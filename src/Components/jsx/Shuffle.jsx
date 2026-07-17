import { useEffect, useContext, useCallback } from "react";
import emitter from "../../utils/eventBus";
import logger from "../../utils/logger";
import "../../pages/css/Song.css";
import { PlayerContext } from "../../contexts/PlayerContext";
import { QueueContext } from "../../contexts/QueueContext";
import { LibraryContext } from "../../contexts/LibraryContext";
export function Shuffle() {
  const {
    shuffle, setShuffle, song
  } = useContext(PlayerContext);

  const { setPlayer, setCurrentIndex } = useContext(QueueContext);
  const { songs } = useContext(LibraryContext);

  const shuffleSongs = useCallback(() => {
    const newShuffle = !shuffle;
    setShuffle(newShuffle);
    return newShuffle ? "On" : "Off";
    
  }, [setShuffle, shuffle]);

  useEffect(() => {
    const onShuffle = () => shuffleSongs();
    if (!shuffle) {
      setPlayer(songs);
      setCurrentIndex(songs.findIndex((s) => s.id === song.id));
    }
    emitter.on("toggleShuffle", onShuffle);

    return () => {
      emitter.off("toggleShuffle", onShuffle);
    };


  }, [shuffleSongs, setCurrentIndex, setPlayer, songs, song,shuffle]);

  return (
    <img
      className="play-button"
      onClick={logger(shuffleSongs, "shuffle: ")}
      src={import.meta.env.BASE_URL + (shuffle ? "images/shuffleOn.webp" : "images/shuffleOff.webp")}
    ></img>
  );
}
