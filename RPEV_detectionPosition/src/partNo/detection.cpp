#include <iostream>
#include <cstdlib>
#include <opencv2/opencv.hpp>
#include <stdio.h>
#include <time.h> 
#include "scene.hpp"
#include <sys/time.h>
using namespace std;
using namespace cv;

#define FRAMERATE 2000
#define NBMETABOTS 4

Scene* mainscene;

void printHelp(){

  cout << "ordres disponibles : " << endl;
  cout << "\tprint\t: affiche la position des Metabots" << endl;
  cout << "\tinit\t: lance la phase d'initialisation des robots" << endl;
  cout << "\tstart\t: demarre la détection" << endl;

}

void init(){

  mainscene = new Scene(NBMETABOTS);
  mainscene->addMetabot(0.8,4.6);
  mainscene->addMetabot(0.6,1.6);
  mainscene->addMetabot(0.8,0.1);
  mainscene->addMetabot(4.4,4.6);

}

void sendData(){

  string jsondata = mainscene->getPositions();
  cout << jsondata << endl;

}

void startDetection(){

  cout << "Lancement de la détection" << endl;
  cout << "Framerate : 1 frame toutes les " <<  FRAMERATE << " millisecondes" << endl;
  string order;
  bool quit = false;
  struct timeval previousTime, currentTime;
  long totalTime, startTime;
  gettimeofday(&previousTime, NULL);

  startTime = (previousTime.tv_sec * 1000) + (previousTime.tv_usec / 1000);

  while(true){

    gettimeofday(&currentTime, NULL);
    totalTime = (((currentTime.tv_sec * 1000) + (currentTime.tv_usec / 1000)) - startTime);
      if(totalTime >= FRAMERATE){
        mainscene->processNewFrame();
        gettimeofday(&previousTime, NULL);
        startTime = (previousTime.tv_sec * 1000) + (previousTime.tv_usec / 1000);

      }

  }

}

void startInitScene(){

  cout << "consignes :  " << endl;
  cout << "\t- démarrer le métabot et sa led infrarouge" << endl;
  cout << "\t- entrer l'id du métabot pour lancer la détection et la récupération de sa position" << endl;
  cout << "\t- éteignez le métabot, allumer le suivant et entrer son id" << endl;
  cout << "\t- une fois tous les Metabots ajoutés, entrer start pour démarrer le programme de détection" << endl;

  string message;

  while(true){

    cin >> message;

  }

}


void processOrder(string order,bool &q){

  cout << "order recu :  " << order << endl;

  if( order.compare("quit")==0){

    q = true;


  }
  else if( order.compare("print")==0){

    sendData();

  }
  else if( order.compare("start")==0){

    startDetection();

  }
  else if( order.compare("init")==0){

    startInitScene();

  }
  else{
    printHelp();
  }
}




int main( int argc, char* argv[] )
{

  init();
  bool quit = false;
  
  string order;

  while(!quit){

    cin >> order;
    processOrder(order,quit);


  }


  return EXIT_SUCCESS;
}
