#include <iostream>
#include <cstdlib>
#include <opencv2/opencv.hpp>

#include "border.hpp"
#include "scene.hpp"

using namespace std;
using namespace cv;


/**********************************
TO CONSIDER :
- Scene::function() to edit Borders, according to the diameter of a robot (need 'scale') OR Border::is_outside() must cope with it
- Scene::function() to tell whether the Borders delimitate a closed space or not
- step 2) of proc_inipos()
- write functions for step 3) of proc_performance
- do a Qt HMI
***********************************/


// turns on/off ('state' = 1/0) the infrared LED on the robot number 'robot_id'
void turn_robot_led(int robot_id, bool state){
  // TO DO
}

// turns on/off ('state' = 1/0) both of the positionning LEDs (used for getting the scale of the image / the borders of the scene)
void turn_pos_leds(bool state){
    // TO DO
}

// detects all the LEDs in the image 'img' and fills the vector 'positions' accordingly
void find_leds(Mat img, Vec2f* led_positions){
  // TO DO
}

// add a led to an array of led positions
void add_led(Vec2f led_pos, Vec2f* led_positions){
  // TO DO
}

void proc_scaling(Scene* scene){
  /*
  1) use turn_pos_leds(1)
  2) wait for the user to set LEDs and type 'dist' (meters), then press a key
  3) take a picture
  4) use Scene::compute_scale()
  5) use turn_pos_leds(0)
  */
}


void proc_borders(Scene* scene){
/*
1) use turn_pos_leds(1)
2) wait for the user to set LEDs and press a key
3) take a picture
4) use find_leds()
5) use Scene::add_border()
6) repeat 2,3,4,5 as many times as there are borders, until user presses another key
7) use turn_pos_leds(0)
*/
}

void proc_inipos(Scene* scene, Vec2f* led_positions){
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
}

void proc_performance(Scene* scene){
/*
1) use turn_robot_led(id,1) on every robot
2) take a picture
3) use find_leds()
4) SOMETHING to compare new and previous led positions, and displays them + direction of the robots
5) repeat 2,3,4 until user presses a key (end of the program)
6) use turn_robot_led(id,0) on every robot
*/
}

void process(const char* imsname)
{
	Mat imsimg = imread(imsname,0);

	imshow("Display window ims",imsimg);
	waitKey(0);

}

void usage (const char *s)
{
  std::cerr<<"Usage: "<<s<<" im-boundary ims imd\n"<<std::endl;
  exit(EXIT_FAILURE);
}


#define param 1
int main( int argc, char* argv[] )
{
  if(argc != (param+1))
    usage(argv[0]);
  process(argv[1]);
  return EXIT_SUCCESS;
}
