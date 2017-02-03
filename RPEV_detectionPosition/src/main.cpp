#include <iostream>
#include <cstdlib>
#include <opencv2/opencv.hpp>
#include <stdio.h>
#include <time.h>
#include "scene.hpp"
#include <sys/time.h>
#include "zmq.hpp"
using namespace std;
using namespace cv;

#define FRAMERATE 1000 // en millisecondes
#define NBMETABOTS 4

Scene* mainscene;
zmq::context_t context(1);
zmq::socket_t publisher (context, ZMQ_PUB);

void printHelp() {

    cout << "ordres disponibles : " << endl;
    cout << "\tprint\t: affiche la position des Metabots" << endl;
    cout << "\tinit\t: lance la phase d'initialisation de la camera et des robots" << endl;
    cout << "\tstart\t: demarre la détection" << endl;

}

void init() {

    mainscene = new Scene(NBMETABOTS);

}

void sendData() {

    string jsondata = mainscene->getPositions();
    cout << jsondata << endl;

}

void startDetection() {

    if(mainscene->isInit()) {

        cout << "Lancement de la détection" << endl;

        cout << "Framerate : 1 frame toutes les " <<  FRAMERATE << " millisecondes" << endl;
        string order;
        bool quit = false;
        struct timeval previousTime, currentTime;
        long totalTime, startTime;
        gettimeofday(&previousTime, NULL);

        startTime = (previousTime.tv_sec * 1000) + (previousTime.tv_usec / 1000);

        for(;;)
        {

            gettimeofday(&currentTime, NULL);
            totalTime = (((currentTime.tv_sec * 1000) + (currentTime.tv_usec / 1000)) - startTime);
            mainscene->processNewFrame();
            if(totalTime >= FRAMERATE) {
                mainscene->treatFrame();
                zmq::message_t message(mainscene->getPositions().size() +1);
                snprintf ((char *) message.data(), mainscene->getPositions().size() ,"%s", (char*)mainscene->getPositions().c_str());

                publisher.send(message);
                gettimeofday(&previousTime, NULL);
                startTime = (previousTime.tv_sec * 1000) + (previousTime.tv_usec / 1000);
            }
        }
    }
    else {
        cout << "metabots pas encore initialisés, veuillez déclencher la phase d'initialisation avec la commande init avant de lancer le procesus de détection" << endl;
    }

}

void processOrder(string order,bool &q) {

    if( order.compare("quit")==0)
        q = true;
    else if( order.compare("print")==0)
        sendData();
    else if( order.compare("start")==0)
        startDetection();
    else if( order.compare("init")==0)
        mainscene->initScene();
    else 
        printHelp();
}




int main( int argc, char* argv[] )
{

    init();
    bool quit = false;

    string order;
    printHelp();
    publisher.bind("tcp://*:5556");

    while(!quit) {
        cin >> order;
        processOrder(order,quit);
    }

    return EXIT_SUCCESS;
}
