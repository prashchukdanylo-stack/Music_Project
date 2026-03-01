import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { formatTime } from "../utils/formatTime";
import "./Song.css"
export function Song({
  isPlaying,
  song,
  setIsPlaying,
  setSong,
  trackGenRef,
  currentSongPlaylist,
  setCurrentSongPlaylist,
  currentIndex,
  setCurrentIndex,
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


const nextSong = () => {
  
  setProgress(0);
    setTime("0:00 / 0:00");
    setDuration(0);
    if (currentIndex < currentSongPlaylist.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setSong(currentSongPlaylist[nextIndex]);
      setIsPlaying(true);
      return;
    };
    if (!trackGenRef.current) throw new Error("Track is not ready yet");
    const song = trackGenRef.current.next().value;
    if (!song) return;
    setSong(song);
    setIsPlaying(true);
    setCurrentSongPlaylist(prev => {
      const newArr = [...prev.slice(0, currentIndex + 1), song];
      setCurrentIndex(newArr.length - 1);
      return newArr;
    });
    console.log(currentSongPlaylist);
}

const previousSong = () => {
  if (currentIndex <=0) return;
  setProgress(0);
    setTime("0:00 / 0:00");
    setDuration(0);
    
    const previousIndex = currentIndex - 1;
    setCurrentIndex(previousIndex);
    setSong(currentSongPlaylist[previousIndex]);
    setIsPlaying(true);
}
  return (
    <>
    <audio
          id="id"
          ref={audioRef}
          type="audio/mpeg"
          onEnded={nextSong}
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
      <div>
        <button onClick={previousSong}>Previous song</button>
        <button onClick={nextSong}>Next song</button>
      </div>
    </div>
    </>
  );
}
