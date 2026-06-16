import React,{useState} from "react";
import Square from "./Square";
import {
  initialBoard,
  getValidMoves,
  isCheck,
  isCheckmate,
  isStalemate,
  getNotation
} from "../utils/gameLogic";

function Board({turn,setTurn}){

  const [board,setBoard]=useState(initialBoard());
  const [selected,setSelected]=useState(null);
  const [moves,setMoves]=useState([]);
  const [history,setHistory]=useState([]);
  const [captured,setCaptured]=useState([]);
  const [moveList,setMoveList]=useState([]);
  const [gameOver,setGameOver]=useState(false);

  function handleClick(r,c){

    if(gameOver) return;

    let piece=board[r][c];

    if(!selected){
      if(piece && piece[0]===(turn==="white"?"w":"b")){
        setSelected([r,c]);
        setMoves(getValidMoves(board,r,c,turn));
      }
      return;
    }

    let valid=moves.some(m=>m[0]===r && m[1]===c);

    if(!valid){
      setSelected(null);
      setMoves([]);
      return;
    }

    setHistory(prev=>[...prev,board]);

    let newBoard=board.map(row=>[...row]);
    let moving=newBoard[selected[0]][selected[1]];
    let capturedPiece=newBoard[r][c];

    if(capturedPiece){
      setCaptured(prev=>[...prev,capturedPiece]);
    }

    newBoard[r][c]=moving;
    newBoard[selected[0]][selected[1]]="";

    // promotion
    if(moving==="wp" && r===0) newBoard[r][c]="wq";
    if(moving==="bp" && r===7) newBoard[r][c]="bq";

    // castling rook move
    if(moving[1]==="k" && Math.abs(c-selected[1])===2){
      if(c===6){
        newBoard[r][5]=newBoard[r][7];
        newBoard[r][7]="";
      }
      if(c===2){
        newBoard[r][3]=newBoard[r][0];
        newBoard[r][0]="";
      }
    }

    let next=turn==="white"?"black":"white";

    let text=getNotation(moving,selected,[r,c]);

    if(isCheck(newBoard,next)) text+="+";
    if(isCheckmate(newBoard,next)){
      text+="#";
      setGameOver(true);
      alert("Checkmate!");
    }

    if(isStalemate(newBoard,next)){
      setGameOver(true);
      alert("Stalemate!");
    }

    setMoveList(prev=>[...prev,text]);

    setBoard(newBoard);
    setSelected(null);
    setMoves([]);
    setTurn(next);
  }

  function undoMove(){
    if(history.length===0) return;
    let last=history[history.length-1];
    setBoard(last);
    setHistory(history.slice(0,-1));
  }

  return(
    <>
      <button onClick={undoMove}>Undo</button>

      <div className="board">
        {board.map((row,i)=>
          row.map((sq,j)=>(
            <Square
              key={i+"-"+j}
              value={sq}
              onClick={()=>handleClick(i,j)}
              highlight={moves.some(m=>m[0]===i&&m[1]===j)}
              selected={selected && selected[0]===i && selected[1]===j}
              isDark={(i+j)%2}
            />
          ))
        )}
      </div>

      <h3>Moves</h3>
      {moveList.map((m,i)=><div key={i}>{i+1}. {m}</div>)}

      <h3>Captured</h3>
      <div>{captured.join(" ")}</div>
    </>
  );
}

export default Board;