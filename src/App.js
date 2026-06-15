import React, { useState } from "react";
import Board from "./components/Board";
import Timer from "./components/Timer";

function App() {
  const [turn, setTurn] = useState("white");
  const [moves, setMoves] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  const addMove = (move) => {
    setMoves(prev => [...prev, move]);
  };

  return (
    <div className="app">
      <h1>Simple Chess Game</h1>

      <div className="game">
        <div>
          <h3>White Timer</h3>
          <Timer active={turn === "white"} gameOver={gameOver} />
        </div>

        <Board
          turn={turn}
          setTurn={setTurn}
          addMove={addMove}
          setGameOver={setGameOver}
        />

        <div>
          <h3>Black Timer</h3>
          <Timer active={turn === "black"} gameOver={gameOver} />
        </div>
      </div>

      <div className="moves">
        <h3>Move List</h3>
        {moves.map((m, i) => (
          <div key={i}>{i + 1}. {m}</div>
        ))}
      </div>
    </div>
  );
}

export default App;