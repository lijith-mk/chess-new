import React,{useState,useCallback} from "react";
import Board from "./components/Board";
import Timer from "./components/Timer";

function App(){

  const [turn,setTurn]=useState("white");
  const [time,setTime]=useState({white:300,black:300});

  // stable functions (fix ESLint + timer bug)
  const updateWhite = useCallback((t)=>{
    setTime(p=>({...p,white:t}));
  },[]);

  const updateBlack = useCallback((t)=>{
    setTime(p=>({...p,black:t}));
  },[]);

  return(
    <div>
      <h1>Chess</h1>

      <Timer
        time={time.white}
        active={turn==="white"}
        onChange={updateWhite}
      />

      {/* pass turn + setTurn */}
      <Board turn={turn} setTurn={setTurn} />

      <Timer
        time={time.black}
        active={turn==="black"}
        onChange={updateBlack}
      />
    </div>
  );
}

export default App;