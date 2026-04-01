
export function Favourite({
  favourite,
  setProgress,
  setTime,
  setDuration,
  setSong,
  setCurrentSongPlaylist,
  setCurrentIndex,
  setIsPlaying,
  songs,
  setCurrentGenerator,
  setPath,
  song,
  setFavourite,
  setSongs
}) {
  const songsMap = new Map(songs.map(song => [song.id, song]));
  let songsToRender = Array.from(favourite).map(id => songsMap.get(id)).filter(Boolean);
  console.log(songsToRender);

  const chooseSong = (song) => {
    setProgress(0);
    setTime("0:00 / 0:00");
    setDuration(0);
    setPath("fav")

    const updatedSongs = songs.map((s) => {
      if (s.id === song.id) {
        return {
          ...s,
          playCount: (s.playCount || 0) + 1
        };
      };
      return s;
    })

    setSongs(updatedSongs);
    
    const updatedSong = updatedSongs.find((s) => s.id === song.id);
    
    const index = songsToRender.findIndex(s => s.id ===song.id );
     setSong(updatedSong); 
     setCurrentSongPlaylist(songsToRender); 
     setCurrentGenerator(songsToRender);
      setCurrentIndex(index);                                      
    
    
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
          {songsToRender.map((songToRender) => {
            return (
              <div
                key={songToRender.id}
                className={songToRender === song ? "songlist-card-active" : "songlist-card"}
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
      )}
    </>
  );
}
