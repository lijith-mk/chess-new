import React, { useState } from "react";
import Square from "./Square";
import {
  initialBoard,
  getValidMoves,
  isCheck,
  isCheckmate,
  getNotation
} from "../utils/gameLogic";

function Board({ turn, setTurn, addMove, setGameOver }) {
  const [board, setBoard] = useState(initialBoard());
  const [selected, setSelected] = useState(null);

  const handleClick = (r, c) => {
    const piece = board[r][c];

    if (selected) {
      const moves = getValidMoves(board, selected, turn);

      const valid = moves.some(m => m[0] === r && m[1] === c);

      if (valid) {
        const newBoard = board.map(row => [...row]);

        const movingPiece = newBoard[selected[0]][selected[1]];
        const captured = newBoard[r][c];

        newBoard[r][c] = movingPiece;
        newBoard[selected[0]][selected[1]] = "";

        setBoard(newBoard);

        addMove(getNotation(movingPiece, selected, [r, c], captured));

        const nextTurn = turn === "white" ? "black" : "white";

        if (isCheck(newBoard, nextTurn)) alert("Check!");

        if (isCheckmate(newBoard, nextTurn)) {
          alert("Checkmate!");
          setGameOver(true);
        }

        setTurn(nextTurn);
      }

      setSelected(null);
    } else {
      if (piece && piece[0] === (turn === "white" ? "w" : "b")) {
        setSelected([r, c]);
      }
    }
  };

  return (
    <div className="board">
      {board.map((row, i) =>
        row.map((sq, j) => (
          <Square
            key={i + "-" + j}
            value={sq}
            onClick={() => handleClick(i, j)}
            isDark={(i + j) % 2 === 1}
          />
        ))
      )}
    </div>
  );
}

export default Board;