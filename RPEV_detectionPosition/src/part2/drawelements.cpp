#include <iostream>
#include <cstdlib>

#include "morphology.hpp"

using namespace cv;
using namespace std;

void
process(const char* elementsname, const char* imsname, const char* imdname)
{
  Mat elements = imread(elementsname, 0);
  Mat ims = imread(imsname, 1);

  if(elements.size() == ims.size())
  {
    for (int i = 0; i < ims.rows; ++i)
    {
      for (int j = 0; j < ims.cols; ++j)
      {
        if(elements.at<uchar>(i,j) != 0)
        {
          ims.at<Vec3b>(i,j) = Vec3b(0,200,0);
        }
      }
    }
  }

  imwrite(imdname, ims);
}

void
usage (const char *s)
{
  std::cerr<<"Usage: "<<s<<"elementsname ims imd\n"<<std::endl;
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
