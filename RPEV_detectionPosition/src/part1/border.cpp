#include "border.hpp"

Border::Border(){
  // TO DO
}

void Border::points2border(Vec2f p1, Vec2f p2){
  direction = fabs(p1(0)-p2(0)) >= fabs(p1(1)-p2(1));
  if(direction){
    sign = p1(0)>p2(0);
    A = (p2(1)-p1(1)) ./ (p2(0)-p1(0));
    B = p1(1)-A*p1(0);
  }
  else{
    sign = p1(1)<p2(1);
    A = (p2(0)-p1(0)) ./ (p2(1)-p1(1));
    B = p1(0)-A*p1(1);
  }


}

bool Border::is_outside(Vec2f p) const{
    // TO DO
}
