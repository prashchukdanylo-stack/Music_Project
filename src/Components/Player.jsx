import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { formatTime } from "../utils/formatTime";
import { Shuffle } from "./Shuffle";
import "./Player.css";
export function Player({
  audioRef,
  song,
  setTime,
  setDuration,
  setIsPlaying,
  setProgress,
  currentIndex,
  currentSongPlaylist,
  setCurrentIndex,
  setCurrentSongPlaylist,
  setSong,
  shuffle,
  trackGenRef,
  isPlaying,
  setShuffle,
  progress,
  duration,
  time,
  setFavourite,
  favourite,
}) {
  const navigate = useNavigate();
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
    };

    audio.addEventListener("loadedmetadata", handleMetaData);
    return () => {
      audio.removeEventListener("loadedmetadata", handleMetaData);
    };
  }, [song, audioRef, setDuration, setTime]);

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
    if (!audio || isNaN(audio.duration)) return;

    const currentTime = audio.currentTime;
    const duration = audio.duration;

    setProgress((currentTime / duration) * 100);
    setTime(`${formatTime(currentTime)} / ${song?.duration || "0:00"}`);
  };

  const nextSong = () => {
    if (currentIndex < currentSongPlaylist.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setSong(currentSongPlaylist[nextIndex]);
      setIsPlaying(true);
      return;
    }

    if (shuffle) {
      setProgress(0);
      setTime("0:00 / 0:00");
      setDuration(0);
      if (!trackGenRef.current) throw new Error("Track is not ready yet");

      const newSong = trackGenRef.current.next().value;
      if (!newSong) return;

      setSong(newSong);
      setIsPlaying(true);

      setCurrentSongPlaylist((prev) => {
        const newArr = [...prev, newSong];
        setCurrentIndex(newArr.length - 1);
        return newArr;
      });

      return;
    }
  };

  const previousSong = () => {
    if (currentIndex <= 0) return;
    setProgress(0);
    setTime("0:00 / 0:00");
    setDuration(0);

    const previousIndex = currentIndex - 1;
    setCurrentIndex(previousIndex);
    setSong(currentSongPlaylist[previousIndex]);
    setIsPlaying(true);
  };
  return (
    <div className="player-container">
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
          onClick={nextSong}
          src="/images/next.png"
          className="play-button"
        ></img>
        <Shuffle
          trackGenRef={trackGenRef}
          setSong={setSong}
          setIsPlaying={setIsPlaying}
          setCurrentSongPlaylist={setCurrentSongPlaylist}
          setCurrentIndex={setCurrentIndex}
          shuffle={shuffle}
          setShuffle={setShuffle}
        />
      </div>
      <div className="song-details">
        <img
          className="player-song-image"
          src={song.img}
          onClick={() => navigate("/song")}
        ></img>
        <div className="player-song-description">
          <h1 className="player-song-name">{song.name}</h1>
          <h5 className="player-song-author">{song.author}</h5>
        </div>
        <img
          className="player-song-heart"
          src={favourite.has(song) ? "images/heart-active.png" : "images/heart.png"}
          onClick={() => {
            setFavourite(prev => {
              const newSet = new Set(prev);
              newSet.has(song) ? newSet.delete(song) : newSet.add(song);
              return newSet;
            })
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
            onChange={(event) => {
              const volume = Number(event.target.value) / 100;
              audioRef.current.volume = volume;
            }}
          ></input>
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
      </div>
    </div>
  );
}
