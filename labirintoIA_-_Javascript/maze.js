function Maze(linhas, colunas, larguraCelula){
  this.matriz = [];
  this.linhas = linhas;
  this.colunas = colunas;
  this.larguraCelula = larguraCelula;
  this.celulaAtual = null;
  this.grid = [];                                            //Vetor que armazena a matriz toda de maneira linear pra poder gerar o labirinto mais fácil usando backtrack recursivo
  this.pilha = [];
  for (var i = 0; i < linhas; i++) {                         //Cria a estrutura básica do labirinto
    this.matriz[i] = [];
    for (var j = 0; j < colunas; j++) {
      var cell = new Cell(i, j);
      this.matriz[i][j] = cell;
      this.grid.push(cell);

    }
  }
  this.celulaAtual = this.grid[0];                           //Expande a geração do labirinto a partir da célula{0,0}
  this.caminhoSolucao = [];
  this.matrizHeuristicas = [];
};


/*****************************************************************
*                                                                *
*                 gerarLabirintoPorPassos():                      *
*  -> gera o labirinto passo a passo sendo necessário colocar no *
*  loop de animação para que termine a geração completa.         *
*                                                                *
******************************************************************/

Maze.prototype.gerarLabirintoPorPassos = function(){
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
         estado = 0;  //Modifica a variável global
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

Maze.prototype.desenharGeracaoLabirintoPorPassos = function(ctx, espacamento){
  for (var i = 0; i < this.grid.length; i++) {          //Exibe as células
    this.grid[i].show(ctx, this.larguraCelula, espacamento);
  }
  this.celulaAtual.colorido(ctx, this.larguraCelula, espacamento);
  this.gerarLabirintoPorPassos();
  if(estado == 0){
    this.desenharLabirinto(ctx, espacamento);
  }
}

/******************************************************
*                                                     *
*            desenharSolucao(ctx, espacaemento):      *
*  -> Projeta o caminho da solução no labirinto.      *
*                                                     *
*******************************************************/

Maze.prototype.desenharSolucao = function(ctx, espacamento){
  //Desenhando Quadrados coloridos
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

  // Desenhando linhas vermelhas
  ctx.strokeStyle = 'rgb(255,0,0)';
  ctx.lineWidth = 3;
  if(this.caminhoSolucao.length > 0){
    var inicioX = (this.caminhoSolucao[0].j * this.larguraCelula + espacamento) + (this.larguraCelula/4) + this.larguraCelula/4;
    var inicioY = (this.caminhoSolucao[0].i * this.larguraCelula + espacamento) + (this.larguraCelula/4) + this.larguraCelula/4;
  }
  for(var i = 1; i < this.caminhoSolucao.length; i++){
    var fimX = (this.caminhoSolucao[i].j * this.larguraCelula + espacamento) + (this.larguraCelula/4) + this.larguraCelula/4;
    var fimY = (this.caminhoSolucao[i].i * this.larguraCelula + espacamento) + (this.larguraCelula/4) + this.larguraCelula/4;
    ctx.beginPath();
    ctx.moveTo(inicioX, inicioY);
    ctx.lineTo(fimX, fimY);
    ctx.stroke();
    ctx.closePath();
    inicioX = fimX;
    inicioY = fimY;
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
*                       addWalls(a, b):                          *
*  -> Adicionar paredes entre celulas visando gerar um mapa sem  *
*  caminho pra uma determinada celula e testar situações de      *
*  fracasso.                                                     *
******************************************************************/

Maze.prototype.addWalls = function (a, b) {
  var x = a.j - b.j;           ///Analisa a coluna
  if (x === 1) {
    a.wall[3] = true;
    b.wall[1] = true;
  } else if (x === -1) {
    a.wall[1] = true;
    b.wall[3] = true;
  }
  var y = a.i - b.i;           ///Analisa a linha
  if (y === 1) {
    a.wall[0] = true;
    b.wall[2] = true;
  } else if (y === -1) {
    a.wall[2] = true;
    b.wall[0] = true;
  }
}

/*****************************************************************
*                                                                *
*      criarMapaComFracassoProObjetivo(verticeObjetivo)          *
*  -> Coloca parede em todas as direções no vertice objetivo vi- *
*  sando testar o desempenho em casos de fracasso.               *
*                                                                *
******************************************************************/

Maze.prototype.criarMapaComFracassoProObjetivo = function(verticeObjetivo){
    var celulaFinal = this.matriz[verticeObjetivo[0]][verticeObjetivo[1]];
    for (var i = 0; i < celulaFinal.wall.length; i++) {
        if(celulaFinal.wall[i] === false){
            this.addWalls(celulaFinal, celulaFinal.getVizinho(i, this.matriz));
        }
    }
}

/*****************************************************************
*                                                                *
*               gerarVariacao(verticeObjetivo)                   *
*  -> Função responsável por gerar uma melhor diversificação no  *
*  mapa.                                                         *
*                                                                *
******************************************************************/

Maze.prototype.gerarVariacao = function(){
  //IDEIA: uma porcentagem do número de celulas na região do meio perderão algumas paredes
  //visando gerar mais caminhos possíveis
  /**
    Matriz total: M x N
    Regiao do meio: (M-1)x(N-1)

  */
  this.caminhoSolucao = [];
  var totalRegiaoMeio = ((this.linhas - 1) * (this.colunas - 1));
  var pRemocaoParedes = 0.15; //Porcentagem de remoção das paredes
  var quantParedePorCelulaRemove = 1;
  var paredesRemocao = quantParedePorCelulaRemove * pRemocaoParedes * totalRegiaoMeio; // Quantidade de paredes a serem removidas
  var regiaoCentral = [];                            // Vetor que armazena todas as celulas da região central
  for (var i = 1; i < this.linhas - 1; i++) {
    for(var j = 1; j < this.colunas - 1; j++){
      regiaoCentral.push(this.matriz[i][j]);
    }
  }

  // Caminhamento no vetor e sorteio das posições e paredes
  var contParedesRemovidas = 0;
  //var direcao = 0;  //Direcao de remocao se possivel: 0 => Cima, 1 => Direita, 2 => Baixo, 3 => Esquerda
  var sentidoRemocao = 0;   // 0 => Sentido do vetor de paredes, 1 => Sentido contrário
  while(contParedesRemovidas < paredesRemocao){
    var posicao = Math.floor(Math.random() * (regiaoCentral.length - 1))  //Sorteia uma posição
    var removeu = false;
    if(sentidoRemocao === 0){
      for(var i = 0; i < 4; i++){
        if(regiaoCentral[posicao].wall[i]){
          this.removeWalls(regiaoCentral[posicao], regiaoCentral[posicao].getVizinho(i, this.matriz)) //Aplica a remoção da parede
          removeu = true;
          regiaoCentral.splice(posicao, 1);
          sentidoRemocao = 1;
          contParedesRemovidas++;
          break;
        }
      }
    }
    else if(sentidoRemocao === 1){
      for(var i = 3; i >= 0; i--){
        if(regiaoCentral[posicao].wall[i]){
          this.removeWalls(regiaoCentral[posicao], regiaoCentral[posicao].getVizinho(i, this.matriz)) //Aplica a remoção da parede
          removeu = true;
          regiaoCentral.splice(posicao, 1);
          sentidoRemocao = 0;
          contParedesRemovidas++;
          break;
        }
      }
    }
    if(removeu === false){  //Encontrou celula que não tem parede
      regiaoCentral.splice(posicao, 1);
    }
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

/*****************************************************************
*                                                                *
*     insereNaTabelaTexto(nomeTabela, qtdCelulasColuna, texto):  *
*  -> Insere os dados na tabela do HTML.                         *
*                                                                *
******************************************************************/

Maze.prototype.insereNaTabelaTexto = function(nomeTabela, qtdCelulasColuna, texto){
  switch(qtdCelulasColuna){
      case 2:
      {
          var table = document.getElementById(nomeTabela);
          var row = table.insertRow();    //Deixando vazio ele insere uma linha na ultima posicao
          var cell1 = row.insertCell(0);
          var cell2 = row.insertCell(1);
          var cell3 = row.insertCell(2);
          cell1.innerHTML = texto[0];
          cell2.innerHTML = texto[1];
          cell3.innerHTML = " - ";
      }
      break;
      case 3://Caso tenha tabelas com 3 elementos -- ACERTAR AQUI
      {
          var table = document.getElementById(nomeTabela);
          var row = table.insertRow();    //Deixando vazio ele insere uma linha na ultima posicao
          var cell1 = row.insertCell(0);
          var cell2 = row.insertCell(1);
          var cell3 = row.insertCell(2);
          cell1.innerHTML = texto[0];
          cell2.innerHTML = texto[1];
          cell3.innerHTML = texto[2];
      }
      break;
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

Maze.prototype.calcularHeuristica = function (verticeObjetivo){
  //CRIA MATRIZ AUXILIAR DE HEURÍSTICAS
  this.matrizHeuristicas = [];
  console.log("Calculando a matriz de heurísticas");
  for (var i = 0; i < this.linhas; i++) {
      this.matrizHeuristicas[i] = [];
    for (var j = 0; j < this.colunas; j++) {
      this.matrizHeuristicas[i][j] = this.heuristica(i,j,verticeObjetivo[0], verticeObjetivo[1]);
      //console.log("linha "+i+" coluna "+j+" = "+matrizHeuristicas[i][j]);
      this.insereNaTabelaTexto("tabelaListaHeuristica", 3, [((j + i * this.colunas) + ""), ("Celula["+i+"]["+j+"]"), (this.matrizHeuristicas[i][j]+"")]);
    }
  }
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
          auxVizinho.pai = n;                                       //Armazena o pai para gerar o caminho e "arvore" de solução
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
          var aux = abertos.pop();
          n.pai = abertos[abertos.length - 1];
          fechados.push(aux);                               //Armazena os vertices Fechados
          n = abertos[abertos.length - 1];                  //Desempilha e redireciona para o pai
          profundidade--;
      }
    }
  }

  var tempoFinal = performance.now();

  if(fracasso){
    console.log("\t \t ----- Fracasso em encontrar a solução!!! --- \n");
    console.log("Status da busca: \n \n");

    var texto = "\nAbertos - Nós expandidos (total ao final da execucao: " + abertos.length + "): ";
    for(var i = 0; i < abertos.length; i++){
        texto = texto + "Celula[" + abertos[i].i + "][" + abertos[i].j + "]" + " -- ";
        //Adicionando na tabela do html
        this.insereNaTabelaTexto("tabelaListaAbertos", 2, [(i + ""), ("Celula["+abertos[i].i+"]["+abertos[i].j+"]")]);
    }
    console.log(texto + "\n");

    var texto = "\nFechados (total ao final da execucao: " + fechados.length + "): ";
    for(var i = 0; i < fechados.length; i++){
        texto = texto + "Celula["+fechados[i].i+"]["+fechados[i].j+"]"+ " -- \n";
        this.insereNaTabelaTexto("tabelaListaFechados", 2, [(i + ""), ("Celula["+fechados[i].i+"]["+fechados[i].j+"]")]);
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
    console.log("\nProfundidade: " + profundidade);


    var elementosBusca = [];
    elementosBusca = abertos.concat(fechados);
    var tabelaFilhosPorCelula = [];
    for(var j = 0; j < elementosBusca.length; j++){          //Cria tabela inicial de filhos por celula
      tabelaFilhosPorCelula.push([elementosBusca[j], 0]);
    }
    for(var i = 0; i < elementosBusca.length; i++){
      if(elementosBusca[i].pai != null){
        for(var j = 0; j < tabelaFilhosPorCelula.length; j++){
          if(elementosBusca[i].pai === tabelaFilhosPorCelula[j][0]){                 //Encontrou o pai então incrementa o número de filhos dele
            tabelaFilhosPorCelula[j][1] = tabelaFilhosPorCelula[j][1] + 1;
          }
        }
      }
    }

    texto = "\nImpressao da lista de pais e numero de filhos(Total de vertices: " + tabelaFilhosPorCelula.length + "): \n";
    var valorMedioRamificacao = 0;
    var numPais = 0;
    for(var i = 0; i < tabelaFilhosPorCelula.length; i++){
     texto = texto + "(["+tabelaFilhosPorCelula[i][0].i+", "+ tabelaFilhosPorCelula[i][0].j + "], " + tabelaFilhosPorCelula[i][1] + ")  --  \n";
     valorMedioRamificacao = valorMedioRamificacao + tabelaFilhosPorCelula[i][1];
     if(tabelaFilhosPorCelula[i][1] != 0){                                          //Não conta as folhas visto que não são pais
        numPais++;
     }
    }
    console.log(texto+"\n");
    valorMedioRamificacao = parseFloat((valorMedioRamificacao - 1)/numPais).toFixed(3);
    console.log("Valor médio do fator de ramificação da árvore de busca: " + valorMedioRamificacao);



    console.log("\nTempo de execução: " + parseFloat((tempoFinal - tempoInicial)).toFixed(3) + " milissegundos");    ///Mede o tempo somente na função

    //Atualiza as estatísticas no HTML
    document.getElementById("profEstatistica").innerHTML=(profundidade + "");
    document.getElementById("statusBusca").style="color:red; font-weight:bold";
    document.getElementById("statusBusca").innerHTML="FRACASSO!!!";
    document.getElementById("custoSolucao").innerHTML=" X ";
    document.getElementById("qtdNosExpandidos").innerHTML=((fechados.length + abertos.length) + "");
    document.getElementById("qtdNosVisitados").innerHTML=((fechados.length + abertos.length) + "");
    document.getElementById("fatorRamificacaoMediaBusca").innerHTML=(valorMedioRamificacao + "");
    document.getElementById("tempoExecucao").innerHTML=(parseFloat((tempoFinal - tempoInicial)).toFixed(3) + " milissegundos");
  }
  else{
    if(sucesso){
      console.log("\t \t ----- Sucesso em encontrar a solução!!! --- \n");
      console.log("Status da busca: \n \n");
      var texto = "\nAbertos - Nós expandidos (total ao final da execucao: " + abertos.length + "): ";
      for(var i = 0; i < abertos.length; i++){
          texto = texto + "Celula["+abertos[i].i+"]["+abertos[i].j+"]"+ " -- ";

          //Adicionando na tabela do html
          this.insereNaTabelaTexto("tabelaListaAbertos", 2, [(i + ""), ("Celula["+abertos[i].i+"]["+abertos[i].j+"]")]);
      }
      console.log(texto + "\n");

      var texto = "\nFechados (total ao final da execucao: " + fechados.length + "): ";
      for(var i = 0; i < fechados.length; i++){
          texto = texto + "Celula["+fechados[i].i+"]["+fechados[i].j+"]"+ " -- \n";
          this.insereNaTabelaTexto("tabelaListaFechados", 2, [(i + ""), ("Celula["+fechados[i].i+"]["+fechados[i].j+"]")]);
      }
      console.log(texto+"\n");

      texto = "";
      var numVisitados = 0;
      for (var i = 0; i < this.linhas; i++) {
        for(var j = 0; j < this.colunas; j++){
          if(visitados[i][j]){
              texto = texto + "Celula["+i+"]["+j+"] -- ";
          }
        }
      }
      texto = "\n\nQuem foi visitado (total ao final da execucao: " + numVisitados + "): " + texto;
      console.log(texto);
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
     var tabelaFilhosPorCelula = [];
     for(var j = 0; j < elementosBusca.length; j++){          //Cria tabela inicial de filhos por celula
       tabelaFilhosPorCelula.push([elementosBusca[j], 0]);
     }
     for(var i = 0; i < elementosBusca.length; i++){
       if(elementosBusca[i].pai != null){
         for(var j = 0; j < tabelaFilhosPorCelula.length; j++){
           if(elementosBusca[i].pai === tabelaFilhosPorCelula[j][0]){                 //Encontrou o pai então incrementa o número de filhos dele
             tabelaFilhosPorCelula[j][1] = tabelaFilhosPorCelula[j][1] + 1;
           }
         }
       }
     }

      texto = "\nImpressao da lista de pais e numero de filhos(Total de vertices: " + tabelaFilhosPorCelula.length + "): \n";
      var valorMedioRamificacao = 0;
      var numPais = 0;
      for(var i = 0; i < tabelaFilhosPorCelula.length; i++){
       texto = texto + "(["+tabelaFilhosPorCelula[i][0].i+", "+ tabelaFilhosPorCelula[i][0].j + "], " + tabelaFilhosPorCelula[i][1] + ")  --  \n";
       valorMedioRamificacao = valorMedioRamificacao + tabelaFilhosPorCelula[i][1];
       if(tabelaFilhosPorCelula[i][1] != 0){                                          //Não conta as folhas visto que não são pais
          numPais++;
       }
      }
      console.log(texto+"\n");
      valorMedioRamificacao = parseFloat((valorMedioRamificacao - 1)/numPais).toFixed(3);
      console.log("Valor médio do fator de ramificação da árvore de busca: " + valorMedioRamificacao);


      console.log("\nTempo de execução: " + parseFloat((tempoFinal - tempoInicial)).toFixed(3) + " milissegundos");    ///Mede o tempo somente na função


      //Atualiza as estatísticas no HTML
      document.getElementById("profEstatistica").innerHTML=(profundidade + "");
      document.getElementById("statusBusca").style="color:green; font-weight:bold";
      document.getElementById("statusBusca").innerHTML="SUCESSO!!!";
      document.getElementById("custoSolucao").innerHTML=(this.caminhoSolucao.length + "");
      document.getElementById("qtdNosExpandidos").innerHTML=((fechados.length + abertos.length) + "");
      document.getElementById("qtdNosVisitados").innerHTML=((fechados.length + abertos.length) + "");
      document.getElementById("fatorRamificacaoMediaBusca").innerHTML=(valorMedioRamificacao + "");
      document.getElementById("tempoExecucao").innerHTML=(parseFloat((tempoFinal - tempoInicial)).toFixed(3) + " milissegundos");
    }
  }
}
/**

Estratégia de controle: Inserir na pilha de modo que sejam executadas a ordem
do vetor de paredes, ou seja, cima, direita, baixo e esquerda
*/

Maze.prototype.buscaProfundidadeLimitada = function (verticeInicial, verticeObjetivo, limiteProfMax){
  this.caminhoSolucao = [];
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
          visitados[n.i][n.j] = true;                              //Marca como visitado o próximo vértice
          if(n == fim){
              sucesso = true;
              fechados.push(n);
              break;
          }
          else{
              var contador = 0;
              var contadorVisitados = 0;
              for (var i = s.wall.length - 1; i > -1; i--) {                  //Checa na direção contraria(esquerda,baixo,direita,cima) para poder retirar da pilha na ordem do vetor de paredes
                if(n.wall[i] === false){                                      //Checa se não há parede
                  var auxVizinho = n.getVizinho(i, this.matriz);              //Captura a celula do vizinho na matriz
                  if(visitados[auxVizinho.i][auxVizinho.j] === false){        //vizinho não visitado
                    var u = auxVizinho;                                       //Atualiza para o próximo vértice
                    u.pai = n;
                    abertos.push(u);
                    contadorVisitados++;
                  }
                }
                contador++;
            }

            if(contador >= 4){ ///Passou todas as operações possíveis -- Fazer o backtracking senão retornar fracasso
              limiteProfundidade++;
              if(contadorVisitados == 0){  // Já visitou todos os vizinhos, logo tem que fazer backtracking
                limiteProfundidade--;      //Diminui a profundidade
              }
              fechados.push(n);
            }
          }
      }
    }

  var tempoFinal = performance.now();
  if(fracasso){
    console.log("\t \t ----- Fracasso em encontrar a solução!!! --- \n");
    console.log("Status da busca: \n \n");
    var texto = "\nAbertos (total ao final da execucao: " + abertos.length + "): ";
    for(var i = 0; i < abertos.length; i++){
        texto = texto + "Celula["+abertos[i].i+"]["+abertos[i].j+"]"+ " -- ";
        this.insereNaTabelaTexto("tabelaListaAbertos", 2, [(i + ""), ("Celula["+abertos[i].i+"]["+abertos[i].j+"]")]);
    }
    texto = texto + "\n";
    console.log(texto);
    texto = "\nFechados (total ao final da execucao: " + fechados.length + "): ";
    for(var i = 0; i < fechados.length; i++){
        texto = texto + "Celula["+fechados[i].i+"]["+fechados[i].j+"]"+ " -- ";
        this.insereNaTabelaTexto("tabelaListaFechados", 2, [(i + ""), ("Celula["+fechados[i].i+"]["+fechados[i].j+"]")]);
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

    var elementosBusca = [];
    elementosBusca = abertos.concat(fechados);
    var tabelaFilhosPorCelula = [];
    for(var j = 0; j < elementosBusca.length; j++){          //Cria tabela inicial de filhos por celula
     tabelaFilhosPorCelula.push([elementosBusca[j], 0]);
    }
    for(var i = 0; i < elementosBusca.length; i++){
     if(elementosBusca[i].pai != null){
       for(var j = 0; j < tabelaFilhosPorCelula.length; j++){
         if(elementosBusca[i].pai === tabelaFilhosPorCelula[j][0]){                 //Encontrou o pai então incrementa o número de filhos dele
           tabelaFilhosPorCelula[j][1] = tabelaFilhosPorCelula[j][1] + 1;
         }
       }
     }
    }

    texto = "\nImpressao da lista de pais e numero de filhos(Total de vertices: " + tabelaFilhosPorCelula.length + "): \n";
    var valorMedioRamificacao = 0;
    var numPais = 0;
    for(var i = 0; i < tabelaFilhosPorCelula.length; i++){
     texto = texto + "(["+tabelaFilhosPorCelula[i][0].i+", "+ tabelaFilhosPorCelula[i][0].j + "], " + tabelaFilhosPorCelula[i][1] + ")  --  \n";
     valorMedioRamificacao = valorMedioRamificacao + tabelaFilhosPorCelula[i][1];
     if(tabelaFilhosPorCelula[i][1] != 0){                                          //Não conta as folhas visto que não são pais
        numPais++;
     }
    }
    console.log(texto+"\n");
    valorMedioRamificacao = parseFloat((valorMedioRamificacao - 1)/numPais).toFixed(3);
    console.log("Valor médio do fator de ramificação da árvore de busca: " + valorMedioRamificacao);
    console.log("\nTempo de execução: " + parseFloat((tempoFinal - tempoInicial)).toFixed(3) + " milissegundos");    ///Mede o tempo somente na função
    //Atualiza as estatísticas no HTML
    document.getElementById("profEstatistica").innerHTML=(limiteProfundidade + "");
    document.getElementById("statusBusca").style="color:red; font-weight:bold";
    document.getElementById("statusBusca").innerHTML="FRACASSO!!!";
    document.getElementById("custoSolucao").innerHTML=(" X ");
    document.getElementById("qtdNosExpandidos").innerHTML=((fechados.length + abertos.length) + "");
    document.getElementById("qtdNosVisitados").innerHTML=(fechados.length + "");
    document.getElementById("fatorRamificacaoMediaBusca").innerHTML=(valorMedioRamificacao + "");
    document.getElementById("tempoExecucao").innerHTML=(parseFloat((tempoFinal - tempoInicial)).toFixed(3) + " milissegundos");
  }
  else{
    if(sucesso){
      console.log("\t \t ----- Sucesso em encontrar a solução!!! --- \n");
      console.log("Status da busca: \n \n");
      var texto = "\nAbertos (total ao final da execucao: " + abertos.length + "): ";
      for(var i = 0; i < abertos.length; i++){
          texto = texto + "Celula["+abertos[i].i+"]["+abertos[i].j+"]"+ " -- ";
          this.insereNaTabelaTexto("tabelaListaAbertos", 2, [(i + ""), ("Celula["+abertos[i].i+"]["+abertos[i].j+"]")]);
      }
      texto = texto + "\n";
      console.log(texto);
      texto = "\Fechados (total ao final da execucao: " + fechados.length + "): ";
      for(var i = 0; i < fechados.length; i++){
          texto = texto + "Celula["+fechados[i].i+"]["+fechados[i].j+"]"+ " -- ";
          this.insereNaTabelaTexto("tabelaListaFechados", 2, [(i + ""), ("Celula["+fechados[i].i+"]["+fechados[i].j+"]")]);
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
      var elementosBusca = [];
      elementosBusca = abertos.concat(fechados);
      var tabelaFilhosPorCelula = [];
      for(var j = 0; j < elementosBusca.length; j++){          //Cria tabela inicial de filhos por celula
       tabelaFilhosPorCelula.push([elementosBusca[j], 0]);
      }
      for(var i = 0; i < elementosBusca.length; i++){
       if(elementosBusca[i].pai != null){
         for(var j = 0; j < tabelaFilhosPorCelula.length; j++){
           if(elementosBusca[i].pai === tabelaFilhosPorCelula[j][0]){                 //Encontrou o pai então incrementa o número de filhos dele
             tabelaFilhosPorCelula[j][1] = tabelaFilhosPorCelula[j][1] + 1;
           }
         }
       }
      }

       texto = "\nImpressao da lista de pais e numero de filhos(Total de vertices: " + tabelaFilhosPorCelula.length + "): \n";
      var valorMedioRamificacao = 0;
      var numPais = 0;
      for(var i = 0; i < tabelaFilhosPorCelula.length; i++){
       texto = texto + "(["+tabelaFilhosPorCelula[i][0].i+", "+ tabelaFilhosPorCelula[i][0].j + "], " + tabelaFilhosPorCelula[i][1] + ")  --  \n";
       valorMedioRamificacao = valorMedioRamificacao + tabelaFilhosPorCelula[i][1];
       if(tabelaFilhosPorCelula[i][1] != 0){                                          //Não conta as folhas visto que não são pais
          numPais++;
       }
      }
      console.log(texto+"\n");
      valorMedioRamificacao = parseFloat((valorMedioRamificacao - 1)/numPais).toFixed(3);
      console.log("Valor médio do fator de ramificação da árvore de busca: " + valorMedioRamificacao);
      console.log("\nTempo de execução: " + parseFloat((tempoFinal - tempoInicial)).toFixed(3) + " milissegundos");    ///Mede o tempo somente na função

      //Atualiza as estatísticas no HTML
      document.getElementById("profEstatistica").innerHTML=(limiteProfundidade + "");
      document.getElementById("statusBusca").style="color:green; font-weight:bold";
      document.getElementById("statusBusca").innerHTML="SUCESSO!!!";
      document.getElementById("custoSolucao").innerHTML=(this.caminhoSolucao.length + "");
      document.getElementById("qtdNosExpandidos").innerHTML=((fechados.length + abertos.length) + "");
      document.getElementById("qtdNosVisitados").innerHTML=(fechados.length + "");
      document.getElementById("fatorRamificacaoMediaBusca").innerHTML=(valorMedioRamificacao + "");
      document.getElementById("tempoExecucao").innerHTML=(parseFloat((tempoFinal - tempoInicial)).toFixed(3) + " milissegundos");
    }
  }
}

Maze.prototype.buscaEmLargura = function (verticeInicial, verticeObjetivo){
  this.caminhoSolucao = [];
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
      console.log("Iteracoes");
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
                    u.pai = n;
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
  var tempoFinal = performance.now();

  if(fracasso){
    console.log("\t \t ----- Fracasso em encontrar a solução!!! --- \n");
    console.log("Status da busca: \n \n");
    console.log("Profundidade: "+ profundidade);
    var texto = "\nAbertos (total ao final da execucao: " + abertos.length + "): ";
    for(var i = 0; i < abertos.length; i++){
        texto = texto + "Celula["+abertos[i].i+"]["+abertos[i].j+"]"+ " -- ";
        this.insereNaTabelaTexto("tabelaListaAbertos", 2, [(i + ""), ("Celula["+abertos[i].i+"]["+abertos[i].j+"]")]);
    }
    texto = texto + "\n";
    console.log(texto);
    texto = "\nFechados (total ao final da execucao: " + fechados.length + "): ";
    for(var i = 0; i < fechados.length; i++){
        texto = texto + "Celula["+fechados[i].i+"]["+fechados[i].j+"]"+ " -- ";
        this.insereNaTabelaTexto("tabelaListaFechados", 2, [(i + ""), ("Celula["+fechados[i].i+"]["+fechados[i].j+"]")]);
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

    var elementosBusca = [];
    elementosBusca = abertos.concat(fechados);
    var tabelaFilhosPorCelula = [];
    for(var j = 0; j < elementosBusca.length; j++){          //Cria tabela inicial de filhos por celula
     tabelaFilhosPorCelula.push([elementosBusca[j], 0]);
    }
    for(var i = 0; i < elementosBusca.length; i++){
     if(elementosBusca[i].pai != null){
       for(var j = 0; j < tabelaFilhosPorCelula.length; j++){
         if(elementosBusca[i].pai === tabelaFilhosPorCelula[j][0]){                 //Encontrou o pai então incrementa o número de filhos dele
           tabelaFilhosPorCelula[j][1] = tabelaFilhosPorCelula[j][1] + 1;
         }
       }
     }
    }
    texto = "\nImpressao da lista de pais e numero de filhos(Total de vertices: " + tabelaFilhosPorCelula.length + "): \n";
    var valorMedioRamificacao = 0;
    var numPais = 0;
    for(var i = 0; i < tabelaFilhosPorCelula.length; i++){
     texto = texto + "(["+tabelaFilhosPorCelula[i][0].i+", "+ tabelaFilhosPorCelula[i][0].j + "], " + tabelaFilhosPorCelula[i][1] + ")  --  \n";
     valorMedioRamificacao = valorMedioRamificacao + tabelaFilhosPorCelula[i][1];
     if(tabelaFilhosPorCelula[i][1] != 0){                                          //Não conta as folhas visto que não são pais
        numPais++;
     }
    }
    console.log(texto+"\n");
    valorMedioRamificacao = parseFloat((valorMedioRamificacao - 1)/numPais).toFixed(3);
    console.log("Valor médio do fator de ramificação da árvore de busca: " + valorMedioRamificacao);


    console.log("\nTempo de execução: " + parseFloat((tempoFinal - tempoInicial)).toFixed(3) + " milissegundos");    ///Mede o tempo somente na função

    //Atualiza as estatísticas no HTML
    document.getElementById("profEstatistica").innerHTML=(profundidade + "");
    document.getElementById("statusBusca").style="color:red; font-weight:bold";
    document.getElementById("statusBusca").innerHTML="FRACASSO!!!";
    document.getElementById("custoSolucao").innerHTML=(" X ");
    document.getElementById("qtdNosExpandidos").innerHTML=((fechados.length + abertos.length) + "");
    document.getElementById("qtdNosVisitados").innerHTML=((fechados.length) + "");
    document.getElementById("fatorRamificacaoMediaBusca").innerHTML=(valorMedioRamificacao + "");
    document.getElementById("tempoExecucao").innerHTML=(parseFloat((tempoFinal - tempoInicial)).toFixed(3) + " milissegundos");
  }
  else{
    if(sucesso){
      console.log("\t \t ----- Sucesso em encontrar a solução!!! --- \n");
      console.log("Status da busca: \n \n");
      //console.log("Profundidade: "+ profundidade);
      var texto = "\nAbertos (total ao final da execucao: " + abertos.length + "): ";
      for(var i = 0; i < abertos.length; i++){
      texto = texto + "Celula["+abertos[i].i+"]["+abertos[i].j+"]"+ " -- ";
      this.insereNaTabelaTexto("tabelaListaAbertos", 2, [(i + ""), ("Celula["+abertos[i].i+"]["+abertos[i].j+"]")]);
      }
      texto = texto + "\n";
      console.log(texto);

      texto = "\nFechados (total ao final da execucao: " + fechados.length + "): ";
      for(var i = 0; i < fechados.length; i++){
          texto = texto + "Celula["+fechados[i].i+"]["+fechados[i].j+"]"+ " -- ";
          this.insereNaTabelaTexto("tabelaListaFechados", 2, [(i + ""), ("Celula["+fechados[i].i+"]["+fechados[i].j+"]")]);
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
      var tabelaFilhosPorCelula = [];
      for(var j = 0; j < elementosBusca.length; j++){          //Cria tabela inicial de filhos por celula
       tabelaFilhosPorCelula.push([elementosBusca[j], 0]);
      }
      for(var i = 0; i < elementosBusca.length; i++){
       if(elementosBusca[i].pai != null){
         for(var j = 0; j < tabelaFilhosPorCelula.length; j++){
           if(elementosBusca[i].pai === tabelaFilhosPorCelula[j][0]){                 //Encontrou o pai então incrementa o número de filhos dele
             tabelaFilhosPorCelula[j][1] = tabelaFilhosPorCelula[j][1] + 1;
           }
         }
       }
      }

      texto = "\nImpressao da lista de pais e numero de filhos(Total de vertices: " + tabelaFilhosPorCelula.length + "): \n";
      var valorMedioRamificacao = 0;
      var numPais = 0;
      for(var i = 0; i < tabelaFilhosPorCelula.length; i++){
        texto = texto + "(["+tabelaFilhosPorCelula[i][0].i+", "+ tabelaFilhosPorCelula[i][0].j + "], " + tabelaFilhosPorCelula[i][1] + ")  --  \n";
        valorMedioRamificacao = valorMedioRamificacao + tabelaFilhosPorCelula[i][1];
        if(tabelaFilhosPorCelula[i][1] != 0){                                          //Não conta as folhas visto que não são pais
          numPais++;
        }
      }
      console.log(texto+"\n");
      valorMedioRamificacao = parseFloat((valorMedioRamificacao - 1)/numPais).toFixed(3);
      console.log("Valor médio do fator de ramificação da árvore de busca: " + valorMedioRamificacao);


      console.log("\nTempo de execução: " + parseFloat((tempoFinal - tempoInicial)).toFixed(3) + " milissegundos");    ///Mede o tempo somente na função

      //Atualiza as estatísticas no HTML
      document.getElementById("profEstatistica").innerHTML=(profundidade + "");
      document.getElementById("statusBusca").style="color:green; font-weight:bold";
      document.getElementById("statusBusca").innerHTML="SUCESSO!!!";
      document.getElementById("custoSolucao").innerHTML=(this.caminhoSolucao.length + "");
      document.getElementById("qtdNosExpandidos").innerHTML=((fechados.length + abertos.length) + "");
      document.getElementById("qtdNosVisitados").innerHTML=((fechados.length) + "");
      document.getElementById("fatorRamificacaoMediaBusca").innerHTML=(valorMedioRamificacao + "");
      document.getElementById("tempoExecucao").innerHTML=(parseFloat((tempoFinal - tempoInicial)).toFixed(3) + " milissegundos");
    }
  }
}

Maze.prototype.mudarPesos = function (pesosAtuais){
  for(var i = 0; i < this.linhas; i++){
    for(var j = 0; j < this.linhas; j++){
      this.matriz[i][j].peso = pesosAtuais;
    }
  }
}

Maze.prototype.buscaOrdenada = function (verticeInicial, verticeObjetivo){
  this.caminhoSolucao = [];
  var tempoInicial = performance.now();
  console.log("\n \t \t-------- Executando a busca Ordenada:  ------------\n \n");
  var abertos = [];                                //Comportamento de uma fila - FIFO - Primeiro que entra é o primeiro que sai
  var fechados = [];
  var visitados = [];                            //Matriz de visitados
  for (var i = 0; i < this.linhas; i++) {
    visitados[i] = [];
    for(var j = 0; j < this.colunas; j++){
      visitados[i][j] = false;
    }
  }
  var nosExpandidos = 0;
  var profundidade = 0;                                             ///Armazena a profundidade da busca
  var fim = this.matriz[verticeObjetivo[0]][verticeObjetivo[1]];
  var s = this.matriz[verticeInicial[0]][verticeInicial[1]];
  abertos.push([s, 0]);                                             // (Celula, somaArestas)
  visitados[s.i][s.j] = true;                                       //Visitando o primeiro vertice
  var fracasso = false, sucesso = false;
  while((sucesso == false) && (fracasso == false)){
    if(abertos.length == 0){                            ///Lista de abertos vazia
        fracasso = true;
    }
    else{
      var n;
      var custoArestas = abertos[0][1];
      var posicao = 0;
      for(var i = 0; i < abertos.length; i++){                  //Pega o elemento de menor (somaAresta)
        if(abertos[i][1] <= custoArestas){
          n = abertos[i][0];
          custoArestas = abertos[i][1];
          posicao = i;
        }
      }
      abertos.splice(posicao, 1);                               //Remove o elemento de menor custo
      visitados[n.i][n.j] = true;                               //Marca como visitado o próximo vértice
      if(n == fim){
        sucesso = true;
        fechados.push([n, custoArestas]);
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
              //abertos.push([u, custoArestas + n.peso[i]]);
              //verifica se a celula já está na lista de abertos e se o custo é maior ou menor
              //Não insere na lista de abertos caso o custo seja maior ou igual ao que já tem na lista
              //Se tiver e este for com custo menor, remover a celula antiga do abertos
              var encontrouNaLista = false;
              for(var c = 0; c < abertos.length; c++){
                if(u === abertos[c][0]){  //u está na lista
                  encontrouNaLista = true;
                  if(abertos[c][1] <= (custoArestas + n.peso[i])){   // Compara o custo com a celula presente
                      //O antigo na lista tem o menor custo então não faz nada
                      break;
                  }
                  else{   //Custo válido para inserir na lista
                    abertos.splice(c, 1);                   //remove o elemento
                    u.pai = n;
                    abertos.push([u, custoArestas + n.peso[i]]);
                    nosExpandidos++;
                    break;
                  }
                }
              }
              if(encontrouNaLista === false){ //Não encontrou então pode inserir na lista
                u.pai = n;
                abertos.push([u, custoArestas + n.peso[i]]);
                nosExpandidos++;
              }
            }
          }
          contador++;
        }
        if(contador >= 4){ ///Passou todas as operações possíveis -- Fazer o backtracking senão retornar fracasso
          profundidade++;
          fechados.push([n, custoArestas]);
        }
      }
    }
  }
  var tempoFinal = performance.now();

  if(fracasso){
    console.log("\t \t ----- Fracasso em encontrar a solução!!! --- \n");
    console.log("Status da busca: \n \n");
    //console.log("Profundidade: "+ profundidade);
    var texto = "\nAbertos (total ao final da execucao: " + abertos.length + "): ";
    for(var i = 0; i < abertos.length; i++){
      texto = texto + "Celula[" + abertos[i][0].i + "][" + abertos[i][0].j + "] Custo:  +" + abertos[i][1] +" -- ";
      this.insereNaTabelaTexto("tabelaListaAbertos", 3, [(i + ""), ("Celula["+abertos[i][0].i+"]["+abertos[i][0].j+"]"), (abertos[i][1]+"")]);
    }
    texto = texto + "\n";
    console.log(texto);

    texto = "\nFechados (total ao final da execucao: " + fechados.length + "): ";
    for(var i = 0; i < fechados.length; i++){
        texto = texto + "Celula["+fechados[i][0].i+"]["+fechados[i][0].j+"] Custo:  +" + fechados[i][1] +" -- ";
        this.insereNaTabelaTexto("tabelaListaFechados", 3, [(i + ""), ("Celula[" + fechados[i][0].i + "][" + fechados[i][0].j+"]"), (fechados[i][1] + "")]);
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

    var elementosBusca = [];
    elementosBusca = abertos.concat(fechados);
    var tabelaFilhosPorCelula = [];
    for(var j = 0; j < elementosBusca.length; j++){          //Cria tabela inicial de filhos por celula
     tabelaFilhosPorCelula.push([elementosBusca[j][0], 0]);
    }
    for(var i = 0; i < elementosBusca.length; i++){
     if(elementosBusca[i][0].pai != null){
       for(var j = 0; j < tabelaFilhosPorCelula.length; j++){
         if(elementosBusca[i][0].pai === tabelaFilhosPorCelula[j][0]){                 //Encontrou o pai então incrementa o número de filhos dele
           tabelaFilhosPorCelula[j][1] = tabelaFilhosPorCelula[j][1] + 1;
         }
       }
     }
    }
    texto = "\nImpressao da lista de pais e numero de filhos(Total de vertices: " + tabelaFilhosPorCelula.length + "): \n";
    var valorMedioRamificacao = 0;
    var numPais = 0;
    for(var i = 0; i < tabelaFilhosPorCelula.length; i++){
      texto = texto + "(["+tabelaFilhosPorCelula[i][0].i+", "+ tabelaFilhosPorCelula[i][0].j + "], " + tabelaFilhosPorCelula[i][1] + ")  --  \n";
      valorMedioRamificacao = valorMedioRamificacao + tabelaFilhosPorCelula[i][1];
      if(tabelaFilhosPorCelula[i][1] != 0){                                          //Não conta as folhas visto que não são pais
        numPais++;
      }
    }
    console.log(texto+"\n");
    valorMedioRamificacao = parseFloat((valorMedioRamificacao - 1)/numPais).toFixed(3);
    console.log("Valor médio do fator de ramificação da árvore de busca: " + valorMedioRamificacao);
    console.log("\nTempo de execução: " + parseFloat((tempoFinal - tempoInicial)).toFixed(3) + " milissegundos");    ///Mede o tempo somente na função
    //Atualiza as estatísticas no HTML
    document.getElementById("profEstatistica").innerHTML=(profundidade + "");
    document.getElementById("statusBusca").style="color:red; font-weight:bold";
    document.getElementById("statusBusca").innerHTML="FRACASSO!!!";
    document.getElementById("custoSolucao").innerHTML=(" X ");
    document.getElementById("qtdNosExpandidos").innerHTML=((fechados.length + abertos.length) + "");
    document.getElementById("qtdNosVisitados").innerHTML=((fechados.length) + "");
    document.getElementById("fatorRamificacaoMediaBusca").innerHTML=(valorMedioRamificacao + "");
    document.getElementById("tempoExecucao").innerHTML=(parseFloat((tempoFinal - tempoInicial)).toFixed(3) + " milissegundos");
  }
  else{
    if(sucesso){
      console.log("\t \t ----- Sucesso em encontrar a solução!!! --- \n");
      console.log("Status da busca: \n \n");
      console.log("Profundidade: "+ profundidade);
      var texto = "\nAbertos (total ao final da execucao: " + abertos.length + "): ";
      for(var i = 0; i < abertos.length; i++){
        texto = texto + "Celula[" + abertos[i][0].i + "][" + abertos[i][0].j + "] Custo:  +" + abertos[i][1] +" -- ";
      this.insereNaTabelaTexto("tabelaListaAbertos", 3, [(i + ""), ("Celula["+abertos[i][0].i+"]["+abertos[i][0].j+"]"), (abertos[i][1]+"")]);
      }
      texto = texto + "\n";
      console.log(texto);

      texto = "\nFechados (total ao final da execucao: " + fechados.length + "): ";
      for(var i = 0; i < fechados.length; i++){
          texto = texto + "Celula["+fechados[i][0].i+"]["+fechados[i][0].j+"] Custo:  +" + fechados[i][1] +" -- ";
          this.insereNaTabelaTexto("tabelaListaFechados", 3, [(i + ""), ("Celula[" + fechados[i][0].i + "][" + fechados[i][0].j+"]"), (fechados[i][1] + "")]);
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
      var tabelaFilhosPorCelula = [];
      for(var j = 0; j < elementosBusca.length; j++){          //Cria tabela inicial de filhos por celula
       tabelaFilhosPorCelula.push([elementosBusca[j][0], 0]);
      }
      for(var i = 0; i < elementosBusca.length; i++){
       if(elementosBusca[i][0].pai != null){
         for(var j = 0; j < tabelaFilhosPorCelula.length; j++){
           if(elementosBusca[i][0].pai === tabelaFilhosPorCelula[j][0]){                 //Encontrou o pai então incrementa o número de filhos dele
             tabelaFilhosPorCelula[j][1] = tabelaFilhosPorCelula[j][1] + 1;
           }
         }
       }
      }
      texto = "\nImpressao da lista de pais e numero de filhos(Total de vertices: " + tabelaFilhosPorCelula.length + "): \n";
      var valorMedioRamificacao = 0;
      var numPais = 0;
      for(var k = 0; k < tabelaFilhosPorCelula.length; k++){
        texto = texto + "(["+tabelaFilhosPorCelula[k][0].i+", "+ tabelaFilhosPorCelula[k][0].j + "], " + tabelaFilhosPorCelula[k][1] + ")  --  \n";
        valorMedioRamificacao = valorMedioRamificacao + tabelaFilhosPorCelula[k][1];
        if(tabelaFilhosPorCelula[k][1] != 0){                                          //Não conta as folhas visto que não são pais
          numPais++;
        }
      }
      console.log(texto+"\n");
      valorMedioRamificacao = parseFloat((valorMedioRamificacao - 1)/numPais).toFixed(3);
      console.log("Valor médio do fator de ramificação da árvore de busca: " + valorMedioRamificacao);
      console.log("\nTempo de execução: " + parseFloat((tempoFinal - tempoInicial)).toFixed(3) + " milissegundos");    ///Mede o tempo somente na função
      //Atualiza as estatísticas no HTML
      document.getElementById("profEstatistica").innerHTML=(profundidade + "");
      document.getElementById("statusBusca").style="color:green; font-weight:bold";
      document.getElementById("statusBusca").innerHTML="SUCESSO!!!";
      document.getElementById("custoSolucao").innerHTML=(fechados[fechados.length - 1][1] + "");        // ultimo elemento fechado tem o custo de solução
      document.getElementById("qtdNosExpandidos").innerHTML=(nosExpandidos + "");
      document.getElementById("qtdNosVisitados").innerHTML=(numVisitados + "");
      document.getElementById("fatorRamificacaoMediaBusca").innerHTML=(valorMedioRamificacao + "");
      document.getElementById("tempoExecucao").innerHTML=(parseFloat((tempoFinal - tempoInicial)).toFixed(3) + " milissegundos");
    }
  }
}

//Implementação do André
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
      matrizHeuristicas[i][j] = this.heuristica(i,j,verticeObjetivo[0], verticeObjetivo[1]);
      //console.log("linha "+i+" coluna "+j+" = "+matrizHeuristicas[i][j]);
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
    visitados[navegante.i][navegante.j] = true;
    console.log(navegante.i+" e "+navegante.j);
      if(navegante === this.matriz[verticeObjetivo[0]][verticeObjetivo[1]])
      {
        console.log("SUCESSO"+navegante.i+" e "+navegante.j);
        sucesso = true;
      }else
      {

        if(visitados[navegante.i][navegante.j] === true)
        {
            aux = this.escolheMelhorCaminho(navegante,matrizHeuristicas,visitados);
            if(aux===navegante)
            {
              console.log("não tem caminho");
              pilhaBT.pop();
              if(pilhaBT.length===0)
              {
                console.log("FRACASSO"+navegante.i+" e "+navegante.j)
                fracasso = true;
              }else
              {
                console.log("volta pro pai");
                navegante = pilhaBT[pilhaBT.length-1];
              }
            }else{
              navegante = aux;
              pilhaBT.push(navegante);
            }
        }else
        {
          navegante = this.escolheMelhorCaminho(navegante, matrizHeuristicas, visitados);
        }
      }
  }

}

//Implementação do Lucas
Maze.prototype.buscaGulosa2 = function(verticeInicial, verticeObjetivo){
  this.caminhoSolucao = [];
  var tempoInicial = performance.now();
  console.log("\n \t \t-------- Executando a busca gulosa:  ------------\n \n");
  var abertos = [];                                //Armazena os custo de cada celula
  var fechados = [];
  var visitados = [];                            //Matriz de visitados
  for (var i = 0; i < this.linhas; i++) {
    visitados[i] = [];
    for(var j = 0; j < this.colunas; j++){
      visitados[i][j] = false;
    }
  }
  var profundidade = 0;                                             //Armazena a profundidade da busca
  var fim = this.matriz[verticeObjetivo[0]][verticeObjetivo[1]];
  var s = this.matriz[verticeInicial[0]][verticeInicial[1]];
  abertos.push([s, 0]);               // (celula, f(x), somaArestas)
  visitados[s.i][s.j] = true;                                       // Visitando o primeiro vertice
  var fracasso = false, sucesso = false;
  while((sucesso == false) && (fracasso == false)){
    if(abertos.length == 0){                                    // Lista de abertos vazia
        fracasso = true;
    }
    else{
      var n;
      var menorH = this.matrizHeuristicas[abertos[0][0].i][abertos[0][0].j];
      console.log(menorH);
      var custoArestas = abertos[0][1];
      var posicao = 0;
      for(var i = 0; i < abertos.length; i++){                  //Pega o elemento de menor (heuristica)
        if(this.matrizHeuristicas[abertos[i][0].i][abertos[i][0].j] <= menorH){
          n = abertos[i][0];
          menorH = this.matrizHeuristicas[abertos[i][0].i][abertos[i][0].j];
          custoArestas = abertos[i][1];
          posicao = i;
        }
      }
      abertos.splice(posicao, 1);                               //Remove da lista de abertos o elemento de menor valor da heurística
      visitados[n.i][n.j] = true;                               //Marca como visitado o próximo vértice
      if(n == fim){
          sucesso = true;
          profundidade++;
          fechados.push([n, custoArestas]);
          break;
      }
      else{
          var contador = 0;
          for (var i = 0; i < s.wall.length; i++) {                       //Checa na direção contraria(esquerda,baixo,direita,cima) para poder retirar da pilha na ordem do vetor de paredes
            if(n.wall[i] === false){                                      //Checa se não há parede
              var auxVizinho = n.getVizinho(i, this.matriz);              //Captura a celula do vizinho na matriz
              if(visitados[auxVizinho.i][auxVizinho.j] === false){        //vizinho não visitado
                var u = auxVizinho;                                       //Atualiza para o próximo vértice
                //verifica se a celula já está na lista de abertos e se o custo é maior ou menor
                //Não insere na lista de abertos caso o custo seja maior ou igual ao que já tem na lista
                //Se tiver e este for com custo menor, remover a celula antiga do abertos
                //console.log("TESTEEEEEEEEEE");
                var encontrouNaLista = false;
                for(var c = 0; c < abertos.length; c++){
                  if(u === abertos[c][0]){  //u está na lista
                    encontrouNaLista = true;
                    if(this.matrizHeuristicas[abertos[c][0].i][abertos[c][0].j] <= (this.matrizHeuristicas[auxVizinho.i][auxVizinho.j])){   // Compara o custo com a celula presente
                        //O antigo na lista tem o menor custo então não faz nada
                        break;
                    }
                    else{   //Custo válido para inserir na lista
                      abertos.splice(c, 1);                   //remove o elemento
                      u.pai = n;
                      abertos.push([u, custoArestas + n.peso[i]]);
                      break;
                    }
                  }
                }
                if(encontrouNaLista === false){ //Não encontrou então pode inserir na lista
                  u.pai = n;
                  abertos.push([u, custoArestas + n.peso[i]]);
                }
              }
            }
            contador++;
        }
        if(contador >= 4){                ///Passou todas as operações possíveis -- Insere o n fechado com os custos de aresta e funcao FF
          profundidade++;
          fechados.push([n, custoArestas]);
        }
      }
    }
  }

  var tempoFinal = performance.now();
  if(fracasso){
    console.log("\t \t ----- Fracasso em encontrar a solução!!! --- \n");
    console.log("Status da busca: \n \n");
    console.log("Profundidade: "+ profundidade);
    var texto = "\nAbertos (total ao final da execucao: " + abertos.length + "): ";
    for(var i = 0; i < abertos.length; i++){
      texto = texto + "Celula[" + abertos[i][0].i + "][" + abertos[i][0].j + "] Custo:  +" + abertos[i][1] +" -- ";
    this.insereNaTabelaTexto("tabelaListaAbertos", 3, [(i + ""), ("Celula["+abertos[i][0].i+"]["+abertos[i][0].j+"]"), (abertos[i][1]+"")]);
    }
    texto = texto + "\n";
    console.log(texto);
    texto = "\nFechados (total ao final da execucao: " + fechados.length + "): ";
    for(var i = 0; i < fechados.length; i++){
        texto = texto + "Celula["+fechados[i][0].i+"]["+fechados[i][0].j+"] Custo:  +" + fechados[i][1] +" -- ";
        this.insereNaTabelaTexto("tabelaListaFechados", 3, [(i + ""), ("Celula[" + fechados[i][0].i + "][" + fechados[i][0].j+"]"), (fechados[i][1] + "")]);
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
    var elementosBusca = [];
    elementosBusca = abertos.concat(fechados);
    var tabelaFilhosPorCelula = [];
    for(var j = 0; j < elementosBusca.length; j++){          //Cria tabela inicial de filhos por celula
     tabelaFilhosPorCelula.push([elementosBusca[j][0], 0]);
    }
    for(var i = 0; i < elementosBusca.length; i++){
     if(elementosBusca[i][0].pai != null){
       for(var j = 0; j < tabelaFilhosPorCelula.length; j++){
         if(elementosBusca[i][0].pai === tabelaFilhosPorCelula[j][0]){                 //Encontrou o pai então incrementa o número de filhos dele
           tabelaFilhosPorCelula[j][1] = tabelaFilhosPorCelula[j][1] + 1;
         }
       }
     }
    }
    texto = "\nImpressao da lista de pais e numero de filhos(Total de vertices: " + tabelaFilhosPorCelula.length + "): \n";
    var valorMedioRamificacao = 0;
    var numPais = 0;
    for(var k = 0; k < tabelaFilhosPorCelula.length; k++){
      texto = texto + "(["+tabelaFilhosPorCelula[k][0].i+", "+ tabelaFilhosPorCelula[k][0].j + "], " + tabelaFilhosPorCelula[k][1] + ")  --  \n";
      valorMedioRamificacao = valorMedioRamificacao + tabelaFilhosPorCelula[k][1];
      if(tabelaFilhosPorCelula[k][1] != 0){                                          //Não conta as folhas visto que não são pais
        numPais++;
      }
    }
    console.log(texto+"\n");
    valorMedioRamificacao = parseFloat((valorMedioRamificacao - 1)/numPais).toFixed(3);
    console.log("Valor médio do fator de ramificação da árvore de busca: " + valorMedioRamificacao);
    console.log("\nTempo de execução: " + parseFloat((tempoFinal - tempoInicial)).toFixed(3) + " milissegundos");    ///Mede o tempo somente na função
    //Atualiza as estatísticas no HTML
    document.getElementById("profEstatistica").innerHTML=(profundidade + "");
    document.getElementById("statusBusca").style="color:red; font-weight:bold";
    document.getElementById("statusBusca").innerHTML="FRACASSO!!!";
    document.getElementById("custoSolucao").innerHTML=("X");
    document.getElementById("qtdNosExpandidos").innerHTML=((fechados.length + abertos.length)+"");
    document.getElementById("qtdNosVisitados").innerHTML=(fechados.length + "");
    document.getElementById("fatorRamificacaoMediaBusca").innerHTML=(valorMedioRamificacao + "");
    document.getElementById("tempoExecucao").innerHTML=(parseFloat((tempoFinal - tempoInicial)).toFixed(3) + " milissegundos");
  }
  else{
    if(sucesso){
      console.log("\t \t ----- Sucesso em encontrar a solução!!! --- \n");
      console.log("Status da busca: \n \n");
      console.log("Profundidade: "+ profundidade);
      var texto = "\nAbertos (total ao final da execucao: " + abertos.length + "): ";
      for(var i = 0; i < abertos.length; i++){
        texto = texto + "Celula[" + abertos[i][0].i + "][" + abertos[i][0].j + "] Custo:  +" + abertos[i][1] +" -- ";
      this.insereNaTabelaTexto("tabelaListaAbertos", 3, [(i + ""), ("Celula["+abertos[i][0].i+"]["+abertos[i][0].j+"]"), (abertos[i][1]+"")]);
      }
      texto = texto + "\n";
      console.log(texto);
      texto = "\nFechados (total ao final da execucao: " + fechados.length + "): ";
      for(var i = 0; i < fechados.length; i++){
          texto = texto + "Celula["+fechados[i][0].i+"]["+fechados[i][0].j+"] Custo:  +" + fechados[i][1] +" -- ";
          this.insereNaTabelaTexto("tabelaListaFechados", 3, [(i + ""), ("Celula[" + fechados[i][0].i + "][" + fechados[i][0].j+"]"), (fechados[i][1] + "")]);
      }
      texto = texto + "\n";
      console.log(texto);
      texto = "";
      var numVisitados = 0;
      for (var i = 0; i < this.linhas; i++) {
        for(var j = 0; j < this.colunas; j++){
          if(visitados[i][j]){
              texto = texto + "Celula["+i+"]["+j+"] -- ";
          }
        }
      }
      texto = "\n\nQuem foi visitado (total ao final da execucao: " + numVisitados + "): " + texto;
      console.log(texto);
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
      var tabelaFilhosPorCelula = [];
      for(var j = 0; j < elementosBusca.length; j++){          //Cria tabela inicial de filhos por celula
       tabelaFilhosPorCelula.push([elementosBusca[j][0], 0]);
      }
      for(var i = 0; i < elementosBusca.length; i++){
       if(elementosBusca[i][0].pai != null){
         for(var j = 0; j < tabelaFilhosPorCelula.length; j++){
           if(elementosBusca[i][0].pai === tabelaFilhosPorCelula[j][0]){                 //Encontrou o pai então incrementa o número de filhos dele
             tabelaFilhosPorCelula[j][1] = tabelaFilhosPorCelula[j][1] + 1;
           }
         }
       }
      }
      texto = "\nImpressao da lista de pais e numero de filhos(Total de vertices: " + tabelaFilhosPorCelula.length + "): \n";
      var valorMedioRamificacao = 0;
      var numPais = 0;
      for(var k = 0; k < tabelaFilhosPorCelula.length; k++){
        texto = texto + "(["+tabelaFilhosPorCelula[k][0].i+", "+ tabelaFilhosPorCelula[k][0].j + "], " + tabelaFilhosPorCelula[k][1] + ")  --  \n";
        valorMedioRamificacao = valorMedioRamificacao + tabelaFilhosPorCelula[k][1];
        if(tabelaFilhosPorCelula[k][1] != 0){                                          //Não conta as folhas visto que não são pais
          numPais++;
        }
      }
      console.log(texto+"\n");
      valorMedioRamificacao = parseFloat((valorMedioRamificacao - 1)/numPais).toFixed(3);
      console.log("Valor médio do fator de ramificação da árvore de busca: " + valorMedioRamificacao);
      console.log("\nTempo de execução: " + parseFloat((tempoFinal - tempoInicial)).toFixed(3) + " milissegundos");    ///Mede o tempo somente na função
      //Atualiza as estatísticas no HTML
      document.getElementById("profEstatistica").innerHTML=(profundidade + "");
      document.getElementById("statusBusca").style="color:green; font-weight:bold";
      document.getElementById("statusBusca").innerHTML="SUCESSO!!!";
      document.getElementById("custoSolucao").innerHTML=(fechados[fechados.length - 1][1] + "");        // ultimo elemento fechado tem o custo de solução
      document.getElementById("qtdNosExpandidos").innerHTML=((fechados.length + abertos.length) + "");
      document.getElementById("qtdNosVisitados").innerHTML=(fechados.length + "");
      document.getElementById("fatorRamificacaoMediaBusca").innerHTML=(valorMedioRamificacao + "");
      document.getElementById("tempoExecucao").innerHTML=(parseFloat((tempoFinal - tempoInicial)).toFixed(3) + " milissegundos");
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
            retorno = o;
          }
      }


    visitados[celula.i][celula.j] = true;
    return this.matriz[vizinhos[retorno].i][vizinhos[retorno].j];

  }

}


Maze.prototype.buscaAEstrela = function(verticeInicial, verticeObjetivo){
  this.caminhoSolucao = [];
  var tempoInicial = performance.now();
  console.log("\n \t \t-------- Executando busca em A*:  ------------\n \n");
  var abertos = [];                                //Armazena os custo de cada celula
  var fechados = [];
  var visitados = [];                            //Matriz de visitados
  for (var i = 0; i < this.linhas; i++) {
    visitados[i] = [];
    for(var j = 0; j < this.colunas; j++){
      visitados[i][j] = false;
    }
  }
  var profundidade = 0;                                             //Armazena a profundidade da busca
  var fim = this.matriz[verticeObjetivo[0]][verticeObjetivo[1]];
  var s = this.matriz[verticeInicial[0]][verticeInicial[1]];
  abertos.push([s, 0 + this.matrizHeuristicas[s.i][s.j], 0]);               // (celula, f(x), somaArestas)
  visitados[s.i][s.j] = true;                                       // Visitando o primeiro vertice
  var fracasso = false, sucesso = false;
  var nosExpandidos = 0;
  while((sucesso == false) && (fracasso == false)){
    if(abertos.length == 0){                                    // Lista de abertos vazia
        fracasso = true;
    }
    else{
      var n;
      var menorF = abertos[0][1];
      var custoArestas = abertos[0][2];
      var posicao = 0;
      for(var i = 0; i < abertos.length; i++){                  //Pega o elemento de menor (somaAresta + heuristica)
        if(abertos[i][1] <= menorF){
          n = abertos[i][0];
          menorF = abertos[i][1];
          custoArestas = abertos[i][2];
          posicao = i;
        }
      }
      abertos.splice(posicao, 1);                               //Remove o elemento de menor custo
      visitados[n.i][n.j] = true;                               //Marca como visitado o próximo vértice
      if(n == fim){
          sucesso = true;
          profundidade++;
          fechados.push([n, menorF, custoArestas]);
          break;
      }
      else{
          var contador = 0;
          for (var i = 0; i < s.wall.length; i++) {                       //Checa na direção contraria(esquerda,baixo,direita,cima) para poder retirar da pilha na ordem do vetor de paredes
            if(n.wall[i] === false){                                      //Checa se não há parede
              var auxVizinho = n.getVizinho(i, this.matriz);              //Captura a celula do vizinho na matriz
              if(visitados[auxVizinho.i][auxVizinho.j] === false){        //vizinho não visitado
                var u = auxVizinho;                                       //Atualiza para o próximo vértice
                //verifica se a celula já está na lista de abertos e se o custo é maior ou menor
                //Não insere na lista de abertos caso o custo seja maior ou igual ao que já tem na lista
                //Se tiver e este for com custo menor, remover a celula antiga do abertos
                var encontrouNaLista = false;
                for(var c = 0; c < abertos.length; c++){
                  if(u === abertos[c][0]){  //u está na lista
                    encontrouNaLista = true;
                    if(abertos[c][1] <= (custoArestas + this.matrizHeuristicas[auxVizinho.i][auxVizinho.j] + n.peso[i])){   // Compara o custo com a celula presente
                        //O antigo na lista tem o menor custo então não faz nada
                        break;
                    }
                    else{   //Custo válido para inserir na lista
                      abertos.splice(c, 1);                   //remove o elemento
                      u.pai = n;
                      abertos.push([u, custoArestas + this.matrizHeuristicas[auxVizinho.i][auxVizinho.j] + n.peso[i], custoArestas + n.peso[i]]);
                      break;
                    }
                  }
                }
                if(encontrouNaLista === false){ //Não encontrou então pode inserir na lista
                  u.pai = n;
                  abertos.push([u, custoArestas + this.matrizHeuristicas[auxVizinho.i][auxVizinho.j] + n.peso[i], custoArestas + n.peso[i]]);
                }

              }
            }
            contador++;
        }
        if(contador >= 4){                ///Passou todas as operações possíveis -- Insere o n fechado com os custos de aresta e funcao FF
          profundidade++;
          fechados.push([n, menorF, custoArestas]);
        }
      }
    }
  }

  var tempoFinal = performance.now();
  if(fracasso){
    console.log("\t \t ----- Fracasso em encontrar a solução!!! --- \n");
    console.log("Status da busca: \n \n");
    console.log("Profundidade: "+ profundidade);
    var texto = "\nAbertos (total ao final da execucao: " + abertos.length + "): ";
    for(var i = 0; i < abertos.length; i++){
      texto = texto + "Celula[" + abertos[i][0].i + "][" + abertos[i][0].j + "] Custo:  +" + abertos[i][1] +" -- ";
    this.insereNaTabelaTexto("tabelaListaAbertos", 3, [(i + ""), ("Celula["+abertos[i][0].i+"]["+abertos[i][0].j+"]"), (abertos[i][1]+"")]);
    }
    texto = texto + "\n";
    console.log(texto);

    texto = "\nFechados (total ao final da execucao: " + fechados.length + "): ";
    for(var i = 0; i < fechados.length; i++){
        texto = texto + "Celula["+fechados[i][0].i+"]["+fechados[i][0].j+"] Custo:  +" + fechados[i][1] +" -- ";
        this.insereNaTabelaTexto("tabelaListaFechados", 3, [(i + ""), ("Celula[" + fechados[i][0].i + "][" + fechados[i][0].j+"]"), (fechados[i][1] + "")]);
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

    var elementosBusca = [];
    elementosBusca = abertos.concat(fechados);
    var tabelaFilhosPorCelula = [];
    for(var j = 0; j < elementosBusca.length; j++){          //Cria tabela inicial de filhos por celula
     tabelaFilhosPorCelula.push([elementosBusca[j][0], 0]);
    }
    for(var i = 0; i < elementosBusca.length; i++){
     if(elementosBusca[i][0].pai != null){
       for(var j = 0; j < tabelaFilhosPorCelula.length; j++){
         if(elementosBusca[i][0].pai === tabelaFilhosPorCelula[j][0]){                 //Encontrou o pai então incrementa o número de filhos dele
           tabelaFilhosPorCelula[j][1] = tabelaFilhosPorCelula[j][1] + 1;
         }
       }
     }
    }

    texto = "\nImpressao da lista de pais e numero de filhos(Total de vertices: " + tabelaFilhosPorCelula.length + "): \n";
    var valorMedioRamificacao = 0;
    var numPais = 0;
    for(var k = 0; k < tabelaFilhosPorCelula.length; k++){
      texto = texto + "(["+tabelaFilhosPorCelula[k][0].i+", "+ tabelaFilhosPorCelula[k][0].j + "], " + tabelaFilhosPorCelula[k][1] + ")  --  \n";
      valorMedioRamificacao = valorMedioRamificacao + tabelaFilhosPorCelula[k][1];
      if(tabelaFilhosPorCelula[k][1] != 0){                                          //Não conta as folhas visto que não são pais
        numPais++;
      }
    }
    console.log(texto+"\n");
    valorMedioRamificacao = parseFloat((valorMedioRamificacao - 1)/numPais).toFixed(3);
    console.log("Valor médio do fator de ramificação da árvore de busca: " + valorMedioRamificacao);


    console.log("\nTempo de execução: " + parseFloat((tempoFinal - tempoInicial)).toFixed(3) + " milissegundos");    ///Mede o tempo somente na função

    //Atualiza as estatísticas no HTML
    document.getElementById("profEstatistica").innerHTML=(profundidade + "");
    document.getElementById("statusBusca").style="color:red; font-weight:bold";
    document.getElementById("statusBusca").innerHTML="FRACASSO!!!";
    document.getElementById("custoSolucao").innerHTML=(" X ");
    document.getElementById("qtdNosExpandidos").innerHTML=((fechados.length + abertos.length) + "");
    document.getElementById("qtdNosVisitados").innerHTML=((fechados.length) + "");
    document.getElementById("fatorRamificacaoMediaBusca").innerHTML=(valorMedioRamificacao + "");
    document.getElementById("tempoExecucao").innerHTML=(parseFloat((tempoFinal - tempoInicial)).toFixed(3) + " milissegundos");
  }
  else{
    if(sucesso){
      console.log("\t \t ----- Sucesso em encontrar a solução!!! --- \n");
      console.log("Status da busca: \n \n");
      console.log("Profundidade: "+ profundidade);
      var texto = "\nAbertos (total ao final da execucao: " + abertos.length + "): ";
      for(var i = 0; i < abertos.length; i++){
        texto = texto + "Celula[" + abertos[i][0].i + "][" + abertos[i][0].j + "] Custo:  +" + abertos[i][1] +" -- ";
      this.insereNaTabelaTexto("tabelaListaAbertos", 3, [(i + ""), ("Celula["+abertos[i][0].i+"]["+abertos[i][0].j+"]"), (abertos[i][1]+"")]);
      }
      texto = texto + "\n";
      console.log(texto);

      texto = "\nFechados (total ao final da execucao: " + fechados.length + "): ";
      for(var i = 0; i < fechados.length; i++){
          texto = texto + "Celula["+fechados[i][0].i+"]["+fechados[i][0].j+"] Custo:  +" + fechados[i][1] +" -- ";
          this.insereNaTabelaTexto("tabelaListaFechados", 3, [(i + ""), ("Celula[" + fechados[i][0].i + "][" + fechados[i][0].j+"]"), (fechados[i][1] + "")]);
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
      var tabelaFilhosPorCelula = [];
      for(var j = 0; j < elementosBusca.length; j++){          //Cria tabela inicial de filhos por celula
       tabelaFilhosPorCelula.push([elementosBusca[j][0], 0]);
      }
      for(var i = 0; i < elementosBusca.length; i++){
       if(elementosBusca[i][0].pai != null){
         for(var j = 0; j < tabelaFilhosPorCelula.length; j++){
           if(elementosBusca[i][0].pai === tabelaFilhosPorCelula[j][0]){                 //Encontrou o pai então incrementa o número de filhos dele
             tabelaFilhosPorCelula[j][1] = tabelaFilhosPorCelula[j][1] + 1;
           }
         }
       }
      }

      texto = "\nImpressao da lista de pais e numero de filhos(Total de vertices: " + tabelaFilhosPorCelula.length + "): \n";
      var valorMedioRamificacao = 0;
      var numPais = 0;
      for(var k = 0; k < tabelaFilhosPorCelula.length; k++){
        texto = texto + "(["+tabelaFilhosPorCelula[k][0].i+", "+ tabelaFilhosPorCelula[k][0].j + "], " + tabelaFilhosPorCelula[k][1] + ")  --  \n";
        valorMedioRamificacao = valorMedioRamificacao + tabelaFilhosPorCelula[k][1];
        if(tabelaFilhosPorCelula[k][1] != 0){                                          //Não conta as folhas visto que não são pais
          numPais++;
        }
      }
      console.log(texto+"\n");
      valorMedioRamificacao = parseFloat((valorMedioRamificacao - 1)/numPais).toFixed(3);
      console.log("Valor médio do fator de ramificação da árvore de busca: " + valorMedioRamificacao);
      console.log("\nTempo de execução: " + parseFloat((tempoFinal - tempoInicial)).toFixed(3) + " milissegundos");    ///Mede o tempo somente na função

      //Atualiza as estatísticas no HTML
      document.getElementById("profEstatistica").innerHTML=(profundidade + "");
      document.getElementById("statusBusca").style="color:green; font-weight:bold";
      document.getElementById("statusBusca").innerHTML="SUCESSO!!!";
      document.getElementById("custoSolucao").innerHTML=(fechados[fechados.length - 1][1] + "");        // ultimo elemento fechado tem o custo de solução
      document.getElementById("qtdNosExpandidos").innerHTML=((fechados.length + abertos.length)+ "");
      document.getElementById("qtdNosVisitados").innerHTML=(fechados.length+ "");
      document.getElementById("fatorRamificacaoMediaBusca").innerHTML=(valorMedioRamificacao + "");
      document.getElementById("tempoExecucao").innerHTML=(parseFloat((tempoFinal - tempoInicial)).toFixed(3) + " milissegundos");
    }
  }
}



Maze.prototype.buscaIDAEstrela = function(verticeInicial, verticeObjetivo){

  /*var tempoInicial = performance.now();
  console.log("\n \t \t-------- Executando busca em A*:  ------------\n \n");

  //CRIA MATRIZ AUXILIAR DE HEURÍSTICAS
  var matrizHeuristicas = [];
  for (var i = 0; i < this.linhas; i++) {
      matrizHeuristicas[i] = [];
    for (var j = 0; j < this.colunas; j++) {
      matrizHeuristicas[i][j] = this.heuristica(i,j,verticeObjetivo[0], verticeObjetivo[1]);
      console.log("linha "+i+" coluna " + j + " = " + matrizHeuristicas[i][j]);
    }
  }

  var abertos = [];
  var fechados = [];
  var visitados = [];                            //Matriz de visitados
  for (var i = 0; i < this.linhas; i++) {
    visitados[i] = [];
    for(var j = 0; j < this.colunas; j++){
      visitados[i][j] = false;
    }
  }
  var profundidade = 0;                                             //Armazena a profundidade da busca
  var fim = this.matriz[verticeObjetivo[0]][verticeObjetivo[1]];
  var s = this.matriz[verticeInicial[0]][verticeInicial[1]];

  var n = s;
  var patamar_old = -1;
  var patamar = matrizHeuristicas[s.i][s.j];                        //Patamar inicial é o valor da heurística do primeiro elemento


  abertos.push([s, 0 + matrizHeuristicas[s.i][s.j], 0]);            // (celula, f(x), somaArestas)
  //visitados[s.i][s.j] = true;                                       // Visitando o primeiro vertice

  var fracasso = false, sucesso = false;
  while((sucesso == false) && (fracasso == false)){
    if(patamar_old == patamar){
      fracasso = true;
    }
    else{
      if((n == fim) && (matrizHeuristicas[n.i][n.j] + abertos[abertos.length - 1][1] <= patamar)){
        sucesso = true;
      }
      else{
        if(abertos[abertos.length - 1][1] > patamar){
          fechados.push([n, abertos[abertos.length - 1][1], abertos[abertos.length - 1][2]]);
          abertos.pop();
          n = abertos[abertos.length - 1];
        }
        else{
          var contador = 0;
          visitados[n.i][n.j] = true;                               //Marca como visitado o próximo vértice
          for (var i = 0; i < s.wall.length; i++) {
            if(n.wall[i] === false){                                      //Checa se não há parede
              var auxVizinho = n.getVizinho(i, this.matriz);              //Captura a celula do vizinho na matriz
              if(visitados[auxVizinho.i][auxVizinho.j] === false){        //vizinho não visitado
                auxVizinho.pai = n;                                       //Armazena o pai para gerar o caminho e "arvore" de solução
                n = auxVizinho;                                           //Atualiza para o próximo vértice
                //visitados[n.i][n.j] = true;                               //Marca como visitado o próximo vértice
                //abertos.push([n, 0 + matrizHeuristicas[s.i][s.j], 0]);
                abertos.push([auxVizinho, abertos[abertos.length - 1][2] + matrizHeuristicas[auxVizinho.i][auxVizinho.j] + n.peso[i], abertos[abertos.length - 1][2] + n.peso[i]]);
                break;
              }
            }
            contador++;
          }
          if(contador >= 4){  //Passou as operações
            //Faz backtracking
            if(n == abertos[0][0]){ //N == s Voltou pra raiz
              //limpa visitados, abertos e incrementa o patamar
              var menorF = fechados[0][1];
              var posicaoMenor = 0;
              for(var k = 0; k < fechados.length; k++){
                visitados[fechados[i][0].i][fechados[i][0].j] = false;
                if(fechados[k][1] <= menorF)
                {
                  menorF = fechados[k][1];
                  posicaoMenor = i;
                }
              }
              if(menorF >= abertos[0][0]){
                menorF = abertos[0][1];
              }
              patamar_old = patamar;
              patamar = menorF;           //Pega o menor valor F(X) da lista de Fechados/descartados e vira o novo patamar
              fechados.length = 0;        //Limpa os fechados
              nAbertos.length = 0;        //Limpa os fechados
          }
        }
      }
    }
  }*/
}

Maze.prototype.verificaPosicaoNavegante = function(x, y, navegante)
{
  if(navegante.i === x && navegante.j === y)
  {
    return true;
  }else
  {
    return false;
  }
}

/*Maze.prototype.retornaFilhosCelula = function(celula)
{
  var filhos = [];

  for(var n = 0; n < 4; n++)
  {
    if(celula.wall[n] === false)
    filhos.push(celula.getVizinho(celula.wall[n],this.matriz));
  }

  return filhos;
}

Maze.prototype.atualizaListaCaminhosAbertos = function(caminhosAbertos,navegante){
}

Maze.prototype.escolheMelhorCaminhoAEstrela = function(caminhosAbertos){
}
*/
