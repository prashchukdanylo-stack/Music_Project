import { useEffect, useState } from "react";
import "../css/Toast.css";
import emitter from "../../utils/eventBus";

export function Toast() {
    const [message, setMessage] = useState(null);

    useEffect(()=> {
        const handleToast = (event) => {
            setMessage(event);
        }

        emitter.on("toast", handleToast);

        return () => emitter.off("toast", handleToast);
    }, []);
    
    useEffect(() => {
        if (!message) return;

        const timerId = setTimeout(() => {
            setMessage(null);
        }, 3000);

        return () => clearTimeout(timerId);
    }, [message]);
     
    if (!message) return null;
    return (
        <div className={ message!=="Shuffle is off, turn it on!" ? "toast-container" : "toast-warning-container"}>
            <h1 className={message !=="Shuffle is off, turn it on!"? "toast-message" : "toast-warning-message"}>{message}</h1>
        </div>
    );
}