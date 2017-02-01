#ifndef __CAMERA_HPP__
#define __CAMERA_HPP__

#include <iostream>
#include <cstdlib>
#include <opencv2/opencv.hpp>


using namespace std;
using namespace cv;

class Camera
{

private:

    VideoCapture _capture;
    Mat _currentFrame;


public:

    Camera();
    ~Camera();

    VideoCapture getVideoCapture();
    int initFlux();
    void getNewFrame();
    Mat getCurrentFrame();
    void getFlux();

};

#endif
