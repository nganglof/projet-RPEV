#include "transformations.hpp"

using namespace cv;
using namespace std;

void
morph(Mat disk, Mat ims, Mat imd, void (*compare)(uchar, uchar*))
{

  for (int i = 0; i < ims.rows; ++i)
  {
      for (int j = 0; j < ims.cols; ++j)
      {
        int i0 = (i - disk.rows/2 >= 0)? i - disk.rows/2:0;
        int i1 = (i + disk.rows/2 +1 < ims.rows)? i + disk.rows/2 +1:ims.rows;
        int j0 = (j - disk.cols/2 >= 0)? j - disk.cols/2:0;
        int j1 = (j + disk.cols/2 +1< ims.cols) ? j + disk.cols/2 +1:ims.cols;

        uchar value = ims.at<unsigned char>(i,j);
        for (int u = i0; u < i1; ++u)
        {
            for (int v = j0; v < j1; ++v)
            {
                if(disk.at<unsigned char>(u - i0, v - j0) == 255)
                    compare(ims.at<unsigned char>(u, v), &value);
            }
        }

        imd.at<unsigned char>(i,j) = value;
      }
  }
}

void
minimum(uchar val, uchar* min)
{
  if(val < *min)
    *min = val;
}

void
maximum(uchar val, uchar* max)
{
  if(val > *max)
    *max = val;
}

void
makedisk(const int halfsize, const char* diskname)
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
thresholding(const int threshold, const char* imsname, const char* imdname)
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
erosion(const char* diskname, const char* imsname, const char* imdname)
{
  Mat ims = imread(imsname, 0);
  Mat imd;
  imd =  Mat(ims.size(), CV_8UC1);

  Mat disk = imread(diskname, 0);

  morph(disk, ims, imd, minimum);

  imwrite(imdname, imd);
}


void
dilatation(const char* diskname, const char* imsname, const char* imdname)
{
  Mat ims = imread(imsname, 0);
  Mat imd;
  imd =  Mat(ims.size(), CV_8UC1);

  Mat disk = imread(diskname, 0);

  morph(disk, ims, imd, maximum);

  imwrite(imdname, imd);
}

void
superimpose(const char* imsabovename, const char* imsbelowname, const char* imdname)
{
  Mat imsabove = imread(imsabovename, 0);
  Mat imsbelow = imread(imsbelowname, 1);

  if(imsabove.size() == imsbelow.size())
  {
    for (int i = 0; i < ims.rows; ++i)
    {
      for (int j = 0; j < ims.cols; ++j)
      {
        if(imsabove.at<uchar>(i,j) != 0)
        {
          imsbelow.at<Vec3b>(i,j) = Vec3b(0,200,0);
        }
      }
    }
  }

  imwrite(imdname, ims);
}
