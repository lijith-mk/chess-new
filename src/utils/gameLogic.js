// gameLogic.js

export function initialBoard() {
  return [
    ["br","bn","bb","bq","bk","bb","bn","br"],
    ["bp","bp","bp","bp","bp","bp","bp","bp"],
    ["","","","","","","",""],
    ["","","","","","","",""],
    ["","","","","","","",""],
    ["","","","","","","",""],
    ["wp","wp","wp","wp","wp","wp","wp","wp"],
    ["wr","wn","wb","wq","wk","wb","wn","wr"],
  ];
}

const inside = (r,c)=>r>=0 && c>=0 && r<8 && c<8;

/*
  RAW MOVES (no check logic)
*/
export function getRawMoves(board,r,c,lastMove){

  let piece = board[r][c];
  if(!piece) return [];

  let color = piece[0];
  let type = piece[1];
  let moves = [];

  // ---------------- ROOK ----------------
  if(type==="r"){
    let dirs=[[1,0],[-1,0],[0,1],[0,-1]];

    dirs.forEach(([dx,dy])=>{
      let x=r+dx,y=c+dy;

      while(inside(x,y)){
        if(board[x][y]===""){
          moves.push([x,y]);
        } else {
          if(board[x][y][0]!==color) moves.push([x,y]);
          break;
        }
        x+=dx; y+=dy;
      }
    });
  }

  // ---------------- BISHOP ----------------
  if(type==="b"){
    let dirs=[[1,1],[1,-1],[-1,1],[-1,-1]];

    dirs.forEach(([dx,dy])=>{
      let x=r+dx,y=c+dy;

      while(inside(x,y)){
        if(board[x][y]===""){
          moves.push([x,y]);
        } else {
          if(board[x][y][0]!==color) moves.push([x,y]);
          break;
        }
        x+=dx; y+=dy;
      }
    });
  }

  // ---------------- QUEEN ----------------
  if(type==="q"){
    // queen = rook + bishop logic combined
    let rookDirs=[[1,0],[-1,0],[0,1],[0,-1]];
    let bishopDirs=[[1,1],[1,-1],[-1,1],[-1,-1]];

    [...rookDirs,...bishopDirs].forEach(([dx,dy])=>{
      let x=r+dx,y=c+dy;

      while(inside(x,y)){
        if(board[x][y]===""){
          moves.push([x,y]);
        } else {
          if(board[x][y][0]!==color) moves.push([x,y]);
          break;
        }
        x+=dx; y+=dy;
      }
    });
  }

  // ---------------- PAWN ----------------
  if(type==="p"){
    let dir = color==="w"?-1:1;

    // forward
    if(inside(r+dir,c) && board[r+dir][c]===""){
      moves.push([r+dir,c]);
    }

    // capture
    [[r+dir,c+1],[r+dir,c-1]].forEach(([x,y])=>{
      if(inside(x,y) && board[x][y] && board[x][y][0]!==color){
        moves.push([x,y]);
      }
    });

    // EN PASSANT (FIXED - no unused variable)
    if(lastMove){
      let sr = lastMove[0];
      let er = lastMove[2];
      let ec = lastMove[3];
      let pieceMoved = lastMove[4];

      if(pieceMoved && pieceMoved[1]==="p" && Math.abs(sr-er)===2){
        if(r===er && Math.abs(c-ec)===1){
          moves.push([r+dir,ec]);
        }
      }
    }
  }

  // ---------------- KNIGHT ----------------
  if(type==="n"){
    let steps=[[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]];

    steps.forEach(([dx,dy])=>{
      let x=r+dx,y=c+dy;

      if(inside(x,y) && (!board[x][y] || board[x][y][0]!==color)){
        moves.push([x,y]);
      }
    });
  }

  // ---------------- KING ----------------
  if(type==="k"){
    for(let dx=-1;dx<=1;dx++){
      for(let dy=-1;dy<=1;dy++){
        if(dx||dy){
          let x=r+dx,y=c+dy;
          if(inside(x,y) && (!board[x][y] || board[x][y][0]!==color)){
            moves.push([x,y]);
          }
        }
      }
    }

    // simple castling
    if(c===4){
      if(board[r][7]==="wr" && board[r][5]==="" && board[r][6]===""){
        moves.push([r,6]);
      }
      if(board[r][0]==="wr" && board[r][1]==="" && board[r][2]==="" && board[r][3]===""){
        moves.push([r,2]);
      }
    }
  }

  return moves;
}