import { useEffect, useState, useContext, useRef, useCallback } from "react";
import { PlayerContext } from "../../contexts/PlayerContext";
import { useNavigate, useLocation } from "react-router-dom";
import { formatTime } from "../../utils/formatTime";
import "../css/Player.css";
import { TimeContext } from "../../contexts/TimeContext";
import { QueueContext } from "../../contexts/QueueContext";
import emitter from "../../utils/eventBus";
import { useStorage } from "../../hooks/useStorage";
import logger from "../../utils/logger";
import { LyricsViewer } from "./LyricsViewer";
import { PlayerControls } from "./PlayerControls";
import { SongDetails } from "./SongDetails";
import { Ranges } from "./Ranges";
export function Player({
  currentIndex,
  player,
  setCurrentIndex,
  trackGenRef,
  setAuthor,
  queueShuffle,
  setQueueShuffle,
  setIsPlayerClosed,
  isPlayerClosed,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const [volume, setVolume] = useState(1);
  const [prevPath, setPrevPath] = useStorage("previousPath", {
    path: "/",
    wasClosed: true,
  });
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
    if (location.pathname !== "/song") {
      setIsPlayerClosed(true);
    } else {
      setIsPlayerClosed(false);
    }
  }, [location.pathname, setIsPlayerClosed]);

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
      return "Play";
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
      return "Pause"
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
        setPlayer((prev) =>{
          const newArr = [...prev, queuedSong];
          setCurrentIndex(newArr.length - 1);
          return newArr;
        });
        
        setSong(queuedSong);
        setIsPlaying(true);
        return queuedSong;
      }
      const newSong = trackGenRef.current.next().value;
      if (!newSong) return;

      setSong(newSong);
      setIsPlaying(true);

      setPlayer(
        logger((prev) => {
          const newArr = [...prev, newSong];
          setCurrentIndex(newArr.length - 1);

          return newArr;
        }, "Player updated with new song"),
      );

      return newSong;
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
    return song;
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
    song
  ]);

  const handleSongChange = useCallback(
    (direction) => {
      if (direction === "next") {
        nextSong();
      } else if (direction === "prev") {
        previousSong();
      }
      emitter.emit("timeExpire", { time: Date.now() });
 
      return song
    },
    [nextSong, previousSong, song]
  );

  const handleEnded = useCallback(() => {
    handleSongChange("next");
    emitter.emit("songEnded", { songId: song.id });
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
      const goBack =
        prevPath?.path && prevPath.path !== "/song" ? prevPath.path : "/";
      navigate(goBack);
    } else {
      setPrevPath({ path: location.pathname });
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

      
      <SongDetails
        song={song}
        openSong={openSong}
        navigate={navigate}
        setAuthor={setAuthor}
        handleSongChange={handleSongChange}
        isPlaying={isPlaying}
        playSong={playSong}
      />
      <Ranges
        volume={volume}
        audioRef={audioRef}
        setVolume={setVolume}
        duration={duration}
        setProgress={setProgress}
        time={time}
        isPlayerClosed={isPlayerClosed}
        progress={progress}
        openSong={openSong}
      />
    </div>
  );
}
