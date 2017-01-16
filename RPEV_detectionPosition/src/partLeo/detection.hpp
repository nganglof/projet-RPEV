#ifndef DETECTION_HPP
#define DETECTION_HPP

#include <iostream>
#include <cstdlib>
#include <opencv2/opencv.hpp>

#include "transformations.hpp"



/*************************************************************************************
                             DETECTION FUNCTIONS
**************************************************************************************/

// labels areas in 'ims' according to their color in a binary image, after using transformations::thresholding() for example
// then saves an image of labeled zones as 'regname', and a colored one for visual check as 'colorname'
void
labeling(const char* imsname, const char* regname, const char* colorname);



/*************************************************************************************
         SUBFUNCTIONS OF DETECTION FUNCTIONS - SHOULD NOT BE USED ELSEWHERE !
**************************************************************************************/

int
_find(int p, int* roots);

int
_union(int r0, int r1, int* roots);

int
_add(int p, int r, int* roots);

#endif
