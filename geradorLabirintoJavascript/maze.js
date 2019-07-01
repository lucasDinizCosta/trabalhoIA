function Maze(linhas, colunas, larguraCelula){
  this.matriz = [];
  this.linhas = linhas;
  this.colunas = colunas;
  this.larguraCelula = larguraCelula;
  this.celulaAtual = null;
  this.grid = [];                                            //Vetor que armazena a matriz toda de maneira linear pra poder gerar o labirinto mais fácil usando backtrack recursivo
  this.pilha = [];
  for (var i = 0; i < linhas; i++) {                         ///Cria a estrutura básica do labirinto
    this.matriz[i] = [];
    for (var j = 0; j < colunas; j++) {
      var cell = new Cell(i, j);
      this.matriz[i][j] = cell;
      this.grid.push(cell);
    }
  }
  this.celulaAtual = this.grid[0];                                     //Expande a geração do labirinto a partir da célula{0,0}
  this.caminhoSolucao = [];
};


/*****************************************************************
*                                                                *
*                 gerarLabirintoPorPassos():                      *
*  -> gera o labirinto passo a passo sendo necessário colocar no *
*  loop de animação para que termine a geração completa.         *
*                                                                *
******************************************************************/

Maze.prototype.gerarLabirintoPorPassos = function(estado){
    this.celulaAtual.visited = true;
    //PASSO 1
    var proximaCelula = this.celulaAtual.checarVizinhos(this.grid, this.colunas, this.linhas);
    if (proximaCelula) {
      proximaCelula.visited = true;

      // PASSO 2
      this.pilha.push(this.celulaAtual);

      // PASSO 3
      this.removeWalls(this.celulaAtual, proximaCelula);

      // PASSO 4
      this.celulaAtual = proximaCelula;
    }else if (this.pilha.length > 0) {
      this.celulaAtual = this.pilha.pop();
      if(this.celulaAtual===this.grid[0]){
         console.log("Terminou geração");
         console.log("FOI");
         estado = 1;
      }
    }
}

/*****************************************************
*                                                    *
*             gerarLabirintoCompleto():              *
*  -> gera o labirinto completo de uma vez.          *
*                                                    *
******************************************************/

Maze.prototype.gerarLabirintoCompleto = function(){
  var gerouLabirinto = false;
  while(gerouLabirinto===false){
    this.celulaAtual.visited = true;
    //PASSO 1
    var proximaCelula = this.celulaAtual.checarVizinhos(this.grid, this.colunas, this.linhas);
    if (proximaCelula) {
      proximaCelula.visited = true;

      // PASSO 2
      this.pilha.push(this.celulaAtual);

      // PASSO 3
      this.removeWalls(this.celulaAtual, proximaCelula);

      // PASSO 4
      this.celulaAtual = proximaCelula;
    } else if (this.pilha.length > 0) {
      this.celulaAtual = this.pilha.pop();
      if(this.celulaAtual===this.grid[0]){
         console.log("Terminou a geração");
         break;
      }
    }
  }
}

Maze.prototype.desenharLabirinto = function(ctx, espacamento){
  for (var i = 0; i < this.grid.length; i++) {          //Exibe as células
    this.grid[i].show(ctx, this.larguraCelula, espacamento);
  }
}

Maze.prototype.desenharGeracaoLabirintoPorPassos = function(ctx, espacamento, estado){
  for (var i = 0; i < this.grid.length; i++) {          //Exibe as células
    this.grid[i].show(ctx, this.larguraCelula, espacamento);
  }
  this.celulaAtual.colorido(ctx, this.larguraCelula, espacamento);
  this.gerarLabirintoPorPassos(estado);
}

/******************************************************
*                                                     *
*            desenharSolucao(ctx, espacaemento):      *
*  -> Projeta o caminho da solução no labirinto.      *
*                                                     *
*******************************************************/

Maze.prototype.desenharSolucao = function(ctx, espacamento){
  for(var i = 0; i < this.caminhoSolucao.length; i++){
    var x = this.caminhoSolucao[i].j * this.larguraCelula + espacamento;
    var y = this.caminhoSolucao[i].i * this.larguraCelula + espacamento;
    if(i == 0){
      ctx.fillStyle = 'rgb(0,0,255)';   //Celula INICIAL da busca
      ctx.fillRect(x + (this.larguraCelula/4), y + (this.larguraCelula/4), this.larguraCelula/2, this.larguraCelula/2);
    }
    else if(i == (this.caminhoSolucao.length - 1)){
      ctx.fillStyle = 'rgb(255,0,0)';   //Celula FINAL da busca
      ctx.fillRect(x + (this.larguraCelula/4), y + (this.larguraCelula/4), this.larguraCelula/2, this.larguraCelula/2);
    }
    else{
      ctx.fillStyle = 'rgb(0,200,0)';   //Caminho
      ctx.fillRect(x + (this.larguraCelula/4), y + (this.larguraCelula/4), this.larguraCelula/2, this.larguraCelula/2);
    }
  }
}

