#ifndef GRAFO_H_INCLUDED
#define GRAFO_H_INCLUDED
#include "Vertice.h"
#include "Aresta.h"

class Grafo{
    private:
        Vertice* primeiro;
        Vertice* ultimo;
        int numeroVertices;
        int numeroArestas;
        bool orientado;
    public:
        Grafo();
        ~Grafo();
        void insereVertice(int n);
       // void insereAresta(int v1, int v2, int peso);
        void insereAresta(int v1, int v2, int direcao);
        void removeAresta(int v1, int v2);
        void removeVertice(int v);
        Vertice * retornaVertice(int n);
        bool verificaAdjacencia(int v1, int v2);
        void imprime();

};

/**************************
*  Construtor ~ Destrutor *
***************************/

Grafo::Grafo(){
    numeroArestas = 0;
    numeroVertices = 0;
    primeiro = NULL;
    ultimo = primeiro;
    orientado = false;
};

Grafo::~Grafo(){};

/*****************************************
*  Insere um novo vértice na lista Grafo *
******************************************/

void Grafo::insereVertice(int n){
    if(primeiro==NULL){
        primeiro = new Vertice();
        primeiro->setNum(n);
        primeiro->setProx(NULL);
        ultimo = primeiro;
        numeroVertices++;
    }
    else{
        Vertice* p = new Vertice();
        p->setNum(n);
        ultimo->setProx(p);
        p->setProx(NULL);
        ultimo = p;
        numeroVertices++;
    }
};

/************************************************************************
*  Retorna o vértice cujo o valor é igual a aquele passado no parâmetro *
*************************************************************************/

Vertice * Grafo::retornaVertice(int n){
    if(primeiro!=NULL){
        Vertice*p = primeiro;
        int contador = 0;
        while(p != NULL && contador <= numeroVertices){
            if(p->getNum()==n){
                return p;
            }
            else{
                p = p->getProx();
                contador++;
            }
        }
    }
    else if (primeiro == NULL){
        cout << "Grafo Vazio" << endl;
        return primeiro;
    }
    else{
        cout << "Impossivel encontrar Vertice" << endl;
        exit(0);
    }
    //return NULL;
}

/**************************************************************************************
* Dados dois valores(índices dos vértices), se o grafo NÃO for orientado, atribui ao  *
* primeiro uma aresta para o segundo e ao segundo uma aresta para o primeiro*         *
***************************************************************************************/
void Grafo::insereAresta(int v1, int v2, int direcao){

    Vertice * p = retornaVertice(v1);
    Vertice * p2 = retornaVertice(v2);
    p->insereAdj(v2,0);
    p2->insereAdj(v1,0);
    switch(direcao)
    {
    case 0:
        {
            Aresta * a = new Aresta();
            a->setNum(v2);
            p->caminhos[0] = a;
            a = new Aresta();
            a->setNum(v1);
            p2->caminhos[2] = a;
        }
            break;
    case 1:
        {
            Aresta * a = new Aresta();
            a->setNum(v2);
            p->caminhos[1] = a;
            a = new Aresta();
            a->setNum(v1);
            p2->caminhos[3] = a;
        }
            break;
    case 2:
        {
            Aresta * a = new Aresta();
            a->setNum(v2);
            p->caminhos[2] = a;
            a = new Aresta();
            a->setNum(v1);
            p2->caminhos[0] = a;
        }
    break;
    case 3:
        {
            Aresta * a = new Aresta();
            a->setNum(v2);
            p->caminhos[3] = a;
            a = new Aresta();
            a->setNum(v1);
            p2->caminhos[1] = a;
        }
    break;
    }
    //p = retornaVertice(v2);
    numeroArestas++;

};

void Grafo::removeAresta(int v1, int v2){
    Vertice*p = retornaVertice(v1);
    p->removeAdj(v2);
    p = retornaVertice(v2);
    p->removeAdj(v1);
    numeroArestas--;
};

void Grafo::removeVertice(int v){
    if(v>numeroVertices||v<0){
        cout << "Vertice não pertence ao Grafo" << endl;
        exit(0);
    }
    int i = 1;
    Vertice*p=retornaVertice(v);
    Vertice*q=retornaVertice(v-1);
    Vertice*t=primeiro;
    while(p->getGrau()!=0 && i<=numeroVertices){
        if(verificaAdjacencia(v, i)){
            removeAresta(v,i);
        }
        i++;
    }
    //percorre o grafo atualizando os identificadores do vertice
    while(t!=NULL){
        t->atualizaAposRm(v);
        if(t->getNum()>=v){
            t->setNum(t->getNum()-1);
        }
        t = t->getProx();
    }

    if(p == primeiro){
        primeiro=p->getProx();
        delete(p);
    }
    else{
        q->setProx(p->getProx());
        delete(p);
    }

};

bool Grafo::verificaAdjacencia(int v1, int v2){
    Vertice *p = primeiro;
    while(p != NULL){
        if(p->getNum()==v1){
            if(p->verificaIncidencia(v2))
                return true;
        }
        p = p->getProx();
    }
    return false;
};

/***********************************************************************
* Imprime o grafo fazendo uso da função "imprime()" Aresta TAD Vértice *
************************************************************************/
void Grafo::imprime(){
    cout << "\t\tImpressao do grafo: " << endl << endl;
    if(primeiro!=NULL){
        Vertice*p = primeiro;
        int contador= 0;
        while(p!=NULL && contador<=numeroVertices){
            cout << "(" << p->getNum() << ") ";
            p->imprime();
            p = p->getProx();
            contador ++;
        }
    }
};

#endif // GRAFO_H_INCLUDED
