import React,{useEffect,useState} from "react";

function Timer({active}){

  const [time,setTime]=useState(300);

  useEffect(()=>{
    if(!active) return;

    const id=setInterval(()=>{
      setTime(t=>t>0?t-1:0);
    },1000);

    return()=>clearInterval(id);
  },[active]);

  return <div>{time}s</div>;
}

export default Timer;