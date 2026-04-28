import { useContext } from "react";
import "../css/QueueButton.css"
import { QueueContext } from "../../contexts/QueueContext";
import { PlayerContext } from "../../contexts/PlayerContext";


export function QueueButton({songToRender}) {
  const {setQueueShuffle} = useContext(QueueContext);
  const {shuffle} = useContext(PlayerContext);

  const handleAddToQueue = (event) => {
    event.stopPropagation();

    if (shuffle) {
          setQueueShuffle((prev) => [...prev, songToRender]);
          
          alert(`${songToRender.name} successfully added to the queue!`)
        } else {
          alert("Shuffle is off, turn it on!");
        }
  }
  return (
    <img
      src="images/queue.png"
      className="queueButton"
      onClick={handleAddToQueue}
    ></img>
  );
}