/*****************************************************************
*                                                                *
*            desenharLinhasGrade(ctx, espacaemento):             *
*  -> Método que desenha as linhas de grade e identificação de   *
*  linha e coluna visando facilitar a escolha dos vertices ini-  *
*  cial e objetivo                                               *
******************************************************************/

Maze.prototype.desenharLinhasGrade = function(ctx, espacamento){
  ctx.strokeStyle = 'black';
  for (var i = 0; i < this.linhas; i++) {                         ///Cria a estrutura básica do labirinto
    for (var j = 0; j < this.colunas; j++){
      var x = this.matriz[i][j].j * this.larguraCelula + espacamento;
      var y = this.matriz[i][j].i * this.larguraCelula + espacamento;
      ctx.strokeRect(x, y, this.larguraCelula, this.larguraCelula);
    }
  }

  ctx.fillStyle = 'black';
  ctx.textAlign = "center";

  if(this.larguraCelula > 30){
    ctx.font = "12px Arial Black";
  }
  else{
    ctx.font = "8px Arial Black";
  }
  for (var i = 0; i < this.linhas; i++) {                         ///Cria os escritos das linhas
    var x = this.matriz[0][i].j * this.larguraCelula + espacamento + this.larguraCelula/3;
    var y = this.matriz[0][0].i * this.larguraCelula + espacamento - 8;
    ctx.fillText(i+"", x, y);

  }
  for (var j = 0; j < this.colunas; j++) {                         ///Cria o escrito das colunas
    var x = this.matriz[0][0].j + espacamento/2;
    var y = this.matriz[j][0].i * this.larguraCelula + espacamento + this.larguraCelula/2;
    ctx.fillText(j+"", x, y);
  }
}

/*****************************************************************
*                                                                *
*                       removeWalls(a, b):                       *
*  -> Método importante para geração do labirinto em que remove  *
*  as paredes entre duas células.                                *
*                                                                *
******************************************************************/

Maze.prototype.removeWalls = function (a, b) {
  var x = a.j - b.j;           ///Analisa a coluna
  if (x === 1) {
    a.wall[3] = false;
    b.wall[1] = false;
  } else if (x === -1) {
    a.wall[1] = false;
    b.wall[3] = false;
  }
  var y = a.i - b.i;           ///Analisa a linha
  if (y === 1) {
    a.wall[0] = false;
    b.wall[2] = false;
  } else if (y === -1) {
    a.wall[2] = false;
    b.wall[0] = false;
  }
}

            /********************************
            *       Algoritmos de busca     *
            *********************************/

Maze.prototype.heuristica = function (xInicial, yInicial, xFinal, yFinal){
  if(Math.abs(xFinal - xInicial)  <  Math.abs(yFinal - yInicial))
    return Number(Math.abs(xInicial - xFinal) + Math.abs((yInicial - yFinal) - Math.abs(xInicial - xFinal)));
  else
  if(Math.abs(xFinal - xInicial)  >  Math.abs(yFinal - yInicial))
    return Number(Math.abs(yInicial - yFinal) + Math.abs((xInicial - xFinal) - Math.abs(yInicial - yFinal)));
  else
  if(Math.abs(xFinal - xInicial)  ==  Math.abs(yFinal - yInicial))
    return Number(Math.abs(xInicial - xFinal));
}

