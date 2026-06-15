import React, { useEffect, useState } from "react";

function Timer({ active, gameOver }) {
  const [time, setTime] = useState(300);

  useEffect(() => {
    if (!active || gameOver) return;

    const interval = setInterval(() => {
      setTime(t => (t > 0 ? t - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [active, gameOver]);

  return <div>{time}s</div>;
}

export default Timer;