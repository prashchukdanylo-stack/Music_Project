import { useEffect, useContext, useCallback } from "react";
import emitter from "../../utils/eventBus";
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
    setShuffle((prev)=> !prev);
  }, [setShuffle]);

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
      onClick={shuffleSongs}
      src={shuffle ? "/images/shuffleOn.png" : "/images/shuffleOff.png"}
    ></img>
  );
}
