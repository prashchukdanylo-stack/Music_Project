
import { SongsGrid } from "../../Components/jsx/SongsGrid";
import "../css/Author.css";

export function Author({
  author,
  songs = [],
  song,
  setFavourite,
  favourite,
  chooseSong,
  authors = [],
  setQueueShuffle,
  shuffle
}) {
  
  
  const songsToRender = songs.filter(
    (song) => song.author === author
  );
  const authorInfo = authors.find((autho)=>autho.author === author);

  return (
    <div>
      <div className="author-page">
        <p className="author">{author}</p>
        <img
          className="author-img"
          src={authorInfo.img}
          alt={author}
        ></img>
      </div>
      <SongsGrid
        songsToRender={songsToRender}
        chooseSong={chooseSong}
        setQueueShuffle={setQueueShuffle}
        favourite={favourite}
        setFavourite={setFavourite}
        song={song}
        shuffle={shuffle}
      />
    </div>
  );
}
