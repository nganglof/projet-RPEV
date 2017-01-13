#include "camera.hpp"


#include <iostream>
#include <cstdlib>
#include <stdio.h>

Camera::Camera(){
	initFlux();
}

int Camera::initFlux(){

	_capture = cvCreateCameraCapture( CV_CAP_ANY );
	if (!_capture) {
	 
	   printf("Ouverture du flux vidéo impossible\n");
	   return EXIT_FAILURE;
	 
	}

}

IplImage* Camera::getFrame(){

	return cvQueryFrame(_capture);

}



Camera::~Camera(){
  // TO DO
}
