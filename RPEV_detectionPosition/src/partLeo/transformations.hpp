#ifndef TRANSFORMATIONS_HPP
#define TRANSFORMATIONS_HPP

#include <iostream>
#include <cstdlib>
#include <opencv2/opencv.hpp>

using namespace cv;

/*************************************************************************************
                             TRANSFORMATION FUNCTIONS
**************************************************************************************/

// creates a square image of side 2*halfsize+1 that represents a white disk on black background
Mat
makedisk(const int halfsize);

// creates a square image of side 2*halfsize+1 that represents a white cross on black background
Mat
makecross(const int halfsize, const int thickness);

// paints pixels in 'ims' black or white, by comparing every pixel's value with the 'threshold' value
Mat
thresholding(const Mat ims, const int threshold);

// erodes 'ims' with the given 'disk'
Mat
erosion(Mat ims, const int level);

// dilates 'ims' with the given 'disk'
Mat
dilatation(Mat ims, const int level);

// superimposes non-black elements in 'imsabove' on top of 'imsbelow', after coloring them in green
Mat
draw_on_top(Mat drawing, Mat ims, int centerx, int centery, int R, int G, int B);



/*************************************************************************************
                  SUBFUNCTIONS USED IN transformations.cpp ONLY
**************************************************************************************/

// erodes or dilates 'ims' with the given 'disk', depending on the given 'compare' function : see minimum() and maximum()
void
morph(Mat disk, Mat ims, Mat imd, void (*compare)(uchar, uchar*));

// used as a 'compare' function for eroding ; saves the minimal value between 'val' and '*min' in 'min'
void
minimum(uchar val, uchar* min);

// used as a 'compare' function in dilating ; saves the maximal value between 'val' and '*max' in 'max'
void
maximum(uchar val, uchar* max);

#endif
