#ifndef BORDER_H
#define BORDER_H

#include <iostream>
#include <cstdlib>
#include <opencv2/opencv.hpp>

using namespace std;
using namespace cv;

// a Border is one of the lines delimitating the scene, defined by an inequation as follows :
// the sign is '>' if 'sign' (else <) ; the type is "y .. A*x+B" if 'direction' (else "x .. A*y+B")
class Border
{
private:
  bool direction;
  bool sign;
  float A;
  float B;
public:
  Border();
  void points2border(Vec2f p1, Vec2f p2);  // computes 'direction', 'sign', 'A' and 'B' by means of 2 points 'p1' and 'p2' on the line
  bool is_outside(Vect2f p) const; // true if the point 'p' doesn't respect the inequation of a border
}

#endif
