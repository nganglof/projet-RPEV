#include "metabot.hpp"

Metabot::Metabot( int id, float posx, float posy) : _id(id), _posx(posx), _posy(posy){
  // TO DO
}

Metabot::~Metabot(){
  // TO DO
}


string Metabot::toString(){

	ostringstream data;
	data << "\t{\n\t\t\t" << '"' << "id" << '"' <<" : " << _id << ",\n";
	data << "\t\t\t" << '"' << "position" << '"' << " : {\n";
	data << "\t\t\t\t" << '"' << "x" << '"' << " : " << _posx <<  ",\n";
	data << "\t\t\t\t" << '"' << "y" << '"' << " : " << _posy << "\n\t\t\t}\n\t\t}";

	return data.str();

}
