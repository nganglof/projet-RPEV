#include "detection.hpp"
#include "metabot.hpp"

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
locating(Mat ims, Mat centershape, const int nb_leds, vector<Metabot*> metabots)
{
  int rows  = ims.rows;
  int cols  = ims.cols;

  int root_min_x[nb_leds];
  int root_max_x[nb_leds];
  int root_min_y[nb_leds];
  int root_max_y[nb_leds];

  struct led leds[nb_leds];

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

  Mat imd = Mat(ims.size(), CV_8UC3, Scalar(0,0,0));

  for(int root = 0; root < nb_leds; root++){
    leds[root].id = root;
    leds[root].x = (root_min_x[root]+root_max_x[root])/2;
    leds[root].y = (root_min_y[root]+root_max_y[root])/2;
    imd = draw_on_top(centershape, imd, leds[root].x, leds[root].y, 200, 0, 0);
  }

  struct led closest_leds[nb_leds][2];
  float shortest_dist[nb_leds][2];

  for (int i = 0; i < nb_leds; i++){
    shortest_dist[i][0] = 1000000.0;
    shortest_dist[i][1] = 1000000.0;
    for (int j = 0; j < nb_leds; j++){
      if (i!=j){
        float distance = sqrt(pow(leds[i].x - leds[j].x , 2) + pow(leds[i].y - leds[j].y , 2));
        if (distance < shortest_dist[i][0]){
          shortest_dist[i][1] = shortest_dist[i][0];
          shortest_dist[i][0] = distance;
          closest_leds[i][1] = closest_leds[i][0];
          closest_leds[i][0] = leds[j];
        }
        else if (distance < shortest_dist[i][1]){
          shortest_dist[i][1] = distance;
          closest_leds[i][1] = leds[j];
        }
      }
    }
  }

  vector<struct ledbar> ledbars;

  for (int i = 0; i < nb_leds; i++){
    int j = 0;
    while (j < ledbars.size() && ledbars[j].led1.id != i && ledbars[j].led2.id != i && ledbars[j].led3.id != i)
      j++;
    // if the LED i doesn't appear in the 'ledbars' yet
    if (j == ledbars.size()){
      struct ledbar newledbar;
      if (closest_leds[closest_leds[i][0].id][0].id != i){
        newledbar.led1 = closest_leds[i][1];
        newledbar.led2 = closest_leds[i][0];
        newledbar.led3 = leds[i];
        newledbar.shortdist = shortest_dist[closest_leds[i][0].id][0];
        newledbar.longdist = shortest_dist[i][0];
        ledbars.push_back(newledbar);
      }
      else if (shortest_dist[i][1] > shortest_dist[closest_leds[i][0].id][1]){
        newledbar.led1 = leds[i];
        newledbar.led2 = closest_leds[i][0];
        newledbar.led3 = closest_leds[i][1];
        newledbar.shortdist = shortest_dist[i][0];
        newledbar.longdist = shortest_dist[closest_leds[i][0].id][1];
        ledbars.push_back(newledbar);
      }
      else {
        newledbar.led1 = closest_leds[i][0];
        newledbar.led2 = leds[i];
        newledbar.led3 = closest_leds[i][1];
        newledbar.shortdist = shortest_dist[i][0];
        newledbar.longdist = shortest_dist[i][1];
        ledbars.push_back(newledbar);
      }
    }
  }

  for (int i = 0; i < ledbars.size(); i++){
    float posx = (ledbar[i].led1.x + ledbar[i].led3.x) / 2; // considering that the middle of the robot is at the same distance from external leds
    float posy = (ledbar[i].led1.y + ledbar[i].led3.y) / 2; // same
    float angle;
    if(ledbar[i].led1.x != ledbar[i].led3.x)
      angle = atan((ledbar[i].led1.y - ledbar[i].led3.y) / (ledbar[i].led1.x - ledbar[i].led3.x))*180/M_PI;
    else
      angle = (ledbar[i].led1.y > ledbar[i].led3.y) ? 90 : -90;
    Metabot* newmetabot = new Metabot(-1, posx, posy, angle);
    metabots.pushback(newmetabot);
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
