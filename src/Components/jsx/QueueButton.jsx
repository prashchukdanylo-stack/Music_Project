import { useContext, useCallback, useRef } from "react";
import "../css/QueueButton.css"
import { QueueContext } from "../../contexts/QueueContext";
import { PlayerContext } from "../../contexts/PlayerContext";


export function QueueButton({songToRender}) {
  const {setQueueShuffle, setToast} = useContext(QueueContext);
  const {shuffle} = useContext(PlayerContext);
   const toastRef = useRef(null);

  const showToast = useCallback((message) => {
    if (toastRef.current) {
      clearTimeout(toastRef.current);
    }
    setToast(message);
    toastRef.current = setTimeout(()=> {
      setToast(null);
      toastRef.current = null;
    }
      , 3000);
  }, [setToast]);

  const handleAddToQueue = useCallback((event) => {
    event.stopPropagation();
    if (shuffle) {
          setQueueShuffle((prev) => [...prev, songToRender]);
          
          showToast(`"${songToRender.name}" successfully added to the queue!`)
        } else {
          showToast("Shuffle is off, turn it on!");
        }
  }, [shuffle, songToRender, setQueueShuffle, showToast]);
  return (
    <img
      src="images/queue.png"
      className="queueButton"
      onClick={handleAddToQueue}
    ></img>
  );
}
