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

const directions = {
  bishop: [[1,1],[1,-1],[-1,1],[-1,-1]],
  rook: [[1,0],[-1,0],[0,1],[0,-1]],
  queen: [[1,1],[1,-1],[-1,1],[-1,-1],[1,0],[-1,0],[0,1],[0,-1]],
};

const inBounds = (x,y) => x>=0 && y>=0 && x<8 && y<8;

// raw moves (no check logic)
function getRawMoves(board, [r,c], turn) {
  const piece = board[r][c];
  if (!piece) return [];

  const type = piece[1];
  let moves = [];

  if (type === "p") {
    const dir = turn === "white" ? -1 : 1;

    if (board[r+dir]?.[c] === "") moves.push([r+dir,c]);

    [[r+dir,c+1],[r+dir,c-1]].forEach(([x,y])=>{
      if(inBounds(x,y) && board[x][y] && board[x][y][0] !== piece[0]){
        moves.push([x,y]);
      }
    });
  }

  if (type === "n") {
    const ops = [[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]];
    ops.forEach(([dx,dy])=>{
      let x=r+dx,y=c+dy;
      if(inBounds(x,y) && (!board[x][y] || board[x][y][0]!==piece[0])){
        moves.push([x,y]);
      }
    });
  }

  if (type === "k") {
    for(let dx=-1;dx<=1;dx++){
      for(let dy=-1;dy<=1;dy++){
        if(dx||dy){
          let x=r+dx,y=c+dy;
          if(inBounds(x,y) && (!board[x][y] || board[x][y][0]!==piece[0])){
            moves.push([x,y]);
          }
        }
      }
    }
  }

  if (type === "b" || type === "r" || type === "q") {
    let dirs = directions[
      type === "b" ? "bishop" :
      type === "r" ? "rook" : "queen"
    ];

    dirs.forEach(([dx,dy])=>{
      let x=r+dx,y=c+dy;
      while(inBounds(x,y)){
        if(board[x][y]===""){
          moves.push([x,y]);
        } else {
          if(board[x][y][0]!==piece[0]) moves.push([x,y]);
          break;
        }
        x+=dx; y+=dy;
      }
    });
  }

  return moves;
}

export function isCheck(board, turn) {
  let king = turn === "white" ? "wk" : "bk";
  let kingPos;

  for(let i=0;i<8;i++){
    for(let j=0;j<8;j++){
      if(board[i][j] === king) kingPos = [i,j];
    }
  }

  const enemy = turn === "white" ? "black" : "white";

  for(let i=0;i<8;i++){
    for(let j=0;j<8;j++){
      if(board[i][j] && board[i][j][0] !== king[0]){
        let moves = getRawMoves(board, [i,j], enemy);
        if(moves.some(m=>m[0]===kingPos[0] && m[1]===kingPos[1])){
          return true;
        }
      }
    }
  }

  return false;
}

export function getValidMoves(board, [r,c], turn) {
  const moves = getRawMoves(board, [r,c], turn);

  return moves.filter(([x,y])=>{
    const copy = board.map(row=>[...row]);
    copy[x][y] = copy[r][c];
    copy[r][c] = "";

    return !isCheck(copy, turn);
  });
}

export function isCheckmate(board, turn) {
  if (!isCheck(board, turn)) return false;

  for(let i=0;i<8;i++){
    for(let j=0;j<8;j++){
      if(board[i][j] && board[i][j][0] === (turn==="white"?"w":"b")){
        let moves = getValidMoves(board, [i,j], turn);
        if(moves.length > 0) return false;
      }
    }
  }

  return true;
}

export function getNotation(piece, from, to, capture) {
  const files = "abcdefgh";

  let name = {
    p: "",
    r: "R",
    n: "N",
    b: "B",
    q: "Q",
    k: "K"
  }[piece[1]];

  let move = name + files[to[1]] + (8 - to[0]);

  if (capture) move = name + "x" + files[to[1]] + (8 - to[0]);

  return move;
}