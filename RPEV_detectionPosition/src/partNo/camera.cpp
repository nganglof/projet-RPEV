#include "camera.hpp"


#include <iostream>
#include <cstdlib>
#include <stdio.h>

Camera::Camera() {
    initFlux();
}

int Camera::initFlux() {

    _capture = VideoCapture(1);
    if(!_capture.isOpened()) {
        printf("Ouverture du flux vidéo impossible\n");
        return EXIT_FAILURE;
    }
    else {
        printf("Ouverture du flux vidéo réussie\n");
    }
}

void Camera::getNewFrame() {
    _capture >> _currentFrame;
}

void Camera::getFlux() {
    for(;;)
    {
        Mat frame;
        _capture >> frame;
        imshow("edges", frame);
        if(waitKey(30) == 1048689) break;
    }
}

VideoCapture Camera::getVideoCapture() {
    return _capture;
}

Mat Camera::getCurrentFrame() {


    return _currentFrame;
}

Camera::~Camera() {
    // TO DO
}
