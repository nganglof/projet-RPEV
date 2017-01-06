#include <iostream>
#include <cstdlib>

#include "morphology.hpp"

using namespace cv;
using namespace std;

void
process(const char* diskname, const char* imsname, const char* imdname)
{
  Mat ims = imread(imsname, 0);
  Mat imd;
  imd =  Mat(ims.size(), CV_8UC1);

  Mat disk = imread(diskname, 0);

  morph(disk, ims, imd, minimum);

  imwrite(imdname, imd);
}

void
usage (const char *s)
{
  std::cerr<<"Usage: "<<s<<"diskname imsname imdname\n"<<std::endl;
  exit(EXIT_FAILURE);
}

#define param 3
int
main( int argc, char* argv[] )
{
  if(argc != (param+1))
    usage(argv[0]);
  process(argv[1], argv[2], argv[3]);
  return EXIT_SUCCESS;
}
