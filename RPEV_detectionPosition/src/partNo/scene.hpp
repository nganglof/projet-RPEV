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
		IplImage* _currentImage;

	public:

		Scene(int nbMetabots);
		~Scene();

		void processNewFrame();

		string getPositions();
		void initMetabot();
		void addMetabot(float posx, float posy);



};

#endif
