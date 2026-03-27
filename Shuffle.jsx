import "../pages/Song.css"
export function Shuffle({
  trackGenRef,
  currentSongPlaylist,
  randomTrackGenerator,
  shuffle,
  setShuffle,
}) {
  const shuffleSongs = () => {
  

    if (!shuffle) {
      trackGenRef.current = randomTrackGenerator(currentSongPlaylist)();
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
