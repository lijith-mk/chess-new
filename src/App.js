import React, { useState } from "react";
import Board from "./components/Board";

function App() {
  const [turn, setTurn] = useState("white");

  return (
    <div className="app">
      <h1>Chess Game</h1>
      <h3>Turn: {turn}</h3>

      <Board turn={turn} setTurn={setTurn} />
    </div>
  );
}

export default App;