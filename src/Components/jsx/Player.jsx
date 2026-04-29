import { useEffect, useState, useContext, useRef, useCallback } from "react";
import { PlayerContext } from "../../contexts/PlayerContext";
import { useNavigate } from "react-router-dom";
import { formatTime } from "../../utils/formatTime";
import { Shuffle } from "./Shuffle";
import "../css/Player.css";
import { TimeContext } from "../../contexts/TimeContext";
import { QueueContext } from "../../contexts/QueueContext";

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
  const [volume, setVolume] = useState(1);
  
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
  

  useEffect(() => {
    if (!audioRef.current || !song) return;

    const audio = audioRef.current;
    audio.src = song.audio;
    audio.load();

    setTime(`0:00 / ${song.duration}`);
    console.log("okey");
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

  


  useEffect(() => {
    const handleKeyDown = (e) => {
      if ("INPUT" === e.target.tagName) return;
      if (e.code === "Space") {
        e.preventDefault();
        setIsPlaying((prev) => {
          if (prev === false) {
            audioRef.current.play();
            return true;
          } else {
            audioRef.current.pause();
            return false;
          }
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [audioRef,setIsPlaying]);

  const playSong = async () => {
    if (audioRef.current.paused) {
      await audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

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
        console.log(player);
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
    trackGenRef,
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

  const handleEnded = useCallback(() => {
    nextSong();
    localStorage.setItem("timeExpire", Date.now() + 600000);
  }, [nextSong]);

  useEffect(() => {
    const handleEvent = (e) => {
      if (e.code === "ArrowRight") {
        e.preventDefault();
        handleEnded();
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        previousSong();
      }
    };

    window.addEventListener("keydown", handleEvent);
    return () => window.removeEventListener("keydown", handleEvent);
  }, [handleEnded, previousSong]);


  function openSong() {
    const willBeClosed = !isPlayerClosed;
    setIsPlayerClosed(willBeClosed);

    if (!willBeClosed) {
      navigate("/song");
    } else {
      navigate(-1);
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
          onClick={previousSong}
          src="/images/previous.png"
          className="play-button"
        ></img>

        <img
          className="play-button"
          src={isPlaying ? "images/pause.png" : "images/play.png"}
          onClick={playSong}
        ></img>
        <img
          onClick={handleEnded}
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
