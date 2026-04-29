import { useContext, useCallback } from "react";
import "../css/QueueButton.css"
import { QueueContext } from "../../contexts/QueueContext";
import { PlayerContext } from "../../contexts/PlayerContext";



export function QueueButton({songToRender}) {
  const {setQueueShuffle,setToast} = useContext(QueueContext);
  const {shuffle} = useContext(PlayerContext);
   

  const handleAddToQueue = useCallback((event) => {
    event.stopPropagation();
    if (shuffle) {
          setQueueShuffle((prev) => [...prev, songToRender]);
          
          setToast(`"${songToRender.name}" successfully added to the queue!`)
        } else {
          setToast("Shuffle is off, turn it on!");
        }
  }, [shuffle,setQueueShuffle,setToast,songToRender]);
  return (
    <img
      src="images/queue.png"
      className="queueButton"
      onClick={handleAddToQueue}
    ></img>
  );
}
