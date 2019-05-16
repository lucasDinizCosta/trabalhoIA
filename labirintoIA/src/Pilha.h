#ifndef PILHA_H_INCLUDED
#define PILHA_H_INCLUDED

#include <vector>
#include "Vertice.h"
using namespace std;

class Pilha{
    private:
        std::vector<Vertice*> pilha;

    public:
        Pilha();
        ~Pilha();
        void empilha(Vertice* v);
        Vertice* desempilha();
        Vertice* topo();
		int tamanho();
		bool vazia();
};

Pilha::Pilha(){

};

Pilha::~Pilha(){
    //std::cout << "Destruindo a pilha"  << std::endl;
    while(vazia()){
        pilha.pop_back();
    }
};

void Pilha::empilha(Vertice* v){
    //std::cout << "Empilhando o " << v->getNum() << std::endl;
    pilha.push_back(v);
};


bool Pilha::vazia(){
    if(pilha.size()>0){
        return false;
    }
    else{
        return true;
    }
};

int Pilha::tamanho(){
    return pilha.size();
};

Vertice* Pilha::desempilha(){
    if(vazia()==false){
        //std::cout << "Desempilhando o " << pilha.at(pilha.size()-1)->getNum() << std::endl;
		Vertice* vertice = pilha.at(pilha.size()-1);							//Armazena em uma variavel o vertice
        pilha.pop_back();
		return vertice;
    }
    else{
        //std::cout << "Pilha vazia" << std::endl;
		return NULL;
    }
};

Vertice* Pilha::topo(){
    if(vazia()==false){
        //std::cout << "Desempilhando o " << pilha.at(pilha.size()-1)->getNum() << std::endl;
        Vertice* vertice = pilha.at(pilha.size()-1);							//Armazena em uma variavel o vertice
        return vertice;
    }
    else{
        //std::cout << "Pilha vazia" << std::endl;
        return NULL;
    }
};

#endif // PILHA_H_INCLUDED
