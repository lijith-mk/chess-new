import React, { useState } from "react";
import Square from "./Square";
import {
  initialBoard,
  getValidMoves,
  isCheck,
  isCheckmate,
  getNotation
} from "../utils/gameLogic";

function Board({ turn, setTurn, addMove }) {

  const [board,setBoard]=useState(initialBoard());
  const [selected,setSelected]=useState(null);
  const [moves,setMoves]=useState([]);

  const handleClick=(r,c)=>{
    let piece=board[r][c];

    if(selected){
      let valid=moves.some(m=>m[0]===r && m[1]===c);

      if(!valid){
        alert("Illegal move");
        setSelected(null);
        return;
      }

      let newBoard=board.map(row=>[...row]);
      let moving=newBoard[selected[0]][selected[1]];

      newBoard[r][c]=moving;
      newBoard[selected[0]][selected[1]]="";

      // pawn promotion
      if(moving==="wp" && r===0){
        let choice=prompt("Promote to (q,r,b,n)");
        newBoard[r][c]="w"+choice;
      }

      if(moving==="bp" && r===7){
        let choice=prompt("Promote to (q,r,b,n)");
        newBoard[r][c]="b"+choice;
      }

      addMove(getNotation(moving,[r,c]));

      setBoard(newBoard);

      let next=turn==="white"?"black":"white";

      if(isCheck(newBoard,next)) alert("Check!");

      if(isCheckmate(newBoard,next)) alert("Checkmate!");

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

  return (
    <div className="board">
      {board.map((row,i)=>
        row.map((sq,j)=>(
          <Square
            key={i+"-"+j}
            value={sq}
            onClick={()=>handleClick(i,j)}
            highlight={moves.some(m=>m[0]===i && m[1]===j)}
            isDark={(i+j)%2}
          />
        ))
      )}
    </div>
  );
}

export default Board;