import { useEffect } from "react";
import "../../pages/css/Song.css";
export function Shuffle({ shuffle, setShuffle }) {
  const shuffleSongs = () => {
    if (!shuffle) {
      setShuffle(true);
    } else {
      setShuffle(false);
    }
  };

  useEffect(() => {
    const handleEvent = (e) => {
      if (e.code === "KeyS") {
        e.preventDefault();
        shuffleSongs();
      }
    };
    window.addEventListener("keydown", handleEvent);
    return () => {
      window.removeEventListener("keydown", handleEvent);
    };
  });

  return (
    <img
      className="play-button"
      onClick={shuffleSongs}
      src={shuffle ? "/images/shuffleOn.png" : "/images/shuffleOff.png"}
    ></img>
  );
}
