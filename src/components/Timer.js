import React,{useEffect} from "react";

function Timer({time,active,onChange}){

  useEffect(()=>{
    if(!active) return;

    const id=setInterval(()=>{
      onChange(time>0?time-1:0);
    },1000);

    return()=>clearInterval(id);
  },[active,time]);

  return <div>{time}s</div>;
}

export default Timer;