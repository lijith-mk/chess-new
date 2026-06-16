import React,{useState} from "react";
import Board from "./components/Board";
import Timer from "./components/Timer";

function App(){

  const [turn,setTurn]=useState("white");
  const [time,setTime]=useState({white:300,black:300});

  return(
    <div>
      <h1>Chess</h1>

      <Timer
        time={time.white}
        active={turn==="white"}
        onChange={(t)=>setTime(p=>({...p,white:t}))}
      />

      <Board/>

      <Timer
        time={time.black}
        active={turn==="black"}
        onChange={(t)=>setTime(p=>({...p,black:t}))}
      />
    </div>
  );
}

export default App;