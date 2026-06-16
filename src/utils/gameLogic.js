export function initialBoard() {
  return [
    ["br","bn","bb","bq","bk","bb","bn","br"],
    ["bp","bp","bp","bp","bp","bp","bp","bp"],
    ["","","","","","","",""],
    ["","","","","","","",""],
    ["","","","","","","",""],
    ["","","","","","","",""],
    ["wp","wp","wp","wp","wp","wp","wp","wp"],
    ["wr","wn","wb","wq","wk","wb","wn","wr"]
  ];
}

function inside(r,c){
  return r>=0 && c>=0 && r<8 && c<8;
}

export function findKing(board,color){
  let target = color==="white"?"wk":"bk";
  for(let i=0;i<8;i++){
    for(let j=0;j<8;j++){
      if(board[i][j]===target) return [i,j];
    }
  }
}

export function isCheck(board,color){
  let king=findKing(board,color);
  let enemy=color==="white"?"b":"w";

  for(let i=0;i<8;i++){
    for(let j=0;j<8;j++){
      let p=board[i][j];
      if(p && p[0]===enemy){
        let moves=getRawMoves(board,i,j);
        for(let m of moves){
          if(m[0]===king[0] && m[1]===king[1]) return true;
        }
      }
    }
  }
  return false;
}

export function isCheckmate(board,color){
  if(!isCheck(board,color)) return false;

  for(let i=0;i<8;i++){
    for(let j=0;j<8;j++){
      let p=board[i][j];
      if(p && p[0]===(color==="white"?"w":"b")){
        if(getValidMoves(board,i,j,color).length>0) return false;
      }
    }
  }
  return true;
}

export function isStalemate(board,color){
  if(isCheck(board,color)) return false;

  for(let i=0;i<8;i++){
    for(let j=0;j<8;j++){
      let p=board[i][j];
      if(p && p[0]===(color==="white"?"w":"b")){
        if(getValidMoves(board,i,j,color).length>0) return false;
      }
    }
  }
  return true;
}

export function getRawMoves(board,r,c){

  let piece=board[r][c];
  if(!piece) return [];

  let color=piece[0];
  let type=piece[1];
  let moves=[];

  // rook
  if(type==="r" || type==="q"){
    for(let i=r-1;i>=0;i--){
      if(board[i][c]==="") moves.push([i,c]);
      else { if(board[i][c][0]!==color) moves.push([i,c]); break; }
    }
    for(let i=r+1;i<8;i++){
      if(board[i][c]==="") moves.push([i,c]);
      else { if(board[i][c][0]!==color) moves.push([i,c]); break; }
    }
    for(let j=c-1;j>=0;j--){
      if(board[r][j]==="") moves.push([r,j]);
      else { if(board[r][j][0]!==color) moves.push([r,j]); break; }
    }
    for(let j=c+1;j<8;j++){
      if(board[r][j]==="") moves.push([r,j]);
      else { if(board[r][j][0]!==color) moves.push([r,j]); break; }
    }
  }

  // bishop
  if(type==="b" || type==="q"){
    for(let i=1;i<8;i++){
      let x=r+i,y=c+i;
      if(!inside(x,y)) break;
      if(board[x][y]==="") moves.push([x,y]);
      else { if(board[x][y][0]!==color) moves.push([x,y]); break; }
    }
    for(let i=1;i<8;i++){
      let x=r-i,y=c-i;
      if(!inside(x,y)) break;
      if(board[x][y]==="") moves.push([x,y]);
      else { if(board[x][y][0]!==color) moves.push([x,y]); break; }
    }
    for(let i=1;i<8;i++){
      let x=r+i,y=c-i;
      if(!inside(x,y)) break;
      if(board[x][y]==="") moves.push([x,y]);
      else { if(board[x][y][0]!==color) moves.push([x,y]); break; }
    }
    for(let i=1;i<8;i++){
      let x=r-i,y=c+i;
      if(!inside(x,y)) break;
      if(board[x][y]==="") moves.push([x,y]);
      else { if(board[x][y][0]!==color) moves.push([x,y]); break; }
    }
  }

  // knight
  if(type==="n"){
    let arr=[[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]];
    for(let a of arr){
      let x=r+a[0],y=c+a[1];
      if(inside(x,y)){
        if(!board[x][y]||board[x][y][0]!==color){
          moves.push([x,y]);
        }
      }
    }
  }

  // king + castling
  if(type==="k"){
    for(let dx=-1;dx<=1;dx++){
      for(let dy=-1;dy<=1;dy++){
        if(dx||dy){
          let x=r+dx,y=c+dy;
          if(inside(x,y)){
            if(!board[x][y]||board[x][y][0]!==color){
              moves.push([x,y]);
            }
          }
        }
      }
    }

    if(c===4){
      if(board[r][5]==="" && board[r][6]==="" && board[r][7]===color+"r"){
        moves.push([r,6]);
      }
      if(board[r][1]==="" && board[r][2]==="" && board[r][3]==="" && board[r][0]===color+"r"){
        moves.push([r,2]);
      }
    }
  }

  // pawn
  if(type==="p"){
    let dir=color==="w"?-1:1;

    if(board[r+dir] && board[r+dir][c]===""){
      moves.push([r+dir,c]);

      if((color==="w"&&r===6)||(color==="b"&&r===1)){
        if(board[r+2*dir][c]===""){
          moves.push([r+2*dir,c]);
        }
      }
    }

    if(board[r+dir] && board[r+dir][c+1] && board[r+dir][c+1][0]!==color){
      moves.push([r+dir,c+1]);
    }
    if(board[r+dir] && board[r+dir][c-1] && board[r+dir][c-1][0]!==color){
      moves.push([r+dir,c-1]);
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

    if(!isCheck(copy,color)){
      valid.push(m);
    }
  }
  return valid;
}

export function getNotation(piece,from,to){
  const files="abcdefgh";
  const names={p:"",r:"R",n:"N",b:"B",q:"Q",k:"K"};

  return names[piece[1]]+
    files[from[1]]+(8-from[0])+
    "-" +
    files[to[1]]+(8-to[0]);
}