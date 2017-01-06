#ifndef MORPHOLOGY
#define MORPHOLOGY

#include <opencv2/opencv.hpp>

void
morph(cv::Mat disk, cv::Mat ims, cv::Mat imd, void (*compare)(uchar, uchar*));

void
maximum(uchar val, uchar* max);

void
minimum(uchar val, uchar* min);

#endif
