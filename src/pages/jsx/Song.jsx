import "../css/Song.css";
import { TimeContext } from "../../contexts/TimeContext";
import { useContext } from "react";
export function Song({song}) {
  
  const {time} = useContext(TimeContext);

  if (!song) {
    return(
      <div className="sorry-text">
        <h1>There is no song, please choose it first!</h1>;
      </div>
    )
  }
  return (
      <div className="song-card">
        <div className="song-container">
          <img src={song.img} className="song-image" alt={song} image />
          <h1 className="song-name">{song.name}</h1>
          <h5 className="song-author">{song.author} </h5>
          <div>
            <p>{time}</p>
            <h5>{song.playCount}- times clicked on song</h5>
          </div>
        </div>
      </div>
  );
}
