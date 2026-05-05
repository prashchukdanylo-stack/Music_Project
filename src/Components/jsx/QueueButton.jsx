import { useContext, useCallback } from "react";
import "../css/QueueButton.css"
import { QueueContext } from "../../contexts/QueueContext";
import { PlayerContext } from "../../contexts/PlayerContext";
import emitter from "../../utils/eventBus";



export function QueueButton({songToRender}) {
  const {setQueueShuffle, queueShuffle} = useContext(QueueContext);
  const {shuffle} = useContext(PlayerContext);
   

  const handleAddToQueue = useCallback((event) => {
    event.stopPropagation();
    if (shuffle && !queueShuffle.includes(songToRender)) {
          setQueueShuffle((prev) => [...prev, songToRender]);
          
          emitter.emit("toast", `"${songToRender.name}" added to shuffle queue!`);
        } else if (!shuffle) {
          emitter.emit("toast", "Shuffle is off, turn it on!");
        } else {
          emitter.emit("toast", `"${songToRender.name}" is already in the shuffle queue!`);
        }
  }, [shuffle, queueShuffle ,setQueueShuffle,songToRender]);
  return (
    <img
      src="images/queue.png"
      className="queueButton"
      onClick={handleAddToQueue}
    ></img>
  );
}
