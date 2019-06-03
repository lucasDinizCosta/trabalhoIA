#ifndef LABIRINTO_H_INCLUDED
#define LABIRINTO_H_INCLUDED

#include "Grafo.h"
#include <vector>

using namespace std;

class Labirinto
{
private:
    Grafo labirinto;///Corpo do labirinto
    vector<int> caminhoFinal;
    bool visitados[];
    int indiceInicio, indiceFim;
    //vector<Vertice>
public:
    Labirinto(int numeroCelulas)
    {
        visitados[numeroCelulas];
        limpaVisitados(numeroCelulas);

    };
    ~Labirinto();

    void visitaCelula(int v);
    void insereCaminhoFinal(int v);
    void retiraCaminhoFinal();
    void limpaVisitados(int numeroCelulas);
};

Labirinto::~Labirinto()
{

}

void Labirinto::visitaCelula(int v)
{
    visitados[v] = true;
}

void Labirinto::insereCaminhoFinal(int v)
{
    caminhoFinal.push_back(v);
}

void Labirinto::retiraCaminhoFinal()
{
    caminhoFinal.pop_back();
}

void Labirinto::limpaVisitados(int numeroCelulas)
{
    for(int i = 0; i < numeroCelulas; i++)
    {
        visitados[i] = false;
    }
}

#endif // LABIRINTO_H_INCLUDED
