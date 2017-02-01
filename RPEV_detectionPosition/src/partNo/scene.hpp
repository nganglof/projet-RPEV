#ifndef __SCENE_HPP__
#define __SCENE_HPP__

#include <iostream>
#include <cstdlib>
#include <opencv2/opencv.hpp>
#include "metabot.hpp"
#include "camera.hpp"
#include <string>

using namespace std;
using namespace cv;

class Scene
{

private:
    Camera* _camera;
    Vector<Metabot*> _metabots;
    int _nbMetabots;
    int _currentNb;

public:

    Scene(int nbMetabots);
    ~Scene();

    void resetScene();
    void showFrame();
    void treatFrame();
    void processNewFrame();
    string getPositions();
    void initMetabot();
    void initScene();
    void initCamera();
    void launchCamera();
    void addMetabot(int id, float posx, float posy, float angle);
    bool isInit();


};

#endif
