import React,{useState} from "react";
import Square from "./Square";
import {initialBoard,getRawMoves} from "../utils/gameLogic";

function Board(){

  const [board,setBoard]=useState(initialBoard());
  const [selected,setSelected]=useState(null);
  const [moves,setMoves]=useState([]);
  const [captured,setCaptured]=useState([]);
  const [lastMove,setLastMove]=useState(null);

  const symbols={
    wp:"♙",wr:"♖",wn:"♘",wb:"♗",wq:"♕",wk:"♔",
    bp:"♟",br:"♜",bn:"♞",bb:"♝",bq:"♛",bk:"♚"
  };

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
      let capturedPiece=newBoard[r][c];

      // capture
      if(capturedPiece){
        setCaptured(prev=>[...prev,symbols[capturedPiece]]);
      }

      newBoard[r][c]=moving;
      newBoard[selected[0]][selected[1]]="";

      // promotion
      if(moving==="wp" && r===0){
        let choice=prompt("q r b n");
        newBoard[r][c]="w"+choice;
      }

      // save last move (for en passant)
      setLastMove([selected[0],selected[1],r,c,moving]);

      setBoard(newBoard);
      setSelected(null);
      setMoves([]);
    }
    else{
      if(piece){
        setSelected([r,c]);
        setMoves(getRawMoves(board,r,c,lastMove));
      }
    }
  };

  return(
    <>
      <div className="board">
        {board.map((row,i)=>
          row.map((sq,j)=>(
            <Square
              key={i+"-"+j}
              value={symbols[sq]||""}
              onClick={()=>handleClick(i,j)}
              highlight={moves.some(m=>m[0]===i&&m[1]===j)}
              isDark={(i+j)%2}
            />
          ))
        )}
      </div>

      <h4>Captured Pieces:</h4>
      <div>{captured.join(" ")}</div>
    </>
  );
}

export default Board;