Maze.prototype.backtracking = function(verticeInicial, verticeObjetivo){
  this.caminhoSolucao = [];
  var tempoInicial = performance.now();
  console.log("\n \t \t-------- Executando busca em Backtracking:  ------------\n \n");
  var abertos = [];                                //Pilha
  var fechados = [];                                //Removidos da pilha
  var visitados = [];//[linhas][cols];            //Matriz de visitados
  for (var i = 0; i < this.linhas; i++) {
    visitados[i] = [];
    for(var j = 0; j < this.colunas; j++){
      visitados[i][j] = false;
    }
  }
  var profundidade = 0;
  var fim = this.matriz[verticeObjetivo[0]][verticeObjetivo[1]];
  var s = this.matriz[verticeInicial[0]][verticeInicial[1]];
  var n = s;
  visitados[n.i][n.j] = true;                                       //Visitando o primeiro vertice
  abertos.push(n);
  var fracasso = false, sucesso = false;
  while((sucesso == false) && (fracasso == false)){
    var contador = 0;
    for (var i = 0; i < s.wall.length; i++) {
      if(n.wall[i] === false){                                      //Checa se não há parede
        var auxVizinho = n.getVizinho(i, this.matriz);              //Captura a celula do vizinho na matriz
        if(visitados[auxVizinho.i][auxVizinho.j] === false){        //vizinho não visitado
          auxVizinho.pai = n;                                         //Armazena o pai para gerar o caminho e "arvore" de solução
          n = auxVizinho;                                           //Atualiza para o próximo vértice
          visitados[n.i][n.j] = true;                               //Marca como visitado o próximo vértice
          abertos.push(n);
          if(n === fim){                                            //Encontrou o objetivo
            sucesso = true;
          }
          break;
        }
      }
      contador++;
    }
    profundidade++;
    if(contador >= 4){          ///Passou todas as operações possíveis -- Fazer o backtracking senão retornar fracasso
      if(n === s){
          fracasso = true;
      }
      else{
          if(abertos.length == 0){
             fracasso = true;
             break;
          }
          fechados.push(abertos.pop());                     //Armazena os vertices fechados
          n = abertos[abertos.length - 1];                  //Desempilha e redireciona para o pai
          profundidade--;
      }
    }
  }
  if(fracasso){
    console.log("\t \t ----- Fracasso em encontrar a solução!!! --- \n");
    console.log("Status da busca: \n \n");
    var texto = "\nAbertos - nós expandidos (total ao final da execucao: " + abertos.length + "): ";
    for(var i = 0; i < abertos.length; i++){
        texto = texto + "Celula["+abertos[i].i+"]["+abertos[i].j+"]"+ " -- ";
    }
    texto = texto + "\n";
    console.log(texto);
    texto = "";
    var numVisitados = 0;
    for (var i = 0; i < this.linhas; i++) {
      for(var j = 0; j < this.colunas; j++){
        if(visitados[i][j]){
            texto = texto + "Celula["+i+"]["+j+"] -- ";
            numVisitados++;
        }
      }
    }
    texto = "\n\nQuem foi visitado (total ao final da execucao: " + numVisitados + "): " + texto;
    console.log(texto);
    console.log("\nProfundidade: " + profundidade);
    var tempoFinal = performance.now();
    console.log("\nTempo de execução: " + parseFloat((tempoFinal - tempoInicial)).toFixed(3) + " milissegundos");    ///Mede o tempo somente na função
    this.caminhoSolucao = [];
  }
  else{
    if(sucesso){
      console.log("\t \t ----- Sucesso em encontrar a solução!!! --- \n");
      console.log("Status da busca: \n \n");
      var texto = "\nAbertos - Nós expandidos (total ao final da execucao: " + abertos.length + "): ";
      for(var i = 0; i < abertos.length; i++){
          texto = texto + "Celula["+abertos[i].i+"]["+abertos[i].j+"]"+ " -- ";
      }
      console.log(texto + "\n");

      var texto = "\nFechados (total ao final da execucao: " + fechados.length + "): ";
      for(var i = 0; i < fechados.length; i++){
          texto = texto + "Celula["+fechados[i].i+"]["+fechados[i].j+"]"+ " -- \n";
      }
     console.log(texto+"\n");

      texto = "";
      var numVisitados = 0;
      for (var i = 0; i < this.linhas; i++) {
        for(var j = 0; j < this.colunas; j++){
          if(visitados[i][j]){
              texto = texto + "Celula["+i+"]["+j+"] -- ";
              numVisitados++;
          }
        }
      }
      texto = "\n\nQuem foi visitado (total ao final da execucao: " + numVisitados + "): " + texto;
      console.log(texto);

      this.caminhoSolucao = [];
      var aux = n;
      while(aux != null){
        this.caminhoSolucao.push(aux);
        aux = aux.pai;
      }
      this.caminhoSolucao.reverse();                                               //Inverte o vetor
      texto = "Caminho da solução (Total: "+ this.caminhoSolucao.length + "): ";
      for(var i = 0; i < this.caminhoSolucao.length; i++){
        texto = texto + "Celula["+this.caminhoSolucao[i].i+"]["+this.caminhoSolucao[i].j+"] -- "
      }
      console.log(texto);

      //Valor médio do fator de ramificação da árvore => Como é capturado o pai de cada um, logo
      //vai verificando os filhos daquele determinado pai e calcula a média
      /**
        |  nós  | Filhos|
        | [0,0] |   0  |      ==> [[Celula, qtdFilhos],...]

      */

     var elementosBusca = [];
     elementosBusca = abertos.concat(fechados);
     /*console.log(abertos.length);
     console.log(fechados.length);
     console.log(elementosBusca.length);
     console.log(abertos.concat(fechados).length);*/

     var tabelaFilhosPorCelula = [];
     for(var i = 0; i < elementosBusca.length; i++){
       if(elementosBusca[i].pai != null){
         for(var j = 0; j < tabelaFilhosPorCelula.length; j++){
           if(elementosBusca[i].pai === tabelaFilhosPorCelula[j][0]){                 //Encontrou o pai então incrementa o número de filhos dele
             tabelaFilhosPorCelula[j][1] = tabelaFilhosPorCelula[j][1] + 1;
             break;
           }
         }
         tabelaFilhosPorCelula.push([elementosBusca[i], 0]);
       }
       else{
         tabelaFilhosPorCelula.push([elementosBusca[i], 0]);
       }
     }

     texto = "\nImpressao da lista de pais e numero de filhos(Total de vertices: "+tabelaFilhosPorCelula.length+"): \n";
     var valorMedioRamificacao = 0;
     for(var i = 0; i < tabelaFilhosPorCelula.length; i++){
       texto = texto + "(["+tabelaFilhosPorCelula[i][0].i+", "+ tabelaFilhosPorCelula[i][0].j + "], " + tabelaFilhosPorCelula[i][1] + ")  --  \n";
       valorMedioRamificacao = valorMedioRamificacao + tabelaFilhosPorCelula[i][1];
     }
     console.log(texto+"\n");
     valorMedioRamificacao = (valorMedioRamificacao/tabelaFilhosPorCelula.length);
     console.log("Valor médio do fator de ramificação da árvore de busca: " + valorMedioRamificacao);

      var tempoFinal = performance.now();
      console.log("\nTempo de execução: " + parseFloat((tempoFinal - tempoInicial)).toFixed(3) + " milissegundos");    ///Mede o tempo somente na função
    }
  }

}
/**

Estratégia de controle: Inserir na pilha de modo que sejam executadas a ordem
do vetor de paredes, ou seja, cima, direita, baixo e esquerda
*/

