

// initial board setup
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

// check if position is inside board
const inside = (r, c) => r >= 0 && c >= 0 && r < 8 && c < 8;



export function getRawMoves(board, r, c) {
  const piece = board[r][c];
  if (!piece) return [];

  const color = piece[0];
  const type = piece[1];
  let moves = [];

  // -------- PAWN --------
  if (type === "p") {
    let dir = color === "w" ? -1 : 1;

    // forward move
    if (inside(r + dir, c) && board[r + dir][c] === "") {
      moves.push([r + dir, c]);

      // first double move
      if ((r === 6 && color === "w") || (r === 1 && color === "b")) {
        if (board[r + 2 * dir][c] === "") {
          moves.push([r + 2 * dir, c]);
        }
      }
    }

    // capture moves
    [[r + dir, c + 1], [r + dir, c - 1]].forEach(([x, y]) => {
      if (inside(x, y) && board[x][y] && board[x][y][0] !== color) {
        moves.push([x, y]);
      }
    });
  }

  // -------- ROOK --------
  if (type === "r") {
    let dirs = [[1,0],[-1,0],[0,1],[0,-1]];
    dirs.forEach(([dx, dy]) => {
      let x = r + dx, y = c + dy;
      while (inside(x, y)) {
        if (board[x][y] === "") {
          moves.push([x, y]);
        } else {
          if (board[x][y][0] !== color) moves.push([x, y]);
          break;
        }
        x += dx;
        y += dy;
      }
    });
  }

  // -------- BISHOP --------
  if (type === "b") {
    let dirs = [[1,1],[1,-1],[-1,1],[-1,-1]];
    dirs.forEach(([dx, dy]) => {
      let x = r + dx, y = c + dy;
      while (inside(x, y)) {
        if (board[x][y] === "") {
          moves.push([x, y]);
        } else {
          if (board[x][y][0] !== color) moves.push([x, y]);
          break;
        }
        x += dx;
        y += dy;
      }
    });
  }

  // -------- QUEEN --------
  if (type === "q") {
    let dirs = [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
    dirs.forEach(([dx, dy]) => {
      let x = r + dx, y = c + dy;
      while (inside(x, y)) {
        if (board[x][y] === "") {
          moves.push([x, y]);
        } else {
          if (board[x][y][0] !== color) moves.push([x, y]);
          break;
        }
        x += dx;
        y += dy;
      }
    });
  }

  // -------- KNIGHT --------
  if (type === "n") {
    let steps = [[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]];
    steps.forEach(([dx, dy]) => {
      let x = r + dx, y = c + dy;
      if (inside(x, y) && (!board[x][y] || board[x][y][0] !== color)) {
        moves.push([x, y]);
      }
    });
  }

  
  if (type === "k") {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx || dy) {
          let x = r + dx, y = c + dy;
          if (inside(x, y) && (!board[x][y] || board[x][y][0] !== color)) {
            moves.push([x, y]);
          }
        }
      }
    }

    // CASTLING
    if (color === "w" && r === 7 && c === 4) {
      if (board[7][7] === "wr" && board[7][5] === "" && board[7][6] === "") {
        moves.push([7,6]);
      }
      if (board[7][0] === "wr" && board[7][1] === "" && board[7][2] === "" && board[7][3] === "") {
        moves.push([7,2]);
      }
    }
  }

  return moves;
}