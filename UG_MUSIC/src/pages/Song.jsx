import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { formatTime } from "../utils/formatTime";
import "./Song.css"
export function Song({
  isPlaying,
  song,
  setIsPlaying,
}) {
  const [progress, setProgress] = useState(0);
  const [time, setTime] = useState("0:00 / 0:00");
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);
  const navigate = useNavigate();
 
  useEffect(() => {
    if (!audioRef.current || !song) return;

    const audio = audioRef.current;
    audio.src = song.audio;
    audio.load();

  
    

    const handleMetaData = () => {
      const duration = audio.duration;
      if (duration && !isNaN(duration)) {
        setDuration(duration);
        setTime(`0:00 / ${formatTime(duration)}`);
      }
    };

    audio.addEventListener("loadedmetadata", handleMetaData);
    return () => {
      audio.removeEventListener("loadedmetadata", handleMetaData);
    };
  }, [song, audioRef]);

  const playSong = () => {
    setIsPlaying((prev) => {
      if (prev === false) {
        audioRef.current.play();
        return true;
      } else {
        audioRef.current.pause();
        return false;
      }
    });
  };

  const trackDuration = () => {
    const audio = audioRef.current;
    if (!audio || !duration || isNaN(duration)) return;

    const currentTime = audio.currentTime;
    const safeCurrentTime = Math.min(currentTime, duration);

    setProgress((safeCurrentTime / duration) * 100);
    setTime(`${formatTime(safeCurrentTime)} / ${formatTime(duration)}`);
  };


const resetThings = () => {
  
  setProgress(0);
    setTime("0:00 / 0:00");
    setDuration(0);
}
  return (
    <>
    <audio
          id="id"
          ref={audioRef}
          type="audio/mpeg"
          onEnded={resetThings}
          onTimeUpdate={trackDuration}
          onCanPlay={() => {
          if (isPlaying) audioRef.current.play();
        }}
        ></audio>

      <button className = "back-button" onClick={() => navigate("/")}> GO BACK GOME</button>

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
          min="0"
          max="100"
          value={progress}
          onChange={(event) => {
            const newTime = (event.target.value / 100) * duration;
            audioRef.current.currentTime = newTime;
            setProgress(Number(event.target.value));
          }}
        />
        <p>{time}</p>
      </div>
    </div>
    </>
  );
}
