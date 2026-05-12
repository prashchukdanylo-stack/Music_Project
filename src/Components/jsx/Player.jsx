import { useEffect, useState, useContext, useRef, useCallback } from "react";
import { PlayerContext } from "../../contexts/PlayerContext";
import { useNavigate, useLocation } from "react-router-dom";
import { formatTime } from "../../utils/formatTime";
import { Shuffle } from "./Shuffle";
import "../css/Player.css";
import { TimeContext } from "../../contexts/TimeContext";
import { QueueContext } from "../../contexts/QueueContext";
import emitter from "../../utils/eventBus";
import { useStorage } from "../../hooks/useStorage";
import logger from "../../utils/logger";
import { LyricsViewer } from "./LyricsViewer";
export function Player({
  currentIndex,
  player,
  setCurrentIndex,
  trackGenRef,
  setFavourite,
  favourite,
  setAuthor,
  queueShuffle,
  setQueueShuffle,
  setIsPlayerClosed,
  isPlayerClosed
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const [volume, setVolume] = useState(1);
  const [prevPath, setPrevPath] = useStorage("previousPath", { path: "/", wasClosed: true });
  const lastUsedTime = useRef(0);

  const {
    song,
    setSong,
    isPlaying,
    setIsPlaying,
    duration,
    setDuration,
    shuffle,
    audioRef,
  } = useContext(PlayerContext);
  const { setPlayer } = useContext(QueueContext);
  const { time, setTime, progress, setProgress } = useContext(TimeContext);
  
  useEffect(()=> {
    if (location.pathname !== "/song") {
      setIsPlayerClosed(true);
    } else {
      setIsPlayerClosed(false);
    }
  },[location.pathname, setIsPlayerClosed]);

  useEffect(() => {
    if (!audioRef.current || !song) return;

    const audio = audioRef.current;
    audio.src = song.audio;
    audio.load();

    setTime(`0:00 / ${song.duration}`);
    
    const handleMetaData = () => {
      const duration = audio.duration;
      if (duration && !isNaN(duration)) {
        setDuration(duration);
      }
      const savedTime = JSON.parse(localStorage.getItem("time"));
      const savedAudio = JSON.parse(localStorage.getItem("volume"));
      if (savedTime && savedTime.songId === song.id) {
        audio.currentTime = savedTime.time;
        setProgress((savedTime.time / duration) * 100);
        setTime(`${formatTime(savedTime.time)} / ${song.duration}`);
      } else {
        setTime(`0:00 / ${song.duration}`);
      }

      if (savedAudio) {
        audioRef.current.volume = savedAudio.volume;
        setVolume(savedAudio.volume);
      }
    };

    audio.addEventListener("loadedmetadata", handleMetaData);
    return () => {
      audio.removeEventListener("loadedmetadata", handleMetaData);
    };
  }, [song, audioRef, setDuration, setTime, setProgress]);

  const playSong = useCallback(async () => {
    if (audioRef.current.paused) {
      await audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [audioRef, setIsPlaying]);

  const trackDuration = () => {
    const audio = audioRef.current;
    if (!audio || isNaN(audio.duration)) return;

    const currentTime = audio.currentTime;
    const duration = audio.duration;

    setProgress((currentTime / duration) * 100);
    setTime(`${formatTime(currentTime)} / ${song?.duration || "0:00"}`);

    if (Math.abs(currentTime - lastUsedTime.current) > 5) {
      localStorage.setItem(
        "time",
        JSON.stringify({
          time: currentTime,
          songId: song.id,
        }),
      );
      lastUsedTime.current = currentTime;
    }
  };

  const nextSong = useCallback(() => {
    setProgress(0);
    setTime("0:00 / 0:00");
    setDuration(0);

    if (shuffle) {
      if (queueShuffle.length > 0) {
        const queuedSong = queueShuffle[0];
        setQueueShuffle((prev) => prev.slice(1));
        setPlayer((prev) => [...prev, queuedSong]);
        setCurrentIndex(player.length);
        setSong(queuedSong);
        setIsPlaying(true);
        return;
      }
      const newSong = trackGenRef.current.next().value;
      if (!newSong) return;

      setSong(newSong);
      setIsPlaying(true);

      setPlayer((prev) => {
        const newArr = [...prev, newSong];
        setCurrentIndex(newArr.length - 1);
        
        return newArr;
      });

      return;
    }

    if (currentIndex < player.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setSong(player[nextIndex]);
      setIsPlaying(true);
    }
  }, [
    player,
    currentIndex,
    queueShuffle,
    setCurrentIndex,
    setPlayer,
    setDuration,
    setIsPlaying,
    setProgress,
    setQueueShuffle,
    setSong,
    setTime,
    shuffle,
    trackGenRef
  ]);

  const previousSong = useCallback(() => {
    if (currentIndex <= 0) return;

    if (shuffle) {
      setPlayer((prev) => prev.slice(0, -1));
    }
    setProgress(0);
    setTime("0:00 / 0:00");
    setDuration(0);

    const previousIndex = currentIndex - 1;
    setCurrentIndex(previousIndex);
    setSong(player[previousIndex]);
    setIsPlaying(true);
  }, [
    player,
    currentIndex,
    setCurrentIndex,
    setPlayer,
    setDuration,
    setIsPlaying,
    setProgress,
    setSong,
    setTime,
    shuffle,
  ]);

   const handleSongChange = useCallback((direction) => {
    if (direction === "next") {
      nextSong()
    } else if (direction === "prev") {
      previousSong()
    }
    emitter.emit("timeExpire", {time: Date.now()});

  }, [nextSong, previousSong]);

  
  const handleEnded = useCallback(() => {
    handleSongChange("next");
    emitter.emit("songEnded", {songId: song.id});
    
  }, [handleSongChange, song.id]);

 

  useEffect(() => {

      const onNextSong = () => handleSongChange("next");
      const onPrevSong = () => handleSongChange("prev");
      const onTogglePlay = () => playSong();

      emitter.on("nextSong", onNextSong);
      emitter.on("previousSong", onPrevSong);
      emitter.on("togglePlay", onTogglePlay);
      return () => {
        emitter.off("nextSong", onNextSong);
        emitter.off("previousSong", onPrevSong);
        emitter.off("togglePlay", onTogglePlay);
      };
  }, [handleSongChange, playSong]);
   


  
  function openSong() {
   if (location.pathname === "/song") {
    const goBack = (prevPath?.path && prevPath.path !== "/song") ? prevPath.path : "/";
    navigate(goBack);
    
   } else {
    setPrevPath({path: location.pathname});
    navigate("/song");
   }
  }
 
  return (
    <div className="player-container">
      <audio
        id="id"
        ref={audioRef}
        type="audio/mpeg"
        onEnded={handleEnded}
        onTimeUpdate={trackDuration}
        onCanPlay={() => {
          if (isPlaying) audioRef.current.play();
        }}
      ></audio>
      <div>
        <img
          onClick={() => handleSongChange("prev")}
          src="/images/previous.png"
          className="play-button"
        ></img>

        <img
          className="play-button"
          src={isPlaying ? "images/pause.png" : "images/play.png"}
          onClick={playSong}
        ></img>
        <img
          onClick={() => handleSongChange("next")}
          src="/images/next.png"
          className="play-button"
        ></img>
        <Shuffle />
      </div>
      <div className="song-details">
        <img
          className="player-song-image"
          src={song.img}
          onClick={openSong}
        ></img>
        <div className="player-song-description">
          <h1 className="player-song-name">{song.name}</h1>
          <h5
            className="player-song-author"
            onClick={() => {
              navigate("/author");
              setAuthor(song.author);
            }}
          >
            {song.author}
          </h5>
        </div>
        <img
          className="player-song-heart"
          src={
            favourite.has(song.id)
              ? "images/heart-active.png"
              : "images/heart.png"
          }
          onClick={() => {
            setFavourite((prev) => {
              const newSet = new Set(prev);
              newSet.has(song.id)
                ? newSet.delete(song.id)
                : newSet.add(song.id);
              return newSet;
            });
          }}
        ></img>
        <button onClick={() => navigate("/lyrics")} className = "lyrics-button play-button"> See text</button>
      </div>
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
              localStorage.setItem(
                "volume",
                JSON.stringify({ volume: volume }),
              );
              console.log(audioRef.current.volume);
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
        <img src={isPlayerClosed ? "images/close.png": "images/open.png"} alt="open button"  className="play-button" onClick={openSong} />
      </div>
    </div>
  );
}
