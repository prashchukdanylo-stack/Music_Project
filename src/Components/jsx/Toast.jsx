import "../css/Toast.css";

export function Toast({toast}) {
    return (
        <div className={ toast!=="Shuffle is off, turn it on!" ? "toast-container" : "toast-warning-container"}>
            <h1 className={toast !=="Shuffle is off, turn it on!"? "toast-message" : "toast-warning-message"}>{toast}</h1>
        </div>
    );
}