import { Heart } from "./Heart";
export const SongDetails = ({song, openSong, navigate, setAuthor}) => {
    return (
          <div className="song-details">
        <img
          className="player-song-image"
          src={song.img}
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