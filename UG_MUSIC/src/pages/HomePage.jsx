import { useState, useRef } from "react";
import "./HomePage.css";
import babyShark from "/songs/babyshark.mp3";

export const HomePage = () => {
  const [button, setButton] = useState("Play track");
  const audioRef = useRef(null);

  const playTrack = () => {
    button === "Play track" ? setButton("Stop track") : setButton("Play track");
    button === "Play track" ? audioRef.current.play() : audioRef.current.pause();
  };
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
        <audio
            id="id"
          controls
          ref={audioRef}
          src={babyShark}
          type="audio/mpeg"
        ></audio>
      </div>
    </>
  );
};
