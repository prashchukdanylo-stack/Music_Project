import "../css/QueueButton.css"


export function QueueButton({setQueueShuffle, songToRender}) {
  return (
    <img
      src="images/queue.png"
      className="queueButton"
      onClick={(event) => {
        event.stopPropagation();
        setQueueShuffle((prev) => [...prev, songToRender]);
      }}
    ></img>
  );
}
