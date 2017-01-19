OPENCV=/opt/opencv
ROOT=.

CC = g++
CFLAGS  = -Wall -Wextra -I$(ROOT) -I$(OPENCV)/include
LDFLAGS = -L/usr/lib/x86_64-linux-gnu -lopencv_core -lopencv_imgproc -lopencv_highgui

execs     = test

all: $(execs)

test: test.o transformations.o detection.o

transformations.o : transformations.hpp
detection.o : detection.hpp

%: %.o
	$(CC) $(CFLAGS) -o $@ $^ $(LDFLAGS)

clean:
	rm -rf *.o *~ test
	clear

.PHONY: all clean
