import React,{useState} from "react";
import Square from "./Square";
import {
  initialBoard,
  getValidMoves,
  isCheck,
  isCheckmate
} from "../utils/gameLogic";

function Board({turn,setTurn}){

  const [board,setBoard]=useState(initialBoard());
  const [selected,setSelected]=useState(null);
  const [moves,setMoves]=useState([]);
  const [lastMove,setLastMove]=useState(null);

  const [moved,setMoved]=useState({
    w:{king:false,rookL:false,rookR:false},
    b:{king:false,rookL:false,rookR:false}
  });

  const handleClick=(r,c)=>{
    let piece=board[r][c];

    if(!selected){
      if(piece && piece[0]!== (turn==="white"?"w":"b")){
        alert("Wrong turn");
        return;
      }
    }

    if(selected){
      let valid=moves.some(m=>m[0]===r && m[1]===c);

      if(!valid){
        alert("Illegal move");
        setSelected(null);
        return;
      }

      let newBoard=board.map(row=>[...row]);
      let moving=newBoard[selected[0]][selected[1]];

      // en passant remove
      if(moving[1]==="p" && c!==selected[1] && !newBoard[r][c]){
        newBoard[selected[0]][c]="";
      }

      newBoard[r][c]=moving;
      newBoard[selected[0]][selected[1]]="";

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

      let newMoved={...moved};
      if(moving==="wk") newMoved.w.king=true;
      if(moving==="bk") newMoved.b.king=true;

      setMoved(newMoved);
      setLastMove([selected[0],selected[1],r,c,moving]);

      let next=turn==="white"?"black":"white";

      if(isCheck(newBoard,next)) alert("Check!");
      if(isCheckmate(newBoard,next,lastMove,moved)) alert("Checkmate!");

      setBoard(newBoard);
      setTurn(next);
      setSelected(null);
      setMoves([]);
    }
    else{
      if(piece){
        setSelected([r,c]);
        setMoves(getValidMoves(board,r,c,turn,lastMove,moved));
      }
    }
  };

  return(
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
  );
}

export default Board;