Maze.prototype.buscaProfundidadeLimitada = function (verticeInicial, verticeObjetivo, limiteProfMax){
  caminhoSolucao = [];
  var tempoInicial = performance.now();
  console.log("\n \t \t-------- Executando busca em profundidade limitada: ------------\n");
  console.log("\t \t-------- Profundidade máxima: "+limiteProfMax+"\n \n");
  var abertos = [];                               //Comportamento de uma pilha - FILO - Primeiro que entra é o ultimo a sair
  var fechados = [];
  var visitados = [];//[linhas][cols];            //Matriz de visitados
  for (var i = 0; i < this.linhas; i++) {
    visitados[i] = [];
    for(var j = 0; j < this.colunas; j++){
      visitados[i][j] = false;
    }
  }
  var limiteProfundidade = 0;             ///Controla a profundidade visando não ocorrer a possibilidade de "caminhos infinitos" ou muito grandes, o que seria inviável
  var fim = this.matriz[verticeObjetivo[0]][verticeObjetivo[1]];
  var s = this.matriz[verticeInicial[0]][verticeInicial[1]];
  abertos.push(s);
  limiteProfundidade++;
  visitados[s.i][s.j] = true;                               //Visitando o primeiro vertice
  var fracasso = false, sucesso = false;
  while((sucesso == false) && (fracasso == false)){
        if(abertos.length == 0){                            ///Lista de abertos vazia
            fracasso = true;
        }
        else{
            var n = abertos[abertos.length - 1];                      //Topo da pilha
            if(limiteProfundidade > limiteProfMax){                   //Estabelece um limite de profundidade da busca
                limiteProfundidade--;
                fechados.push(n);
                abertos.pop();
                continue;                                             //Continua o loop sem descer o código
            }
            abertos.pop();                                            //Desempilha
            visitados[n.i][n.j] = true;                               //Marca como visitado o próximo vértice
            if(n == fim){
                sucesso = true;
                fechados.push(n);
                break;
            }
            else{
                var contador = 0;
                for (var i = s.wall.length - 1; i > -1; i--) {                  //Checa na direção contraria(esquerda,baixo,direita,cima) para poder retirar da pilha na ordem do vetor de paredes
                  if(n.wall[i] === false){                                      //Checa se não há parede
                    var auxVizinho = n.getVizinho(i, this.matriz);              //Captura a celula do vizinho na matriz
                    if(visitados[auxVizinho.i][auxVizinho.j] === false){        //vizinho não visitado
                      var u = auxVizinho;                                       //Atualiza para o próximo vértice
                      u.pai = n;
                      abertos.push(u);
                    }
                  }
                  contador++;
              }
              if(contador >= 4){ ///Passou todas as operações possíveis -- Fazer o backtracking senão retornar fracasso
                limiteProfundidade++;
                fechados.push(n);
              }
            }
        }
    }

    if(fracasso){
      console.log("\t \t ----- Fracasso em encontrar a solução!!! --- \n");
      console.log("Status da busca: \n \n");
      var texto = "\nAbertos (total ao final da execucao: " + abertos.length + "): ";
      for(var i = 0; i < abertos.length; i++){
          texto = texto + "Celula["+abertos[i].i+"]["+abertos[i].j+"]"+ " -- ";
      }
      texto = texto + "\n";
      console.log(texto);
      texto = "\Fechados (total ao final da execucao: " + fechados.length + "): ";
      for(var i = 0; i < fechados.length; i++){
          texto = texto + "Celula["+fechados[i].i+"]["+fechados[i].j+"]"+ " -- ";
      }
      texto = texto + "\n";
      console.log(texto);
      texto = "";
      var numVisitados = 0;
      for (var i = 0; i < this.linhas; i++) {
        for(var j = 0; j < this.colunas; j++){
          if(visitados[i][j]){
              texto = texto + "Celula["+i+"]["+j+"] -- ";
              numVisitados++;
          }
        }
      }
      texto = "\n\nQuem foi visitado (total ao final da execucao: " + numVisitados + "): " + texto;
      console.log(texto);
      //console.log("\nQuantidade total de vértices visitados: " + numVisitados);
      var tempoFinal = performance.now();
      console.log("\nTempo de execução: " + parseFloat((tempoFinal - tempoInicial)).toFixed(3) + " milissegundos");    ///Mede o tempo somente na função
    }
    else{
      if(sucesso){
        console.log("\t \t ----- Sucesso em encontrar a solução!!! --- \n");
        console.log("Status da busca: \n \n");
        var texto = "\nAbertos (total ao final da execucao: " + abertos.length + "): ";
        for(var i = 0; i < abertos.length; i++){
            texto = texto + "Celula["+abertos[i].i+"]["+abertos[i].j+"]"+ " -- ";
        }
        texto = texto + "\n";
        console.log(texto);
        texto = "\Fechados (total ao final da execucao: " + fechados.length + "): ";
        for(var i = 0; i < fechados.length; i++){
            texto = texto + "Celula["+fechados[i].i+"]["+fechados[i].j+"]"+ " -- ";
        }
        texto = texto + "\n";
        console.log(texto);
        texto = "";
        var numVisitados = 0;
        for (var i = 0; i < this.linhas; i++) {
          for(var j = 0; j < this.colunas; j++){
            if(visitados[i][j]){
                texto = texto + "Celula["+i+"]["+j+"] -- ";
                numVisitados++;
            }
          }
        }
        texto = "\n\nQuem foi visitado (total ao final da execucao: " + numVisitados + "): " + texto;
        console.log(texto);
        this.caminhoSolucao = [];
        var aux = fechados[fechados.length - 1];
        while(aux != null){
          this.caminhoSolucao.push(aux);
          aux = aux.pai;
        }
        this.caminhoSolucao.reverse();                                               //Inverte o vetor
        texto = "Caminho da solução (Total: "+ this.caminhoSolucao.length + "): ";
        for(var i = 0; i < this.caminhoSolucao.length; i++){
          texto = texto + "Celula["+this.caminhoSolucao[i].i+"]["+this.caminhoSolucao[i].j+"] -- "
        }
        console.log(texto);
        // Encontrar o caminho até a raiz da solução
        // Encontrar o fator médio de ramificação

       var elementosBusca = [];
       elementosBusca = abertos.concat(fechados);
       /*console.log(abertos.length);
       console.log(fechados.length);
       console.log(elementosBusca.length);
       console.log(abertos.concat(fechados).length);*/

       var tabelaFilhosPorCelula = [];
       for(var i = 0; i < elementosBusca.length; i++){
         if(elementosBusca[i].pai != null){
           for(var j = 0; j < tabelaFilhosPorCelula.length; j++){
             if(elementosBusca[i].pai === tabelaFilhosPorCelula[j][0]){                 //Encontrou o pai então incrementa o número de filhos dele
               tabelaFilhosPorCelula[j][1] = tabelaFilhosPorCelula[j][1] + 1;
               break;
             }
           }
           tabelaFilhosPorCelula.push([elementosBusca[i], 0]);
         }
         else{
           tabelaFilhosPorCelula.push([elementosBusca[i], 0]);
         }
       }

       texto = "\nImpressao da lista de pais e numero de filhos(Total de vertices: "+tabelaFilhosPorCelula.length+"): \n";
       var valorMedioRamificacao = 0;
       for(var i = 0; i < tabelaFilhosPorCelula.length; i++){
         texto = texto + "(["+tabelaFilhosPorCelula[i][0].i+", "+ tabelaFilhosPorCelula[i][0].j + "], " + tabelaFilhosPorCelula[i][1] + ")  --  \n";
         valorMedioRamificacao = valorMedioRamificacao + tabelaFilhosPorCelula[i][1];
       }
       console.log(texto+"\n");
       valorMedioRamificacao = (valorMedioRamificacao/tabelaFilhosPorCelula.length);
       console.log("Valor médio do fator de ramificação da árvore de busca: " + valorMedioRamificacao);


        //console.log("\nQuantidade total de vértices visitados: " + numVisitados);
        var tempoFinal = performance.now();
        console.log("\nTempo de execução: " + parseFloat((tempoFinal - tempoInicial)).toFixed(3) + " milissegundos");    ///Mede o tempo somente na função
      }
    }

}

