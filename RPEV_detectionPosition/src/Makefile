OPENCV=/opt/opencv
ROOT=.

CC = g++
CFLAGS  = -Wall -Wextra -I$(ROOT) -I$(OPENCV)/include
LDFLAGS = -L/usr/lib/x86_64-linux-gnu -lopencv_core -lopencv_imgproc -lopencv_highgui -lzmq

execs     = main

all: $(execs)

main: main.o transformations.o detection.o scene.o camera.o metabot.o

transformations.o : transformations.hpp
detection.o : detection.hpp
scene.o : scene.hpp
camera.o : camera.hpp
metabot.o : metabot.hpp

%: %.o
	$(CC) $(CFLAGS) -o $@ $^ $(LDFLAGS)

clean:
	rm -rf *.o *~ *.png main
	clear

.PHONY: all clean 
