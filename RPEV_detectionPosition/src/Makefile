OPENCV=/opt/opencv
ROOT=.

CC = g++
CFLAGS  = -Wall -Wextra -I$(ROOT) -I$(OPENCV)/include
LDFLAGS = -L/usr/lib/x86_64-linux-gnu -lopencv_core -lopencv_imgproc -lopencv_highgui 

execs     = detection

all: $(execs)

detection: detection.o scene.o border.o

scene.o : scene.hpp
border.o : border.hpp

%: %.o
	$(CC) $(CFLAGS) -o $@ $^ $(LDFLAGS)

clean:
	rm -rf *.o *~ *.png detection
	clear

.PHONY: all clean 
