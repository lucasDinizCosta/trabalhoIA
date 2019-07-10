#ifndef GRAFO_H_INCLUDED
#define GRAFO_H_INCLUDED
#include "Vertice.h"
#include "Aresta.h"
#include <stack>
#include <queue>

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
        void insereAresta(int v1, int v2, int direcao);
        void removeAresta(int v1, int v2);
        void removeVertice(int v);
        Vertice * retornaVertice(int n);
        bool verificaAdjacencia(int v1, int v2);
        void imprime();
        void backtracking(int ini, int fim);
        void buscaProfundidade(int ini, int fim, int limiteProfMax);
};

void Grafo::buscaProfundidade(int ini, int fim, int limiteProfMax){

    cout << endl << "Executando busca em profundidade: " << endl;
    std::vector<int> abertos;
    std::vector<int> fechados;
    std::vector<int> solucao;
    int limiteProfundidade = 0;             ///Controla a profundidade visando não ocorrer a possibilidade de "caminhos infinitos" ou muito grandes, o que seria inviável
    bool visitados[numeroVertices];
    for(int i = 0; i < numeroVertices; i++){
        visitados[i] = false;
    }
    int s = ini;
    abertos.push_back(s);
    limiteProfundidade++;
    //pilha.push_back(n);
    visitados[s - 1] = true;
    bool fracasso = false;
    bool sucesso = false;
    while((sucesso == false) && (fracasso == false)){
        if(abertos.size() == 0){                            ///Lista de abertos vazia
            fracasso = true;
        }
        else{
            int n = abertos[abertos.size() - 1];                         ///Topo da pilha
            if(limiteProfundidade > limiteProfMax){                     ///Estabelece um limite de profundidade da busca
                limiteProfundidade--;
                fechados.push_back(n);
                abertos.pop_back();
                //solucao.push_back(n);
                continue;                                           ///Continua o loop sem descer o código
            }
            //fechados.push_back(n);
            //abertos.pop_back();
            //cout << n << endl;
            cout << endl << endl;
            cout << "Profundidade: " << limiteProfundidade << endl;
            cout << "Abertos: ";
            for(int i = 0; i < abertos.size(); i++){
                cout << abertos[i] << " -- ";
            }
            cout << endl;
            cout << "Fechados: ";
            for(int i = 0; i < fechados.size(); i++){
                cout << fechados[i] << " -- ";
            }
            cout << endl << endl;

            abertos.pop_back();
            if(n == fim){
                sucesso = true;
                fechados.push_back(n);
                break;
            }
            else{
                int cont = 3;
                int contVisitados = 0;
                int contVerticesNull = 0;
                while(cont >= 0){
                    //cout << cont << endl;
                    if(retornaVertice(n)->caminhos[cont] != NULL){  ///Checa se não é NULL
                        //cout << retornaVertice(n)->caminhos[cont]->getNum()<<"FOI" << endl;
                        //cout << retornaVertice(n)->caminhos[cont]->getNum() << " -- " << visitados[retornaVertice(n)->caminhos[cont]->getNum() - 1] << " -- " << "FOI" << endl;
                        if(visitados[retornaVertice(n)->caminhos[cont]->getNum() - 1] == false) /// e se o vertice da proxima aresta não foi visitado
                        {
                            int u = retornaVertice(n)->caminhos[cont]->getNum();            ///Atualiza para o próximo vértice
                            //pilha.push_back(n);
                            //cout << "FOI" << endl;
                            abertos.push_back(u);
                            visitados[u - 1] = true;
                        }
                        else{
                            contVisitados++;
                        }
                        //break;
                    }
                    else{
                        contVerticesNull++;
                    }
                    cont--;
                }
                if(cont < 0){                       ///Passou todas as operações possíveis -- Fazer o backtracking senão retornar fracasso
                    limiteProfundidade++;
                    fechados.push_back(n);
                    solucao.push_back(n);
                    if(contVisitados == 0){
                        //solucao.push_back(n);
                        solucao.pop_back();
                    }
                }
            }
        }

    }
    if(fracasso == true){
        cout << "Fracasso em encontrar a solucao" << endl;
    }
    else{
        if(sucesso == true){
            cout << "--> Sucesso!!! Arvore de Solucao: " << endl << endl;
            /*for(int i = 0; i < pilha.size(); i++){
                cout << pilha[i] << " -- ";
            }*/
            cout << "Abertos: ";
            for(int i = 0; i < abertos.size(); i++){
                cout << abertos[i] << " -- ";
            }
            cout << endl;
            cout << "Fechados: ";
            for(int i = 0; i < fechados.size(); i++){
                cout << fechados[i] << " -- ";
            }
            cout << endl;
            cout << "Solucao: ";
            for(int i = 0; i < solucao.size(); i++){
                cout << solucao[i] << " -- ";
            }
            cout << endl;
            cout << "Numero total de nos visitados: ";
            int numVisitados = 0;
            for(int i = 0; i < numeroVertices; i++){
                if(visitados[i]){
                    numVisitados++;
                }
            }
            cout << numVisitados;
            cout << endl << endl;
        }
    }
}

