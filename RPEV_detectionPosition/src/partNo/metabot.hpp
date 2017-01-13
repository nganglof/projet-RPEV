#ifndef __METABOT_HPP__
#define __METABOT_HPP__

#include <iostream>
#include <cstdlib>
#include <opencv2/opencv.hpp>


using namespace std;
using namespace cv;

class Metabot
{

private:
	float _posx;
	float _posy;
	int _id;
	//Led leds[3];

public:

  Metabot( int id, float posx, float posy);
  ~Metabot();

  string toString();

};

#endif
