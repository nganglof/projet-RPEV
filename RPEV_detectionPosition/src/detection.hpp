#ifndef DETECTION_HPP
#define DETECTION_HPP

#include <iostream>
#include <cstdlib>
#include <opencv2/opencv.hpp>
#include <vector>

#include "transformations.hpp"
#include "metabot.hpp"

using namespace cv;

/*************************************************************************************
                                   STRUCTURES
**************************************************************************************/
struct led
{
  int id;
  int x;
  int y;
};

struct ledbar
{
  struct led led1;
  float shortdist;
  struct led led2;
  float longdist;
  struct led led3;
};

/*************************************************************************************
                              DETECTION FUNCTIONS
**************************************************************************************/

// first saves the number of convex areas in the binary image 'ims' as 'nb_leds'
// then returns the labeled image, where every pixel in a convex area has the same value, from 0 (background) to 'nb_leds'
Mat
labeling(Mat ims, int* nb_leds);

// returns a colored version of a labeled image 'ims', being given the number of non-background areas 'nb_leds'
Mat
coloring(Mat ims, const int nb_leds);

// returns an image with 'centershape' where LEDs are detected and circles around detected robots
// saves the positions and angles of robots in the empty vector 'metabots'
Mat
locating(Mat ims, Mat centershape, const int nb_leds, vector<Metabot*>* metabots);

/*************************************************************************************
                    SUBFUNCTIONS USED IN detection.cpp ONLY
**************************************************************************************/

int
_find(int p, int* roots);

int
_union(int r0, int r1, int* roots);

int
_add(int p, int r, int* roots);

#endif
