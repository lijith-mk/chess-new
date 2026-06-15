import React, { useState } from "react";
import Square from "./Square";
import { initialBoard, getRawMoves } from "../utils/gameLogic";

function Board({ turn, setTurn }) {
  const [board, setBoard] = useState(initialBoard());
  const [selected, setSelected] = useState(null);
  const [validMoves, setValidMoves] = useState([]);
  const [history, setHistory] = useState([]);
  const [captured, setCaptured] = useState([]);

  const handleClick = (r, c) => {
    const piece = board[r][c];

    if (selected) {
      let isValid = validMoves.some(m => m[0] === r && m[1] === c);

      if (!isValid) {
        alert("Illegal move!");
        setSelected(null);
        setValidMoves([]);
        return;
      }

      let newBoard = board.map(row => [...row]);

      let moving = newBoard[selected[0]][selected[1]];
      let capturedPiece = newBoard[r][c];

      // save history for undo
      setHistory(prev => [...prev, { board, turn }]);

      newBoard[r][c] = moving;
      newBoard[selected[0]][selected[1]] = "";

      // pawn promotion
      if (moving === "wp" && r === 0) newBoard[r][c] = "wq";
      if (moving === "bp" && r === 7) newBoard[r][c] = "bq";

      // castling
      if (moving[1] === "k" && Math.abs(c - selected[1]) === 2) {
        if (c === 6) {
          newBoard[r][5] = newBoard[r][7];
          newBoard[r][7] = "";
        }
        if (c === 2) {
          newBoard[r][3] = newBoard[r][0];
          newBoard[r][0] = "";
        }
      }

      if (capturedPiece) {
        setCaptured(prev => [...prev, capturedPiece]);
      }

      setBoard(newBoard);
      setTurn(turn === "white" ? "black" : "white");
      setSelected(null);
      setValidMoves([]);
    } else {
      if (piece && piece[0] === (turn === "white" ? "w" : "b")) {
        setSelected([r, c]);
        setValidMoves(getRawMoves(board, r, c));
      }
    }
  };

  const undo = () => {
    if (history.length === 0) return;

    const last = history[history.length - 1];
    setBoard(last.board);
    setTurn(last.turn);
    setHistory(history.slice(0, -1));
  };

  return (
    <>
      <button onClick={undo}>Undo</button>

      <div className="board">
        {board.map((row, i) =>
          row.map((sq, j) => (
            <Square
              key={i + "-" + j}
              value={sq}
              onClick={() => handleClick(i, j)}
              highlight={validMoves.some(m => m[0] === i && m[1] === j)}
              isDark={(i + j) % 2}
            />
          ))
        )}
      </div>

      <div>
        <h4>Captured:</h4>
        {captured.join(" ")}
      </div>
    </>
  );
}

export default Board;