void Grafo::backtracking(int ini, int fim){

    cout << endl << "Executando Backtrack: " << endl;
    //string arvore = "{";
    //stringstream convert;       // stream used for the conversion
    std::vector<int> pilha;             ///Empilha os vertices
    bool visitados[numeroVertices];
    for(int i = 0; i < numeroVertices; i++){
        visitados[i] = false;
    }
    int s = ini;
    int n = s;
    //visitados[s - 1] = true;              ///Marca o primeiro como visitado
    //pilha.push_back(s);                 ///Empilha o primeiro elemento
    pilha.push_back(n);
    visitados[n - 1] = true;               ///Visitando o primeiro vertice
    bool fracasso = false;
    bool sucesso = false;
    while((sucesso == false) && (fracasso == false)){
        int cont = 0;
        while(cont < 4){
            //cout << cont << endl;
            if(retornaVertice(n)->caminhos[cont] != NULL && visitados[retornaVertice(n)->caminhos[cont]->getNum() - 1] == false){  ///Checa se não é NULL e se o vertice da proxima aresta não foi visitado

                n = retornaVertice(n)->caminhos[cont]->getNum();            ///Atualiza para o próximo vértice
                visitados[n - 1] = true;                                        ///Marca como visitado o próximo vértice
                pilha.push_back(n);
                if(n == fim){                                                   ///Encontrou o objetivo
                    sucesso = true;
                }
                break;
            }
            cont++;
        }
        if(cont >= 4){          ///Passou todas as operações possíveis -- Fazer o backtracking senão retornar fracasso
            if(n == s){
                fracasso = true;
            }
            else{
                if(pilha.size() == 0){
                   fracasso = true;
                   break;
                }
                //arvore = arvore + " [Retorna pro pai -- ";
                //convert << n;                           ///Usado para a concatenação do texto e número em uma String única
                //arvore = arvore + convert.str() + "], ";
                //convert.str(std::string());             ///"Limpa" a variável
                pilha.pop_back();                 ///Desempilha e redireciona para o pai
                n = pilha[pilha.size() - 1];
                //cout << "Foi Aqui" << endl;
            }
        }
    }
    if(fracasso == true){
        cout << "Fracasso em encontrar a solucao" << endl;
    }
    else{
        if(sucesso == true){
            cout << "--> Sucesso!!! Arvore de Solucao: " << endl << endl;
            cout << "Pilha: ";
            for(int i = 0; i < pilha.size(); i++){
                cout << pilha[i] << " -- ";
            }
            cout << endl;

            int numVisitados = 0;
            cout << "Quem foi visitado: ";
            for(int i = 0; i < numeroVertices; i++){
                if(visitados[i]){
                    cout << (i+1) << " -- ";
                    numVisitados++;
                }
            }
            cout << "\nNumero total de nos visitados: " << numVisitados << endl;
            cout << endl << endl;

        }
    }
}

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
