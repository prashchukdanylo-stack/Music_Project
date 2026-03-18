import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./SongsList.css";
export function SongsList({
  songs,
  setProgress,
  setTime,
  setDuration,
  setSong,
  setIsPlaying,
  setCurrentSongPlaylist,
  setCurrentIndex,
  trackGenRef,
  shuffle,
  setShuffle,
}) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
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
    setIsPlaying(true);
  };
  const filteredSong = () => {
    return songs.filter((song) => {
      return song.name.toLowerCase().includes(search.toLowerCase());
    });
  };

  const shuffleSongs = () => {
    const randomTrack = () => {
      if (!trackGenRef.current) throw new Error("Track is not ready yet");
      const song = trackGenRef.current.next().value;
      if (!song) return;
      setSong(song);
      setIsPlaying(true);
      setCurrentSongPlaylist((prev) => {
        const newArr = [...prev, song];
        setCurrentIndex(newArr.length - 1);
        return newArr;
      });
    };

    if (!shuffle) {
      setShuffle(true);
      randomTrack();
    } else {
      setShuffle(false);
    }
  };

  const songsToRender = search ? filteredSong() : songs;
  return (
    <>
      <div className="songs-list-header">
        <button className="back-button" onClick={() => navigate("/")}>
          Go back
        </button>
        <input
          placeholder="Search song"
          className="songs-list-search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        ></input>
        <img
          className="back-button"
          onClick={shuffleSongs}
          src={shuffle ? "/images/shuffleOn.png" : "/images/shuffleOff.png"}
        ></img>
      </div>
      {songsToRender.length === 0 ? (
        <div className = "sorry-text">
        <h1>Sorry, there is no song like this! Check for mistakes in your input.</h1>
        </div>
      ) : (
        <div className="songs-grid">
          {songsToRender.map((song) => {
            return (
              <div
                key={song.id}
                className="song-card"
                onClick={() => chooseSong(song)}
              >
                <img src={song.img} className="songs-list-img" />
                <div className="song-info">
                  <h3>{song.name}</h3>
                  <h5>{song.duration}</h5>
                </div>
                <h5 className="song-author">{song.author}</h5>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
