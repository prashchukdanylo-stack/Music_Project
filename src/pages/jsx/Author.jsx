
import { SongsGrid } from "../../Components/jsx/SongsGrid";
import "../css/Author.css";

export function Author({
  author,
  songs = [],
  authors = [],
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
        <p className = "author-description">{authorInfo.description}</p>
      </div>
      <SongsGrid
        songsToRender={songsToRender}
      />
    </div>
  );
}
