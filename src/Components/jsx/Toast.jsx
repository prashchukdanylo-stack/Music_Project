import { useContext, useEffect } from "react";
import "../css/Toast.css";
import { QueueContext } from "../../contexts/QueueContext";

export function Toast({toast}) {
    const {setToast} = useContext(QueueContext);
    useEffect(()=> {
        if (!toast) return;

        const timerId = setTimeout(()=>{
            setToast(null);
        }, 3000);
        return () => clearTimeout(timerId);
    }, [toast, setToast]);
    
     

    return (
        <div className={ toast!=="Shuffle is off, turn it on!" ? "toast-container" : "toast-warning-container"}>
            <h1 className={toast !=="Shuffle is off, turn it on!"? "toast-message" : "toast-warning-message"}>{toast}</h1>
        </div>
    );
}