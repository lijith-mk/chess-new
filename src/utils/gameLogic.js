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

const inside = (r,c) => r>=0 && c>=0 && r<8 && c<8;

// find king
export function findKing(board, color) {
  let target = color==="white" ? "wk" : "bk";
  for(let i=0;i<8;i++){
    for(let j=0;j<8;j++){
      if(board[i][j]===target) return [i,j];
    }
  }
}

// check if square attacked
export function isSquareAttacked(board,r,c,enemyColor){
  for(let i=0;i<8;i++){
    for(let j=0;j<8;j++){
      let piece=board[i][j];
      if(piece && piece[0]===(enemyColor==="white"?"w":"b")){
        let moves=getRawMoves(board,i,j);
        for(let m of moves){
          if(m[0]===r && m[1]===c) return true;
        }
      }
    }
  }
  return false;
}

export function isCheck(board,color){
  let king=findKing(board,color);
  let enemy=color==="white"?"black":"white";
  return isSquareAttacked(board,king[0],king[1],enemy);
}

// moves
export function getRawMoves(board,r,c){
  let piece=board[r][c];
  if(!piece) return [];

  let color=piece[0];
  let type=piece[1];
  let moves=[];

  if(type==="p"){
    let dir=color==="w"?-1:1;

    if(inside(r+dir,c)&&board[r+dir][c]===""){
      moves.push([r+dir,c]);
    }

    [[r+dir,c+1],[r+dir,c-1]].forEach(([x,y])=>{
      if(inside(x,y)&&board[x][y]&&board[x][y][0]!==color){
        moves.push([x,y]);
      }
    });
  }

  if(type==="n"){
    let steps=[[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]];
    steps.forEach(([dx,dy])=>{
      let x=r+dx,y=c+dy;
      if(inside(x,y)&&(!board[x][y]||board[x][y][0]!==color)){
        moves.push([x,y]);
      }
    });
  }

  if(type==="k"){
    for(let dx=-1;dx<=1;dx++){
      for(let dy=-1;dy<=1;dy++){
        if(dx||dy){
          let x=r+dx,y=c+dy;
          if(inside(x,y)&&(!board[x][y]||board[x][y][0]!==color)){
            moves.push([x,y]);
          }
        }
      }
    }
  }

  return moves;
}

export function getValidMoves(board,r,c,color){
  let raw=getRawMoves(board,r,c);
  let valid=[];

  for(let m of raw){
    let copy=board.map(row=>[...row]);
    copy[m[0]][m[1]]=copy[r][c];
    copy[r][c]="";

    if(!isCheck(copy,color)) valid.push(m);
  }

  return valid;
}

export function isCheckmate(board,color){
  if(!isCheck(board,color)) return false;

  for(let i=0;i<8;i++){
    for(let j=0;j<8;j++){
      let piece=board[i][j];
      if(piece && piece[0]===(color==="white"?"w":"b")){
        if(getValidMoves(board,i,j,color).length>0) return false;
      }
    }
  }
  return true;
}

// FULL notation
export function getNotation(piece, from, to, capture, check, mate){
  const files="abcdefgh";
  const names={p:"",r:"R",n:"N",b:"B",q:"Q",k:"K"};

  let move=names[piece[1]];

  move+=files[from[1]]+(8-from[0]);
  if(capture) move+="x";
  move+=files[to[1]]+(8-to[0]);

  if(mate) move+="#";
  else if(check) move+="+";

  return move;
}