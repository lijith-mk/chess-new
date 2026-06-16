import React from "react";

function Square({value,onClick,isDark,highlight,selected}){

  return(
    <div
      onClick={onClick}
      className={`square ${isDark?"dark":"light"} ${highlight?"highlight":""} ${selected?"selected":""}`}
    >
      {value}
    </div>
  );
}

export default Square;