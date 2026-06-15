import React from "react";

function Square({ value, onClick, isDark }) {
  return (
    <div
      className={`square ${isDark ? "dark" : "light"}`}
      onClick={onClick}
    >
      {value}
    </div>
  );
}

export default Square;