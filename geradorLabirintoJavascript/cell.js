function Cell(i, j){
  this.i = i;
  this.j = j;
  this.wall = [true,true,true,true];   ///Paredes(cima,direita,baixo,esquerda)
  this.visited = false;
};

Cell.prototype.checarVizinhos = function(grid, cols, linhas){
  var vizinhos = [];
  var cima     = grid[this.index(this.i, this.j-1, cols, linhas)];
  var direita  = grid[this.index(this.i+1, this.j, cols, linhas)];     //i é a coluna, j é a linha
  var baixo    = grid[this.index(this.i, this.j+1, cols, linhas)];
  var esquerda = grid[this.index(this.i-1, this.j, cols, linhas)];

  if(cima && !cima.visited){ //Celula de cima não foi visitada
    vizinhos.push(cima);
  }
  if(direita && !direita.visited){ //Celula da direita não foi visitada
    vizinhos.push(direita);
  }
  if(baixo && !baixo.visited){ //Celula de baixo não foi visitada
    vizinhos.push(baixo);
  }
  if(esquerda && !esquerda.visited){ //Celula da esquerda não foi visitada
    vizinhos.push(esquerda);
  }

  if(vizinhos.length > 0){    ///Tem vizinhos não visitados
    var r = Math.floor(Math.random() * (vizinhos.length - 0) ) + 0; //var r = Math.floor(Math.random(0, vizinhos.length))   ///Escolhe um vizinho
    return vizinhos[r];       ///Retorna o vizinho sorteado e não visitado
  }
  else{
    return undefined;
  }
}

Cell.prototype.index = function(i, j, cols, linhas) {
  if (i < 0 || j < 0 || j > cols-1 || i > linhas-1) {
    return -1;          //Retorna indice inválido na matriz
  }
  return (j + i * cols);
}

Cell.prototype.colorido = function(ctx, w, espacamento){
  var x = this.j*w + espacamento;
  var y = this.i*w + espacamento;
  ctx.fillStyle = 'rgb(0,0,255)';   //Celula atual
  ctx.fillRect(x, y, w, w);
}

Cell.prototype.show = function(ctx, espacamento){
  //espacamento entre a borda do canvas

  var x = this.j*w + espacamento;
  var y = this.i*w + espacamento;
  //console.log(x + " -- " + y);

  ctx.strokeStyle = 'rgb(0,0,0)';
  ctx.lineWidth = 2;
  if(this.wall[0]){             //Com parede pra cima
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x+w, y);
    ctx.stroke();
    ctx.closePath();
    //ctx.line(x, y, x + w, y);
  }
  if(this.wall[1]){             //Com parede pra direita
    ctx.beginPath();
    ctx.moveTo(x + w, y);
    ctx.lineTo(x + w, y + w);
    ctx.stroke();
    ctx.closePath();
  }
  if(this.wall[2]){             //Com parede pra Baixo
    ctx.beginPath();
    ctx.moveTo(x + w, y + w);
    ctx.lineTo(x, y + w);
    ctx.stroke();
    ctx.closePath();
    // /ctx.line(x + w, y + w, x, y + w);
  }
  if(this.wall[3]){             //Com parede pra Esquerda
    ctx.beginPath();
    ctx.moveTo(x, y + w);
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.closePath();
    //ctx.line(x, y + w, x, y);
  }

  if(this.visited){             //Se foi visitado
    ctx.fillStyle = 'rgb(50,50,50)';
    ctx.fillRect(x,y,w,w);
  }
}
