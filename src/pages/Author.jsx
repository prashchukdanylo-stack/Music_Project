import "./Author.css";

export function Author({
  authorInfo,
  songs,
  song,
  setFavourite,
  favourite,
  setSongs,
  setProgress,
  setTime,
  setDuration,
  setSong,
  setCurrentSongPlaylist,
  setIsPlaying,
  setCurrentGenerator,
  queue,
  authors
}) {

  const author = authors.find((a) => a.author === authorInfo.author);
  
console.log(author.img);
  const chooseSong = (song) => {
    setProgress(0);
    setTime("0:00 / 0:00");
    setDuration(0);
    

    const updatedSongs = songs.map((s) => {
      if (s.id === song.id) {
        return {
          ...s,
          playCount: (s.playCount || 0) + 1,
        };
      }
      return s;
    });

    setSongs(updatedSongs);

    const updatedSong = updatedSongs.find((s) => s.id === song.id);

    
    setSong(updatedSong);
    setCurrentSongPlaylist(updatedSongs.filter((s) => s.author === authorInfo.author));
    setCurrentGenerator(updatedSongs.filter((s) => s.author === authorInfo.author));
    

    setIsPlaying(true);
    queue.current.enqueue(updatedSong, updatedSong.playCount || 0);
    queue.current.print();
  };

  return (
    <div>
      <div className="author-page">
        <p className="author">{authorInfo.author}</p>
        <img
          className="author-img"
          src={author.img}
          alt={authorInfo.author}
        ></img>
      </div>

      <div className="author-songs">
        {songs
          .filter((song) => song.author === authorInfo.author)
          .map((songToRender) => {
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
                  <h5 className="song-author">
                    {songToRender.author}
                  </h5>
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
    </div>
  );
}
