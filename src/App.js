import React,{useState} from "react";
import Board from "./components/Board";
import Timer from "./components/Timer";

function App(){

  const [turn,setTurn]=useState("white");
  const [moves,setMoves]=useState([]);
  const [time,setTime]=useState({white:300,black:300});

  const updateTime=(color,val)=>{
    setTime(prev=>({...prev,[color]:val}));
  };

  return(
    <div>
      <h1>Chess</h1>

      <Timer
        time={time.white}
        active={turn==="white"}
        onChange={(t)=>updateTime("white",t)}
      />

      <Board turn={turn} setTurn={setTurn} addMove={(m)=>setMoves(p=>[...p,m])}/>

      <Timer
        time={time.black}
        active={turn==="black"}
        onChange={(t)=>updateTime("black",t)}
      />

      <h3>Moves</h3>
      {moves.map((m,i)=><div key={i}>{i+1}. {m}</div>)}
    </div>
  );
}

export default App;