import { useEffect, useContext, useCallback } from "react";
import emitter from "../../utils/eventBus";
import "../../pages/css/Song.css";
import { PlayerContext } from "../../contexts/PlayerContext";
export function Shuffle() {
  const {
    shuffle, setShuffle
  } = useContext(PlayerContext);


  const shuffleSongs = useCallback(() => {
    setShuffle((prev)=> !prev);
  }, [setShuffle]);

  useEffect(() => {
    const onShuffle = () => shuffleSongs();
    emitter.on("toggleShuffle", onShuffle);

    return () => {
      emitter.off("toggleShuffle", onShuffle);
    };


  }, [shuffleSongs]);

  return (
    <img
      className="play-button"
      onClick={shuffleSongs}
      src={shuffle ? "/images/shuffleOn.png" : "/images/shuffleOff.png"}
    ></img>
  );
}