Maze.prototype.buscaEmLargura = function (verticeInicial, verticeObjetivo){
  var tempoInicial = performance.now();
  console.log("\n \t \t-------- Executando busca em Largura:  ------------\n \n");
  var abertos = [];                                //Comportamento de uma fila - FIFO - Primeiro que entra é o primeiro que sai
  var fechados = [];
  var visitados = [];                            //Matriz de visitados
  for (var i = 0; i < this.linhas; i++) {
    visitados[i] = [];
    for(var j = 0; j < this.colunas; j++){
      visitados[i][j] = false;
    }
  }
  var profundidade = 0;                                             ///Armazena a profundidade da busca
  var fim = this.matriz[verticeObjetivo[0]][verticeObjetivo[1]];
  var s = this.matriz[verticeInicial[0]][verticeInicial[1]];
  abertos.push(s);
  visitados[s.i][s.j] = true;                                       //Visitando o primeiro vertice
  var fracasso = false, sucesso = false;
  while((sucesso == false) && (fracasso == false)){
        if(abertos.length == 0){                            ///Lista de abertos vazia
            fracasso = true;
        }
        else{
            var n = abertos[0];                                       ///Inicio da fila
            abertos.shift();                                          //Remove o elemento do começo da fila
            visitados[n.i][n.j] = true;                               //Marca como visitado o próximo vértice
            if(n == fim){
                sucesso = true;
                profundidade++;
                fechados.push(n);
                break;
            }
            else{
                var contador = 0;
                for (var i = 0; i < s.wall.length; i++) {                       //Checa na direção contraria(esquerda,baixo,direita,cima) para poder retirar da pilha na ordem do vetor de paredes
                  if(n.wall[i] === false){                                      //Checa se não há parede
                    var auxVizinho = n.getVizinho(i, this.matriz);              //Captura a celula do vizinho na matriz
                    if(visitados[auxVizinho.i][auxVizinho.j] === false){        //vizinho não visitado
                      var u = auxVizinho;                                       //Atualiza para o próximo vértice
                      abertos.push(u);
                    }
                  }
                  contador++;
              }
              if(contador >= 4){                ///Passou todas as operações possíveis -- Fazer o backtracking senão retornar fracasso
                profundidade++;
                fechados.push(n);
              }
            }
        }
    }

    if(fracasso){
      this.caminhoSolucao = [];
      console.log("\t \t ----- Fracasso em encontrar a solução!!! --- \n");
      console.log("Status da busca: \n \n");
      //console.log("Profundidade: "+ profundidade);
      var texto = "\nAbertos (total ao final da execucao: " + abertos.length + "): ";
      for(var i = 0; i < abertos.length; i++){
      texto = texto + "Celula["+abertos[i].i+"]["+abertos[i].j+"]"+ " -- ";
      }
      texto = texto + "\n";
      console.log(texto);

      texto = "\nFechados (total ao final da execucao: " + fechados.length + "): ";
      for(var i = 0; i < fechados.length; i++){
          texto = texto + "Celula["+fechados[i].i+"]["+fechados[i].j+"]"+ " -- ";
      }
      texto = texto + "\n";
      console.log(texto);

      texto = "";
      var numVisitados = 0;
      for (var i = 0; i < this.linhas; i++) {
        for(var j = 0; j < this.colunas; j++){
          if(visitados[i][j]){
              texto = texto + "Celula["+i+"]["+j+"] -- ";
              numVisitados++;
          }
        }
      }
      texto = "\n\nQuem foi visitado (total ao final da execucao: " + numVisitados + "): " + texto;
      console.log(texto);
    }
    else{
      if(sucesso){
        console.log("\t \t ----- Sucesso em encontrar a solução!!! --- \n");
        console.log("Status da busca: \n \n");
        //console.log("Profundidade: "+ profundidade);
        var texto = "\nAbertos (total ao final da execucao: " + abertos.length + "): ";
        for(var i = 0; i < abertos.length; i++){
        texto = texto + "Celula["+abertos[i].i+"]["+abertos[i].j+"]"+ " -- ";
        }
        texto = texto + "\n";
        console.log(texto);

        texto = "\nFechados (total ao final da execucao: " + fechados.length + "): ";
        for(var i = 0; i < fechados.length; i++){
            texto = texto + "Celula["+fechados[i].i+"]["+fechados[i].j+"]"+ " -- ";
        }
        texto = texto + "\n";
        console.log(texto);

        texto = "";
        var numVisitados = 0;
        for (var i = 0; i < this.linhas; i++) {
          for(var j = 0; j < this.colunas; j++){
            if(visitados[i][j]){
                texto = texto + "Celula["+i+"]["+j+"] -- ";
                numVisitados++;
            }
          }
        }
        texto = "\n\nQuem foi visitado (total ao final da execucao: " + numVisitados + "): " + texto;
        console.log(texto);

        this.caminhoSolucao = [];
        var aux = n;
        while(aux != null){
          this.caminhoSolucao.push(aux);
          aux = aux.pai;
        }
        this.caminhoSolucao.reverse();                                               //Inverte o vetor
        texto = "Caminho da solução (Total: "+ this.caminhoSolucao.length + "): ";
        for(var i = 0; i < this.caminhoSolucao.length; i++){
          texto = texto + "Celula["+this.caminhoSolucao[i].i+"]["+this.caminhoSolucao[i].j+"] -- "
        }
        console.log(texto);

        var elementosBusca = [];
        elementosBusca = abertos.concat(fechados);
          /*console.log(abertos.length);
          console.log(fechados.length);
          console.log(elementosBusca.length);
          console.log(abertos.concat(fechados).length);*/

        var tabelaFilhosPorCelula = [];
        for(var i = 0; i < elementosBusca.length; i++){
         if(elementosBusca[i].pai != null){
           for(var j = 0; j < tabelaFilhosPorCelula.length; j++){
             if(elementosBusca[i].pai === tabelaFilhosPorCelula[j][0]){                 //Encontrou o pai então incrementa o número de filhos dele
               tabelaFilhosPorCelula[j][1] = tabelaFilhosPorCelula[j][1] + 1;
               break;
             }
           }
           tabelaFilhosPorCelula.push([elementosBusca[i], 0]);
         }
         else{
           tabelaFilhosPorCelula.push([elementosBusca[i], 0]);
         }
        }

        texto = "\nImpressao da lista de pais e numero de filhos(Total de vertices: "+tabelaFilhosPorCelula.length+"): \n";
        var valorMedioRamificacao = 0;
        for(var i = 0; i < tabelaFilhosPorCelula.length; i++){
         texto = texto + "(["+tabelaFilhosPorCelula[i][0].i+", "+ tabelaFilhosPorCelula[i][0].j + "], " + tabelaFilhosPorCelula[i][1] + ")  --  \n";
         valorMedioRamificacao = valorMedioRamificacao + tabelaFilhosPorCelula[i][1];
        }
        console.log(texto+"\n");
        valorMedioRamificacao = (valorMedioRamificacao/tabelaFilhosPorCelula.length);
        console.log("Valor médio do fator de ramificação da árvore de busca: " + valorMedioRamificacao);

        var tempoFinal = performance.now();
        console.log("\nTempo de execução: " + parseFloat((tempoFinal - tempoInicial)).toFixed(3) + " milissegundos");    ///Mede o tempo somente na função
      }
    }
}

