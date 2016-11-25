#ifndef __SCENE_HPP__
#define __SCENE_HPP__

#include <iostream>
#include <cstdlib>
#include <opencv2/opencv.hpp>

#include "border.hpp"

using namespace std;
using namespace cv;

class Scene
{
private:
  float scale; // ratio between virtual and real distances (in pixels vs. in meters)
  Vector<Border> borders;
  int border_n;
public:
  Scene();
  void compute_scale(Mat img, float dist); // computes and sets 'scale' by means of 2 LEDs spaced with 'dist' meters in the image 'img'
  void add_border(Border b);
  int is_outside(Vec2f p) const; // -1 if the point 'p' is inside the scene delimited by all the borders
};

#endif
