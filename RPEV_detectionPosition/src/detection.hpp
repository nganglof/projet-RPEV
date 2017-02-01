#ifndef DETECTION_HPP
#define DETECTION_HPP

#include <iostream>
#include <cstdlib>
#include <opencv2/opencv.hpp>
#include <vector>

#include "transformations.hpp"

using namespace cv;

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

Mat
locating(Mat ims, Mat centershape, const int nb_leds);

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
