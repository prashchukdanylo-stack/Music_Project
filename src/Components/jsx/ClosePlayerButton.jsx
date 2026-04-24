import "../css/ClosePlayerButton.css";
export function ClosePlayerButton({isPlayerClosed, setIsPlayerClosed}) {
    return (
        <img src="images/open.png" style={{display: isPlayerClosed && 'none'}} className="close" onClick={() => setIsPlayerClosed(prev=> !prev)} />
    )
}