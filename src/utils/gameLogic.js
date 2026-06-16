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

// find king
export function findKing(board,color){
  let target = color==="white"?"wk":"bk";
  for(let i=0;i<8;i++){
    for(let j=0;j<8;j++){
      if(board[i][j]===target) return [i,j];
    }
  }
}

// check attack
export function isSquareAttacked(board,r,c,enemy){
  for(let i=0;i<8;i++){
    for(let j=0;j<8;j++){
      let p=board[i][j];
      if(p && p[0]===(enemy==="white"?"w":"b")){
        let moves=getRawMoves(board,i,j,null,{w:{},b:{}});
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

// RAW MOVES
export function getRawMoves(board,r,c,lastMove,moved){

  let piece=board[r][c];
  if(!piece) return [];

  let color=piece[0];
  let type=piece[1];
  let moves=[];

  // ROOK
  if(type==="r"){
    let dirs=[[1,0],[-1,0],[0,1],[0,-1]];
    dirs.forEach(([dx,dy])=>{
      let x=r+dx,y=c+dy;
      while(inside(x,y)){
        if(board[x][y]==="") moves.push([x,y]);
        else{
          if(board[x][y][0]!==color) moves.push([x,y]);
          break;
        }
        x+=dx;y+=dy;
      }
    });
  }

  // BISHOP
  if(type==="b"){
    let dirs=[[1,1],[1,-1],[-1,1],[-1,-1]];
    dirs.forEach(([dx,dy])=>{
      let x=r+dx,y=c+dy;
      while(inside(x,y)){
        if(board[x][y]==="") moves.push([x,y]);
        else{
          if(board[x][y][0]!==color) moves.push([x,y]);
          break;
        }
        x+=dx;y+=dy;
      }
    });
  }

  // QUEEN
  if(type==="q"){
    return [
      ...getRawMoves(board,r,c,lastMove,moved,"r"),
      ...getRawMoves(board,r,c,lastMove,moved,"b")
    ];
  }

  // PAWN
  if(type==="p"){
    let dir=color==="w"?-1:1;

    if(board[r+dir]?.[c]==="") moves.push([r+dir,c]);

    [[r+dir,c+1],[r+dir,c-1]].forEach(([x,y])=>{
      if(inside(x,y)&&board[x][y]&&board[x][y][0]!==color){
        moves.push([x,y]);
      }
    });

    // en passant
    if(lastMove){
      let sr=lastMove[0];
      let er=lastMove[2];
      let ec=lastMove[3];
      let pm=lastMove[4];

      if(pm && pm[1]==="p" && Math.abs(sr-er)===2){
        if(r===er && Math.abs(c-ec)===1){
          moves.push([r+dir,ec]);
        }
      }
    }
  }

  // KNIGHT
  if(type==="n"){
    let steps=[[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]];
    steps.forEach(([dx,dy])=>{
      let x=r+dx,y=c+dy;
      if(inside(x,y)&&(!board[x][y]||board[x][y][0]!==color)){
        moves.push([x,y]);
      }
    });
  }

  // KING + CASTLING
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

    if(!moved[color]?.king){
      let enemy=color==="w"?"black":"white";

      if(!moved[color]?.rookR &&
         board[r][5]==="" && board[r][6]==="" &&
         !isSquareAttacked(board,r,4,enemy) &&
         !isSquareAttacked(board,r,5,enemy) &&
         !isSquareAttacked(board,r,6,enemy)){
        moves.push([r,6]);
      }

      if(!moved[color]?.rookL &&
         board[r][1]==="" && board[r][2]==="" && board[r][3]==="" &&
         !isSquareAttacked(board,r,4,enemy) &&
         !isSquareAttacked(board,r,3,enemy) &&
         !isSquareAttacked(board,r,2,enemy)){
        moves.push([r,2]);
      }
    }
  }

  return moves;
}

// VALID MOVES
export function getValidMoves(board,r,c,color,lastMove,moved){
  let raw=getRawMoves(board,r,c,lastMove,moved);
  let valid=[];

  for(let m of raw){
    let copy=board.map(row=>[...row]);
    copy[m[0]][m[1]]=copy[r][c];
    copy[r][c]="";

    if(!isCheck(copy,color)) valid.push(m);
  }

  return valid;
}

// CHECKMATE
export function isCheckmate(board,color,lastMove,moved){
  if(!isCheck(board,color)) return false;

  for(let i=0;i<8;i++){
    for(let j=0;j<8;j++){
      let p=board[i][j];
      if(p && p[0]===(color==="white"?"w":"b")){
        if(getValidMoves(board,i,j,color,lastMove,moved).length>0){
          return false;
        }
      }
    }
  }
  return true;
}