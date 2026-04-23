import { createContext, useState } from "react";

export const TimeContext = createContext();

export const TimeProvider = ({children}) => {
    const [progress, setProgress] = useState(0);
    const [time, setTime] = useState(() => {
    const Parsedtime = localStorage.getItem("time");
    return Parsedtime ? Parsedtime : "0:00 / 0:00";
  });
  return (
    <TimeContext.Provider value = {{progress, setProgress, time, setTime}}>
        {children}
    </TimeContext.Provider>
  )
}