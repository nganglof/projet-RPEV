#include <iostream>
#include <cstdlib>
#include <opencv2/opencv.hpp>

using namespace cv;
using namespace std;

void
process(const int halfsize, const char* diskname)
{
    Mat disk = Mat(2*halfsize+1, 2*halfsize+1, CV_8UC1);

    for (int i = 0; i < disk.rows; ++i)
    {
        for (int j = 0; j < disk.cols; ++j)
        {
            int x = i - halfsize;
            int y = j - halfsize;
            disk.at<unsigned char>(i,j) = (x * x + y * y <= halfsize * halfsize)?255:0;
        }
    }
    imwrite(diskname, disk);
}

void
usage (const char *s)
{
    std::cerr<<"Usage: "<<s<<"halfsize diskname\n"<<std::endl;
    exit(EXIT_FAILURE);
}

#define param 2

int
main( int argc, char* argv[] )
{
    if(argc != (param+1))
        usage(argv[0]);
    process(atoi(argv[1]), argv[2]);
    return EXIT_SUCCESS;
}
