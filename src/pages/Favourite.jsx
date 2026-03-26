import { useNavigate } from "react-router-dom";
export function Favourite({
  favourite,
  setProgress,
  setTime,
  setDuration,
  setSong,
  setCurrentSongPlaylist,
  setCurrentIndex,
  setIsPlaying,
  songs
}) {
  const songsToRender = songs.filter((song) => favourite.has(song.id));
  const navigate = useNavigate();

  const chooseSong = (song) => {
    setProgress(0);
    setTime("0:00 / 0:00");
    setDuration(0);

    const index = songsToRender.findIndex(s => s.id ===song.id )
    setSong(song);
    setCurrentSongPlaylist(songsToRender);
    setCurrentIndex(index);
    navigate("/song");
    setIsPlaying(true);
  };

  return (
    <>
      {songsToRender.length === 0 ? (
        <div className="sorry-text">
          <h1>
            Sorry, there are no songs! Choose the best songs on "Songs" page to see them here!
          </h1>
        </div>
      ) : (
        <div className="songs-grid">
          {songsToRender.map((song) => {
            return (
              <div
                key={song.id}
                className="songlist-card"
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
