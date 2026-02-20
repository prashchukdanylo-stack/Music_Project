export function Player({
  isPlaying,
  playTrack,
  audioRef,
  song,
  progress,
  setProgress,
  time,
}) {
  return (
    <div className="song-container">
      <img src={song.img} className="song-image"></img>
      <p className="song-name">{song.name}</p>

      <div>
        <input
          type="range"
          min="0"
          max="100"
          onChange={(event) => {
            console.log(audioRef.current.duration);
            const volume = Number(event.target.value) / 100;
            audioRef.current.volume = volume;
          }}
        ></input>

        <img
          className="play-button"
          src={isPlaying ? "images/pause.png" : "images/play.png"}
          onClick={playTrack}
        ></img>

        <input
          type="range"
          min="0"
          max="100"
          value={progress || 0}
          onChange={(event) => {
            const duration = audioRef.current.duration;
            const newTime = (event.target.value / 100) * duration;
            audioRef.current.currentTime = newTime;
            setProgress(event.target.value);
          }}
        ></input>
        <p>{time}</p>
      </div>
    </div>
  );
}
