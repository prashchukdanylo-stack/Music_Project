import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatTime } from "../../utils/formatTime";
import { Shuffle } from "./Shuffle";
import "../css/Player.css";

export function Player({
  audioRef,
  song,
  songs,
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
  randomTrackGenerator,
  setAuthor,
  queueChoose,
  setQueueChoose
}) {
  const navigate = useNavigate();
  const [volume, setVolume] = useState(1);

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
        console.log("Volume set to:", audioRef.current.volume);
      }
    };

    audio.addEventListener("loadedmetadata", handleMetaData);
    return () => {
      audio.removeEventListener("loadedmetadata", handleMetaData);
    };
  }, [song, audioRef, setDuration, setTime, setProgress]);

  useEffect(() => {
    const handleKeyDown = (e) => {
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
  }, []);

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
    localStorage.setItem("time", JSON.stringify({
      time: currentTime,
      songId: song.id
    }));
  };

  const nextSong = () => {
    setProgress(0);
      setTime("0:00 / 0:00");
      setDuration(0);

    if (shuffle) {

      if(queueChoose.length > 0) {
        const queuedSong = queueChoose[0];
        setQueueChoose(prev => prev.slice(1));
        setCurrentSongPlaylist(prev => [...prev, queuedSong]);
         setCurrentIndex(currentSongPlaylist.length);
        setSong(queuedSong);
        setIsPlaying(true);
        return;
      }
      const newSong = trackGenRef.current.next().value;
      if (!newSong) return;

      setSong(newSong);
      setIsPlaying(true);

      setCurrentSongPlaylist((prev) => { 
        const newArr = [...prev, newSong];
         setCurrentIndex(newArr.length - 1); 
         console.log(currentSongPlaylist);
         return newArr;
         });
         
      return;
    };

    if (currentIndex < currentSongPlaylist.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setSong(currentSongPlaylist[nextIndex]);
      setIsPlaying(true);

      
    }
  };

  const previousSong = () => {
   
    if (currentIndex <= 0) return;
    
     if (shuffle) {
      setCurrentSongPlaylist(prev => prev.slice(0, -1));
    }
    setProgress(0);
    setTime("0:00 / 0:00");
    setDuration(0);

    const previousIndex = currentIndex - 1;
    setCurrentIndex(previousIndex);
    setSong(currentSongPlaylist[previousIndex]);
    setIsPlaying(true);
  };

  const handleEnded = () => {
    nextSong();
    localStorage.setItem("timeExpire", Date.now() + 600000);
  };


  useEffect(() => {
    const handleEvent = (e) => {
      if (e.code === "ArrowRight") {
        e.preventDefault();
        handleEnded();
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        previousSong();
      }
    }

    window.addEventListener("keydown", handleEvent);
    return () => window.removeEventListener("keydown", handleEvent);
  }, [song]);

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
        <Shuffle
          trackGenRef={trackGenRef}
          setSong={setSong}
          setIsPlaying={setIsPlaying}
          setCurrentSongPlaylist={setCurrentSongPlaylist}
          setCurrentIndex={setCurrentIndex}
          shuffle={shuffle}
          setShuffle={setShuffle}
          currentSongPlaylist={currentSongPlaylist}
          randomTrackGenerator={randomTrackGenerator}
          song={song}
          songs={songs}
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
          <h5 className="player-song-author" onClick={
            () => {navigate("/author"); 
            setAuthor(song);
            }}>
            {song.author}
          </h5>
        </div>
        <img
          className="player-song-heart"
          src={favourite.has(song.id) ? "images/heart-active.png" : "images/heart.png"}
          onClick={() => {
            setFavourite((prev) => {
              const newSet = new Set(prev);
              newSet.has(song.id) ? newSet.delete(song.id) : newSet.add(song.id);
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
            value = {volume * 100}
            onChange={(event) => {
              const volume = Number(event.target.value) / 100;
              audioRef.current.volume = volume;
              setVolume(volume);
              localStorage.setItem("volume", JSON.stringify({ volume: volume}));
              console.log(audioRef.current.volume)
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