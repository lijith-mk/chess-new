import React,{useState} from "react";
import Board from "./components/Board";
import Timer from "./components/Timer";

function App(){

  const [turn,setTurn]=useState("white");
  const [moves,setMoves]=useState([]);

  const addMove=(m)=>{
    setMoves(prev=>[...prev,m]);
  };

  return(
    <div>
      <h1>Chess Game</h1>

      <Timer active={turn==="white"} />
      <Board turn={turn} setTurn={setTurn} addMove={addMove}/>
      <Timer active={turn==="black"} />

      <h3>Moves</h3>
      {moves.map((m,i)=><div key={i}>{i+1}. {m}</div>)}
    </div>
  );
}

export default App;