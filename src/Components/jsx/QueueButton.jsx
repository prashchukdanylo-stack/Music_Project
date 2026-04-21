import "../css/QueueButton.css"


export function QueueButton({setQueueShuffle, songToRender, shuffle}) {
  return (
    <img
      src="images/queue.png"
      className="queueButton"
      onClick={(event) => {
        event.stopPropagation();
        if (shuffle) {
          setQueueShuffle((prev) => [...prev, songToRender]);
          alert(`${songToRender.name} successfully added to the queue!`)
        } else {
          alert("Shuffle is off, turn it on!");
        }
        
      }}
    ></img>
  );
}
