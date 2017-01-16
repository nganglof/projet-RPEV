#include "detection.hpp"

using namespace cv;
using namespace std;

void
labeling(const char* imsname, const char* regname, const char* colorname)
{
  Mat ims = imread(imsname);
  Mat imreg, imcolor;
  imreg =  Mat(ims.size(), CV_8UC1);
  imcolor = Mat(ims.size(), CV_8UC3, Scalar(0,0,0));
  cvtColor(imcolor, imcolor, CV_BGR2HSV);

  if(!ims.data){
    cerr<<"Image not found, exit"<<endl;
    exit(EXIT_FAILURE);
  }

  cvtColor(ims, ims, CV_BGR2GRAY);

  int* roots = new int[ims.total()];

  int  rows  = ims.rows;
  int  cols  = ims.cols;
  int p      = 0;
  int r      = -1;
  uchar* ps  = ims.data;

  for(int i=0; i<rows; i++){
    for(int j=0; j<cols; j++){
      r = -1;

      if( j>0 && (*(ps-1)==(*ps)) )
        r = _union( _find(p-1, roots), r, roots);

      if( (i>0 && j>0) && (*(ps-1-cols)==(*ps)) )
        r = _union( _find(p-1-cols, roots), r, roots);

      if( i>0 && (*(ps-cols) == (*ps)) )
        r = _union(_find(p-cols, roots), r, roots);

      if( (j<(cols-1) && i>0) && (*(ps+1-cols)==(*ps)) )
        r = _union(_find(p+1-cols, roots), r, roots);

      r = _add(p, r, roots);

      p++;
      ps++;
    }
  }

  for(p=0; p<rows*cols; p++){
    roots[p] = _find(p, roots);
  }

  int l=0;
  for(int i=0; i<rows; i++){
    for(int j=0; j<cols; j++){
      int p = i*cols+j;
      if(roots[p]==p)
        roots[p] = l++;
      else
        roots[p] = roots[roots[p]];
    }
  }

  cout<<"labeling: "<< l << " components detected"<<endl;

  for (int i = 0; i < rows; ++i)
  {
    for (int j = 0; j < cols; ++j)
    {
      int n = roots[i*cols+j];
      imreg.at<uchar>(i,j) = (n);
      if(n != 0)
        imcolor.at<Vec3b>(i,j) = Vec3b((179/l) * n, 255,255);
    }
  }

  imwrite(regname, imreg);
  cvtColor(imcolor, imcolor, CV_HSV2BGR);
  imwrite(colorname,imcolor);
  delete [] roots;
}

int
_find(int p, int* roots)
{
  while(roots[p] != p)
    p = roots[p];
  return p;
}

int
_union(int r0, int r1, int* roots)
{
  if(r0 == r1) return r0;
  if(r0 == -1) return r1;
  if(r1 == -1) return r0;
  if(r0 <  r1){
    roots[r1] = r0;
    return r0;
  }else{
    roots[r0]=r1;
    return r1;
  }
}

int
_add(int p, int r, int* roots)
{
  if(r==-1)
    roots[p]=p;
  else
    roots[p]=r;
  return roots[p];
}
