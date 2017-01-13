#include "scene.hpp"


#include <iostream>
#include <cstdlib>
#include <stdio.h>

Scene::Scene(int nbMetabots){

	//_camera = new Camera();
	_nbMetabots = nbMetabots;
	_currentNb = 0;
}

Scene::~Scene(){
  // TO DO
}


void Scene::processNewFrame(){

	printf("Nouvelle frame demandée\n");
	/*
	if(_currentImage!=NULL){
		delete _currentImage;
	}
	else{
		_currentImage = _camera->getFrame();
	}*/

}

void Scene::initMetabot(){

	//get new frame
	//detecter leds
	//calculer position
	//creer metabot
	float x = 45.2;
	float y = 25.3; 
	addMetabot(x,y);


}

void Scene::addMetabot(float posx, float posy){

	if(_currentNb>=_nbMetabots){
		printf("Nombre de metabots deja atteint");
	}
	else{
		Metabot* m = new Metabot(_currentNb,posx,posy);
		_currentNb++;
		_metabots.push_back(m);
	}

}


string Scene::getPositions(){

	ostringstream jsonData;
	jsonData << "{ \t" << '"' << "nbMetabots" << '"' << " : " << _nbMetabots << ",\n\t";
	jsonData << '"' << "metabots" << '"' << " : [\n";

	for(int i =0; i< _nbMetabots ; i++){

		jsonData << "\t" << _metabots[i]->toString() ;
		if(i<(_nbMetabots-1))
			jsonData << ",\n";

	}

	jsonData << "\n\t]\n}\n";

	return jsonData.str();


}

