import "../css/QueueButton.css"


export function QueueButton({setQueueChoose, songToRender}) {
  return (
    <img
      src="images/queue.png"
      className="queueButton"
      onClick={(event) => {
        event.stopPropagation();
        setQueueChoose((prev) => [...prev, songToRender]);
      }}
    ></img>
  );
}
