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

	CvCapture* _capture;

public:

  Camera();
  ~Camera();

  int initFlux();
  IplImage* getFrame();

};

#endif
