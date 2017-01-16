all: transformations.o detection.o

%.o: %.cpp %.hpp
	g++ $^ -c

clean:
	rm ./*.o
