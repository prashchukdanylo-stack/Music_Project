import "../css/Song.css";

export function Song(song, time) {
  
  return (
    <>
      <div className="song-card">
        <div className="song-container">
          <img src={song.img} className="song-image"></img>
          <h1 className="song-name">{song.name}</h1>
          <h5 className="song-author">{song.author} </h5>
          <div>
            <p>{time}</p>
            <h5>{song.playCount}- times clicked on song</h5>
          </div>
        </div>
      </div>
    </>
  );
}
