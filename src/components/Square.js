import React from "react";

function Square({ value, onClick, isDark, highlight }) {
  return (
    <div
      className={`square ${isDark ? "dark" : "light"} ${highlight ? "highlight" : ""}`}
      onClick={onClick}
    >
      {value}
    </div>
  );
}

export default Square;