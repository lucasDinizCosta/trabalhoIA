#include <iostream>
#include <vector>
#include <string>
#include <sstream>
#include <stdlib.h>
#include "src/Grafo.h"
#include "src/Labirinto.h"
using namespace std;

Grafo* G = new Grafo();

void criaMapaTesteGrafo(Grafo * g){
    /************************************************************
    *                   MAPA                                    *
    *     Z                    1                                *
    *     |                    |                                *
    *     A--B--C              2--3  4                          *
    *     |  |  |              |  |                            *
    *     D  E  F              5  6  7                          *
    *        |  |                 |  |                          *
    *     G--H--I              8--9--10                          *
    *     |  |  |              |  |  |                          *
    *     J  K  L             11 12  13                         *
    *           |                    |                          *
    *           W                    14                         *
    *************************************************************/
    /**********************
    *   Operações:        *
    *   0 => Direita      *
    *   1 => Baixo        *
    *   2 => Esquerda     *
    *   3 => Cima         *
    ***********************/
    for(int i = 0; i < 14; i++){
        g->insereVertice(i+1);
    }
    g->insereAresta(1,2,1);
    g->insereAresta(2,3,0);
    g->insereAresta(2,5,1);
    //g->insereAresta(3,4,0);
    g->insereAresta(3,6,1);
    //g->insereAresta(4,7,1);
    g->insereAresta(6,9,1);
    g->insereAresta(7,10,1);
    g->insereAresta(8,9,0);
    g->insereAresta(8,11,1);
    g->insereAresta(9,10,0);
    g->insereAresta(9,12,1);
    g->insereAresta(10,13,1);
    g->insereAresta(13,14,1);
    /*g->insereVertice(1);
    g->insereVertice(2);
    g->insereVertice(3);
    g->insereAresta(1,2,0);
    g->insereAresta(2,3,1);*/
    g->imprime();
}

void metodoIrrevogavel(int ini, int fim, std::vector<std::vector<int> >& matAdj, std::vector<int>& operations){          ///Funcionando

    cout << endl << "Executando Irrevogavel: " << endl;
    string arvore = "{";
    stringstream convert;   // stream used for the conversion
    int s = ini;
    int n = s;
    bool fracasso = false;
    bool sucesso = false;
    while((sucesso == false) && (fracasso == false)){
        int cont = 0;
        while(cont < operations.size()){
            if(matAdj[n][operations[cont]] != -1){          ///Acessando a operação com base na ordem das operações
                convert << "[" << n <<" --(R:" << (cont+1) << ")--> " << matAdj[n][cont] << "], ";      ///Usado para a concatenação do texto e número em uma String única
                arvore = arvore + convert.str();
                convert.str(std::string());             ///"Limpa" a variável
                n = matAdj[n][operations[cont]];
                if(n == fim){
                    sucesso = true;
                }
                break;
            }
            cont++;
        }
        if(cont > operations.size()){               ///Não encontrou operação válida
            fracasso = true;
        }
    }
    arvore = arvore + "}";
    if(fracasso == true){
        cout << "Fracasso em encontrar a solucao" << endl;
    }
    else{
        if(sucesso == true){
            cout << "--> Sucesso!!! Arvore de Solucao: " << endl << endl;
            cout << arvore << endl;
        }
    }
}

void metodoBacktrack(int ini, int fim, std::vector<std::vector<int> >& matAdj, std::vector<int>& operations){          ///Funcionando

    cout << endl << "Executando Backtrack: " << endl;
    string arvore = "{";
    stringstream convert;       // stream used for the conversion
    std::vector<int> pilha;             ///Empilha os vertices
    int s = ini;
    int n = s;
    //pilha.push_back(s);                 ///Empilha o primeiro elemento
    bool fracasso = false;
    bool sucesso = false;
    while((sucesso == false) && (fracasso == false)){
        int cont = 0;
        while(cont < operations.size()){
            if(matAdj[n][operations[cont]] != -1){                  ///Selecionando um operador válido
                convert << "[" << n <<" --(R:" << (cont+1) << ")--> " << matAdj[n][operations[cont]] << "], ";      ///Usado para a concatenação do texto e número em uma String única
                arvore = arvore + convert.str();
                convert.str(std::string());             ///"Limpa" a variável
                n = matAdj[n][operations[cont]];
                pilha.push_back(n);                     ///Empilha o elemento
                if(n == fim){
                    sucesso = true;
                }
                break;
            }
            cont++;
        }
        if(cont >= operations.size()){               ///Não encontrou operação válida
            if(n == s){
                fracasso = true;
            }
            else{
                if(pilha.size() == 0){
                   fracasso = true;
                   //break;
                }
                arvore = arvore + " [Retorna pro pai -- ";
                convert << n;                           ///Usado para a concatenação do texto e número em uma String única
                arvore = arvore + convert.str() + "], ";
                convert.str(std::string());             ///"Limpa" a variável
                pilha.pop_back();                 ///Desempilha e redireciona para o pai
                n = pilha[pilha.size() - 1];
                cout << "Foi Aqui" << endl;
            }
        }
    }
    arvore = arvore + "}";
    if(fracasso == true){
        cout << "Fracasso em encontrar a solucao" << endl;
    }
    else{
        if(sucesso == true){
            cout << "--> Sucesso!!! Arvore de Solucao: " << endl << endl;
            cout << arvore << endl;
        }
    }
}

int main()
{
    //Labirinto* la = new Labirinto();
    Grafo* g = new Grafo();
    criaMapaTesteGrafo(g);
    //g->backtracking(1,8);
    g->buscaProfundidade(1, 3, 2); /// Caminho de 1 ao 8 com profundidade menor que 10

    delete g;
    return 0;
}
