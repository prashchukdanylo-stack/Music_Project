import "../css/Song.css";
import { TimeContext } from "../../contexts/TimeContext";
import { useContext } from "react";
import { QueueContext } from "../../contexts/QueueContext";
import { LyricsViewer } from "../../Components/jsx/LyricsViewer";

export function Song({ song }) {
  const { queueShuffle, setQueueShuffle } = useContext(QueueContext);
  const { time } = useContext(TimeContext);
  
  if (!song) {
    return (
      <div className="sorry-text">
        <h1>There is no song, please choose it first!</h1>;
      </div>
    );
  }
  return (
    <div className="song-card">
      <div className="song-container">
        <img src={song.img} className="song-image" alt={song} />
        <h1 className="song-name">{song.name}</h1>
        <h5 className="song-author">{song.author} </h5>
        <div>
          <p>{time}</p>
          <h5>{song.playCount}- times clicked on song</h5>
        </div>
      </div>
      {queueShuffle.length !== 0 && (
        <div className="queue-container">
          <h1 className="queue-name">Current queue</h1>
          <div className="queue-inner-container">
            {queueShuffle.map((song) => {
              return (
                <div className="queue-song" key={song.id}>
                  {song.id === queueShuffle[0].id && <h1 className="active">Next:</h1>}
                  <img src={song.img} className="queue-song-img" />
                  <h1 className={song.id === queueShuffle[0].id ? "active" : ""}>
                    {song.name}
                  </h1>
                  <img
                    src="images/cross.webp"
                    className="cross"
                    alt="cross"
                    onClick={() =>
                      setQueueShuffle(
                        queueShuffle.filter((s) => s.id !== song.id),
                      )
                    }
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}


    
    </div>
  
  );
}
