#include "transformations.hpp"

using namespace cv;
using namespace std;

Mat
makedisk(const int halfsize)
{
    Mat disk = Mat(2*halfsize+1, 2*halfsize+1, CV_8UC1);

    for (int i = 0; i < disk.rows; ++i)
    {
        for (int j = 0; j < disk.cols; ++j)
        {
            int x = i - halfsize;
            int y = j - halfsize;
            disk.at<unsigned char>(i,j) = (x * x + y * y <= halfsize * halfsize) ? 255 : 0;
        }
    }
    return(disk);
}

Mat
makecross(const int halfsize, const int thickness)
{
    Mat cross = Mat(2*halfsize+1, 2*halfsize+1, CV_8UC1);

    for (int i = 0; i < cross.rows; ++i)
    {
        for (int j = 0; j < cross.cols; ++j)
        {
            cross.at<unsigned char>(i,j) =
            (((i<=halfsize+thickness/2) && (i>=halfsize-thickness/2)) || ((j<=halfsize+thickness/2) && (j>=halfsize-thickness/2))) ? 255 : 0;
        }
    }
    return(cross);
}

Mat
thresholding(const Mat ims, const int threshold)
{
  Mat imd = Mat(ims.size(), CV_8UC1);
  ims.copyTo(imd);

  for (int i = 0; i < imd.rows; ++i)
  {
    for (int j = 0; j < imd.cols; ++j)
    {
      uchar value = imd.at<uchar>(i,j);
      imd.at<uchar>(i,j) = (value >= threshold) ? 255 : 0;
    }
  }
  return(imd);
}

Mat
erosion(Mat ims, const int level)
{
  Mat imd = Mat(ims.size(), CV_8UC1);

  Mat disk = makedisk(level);

  morph(disk, ims, imd, minimum);

  return(imd);
}

Mat
dilatation(Mat ims, const int level)
{
  Mat imd =  Mat(ims.size(), CV_8UC1);

  Mat disk = makedisk(level);

  morph(disk, ims, imd, maximum);

  return(imd);
}

Mat
draw_on_top(Mat drawing, Mat ims, int centerx, int centery, int R, int G, int B)
{
  Mat imd = Mat(ims.size(), CV_8UC1);
  ims.copyTo(imd);

  for (int i = 0; i < drawing.rows; ++i)
  {
    for (int j = 0; j < drawing.cols; ++j)
    {
      if(drawing.at<uchar>(i,j) != 0 && centerx-(drawing.cols/2)+j > 0 && centerx-(drawing.cols/2)+j < ims.cols && centery-(drawing.rows/2)+i > 0 && centery-(drawing.rows/2)+i < ims.rows)
      {
        imd.at<Vec3b>(centery-(drawing.rows/2)+i,centerx-(drawing.cols/2)+j) = Vec3b(B,G,R);
      }
    }
  }
  return(imd);
}

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

    *max = val;
}
