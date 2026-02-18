import { useState, useRef, useEffect } from "react";
import "./HomePage.css";

export const HomePage = () => {

  const [button, setButton] = useState("Play Track");
  const [songs, setSongs] = useState([]);

  const audioRef = useRef(null);
  const trackGenRef = useRef(null);

  //get access to songs
  useEffect(() => {
    const getSongsData = async () => {
      const response = await fetch("/songs.json");
      const data = await response.json();
      setSongs(data);
    };

    getSongsData();
  }, []);

  useEffect(() => {
    if (songs.length > 0) {
      trackGenRef.current = (function* () {
        while (true) {
          const numberOfSongs = Math.floor(Math.random() * songs.length);
          const randomSong = songs[numberOfSongs].audio;
          yield randomSong;
        }
      })();
    }
  }, [songs]);

  const randomTrack = () => {
    if (!trackGenRef.current) throw new Error("Track is not ready yet");
    const song = trackGenRef.current.next().value;
    audioRef.current.src = song;
    playTrack();
    
  };

  const playTrack = () => {
    setButton((prev)=> {
      if (prev === "Play Track") {
        audioRef.current.play();
        return "Stop Track";
      } else {
        audioRef.current.pause();
        return "Play Track";
      }
    })
  }
  

  return (
    <>
      <p className="welcome-text">Welcome to Fluire!</p>
      <div className="welcome-about-container">
        <p className="welcome-about">
          This is a beautiful place to chill and throw away all your problems
          and just feel hapiness!Here, the music flows like a gentle river,
          carrying your thoughts away and wrapping you in a cocoon of sound.
          Every beat, every note, is designed to lift your spirit and let your
          soul breathe. The colors, the rhythm, the atmosphere—they all blend
          together to create a sanctuary where worries fade and only the joy of
          the moment remains. Whether you want to dance like nobody’s watching,
          relax with soothing melodies, or discover new tunes that speak to your
          heart, this is the space where happiness isn’t just a feeling—it’s an
          experience. Here, every track is a doorway to peace, every playlist a
          companion for your mind to wander, and every sound a reminder that
          life can be simple, beautiful, and full of bliss.
        </p>
      </div>
      <div className="play-button-container">
        <button className="play-button" onClick={playTrack}>
          {button}
        </button>
        <button className="play-button" onClick={randomTrack}> Random song</button>
        <audio id="id" ref={audioRef} type="audio/mpeg"></audio>
      </div>
    </>
  );
};
