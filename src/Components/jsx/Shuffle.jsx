import { useEffect, useContext } from "react";
import "../../pages/css/Song.css";
import { PlayerContext } from "../../contexts/PlayerContext";
export function Shuffle() {
  const {
    shuffle, setShuffle
  } = useContext(PlayerContext);
  const shuffleSongs = () => {
    setShuffle((prev)=> !prev);
  };

  useEffect(() => {
    const handleEvent = (e) => {
      if (e.code === "KeyS" && e.target.tagName !== "INPUT") {
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
