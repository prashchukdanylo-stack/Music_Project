import "../css/Ranges.css";

export const Ranges = ({
  volume,
  audioRef,
  setVolume,
  duration,
  setProgress,
  time,
  isPlayerClosed,
  progress,
  openSong,
}) => {
  return (
    <div className="player-ranges">
      <div className="volume">
        <input
          className="volume-range"
          type="range"
          min="0"
          max="100"
          value={volume * 100}
          onChange={(event) => {
            const volume = Number(event.target.value) / 100;
            audioRef.current.volume = volume;
            setVolume(volume);
            localStorage.setItem("volume", JSON.stringify({ volume: volume }));
          }}
        ></input>
        <p className="player-time">Volume {Math.floor(volume * 100)}%</p>
      </div>
      <div className="progress">
        <input
          className="progress-range"
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={(event) => {
            const newTime = (event.target.value / 100) * duration;
            audioRef.current.currentTime = newTime;
            setProgress(Number(event.target.value));
          }}
        ></input>
        <p className="player-time">{time}</p>
      </div>
      <img
        src={
          import.meta.env.BASE_URL +
          (isPlayerClosed ? "images/close.webp" : "images/open.webp")
        }
        alt="open button"
        className="play-button close-open"
        onClick={openSong}
      />
    </div>
  );
};
