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
  //this.desenharLabirinto(ctx);
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

function heuristica(xInicial, yInicial, xFinal, yFinal){
  if(Math.abs(xFinal - xInicial)  <  Math.abs(yFinal - yInicial))
    return Number(Math.abs(xInicial - xFinal) + Math.abs((yInicial - yFinal) - Math.abs(xInicial - xFinal)));
  else
  if(Math.abs(xFinal - xInicial)  >  Math.abs(yFinal - yInicial))
    return Number(Math.abs(yInicial - yFinal) + Math.abs((xInicial - xFinal) - Math.abs(yInicial - yFinal)));
  else
  if(Math.abs(xFinal - xInicial)  ==  Math.abs(yFinal - yInicial))
    return Number(Math.abs(xInicial - xFinal));
}

function backtracking(verticeInicial, verticeObjetivo){
  var tempoInicial = performance.now();

  console.log("Executando backtracking");
  var pilhaBT = [];
  var visitados = [];//[linhas][cols];            //Matriz de visitados
  for (var i = 0; i < linhas; i++) {
    visitados[i] = [];
    for(var j = 0; j < cols; j++){
      visitados[i][j] = false;
    }
  }

  var fim = this.matriz[verticeObjetivo[0]][verticeObjetivo[1]];
  var s = this.matriz[verticeInicial[0]][verticeInicial[1]];
  var n = s;
  visitados[n.i][n.j] = true;                                       //Visitando o primeiro vertice
  pilhaBT.push(n);
  var fracasso = false, sucesso = false;
  while((sucesso == false) && (fracasso == false)){
    var contador = 0;
    for (var i = 0; i < s.wall.length; i++) {
      if(n.wall[i] === false){                                      //Checa se não há parede
        //console.log(i + " ---- "+ n.i + " ------(n) BACKTRACKING ---- " + n.j);
        var auxVizinho = n.getVizinho(i, matriz);                   //Captura a celula do vizinho na matriz
        //console.log(auxVizinho.i + " ------ BACKTRACKING ---- " + auxVizinho.j);
        if(visitados[auxVizinho.i][auxVizinho.j] === false){        //vizinho não visitado
          n = auxVizinho;                                           //Atualiza para o próximo vértice
          visitados[n.i][n.j] = true;                               //Marca como visitado o próximo vértice
          pilhaBT.push(n);
          if(n === fim){                                            //Encontrou o objetivo
            sucesso = true;
          }
          break;
        }
      }
      contador++;
    }

    if(contador >= 4){          ///Passou todas as operações possíveis -- Fazer o backtracking senão retornar fracasso
      if(n === s){
          fracasso = true;
      }
      else{
          if(pilhaBT.length == 0){
             fracasso = true;
             break;
          }
          pilhaBT.pop();                 ///Desempilha e redireciona para o pai
          n = pilhaBT[pilhaBT.length - 1];
      }
    }
  }

  if(fracasso){
    console.log("Fracasso em encontrar a solução");
  }
  else{
    if(sucesso){
      console.log("Sucesso em encontrar a solução");
      var texto = "\nPilha: ";
      for(var i = 0; i < pilhaBT.length; i++){
          texto = texto + "Celula["+pilhaBT[i].i+"]["+pilhaBT[i].j+"]"+ " -- ";
      }
      texto = texto + "\n";
      console.log(texto);
      var numVisitados = 0;
      texto = "\n\nQuem foi visitado: ";
      for (var i = 0; i < linhas; i++) {
        for(var j = 0; j < cols; j++){
          if(visitados[i][j]){
              texto = texto + "Celula["+i+"]["+j+"] -- ";
              numVisitados++;
          }
        }
      }
      console.log(texto);
      console.log("\nQuantidade total de vértices visitados: " + numVisitados);
      var tempoFinal = performance.now();
      console.log("\nTempo de execução: " + parseFloat((tempoFinal - tempoInicial)).toFixed(3));    ///Mede o tempo somente na função
    }
  }
}
