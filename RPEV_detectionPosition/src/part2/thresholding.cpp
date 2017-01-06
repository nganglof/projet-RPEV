#include <iostream>
#include <cstdlib>

#include "morphology.hpp"

using namespace cv;
using namespace std;

void
process(const int threshold, const char* imsname, const char* imdname)
{
  Mat ims = imread(imsname, 0);

  for (int i = 0; i < ims.rows; ++i)
  {
    for (int j = 0; j < ims.cols; ++j)
    {
      uchar value = ims.at<uchar>(i,j);
      ims.at<uchar>(i,j) = (value >= threshold) ? 255 : 0;
    }
  }
  imwrite(imdname, ims);
}

void
usage (const char *s)
{
  std::cerr<<"Usage: "<<s<<"threshold imsname imdname\n"<<std::endl;
  exit(EXIT_FAILURE);
}

#define param 3
int
main( int argc, char* argv[] )
{
  if(argc != (param+1))
    usage(argv[0]);
  process(atoi(argv[1]), argv[2], argv[3]);
  return EXIT_SUCCESS;
}
