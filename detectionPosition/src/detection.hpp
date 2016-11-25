#ifndef DETECTION_H
#define DETECTION_H

#include <iostream>
#include <cstdlib>
#include <opencv2/opencv.hpp>

using namespace std;
using namespace cv;

/**********************************
TO CONSIDER :
- Scene::function() to edit Borders, according to the diameter of a robot (need 'scale') OR Border::is_outside() must deal with it
- Scene::function() to tell whether the Borders delimitate a closed space or not
- step 2) of proc_inipos()
- write functions for step 3) of proc_performance
- do a Qt HMI
***********************************/

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
  void linreg(Vec2f p1, Vec2f p2);  // computes 'direction', 'sign', 'A' and 'B' by means of 2 points 'p1' and 'p2' on the line
  bool is_outside(Vect2f p) const; // true if the point 'p' doesn't respect the inequation of a border
}

class Scene
{
private:
  float scale; // ratio between virtual and real distances (in pixels vs. in meters)
  Border* borders;
  int border_n;
public:
  Scene();
  ~Scene();
  void compute_scale(Mat img, float dist); // computes and sets 'scale' by means of 2 LEDs spaced with 'dist' meters in the image 'img'
  void add_border(Border b);
  int is_outside(Vect2f p) const; // -1 if the point 'p' is inside the scene delimited by all the borders
}

// turns on/off ('state' = 1/0) the infrared LED on the robot number 'robot_id'
void turn_robot_led(int robot_id, bool state);
// turns on/off ('state' = 1/0) both of the positionning LEDs (used for getting the scale of the image / the borders of the scene)
void turn_pos_leds(bool state);

// detects all the LEDs in the image 'img' and fills the vector 'positions' accordingly
void find_leds(Mat img, Vec2f* led_positions);
// add a led to an array of led positions
void add_led(Vec2f led_pos, Vec2f* led_positions);




/********************** PROCEDURES ***********************/

void proc_scaling(Scene* scene);
/*
1) use turn_pos_leds(1)
2) wait for the user to set LEDs and type 'dist' (meters), then press a key
3) take a picture
4) use Scene::compute_scale()
5) use turn_pos_leds(0)
*/

void proc_borders(Scene* scene);
/*
1) use turn_pos_leds(1)
2) wait for the user to set LEDs and press a key
3) take a picture
4) use find_leds()
5) use Scene::add_border()
6) repeat 2,3,4,5 as many times as there are borders, until user presses another key
7) use turn_pos_leds(0)
*/

void proc_inipos(Scene* scene, Vec2f* led_positions);
/*
1) wait for the user to place every robot on the scene and press a key
2) SOMETHING to link the robots to the program (define robot_id?) (could be out of this function)
3) use turn_robot_led(id,1)
4) take a picture
5) use find_leds()
6) use add_led()
7) use turn_robot_led(id,0)
8) repeat 3,4,5,6,7 as many times as there are robots
*/

void proc_performance(Scene* scene);
/*
1) use turn_robot_led(id,1) on every robot
2) take a picture
3) use find_leds()
4) SOMETHING to compare new and previous led positions, and displays them + direction of the robots
5) repeat 2,3,4 until user presses a key (end of the program)
6) use turn_robot_led(id,0) on every robot
*/

#endif
