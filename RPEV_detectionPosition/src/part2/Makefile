OPENCV=/opt/opencv/
ROOT=.

CC = g++
CFLAGS  = -Wall -Wextra -I$(ROOT) -I$(OPENCV)/include
LDFLAGS = -L$(OPENCV)/lib -lopencv_core -lopencv_imgproc -lopencv_highgui 

OBJ = morphology.o
BIN = \
	makedisk\
	dilatation\
	erosion\
	labeling\
	thresholding\
	drawelements

all: $(OBJ) $(BIN)

make-se: 
	$(CC) $(CFLAGS)  -o $@ $@.cpp $(LDFLAGS)
morphology.o: morphology.cpp morphology.hpp
	$(CC) -c $(CFLAGS) -o $@ morphology.cpp
%: %.cpp morphology.o
	$(CC) $(CFLAGS)  -o $@ $^ $(LDFLAGS)
clean:
	rm -rf $(BIN) *.o *~ *.png

.PHONY: all clean 
