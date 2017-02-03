GRELET Leo
GANGLOFF Nolwenn

detectionposition

##User manual##

Here are the dependencies of our application. Those libraries need to be installed before using the detection application.
- Cmake : CMake is an open-source, cross-platform family of tools designed to build, test and package software. These tools are necessary - - Packages v4l2ucp, v4l-utils and libv4l-dev : These packages, which can be installed through "sudo apt-get install v4l2ucp v4l-utils libv4l-dev", are needed for the camera connexion. Once these packages are installed, if Opencv was already installed it must be recompiled.
- Opencv : OpenCV is an open source computer vision and machine learning software library we use to compute the Metabot positions. The version we used is opencv-2.4.13, available here http://opencv.org/downloads.html.
- ZeroMQ : ZeroMQ is the networking library we used to communicate with the control application. The version we used is the 4.2.0 version, which is available here : http://zeromq.org/intro:get-the-software. In addition to that library, we also used cppzmq available here https://github.com/zeromq/cppzmq.


The user can communicate to the application via the terminal. After having compiled the files, thanks to the command make, the application can be launched with :

./main

Then, the user must initialise the Metabots. It is done by entering : init and bot. Once the initialising part is launched, the user must turn on one Metabot at a time, and enter ok when the Metabot is ready. Once all the Metabots are initialised, he has to enter ok again and can now start the detection with the command start.


Depending on the camera you are using, you might have to change this line :
_capture = VideoCapture(0);
(camera.cpp, line 14)
0 is the default camera (webcam on a laptop for example), if you want to take another one, put 1 instead of 0.
