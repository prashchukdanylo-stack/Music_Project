import "../pages/Song.css"
export function Shuffle({
  trackGenRef,
  setSong,
  setIsPlaying,
  setCurrentSongPlaylist,
  setCurrentIndex,
  shuffle,
  setShuffle,
}) {
  const shuffleSongs = () => {
    const randomTrack = () => {
      if (!trackGenRef.current) throw new Error("Track is not ready yet");
      const song = trackGenRef.current.next().value;
      if (!song) return;
      if (shuffle){
        setSong(song);
        setIsPlaying(true);
      };
      setCurrentSongPlaylist((prev) => {
        const newArr = [...prev, song];
        setCurrentIndex(newArr.length - 1);
        return newArr;
      });
    };

    if (!shuffle) {
      randomTrack();
      setShuffle(true);
    } else {
      setShuffle(false);
    }
  };

  return (
    <img
      className="play-button"
      onClick={shuffleSongs}
      src={shuffle ? "/images/shuffleOn.png" : "/images/shuffleOff.png"}
    ></img>
  );
}
