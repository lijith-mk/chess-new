import React,{useEffect} from "react";

function Timer({time,active,onChange}){

  useEffect(()=>{
    if(!active) return;

    const id=setInterval(()=>{
      onChange(prev=>prev>0?prev-1:0);
    },1000);

    return()=>clearInterval(id);
  },[active]);

  return <div>{time}s</div>;
}

export default Timer;