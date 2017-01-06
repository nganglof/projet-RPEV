#ifndef TRANSFORMATIONS_HPP
#define TRANSFORMATIONS_HPP

#include <iostream>
#include <cstdlib>
#include <opencv2/opencv.hpp>

using namespace cv;

/*************************************************************************************
      SUBFUNCTIONS OF TRANSFORMATION FUNCTIONS - SHOULD NOT BE USED ELSEWHERE !
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



/*************************************************************************************
                             TRANSFORMATION FUNCTIONS
**************************************************************************************/

// creates a square image of side 2*halfsize+1 that represents a white disk on black background ; saves it as 'diskname'
void
makedisk(const int halfsize, const char* diskname);

// paints pixels in 'ims' black or white, by comparing every pixel's value with the 'threshold' value ; saves the result as 'imdname'
void
thresholding(const int threshold, const char* imsname, const char* imdname);

// erodes 'ims' with the given 'disk', saves the result as 'imdname'
void
erosion(const char* diskname, const char* imsname, const char* imdname);

// dilates 'ims' with the given 'disk', saves the result as 'imdname'
void
dilatation(const char* diskname, const char* imsname, const char* imdname);

// superimposes non-black elements in 'imsabove' on top of 'imsbelow', after coloring them in green
void
superimpose(const char* imsabovename, const char* imsbelowname, const char* imdname);

#endif
