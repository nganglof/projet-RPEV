#include "detection.hpp"

using namespace cv;
using namespace std;

Mat
labeling(Mat ims, int* nb_leds)
{
  Mat imd =  Mat(ims.size(), CV_8UC1);

  int max_root_size = 0;
  vector<int> *root_size = new vector<int>();
  int background_root;

  if (!ims.data){
    cerr<<"Image not found, exit"<<endl;
    exit(EXIT_FAILURE);
  }

  int* roots = new int[ims.total()];

  int rows  = ims.rows;
  int cols  = ims.cols;
  int p     = 0;
  int r     = -1;
  uchar* ps = ims.data;

  for (int i=0; i<rows; i++){
    for (int j=0; j<cols; j++){
      r = -1;

      if (j>0 && (*(ps-1)==(*ps)))
        r = _union( _find(p-1, roots), r, roots);

      if ((i>0 && j>0) && (*(ps-1-cols)==(*ps)))
        r = _union( _find(p-1-cols, roots), r, roots);

      if (i>0 && (*(ps-cols) == (*ps)))
        r = _union(_find(p-cols, roots), r, roots);

      if ((j<(cols-1) && i>0) && (*(ps+1-cols)==(*ps)))
        r = _union(_find(p+1-cols, roots), r, roots);

      r = _add(p, r, roots);

      p++;
      ps++;
    }
  }

  for (p = 0; p < rows*cols; p++){
    roots[p] = _find(p, roots);
  }

  int root_total = 0;
  for (int i = 0; i < rows; i++){
    for (int j = 0; j < cols; j++){
      int p = i*cols+j;
      if(roots[p]==p){
        roots[p] = root_total++;
        root_size->push_back(1);
      }
      else{
        roots[p] = roots[roots[p]];
        (*root_size)[roots[p]] += 1;
      }
    }
  }

  for (int root = 0; root < root_total; root++){
    if ((*root_size)[root] > max_root_size){
      max_root_size = (*root_size)[root];
      background_root = root;
    }
  }

  for (int i = 0; i < rows; i++){
    for (int j = 0; j < cols; j++){
      int root = roots[i*cols+j];
      if (root == background_root){
        imd.at<uchar>(i,j) = 0;
      }
      else if (!root){
        imd.at<uchar>(i,j) = background_root;
      }
      else {
        imd.at<uchar>(i,j) = roots[i*cols+j];
      }
    }
  }

  *nb_leds = root_total - 1;
  delete [] roots;
  delete root_size;
  return imd;
}

Mat
coloring(Mat ims, const int nb_leds)
{
  Mat imd = Mat(ims.size(), CV_8UC3);
  cvtColor(imd, imd, CV_BGR2HSV);
  int root;
  for (int i = 0; i < ims.rows; i++){
    for (int j = 0; j < ims.cols; j++){
      root = ims.at<uchar>(i,j);
      if(root != 0)
        imd.at<Vec3b>(i,j) = Vec3b((179/nb_leds) * root, 255,255);
    }
  }
  cvtColor(imd, imd, CV_HSV2BGR);

  return(imd);
}

Mat
locating(Mat ims, Mat centershape, const int nb_leds)
{
  int rows  = ims.rows;
  int cols  = ims.cols;

  int root_min_x[nb_leds];
  int root_max_x[nb_leds];
  int root_min_y[nb_leds];
  int root_max_y[nb_leds];
  int root_center_x[nb_leds];
  int root_center_y[nb_leds];

  for (int root = 0; root < nb_leds; root++){
    root_min_x[root] = cols;
    root_max_x[root] = 0;
    root_min_y[root] = rows;
    root_max_y[root] = 0;
  }

  int root;
  for (int i = 0; i < rows; i++){
    for (int j = 0; j < cols; j++){
      root = ims.at<uchar>(i,j) - 1;
      if (root >= 0){
        if (i < root_min_y[root])
          root_min_y[root] = i;
        if (i > root_max_y[root])
          root_max_y[root] = i;
        if (j < root_min_x[root])
          root_min_x[root] = j;
        if (j > root_max_x[root])
          root_max_x[root] = j;
      }
    }
  }

  Mat imd = Mat(ims.size(), CV_8UC3);

  for(int root = 0; root < nb_leds; root++){
    root_center_x[root] = (root_min_x[root]+root_max_x[root])/2;
    root_center_y[root] = (root_min_y[root]+root_max_y[root])/2;
    imd = draw_on_top(centershape, imd, root_center_x[root], root_center_y[root], 200, 0, 0);
  }

  return(imd);
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