Maze.prototype.buscaGulosa = function(verticeInicial, verticeObjetivo)
{

  var visitados = [];                            //Matriz de visitados
  for (var i = 0; i < this.linhas; i++) {
    visitados[i] = [];
    for(var j = 0; j < this.colunas; j++){
      visitados[i][j] = false;
    }
  }

  //CRIA MATRIZ AUXILIAR DE HEURÍSTICAS
  var matrizHeuristicas = [];
  for (var i = 0; i < this.linhas; i++) {
      matrizHeuristicas[i] = [];
    for (var j = 0; j < this.colunas; j++) {
      matrizHeuristicas[i][j] = heuristica(i,j,verticeObjetivo[0], verticeObjetivo[1]);
      console.log("linha "+i+" coluna "+j+" = "+matrizHeuristicas[i][j]);
    }
  }
  
  var pilhaBT = [];

  var celulaInicial = this.matriz[verticeInicial[0]][verticeInicial[1]];

  ///Posicoes iniciais
  var navegante = this.escolheMelhorCaminho(celulaInicial, matrizHeuristicas, visitados);
  
  pilhaBT.push(celulaInicial);
  pilhaBT.push(navegante);

  console.log("MATRIZ HEURISTICAS"+matrizHeuristicas[navegante.i][navegante.j]);

  
  var sucesso = false, fracasso = false;
  var aux;
  while(sucesso === false && fracasso === false)
  {
    console.log(navegante.i+" e "+navegante.j);
      if(navegante === this.matriz[verticeObjetivo[0]][verticeObjetivo[1]])
      {
        console.log(navegante.i+" e "+navegante.j);
        sucesso = true;
      }else
      {

        if(visitados[navegante.i][navegante.j] === true)
        {
            aux = this.escolheMelhorCaminho(navegante,matrizHeuristicas,visitados);
            if(aux===navegante)
            {
              pilhaBT.pop();
              if(pilhaBT.length===0)
              {
                fracasso = true;
              }else
              {
                navegante = pilhaBT[pilhaBT.length-1]; 
              }
            }else{
              navegante = aux;
            }
        }else
        {
          navegante = this.escolheMelhorCaminho(navegante, matrizHeuristicas, visitados);
        }
      }
  }
  
}

