#ifndef __METABOT_HPP__
#define __METABOT_HPP__

#include <iostream>
#include <cstdlib>
#include <opencv2/opencv.hpp>


using namespace std;
using namespace cv;

class Metabot
{

private:
    float _posx;
    float _posy;
    float _angle;
    int _id;
    bool _isPresent;

public:

    Metabot( int id, float posx, float posy, float angle);
    ~Metabot();

    float getPositionX();
    float getPositionY();
    float getAngle();
    int getId();
    string toString();
    void setIsPresent(bool present);
    bool getIsPresent();
    float getDistance(Metabot* m);
    void updateMetabot(float posx, float posy, float angle);

};

#endif
