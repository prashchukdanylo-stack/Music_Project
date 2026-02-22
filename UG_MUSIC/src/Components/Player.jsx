import { useState, useEffect } from "react";
import { formatTime } from "../utils/formatTime";
import "./Player.css"
export function Player({
  isPlaying,
  playSong,
  audioRef,
  song,
  onEnded,
}) {
  const [progress, setProgress] = useState(0);
  const [time, setTime] = useState('');

  //getting duration of track to manipulate progress
  const trackDuration = () => {
    if (!audioRef.current) return;
    const duration = audioRef.current.duration;
    const currentTime = audioRef.current.currentTime;

    if (!duration || isNaN(duration)) return;
    setTime(`${formatTime(currentTime)} / ${formatTime(duration)}`);
    setProgress((currentTime / duration) * 100);
  };

  useEffect(() => {
  if (!audioRef.current || !song) return;

  audioRef.current.src = song.audio;
  audioRef.current.play();
}, [song, audioRef]);

  return (
    <>
    <audio
          id="id"
          ref={audioRef}
          type="audio/mpeg"
          onEnded={onEnded}
          onTimeUpdate={trackDuration}
          onLoadedMetadata={trackDuration}
        ></audio>

    <div className="song-container">
      <img src={song.img} className="song-image"></img>
      <p className="song-name">{song.name}</p>

      <div>
        <input
          className="volume-range"
          type="range"
          min="0"
          max="100"
          onChange={(event) => {
            const volume = Number(event.target.value) / 100;
            audioRef.current.volume = volume;
          }}
        ></input>

        <img
          className="play-button"
          src={isPlaying ? "images/pause.png" : "images/play.png"}
          onClick={playSong}
        ></img>

        <input
        className="progress-range"
          type="range"
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
    </>
  );
}
