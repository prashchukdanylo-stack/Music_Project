import { useNavigate } from "react-router-dom";
import "./SongsList.css";
export function SongsList({
  songs,
  setProgress,
  setTime,
  setDuration,
  setSong,
  setisPlaying,
  setCurrentSongPlaylist,
  setCurrentIndex,
}) {
  const navigate = useNavigate();

  const chooseSong = (song) => {
    setProgress(0);
    setTime("0:00 / 0:00");
    setDuration(0);

    setSong(song);
    setCurrentSongPlaylist((prev) => {
      const newArr = [...prev, song];
      setCurrentIndex(newArr.length - 1);
      return newArr;
    });

    navigate("/song");
    setisPlaying(true);
  };
  return (
    <>
      <button className="back-button" onClick={() => navigate("/")}>
        Go back
      </button>
      <div className="songs-grid">
        {songs.map((song) => {
          return (
            <div
              key={song.id}
              className="song-card"
              onClick={() => chooseSong(song)}
            >
              <h3>{song.name}</h3>
              <img src={song.img} className="songs-list" />
            </div>
          );
        })}
      </div>
    </>
  );
}
