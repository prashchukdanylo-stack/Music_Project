import { useState } from "react";
import "./SongsList.css";
export function SongsList({
  song,
  songs,
  setProgress,
  setTime,
  setDuration,
  setSong,
  setIsPlaying,
  setCurrentSongPlaylist,
  setCurrentIndex,
  setCurrentGenerator,
  setPath,
  favourite,
  setFavourite,
  setSongs
}) {
  const [search, setSearch] = useState("");

  const chooseSong = (song) => {
    setProgress(0);
    setTime("0:00 / 0:00");
    setDuration(0);
    setPath("list");

    const updatedSongs =  songs.map((s) => {
      if (s.id === song.id) {
        return {
          ...s,
          playCount: (s.playCount || 0) + 1
        };
      }
      return s;
    })

    setSongs(updatedSongs);

    const updatedSong = updatedSongs.find((s)=> s.id === song.id);

    const index = songsToRender.findIndex((s) => s.id === song.id);
    setCurrentGenerator(updatedSongs);
    setSong(updatedSong);
    setCurrentSongPlaylist(updatedSongs);
    setCurrentIndex(index);
    setIsPlaying(true);
  };
  const filteredSong = () => {
    return songs.filter((song) => {
      return song.name.toLowerCase().includes(search.toLowerCase());
    });
  };

  const songsToRender = search ? filteredSong() : songs;
  return (
    <>
      <div className="songs-list-header">
        <input
          placeholder="Search song"
          className="songs-list-search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        ></input>
      </div>
      {songsToRender.length === 0 ? (
        <div className="sorry-text">
          <h1>
            Sorry, there is no song like this! Check for mistakes in your input.
          </h1>
        </div>
      ) : (
        <div className="songs-grid">
          {songsToRender.map((songToRender) => {
            return (
              <div
                key={songToRender.id}
                className={
                  songToRender === song
                    ? "songlist-card-active"
                    : "songlist-card"
                }
                onClick={() => chooseSong(songToRender)}
              >
                <img src={songToRender.img} className="songs-list-img" />
                <div className="song-info">
                  <h3>{songToRender.name}</h3>
                  <h5>{songToRender.duration}</h5>
                </div>
                <div className="song-info">
                  <h5 className="song-author">{songToRender.author}</h5>
                  <img
                    className="player-song-heart"
                    src={
                      favourite.has(songToRender.id)
                        ? "images/heart-active.png"
                        : "images/heart.png"
                    }
                    onClick={(event) => {
                      event.stopPropagation();
                      setFavourite((prev) => {
                        const newSet = new Set(prev);
                        newSet.has(songToRender.id)
                          ? newSet.delete(songToRender.id)
                          : newSet.add(songToRender.id);
                        return newSet;
                      });
                    }}
                  ></img>
                </div>
              </div>
            );
          })}
        </div>
      )

      }
      <div className = "bottom"></div>
    </>
  );
}
