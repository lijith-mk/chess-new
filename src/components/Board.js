import React,{useState} from "react";
import Square from "./Square";
import {
  initialBoard,
  getValidMoves,
  isCheck,
  isCheckmate,
  getNotation
} from "../utils/gameLogic";

function Board({turn,setTurn,addMove}){

  const [board,setBoard]=useState(initialBoard());
  const [selected,setSelected]=useState(null);
  const [moves,setMoves]=useState([]);
  const [history,setHistory]=useState([]);
  const [captured,setCaptured]=useState([]);

  const handleClick=(r,c)=>{
    let piece=board[r][c];

    if(selected){
      let valid=moves.some(m=>m[0]===r&&m[1]===c);

      if(!valid){
        alert("Illegal move");
        setSelected(null);
        return;
      }

      let newBoard=board.map(row=>[...row]);
      let moving=newBoard[selected[0]][selected[1]];
      let capturedPiece=newBoard[r][c];

      setHistory(prev=>[...prev,board]);

      newBoard[r][c]=moving;
      newBoard[selected[0]][selected[1]]="";

      if(capturedPiece){
        setCaptured(prev=>[...prev,capturedPiece]);
      }

      let next=turn==="white"?"black":"white";

      let check=isCheck(newBoard,next);
      let mate=isCheckmate(newBoard,next);

      addMove(getNotation(moving,selected,[r,c],capturedPiece,check,mate));

      if(check) alert("Check!");
      if(mate) alert("Checkmate!");

      setBoard(newBoard);
      setTurn(next);
      setSelected(null);
      setMoves([]);
    }
    else{
      if(piece && piece[0]===(turn==="white"?"w":"b")){
        setSelected([r,c]);
        setMoves(getValidMoves(board,r,c,turn));
      }
    }
  };

  const undo=()=>{
    if(history.length===0) return;
    setBoard(history[history.length-1]);
    setHistory(history.slice(0,-1));
  };

  return(
    <>
      <button onClick={undo}>Undo</button>

      <div className="board">
        {board.map((row,i)=>
          row.map((sq,j)=>(
            <Square
              key={i+"-"+j}
              value={sq}
              onClick={()=>handleClick(i,j)}
              highlight={moves.some(m=>m[0]===i&&m[1]===j)}
              isDark={(i+j)%2}
            />
          ))
        )}
      </div>

      <h4>Captured:</h4>
      <div>{captured.join(" ")}</div>
    </>
  );
}

export default Board;