Maze.prototype.escolheMelhorCaminho = function(celula, matrizHeuristicas, visitados){

  var vizinhos = [];
  var contadorVizinhos=0;

  for(var i = 0; i<celula.wall.length; i++)
  {
    if(celula.wall[i] === false && visitados[celula.getVizinho(i,this.matriz).i][celula.getVizinho(i,this.matriz).j]===false)
    { 
      vizinhos.push(celula.getVizinho(i,this.matriz));
      contadorVizinhos++;
    }
  }

  if(contadorVizinhos === 0)
  {
    visitados[celula.i][celula.j] = true;
    return celula;
  }else
  {

    var melhor = matrizHeuristicas[vizinhos[0].i][vizinhos[0].j];
    var retorno = 0;
  
  
      for(var o = 0; o<vizinhos.length; o++)
      {
          if(matrizHeuristicas[vizinhos[o].i][vizinhos[o].j]<melhor)
          {
            melhor = matrizHeuristicas[vizinhos[o].i][vizinhos[o].j];
            retorno = i;
          } 
      }
  
    
    visitados[celula.i][celula.j] = true;
    return this.matriz[vizinhos[retorno].i][vizinhos[retorno].j];
    
  }

}



/*//CRIA AUXILIARES DO ALGORITMO
  var fracasso = false, sucesso = false;//Fazem o algoritmo sair do loop para o caso de sucesso ou fracasso do algoritmo
  var visitados = [];//[linhas][cols];            //Matriz de visitados
  for (var i = 0; i < this.linhas; i++) {
    visitados[i] = [];
    for(var j = 0; j < this.colunas; j++){
      visitados[i][j] = false;
    }
  }

  var fechados = [];
  var inicio = this.matriz[verticeInicial[0]][verticeInicial[1]];
  var atual = this.matriz[verticeInicial[0]][verticeInicial[1]];;
  var destino;
  var menor;
  var pilhaBT = [];
  pilhaBT.push(inicio);
  visitados[inicio.i][inicio.j] = true;
  var contador = 0;

  while(sucesso != true && fracasso != true)
  {
    contador = 0;
    console.log(matrizHeuristicas[atual.i][atual.j]);
    if(matrizHeuristicas[atual.i][atual.j] === 0)  //Se a heurística da célula atual é 0, então esta célula é a solução
    {
      sucesso = true;
    }else //Caso contrário
    {
      atual = pilhaBT[pilhaBT.length - 1];//O atual é sempre o último elemento da lista
      menor = 100000000000000000000000000000//MUDAR ISSO DEPOIS
      //Checa se há parede na direção desejada e se a direção desejada possui a melhor heurística
      //Ao fim deste 'for', o destino com a melhor heurística estará salvo na variável "destino"
      console.log("celula "+atual.i+" e "+ atual.j);
      for(c = 0; c<4; c++)
      {
        if(atual.wall[c]===false)//Verifica se existe parede
        {
          if(visitados[atual.getVizinho(c,this.matriz).i][atual.getVizinho(c,this.matriz).j]===false)//Verifica se o vértice ainda não foi visitado
          { pilhaBT.push(atual.getVizinho(c,this.matriz));
            if(matrizHeuristicas[atual.getVizinho(c,this.matriz).i][atual.getVizinho(c,this.matriz).j] < menor)//Verifica se o vértice em questão possui a menor heurística
            {
              console.log("melhor heurística");
              visitados[atual.i][atual.j]=true;
              menor = matrizHeuristicas[atual.getVizinho(c,this.matriz).i][atual.getVizinho(c,this.matriz).j];
              destino = atual.getVizinho(c,this.matriz);//Faz o destino ser o vértice com menor valor heurístico
            }
          }else
          {
            console.log("ja foi visitado");
            contador++;
          }
        }else
        {
          contador++;
        }
      }
      atual = destino;
      console.log("proximo: "+"celula "+atual.i+" e "+ atual.j);
      //Atual se transforma no novo destino, se preparando para o próximo laço
    }

    if(contador >= 4){          ///Passou todas as operações possíveis -- Fazer o backtracking senão retornar fracasso

      fechados.push(atual);

      if(pilhaBT[length-1] === inicio){
        fracasso = true;
    }
    else{
        if(pilhaBT.length === 0){
           fracasso = true;
           break;
        }
        pilhaBT.pop();                 ///Desempilha e redireciona para o pai
    }
    }


  }
  console.log("BUSCA GULOSAAAAAAAAAAA");*/