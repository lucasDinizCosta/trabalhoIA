#ifndef ARESTA_H_INCLUDED
#define ARESTA_H_INCLUDED

#include <iostream>

//Representa as arestas que um vertice tem

class Aresta
{
    private:
        int numero;
        int peso;
        Aresta* prox;

    public:
        Aresta()                    { peso = 0;}
        ~Aresta()                   {;}
        int getNum()                {return numero;}
        int getPeso()               {return peso;}
        Aresta* getAdj()            {return prox;}
        void setNum(int val)        {numero = val;}
        void setPeso(int val)       {peso = val;}
        void setAdj(Aresta * p)     {prox = p;}
};

#endif // ARESTA_H_INCLUDED
