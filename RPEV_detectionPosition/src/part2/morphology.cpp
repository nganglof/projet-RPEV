#include <iostream>

#include "morphology.hpp"

using namespace cv;

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
maximum(uchar val, uchar* max)
{
  if(val > *max)
    *max = val;
}

void
minimum(uchar val, uchar* min)
{
  if(val < *min)
    *min = val;
}
