import { SongsGrid } from "../../Components/jsx/SongsGrid";
import "../css/Author.css";

export function Author({
  authorInfo,
  songs,
  song,
  setFavourite,
  favourite,
  chooseSong,
  authors,
  setQueueShuffle,
}) {
  const author = authors.find((a) => a.author === authorInfo.author);
  const songsToRender = songs.filter(
    (song) => song.author === authorInfo.author,
  );

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
      <SongsGrid
        songsToRender={songsToRender}
        chooseSong={chooseSong}
        setQueueShuffle={setQueueShuffle}
        favourite={favourite}
        setFavourite={setFavourite}
        song={song}
      />
    </div>
  );
}
