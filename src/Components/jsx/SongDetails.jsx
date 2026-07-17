import { Heart } from "./Heart";
export const SongDetails = ({song, openSong, navigate, setAuthor}) => {
  console.log("Current song data:", import.meta.env.BASE_URL + song.img.slice(1)); // <--- Додайте цей рядок
console.log("Base URL:", import.meta.env.BASE_URL);
    return (
          <div className="song-details">
        <img
          className="player-song-image"
          src={`${import.meta.env.BASE_URL}${song.img}`}
          onClick={openSong}
        ></img>
        <div className="player-song-description">
          <h1 className="player-song-name">{song.name}</h1>
          <h5
            className="player-song-author"
            onClick={() => {
              navigate("/author");
              setAuthor(song.author);
            }}
          >
            {song.author}
          </h5>
        </div>
        
       <Heart songToRender = {song} />

        <button onClick={() => navigate("/lyrics")} className = "lyrics-button play-button"> See text</button>
      </div>
    );
}