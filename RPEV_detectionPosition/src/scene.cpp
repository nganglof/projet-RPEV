#include "scene.hpp"


#include <iostream>
#include <cstdlib>
#include <stdio.h>
#include <time.h>
#include <sys/time.h>

Scene::Scene(int nbMetabots) {

    _camera = new Camera();
    _nbMetabots = nbMetabots;
    _currentNb = 0;
}

Scene::~Scene() {
    // TO DO
}


void Scene::processNewFrame() {
    _camera->getNewFrame();
}

void Scene::launchCamera() {

    _camera->getFlux();
}

void Scene::initScene() {


    string message;
    string reponseBot;
    bool quit = false;

    cout << "\t- entrez cam pour initialiser la camera" << endl;
    cout << "\t- entrez bot pour initialiser les metabots" << endl;
    cout << "\t- entrez reset pour annuler l'initialisation" << endl;
    cout << "\t- entrez ok pour quitter la phase d'initialisation" << endl;

    while(!quit) {

        cin >> message;

        if( message.compare("cam")==0) {

            initCamera();

        }

        else if( message.compare("bot")==0) {

            if(isInit()) {
                cout << "metabots déjà initialisé, si vous relancer l'initialisation, entrez reset" << endl;
            }
            else {
                cout << "\t- un numéro de bot va vous être donné" << endl;
                cout << "\t- démarrer le métabot correspondant et sa led infrarouge" << endl;
                cout << "\t- une fois correctement positionné, entrez ok" << endl;
                cout << "\t- éteignez le métabot" << endl;

                for(int i = 0 ; i < _nbMetabots; i ++) {
                    cout << "bot " << i<< endl;
                    do {
                        cin >> reponseBot;
                        if(reponseBot.compare("ok")!=0)
                            cout << "message non reconnu. Entrez ok une fois le bot allumé et positionné" << endl;
                        else
                            initMetabot();

                    } while(reponseBot.compare("ok")!=0);
                }
                cout << "initialisation des bots terminée"<< endl;
            }

        }
        else if ( message.compare("reset")==0) {
            resetScene();
        }
        else if ( message.compare("ok")==0) {
            if(isInit()) {
                quit = true;
            }
            else {
                cout << "metabots pas encore intialisés, entrez bot pour lancer l'initialisation" << endl;
            }
        }
        else {
            cout << "\t- entrez cam pour initialiser la camera" << endl;
            cout << "\t- entrez bot pour initialiser les metabots" << endl;
            cout << "\t- entrez reset pour annuler l'initialisation" << endl;
            cout << "\t- entrez ok pour quitter la phase d'initialisation" << endl;
        }
    }
}

void Scene::initMetabot() {

    //todo part leo get position
    addMetabot(_currentNb,(float)3.,(float)4.,(float)50.);
    cout << ">>>> bot " << _currentNb-1 << " initialisé" << endl;

}

void Scene::showFrame() {

    imshow("camera", _camera->getCurrentFrame());
    waitKey(0);
}

void Scene::treatFrame() {

    cout << "je traite une nouvelle frame" << endl;
    //todo leo mettre a jour infos

    //envoyer donnees

}

void Scene::initCamera() {

    processNewFrame();
    //todo traitement image
    imshow("Camera après opérations", _camera->getCurrentFrame());
    waitKey(0);
    cout << "init terminé" << endl;

}

void Scene::addMetabot(int id, float posx, float posy, float angle) {

    if(_currentNb>=_nbMetabots) {
        printf("nombre de metabots deja atteint");
    }
    else {
        Metabot* m = new Metabot(_currentNb,posx,posy,angle);
        _currentNb++;
        _metabots.push_back(m);
    }

}


string Scene::getPositions() {

    ostringstream jsonData;
    jsonData << "{ \t" << '"' << "nbMetabots" << '"' << " : " << _nbMetabots << ",\n\t";
    jsonData << '"' << "metabots" << '"' << " : [\n";

    for(int i =0; i< _nbMetabots ; i++) {

        jsonData << "\t" << _metabots[i]->toString() ;
        if(i<(_nbMetabots-1))
            jsonData << ",\n";

    }
    jsonData << "\n\t]\n}\n";
    return jsonData.str();
}

bool Scene::isInit() {

    return _nbMetabots==_currentNb;
}

void Scene::resetScene() {

    cout << "réinitialisation des métabots" << endl;
	for(int i = 0; i < _currentNb; ++i)
	{
	   delete _metabots[i];
	}
    _metabots.clear();
    _currentNb = 0;

}