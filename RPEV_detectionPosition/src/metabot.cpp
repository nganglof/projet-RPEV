#include "metabot.hpp"

Metabot::Metabot( int id, float posx, float posy, float angle) : _id(id), _posx(posx), _posy(posy), _angle(angle), _isPresent(1) {
}

Metabot::~Metabot() {
}

void Metabot::setIsPresent(bool present){
	_isPresent = present;
}

bool Metabot::getIsPresent(){
	return _isPresent;
}

float Metabot::getPositionX(){
	return _posx;
}

float Metabot::getPositionY(){
	return _posy;
}

float Metabot::getAngle(){
	return _angle;
}

string Metabot::toString() {

    ostringstream data;
    data << "\t{\n\t\t\t" << '"' << "id" << '"' <<" : " << _id << ",\n";
    data << "\t\t\t" << '"' << "angle" << '"' <<" : " << _angle << ",\n";
    data << "\t\t\t" << '"' << "position" << '"' << " : {\n";
    data << "\t\t\t\t" << '"' << "x" << '"' << " : " << _posx <<  ",\n";
    data << "\t\t\t\t" << '"' << "y" << '"' << " : " << _posy << "\n\t\t\t}\n\t\t}";

    return data.str();

}

float Metabot::getDistance(Metabot* m){

	return sqrt(pow(getPositionX()-m->getPositionX(),2.) + pow(getPositionY()-m->getPositionY(),2.));

}

void Metabot::updateMetabot(float posx, float posy, float angle){
	_posy = posx;
	_posy = posy;
	_angle = angle;
	_isPresent = 1;
}