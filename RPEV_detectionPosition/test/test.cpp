#include <iostream>
#include <cstdlib>
#include <opencv2/opencv.hpp>

#include "transformations.hpp"
#include "detection.hpp"

using namespace cv;
using namespace std;

int
main(int argc, char **argv){
  int threshold = atoi(argv[1]);
  int level_erosion = atoi(argv[2]);
  int level_dilatation = atoi(argv[3]);

  int* nb_leds = new int(0);

  Mat cross = makecross(3,3);
  Mat something;
  Mat ims = imread("test.png", 0);
  Mat imd = Mat(ims.size(), CV_8UC1);

  imd = thresholding(ims, threshold);
  imd = erosion(imd, level_erosion);
  imd = dilatation(imd, level_dilatation);

  Mat imreg =  Mat(ims.size(), CV_8UC1);
  Mat imcolor = Mat(ims.size(), CV_8UC3, Scalar(0,0,0));
  Mat imcenters = Mat(ims.size(), CV_8UC3, Scalar(0,0,0));

  imreg = labeling(imd, nb_leds);
  imcolor = coloring(imreg, *nb_leds);
  imcenters = locating(imreg, cross, something, *nb_leds);

  imwrite("reg.png", imreg);
  imwrite("color.png", imcolor);
  imwrite("centers.png", imcenters);

  delete nb_leds;
  return 0;
}
