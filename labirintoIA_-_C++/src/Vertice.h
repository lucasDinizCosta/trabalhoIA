#ifndef VERTICE_H_INCLUDED
#define VERTICE_H_INCLUDED

#include <iostream>
#include "Aresta.h"
using namespace std;

class Vertice{

    private:
        int vertice;      //Numero do vertice(identificação)
        int grau;
        Aresta* primeiro;
        Aresta* ultimo;
        Vertice * proximo;
    public:
        /****************************
        *   Arestas de caminhos:    *
        *   0 => Direita            *
        *   1 => Baixo              *
        *   2 => Esquerda           *
        *   3 => Cima               *
        *****************************/
        Aresta * caminhos[4];
        Vertice();
        Vertice(int val);
        ~Vertice();
        void insereAdj(int val, int peso);
        void removeAdj(int val);
        Aresta* getPrimeiraAresta()          {return primeiro;}
        Aresta* getAresta(int val);
        void imprime();
        void imprimePeso();
        int getNum()              {return vertice;}    //retorna o numero do vertice
        void setNum(int numero)   {vertice = numero;}  //ajusta o numero do vertice
        Vertice* getProx()        {return proximo;}    //ponteiro para o proximo vertice dentro da lista "Grafo"(não para o proximo nó)
        void setProx(Vertice* v)  {proximo = v;}       //ajusta o proximo vertice dentro da lista Grafo
        int getGrau()             {return grau;}
        bool verificaIncidencia(int v2);
        bool comparaVertices(Vertice*q);
        void atualizaAposRm(int val);
};

//Construtor

Vertice::Vertice(){
    grau = 0;
    primeiro = NULL;
    ultimo = primeiro;
}

//Construtor passando o numero do vertice

Vertice::Vertice(int val){
    primeiro = new Aresta;
    vertice = val;
    primeiro->setNum(val);
    ultimo = primeiro;
    for(int i = 0; i < 4 ; i++)
    {
        caminhos[i] = NULL;
    }

    for(int i = 0; i < 4 ; i++)
    {
        if(caminhos[i] == NULL){
            cout << "NULL" << endl;
        }
    }
    /**
    *   Operações:
    *   0 => Direita
    *   1 => Baixo
    *   2 => Esquerda
    *   3 => Cima
    */
};

//Destrutor: não faz nada por enquanto

Vertice::~Vertice(){
    Aresta*q = primeiro;
    Aresta*t;
    while(q!=NULL){
        t = q->getAdj();
        delete q;
        q=t;
    }
};

//Função responsavel por inserir os nós que são
//adjacentes a esse vertice
//ou seja, insere Aresta na lista vertice;

void Vertice::insereAdj(int val, int peso){
    if(grau==0){
        primeiro = new Aresta;
        primeiro->setAdj(NULL);
        primeiro->setNum(val);
        primeiro->setPeso(peso);
        ultimo = primeiro;
        grau ++;
    }
    else{
        Aresta *p = new Aresta;
        ultimo->setAdj(p);
        p->setAdj(NULL);
        p->setNum(val);
        p->setPeso(peso);
        ultimo = p;
        grau++;
    }
};

void Vertice::removeAdj(int val){
    if(grau != 0 && verificaIncidencia(val)){
        Aresta*p=primeiro;
        Aresta*q=primeiro;
        Aresta*t;
        int i;
        while(p->getNum()!=val && p!=NULL){
            p=p->getAdj();
        }
        if(p==primeiro){
            primeiro = p->getAdj();
            delete p;
            grau--;
        }
        else{
            while(q->getAdj()!=p && q!=NULL){
                q=q->getAdj();
            }
            if(p!=NULL){
                q->setAdj(p->getAdj());
                delete p;
                grau--;
            }
            else
                cout << "aresta não encontrada" << endl;
        }
        /*t=p->getAdj();
        q->setAdj(t);
        i = t->getNum()-1;

        while(t!=NULL){
            t->setNum(i);
            i++;
            t=t->getAdj();
        }*/
    }

};

//A Função percorre a lista de arestas atualizando os valores
//util para auxiliar na remoção de Vertices
void Vertice::atualizaAposRm(int val){
    Aresta*p=primeiro;
    while(p!=NULL){
        if(p->getNum()>=val){
            p->setNum(p->getNum()-1);
        }
        p=p->getAdj();
    }
};

//A Função imprime a lista Vertice, ou seja, todas as suas arestas

void Vertice::imprime(){
    /*  ANTIGA IMPRESSAO
    Aresta*p = primeiro;
    while(p != NULL){
        cout << "--" << p->getNum();
        p = p->getAdj();
    }*/
    for(int i = 0; i < 4; i++){
        if(caminhos[i] != NULL){
            switch(i){
                case 0:
                    cout << "--(Direita) " << caminhos[i]->getNum() << " ";
                    break;
                case 1:
                    cout << "--(Baixo) " << caminhos[i]->getNum() << " ";
                    break;
                case 2:
                    cout << "--(Esquerda) " << caminhos[i]->getNum() << " ";
                    break;
                case 3:
                    cout << "--(Cima) " << caminhos[i]->getNum() << " ";
                    break;
                default:
                    break;
            }
        }
        else{
            switch(i){
                case 0:
                    cout << "--(Direita) NULL ";
                    break;
                case 1:
                    cout << "--(Baixo) NULL ";
                    break;
                case 2:
                    cout << "--(Esquerda) NULL ";
                    break;
                case 3:
                    cout << "--(Cima) NULL ";
                    break;
                default:
                    break;
            }
        }
    }
    cout << endl;
};

//Função imprime a lista de pesos, ou seja todos os pesos das arestas
//incidentes a esse vertice;
void Vertice::imprimePeso(){
    Aresta*p = primeiro;
    while(p!=NULL){
        cout << "--" << p->getPeso();
        p=p->getAdj();
    }
    cout << endl;
};

bool Vertice::verificaIncidencia(int v2){
    Aresta*p = primeiro;
    while(p != NULL){
        if(p->getNum()==v2)
            return true;
        p = p->getAdj();
    }
    return false;
};

Aresta* Vertice::getAresta(int val){
    Aresta*p = primeiro;
    while(p!=NULL){
        if(p->getNum()==val){
            break;
        }
        p = p->getAdj();
    }
    return p;
};

bool Vertice::comparaVertices(Vertice*q){
    if(grau == q->getGrau()){
        int j=0;
        Aresta*u = primeiro;
        Aresta*v = q->getPrimeiraAresta();
        while(v!=NULL && u!=NULL){
            if(u->getPeso()==v->getPeso())
                j++;
        }
        if(j==grau)
            return true;
        else
            return false;
    }
    return false;
};

#endif // VERTICE_H_INCLUDED
