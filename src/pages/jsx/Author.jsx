import {useMemo} from "react";
import { SongsGrid } from "../../Components/jsx/SongsGrid";
import "../css/Author.css";

export function Author({
  author,
  songs = [],
  authors = [],
}) {
  
  
  const songsToRender = useMemo(() => {
    if (!author) return [];
    return songs.filter((song) => song.author === author);
  }, [author, songs]);
  
  const authorInfo = useMemo(()=> {
    if (!author) return null;
    return authors.find((autho)=>autho.author === author);
  }, [author, authors]);

  if (!author) {
    return(
      <div className="sorry-text">
        <h1>We don't know what singer are you searching for!</h1>
      </div>
    )
  }
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
