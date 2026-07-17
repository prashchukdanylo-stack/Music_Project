import { useContext, memo } from "react";
import { PlayerContext } from "../../contexts/PlayerContext";
import { QueueButton } from "./QueueButton";
import { LibraryContext } from "../../contexts/LibraryContext";
import logger from "../../utils/logger";
import { Heart } from "./Heart";

export const SongCard = memo(({songToRender, songsToRender}) => {
  const {song, chooseSong} = useContext(PlayerContext);


 
    return (
        <div
                key={songToRender.id}
                className={
                  songToRender.id === song?.id
                    ? "songlist-card-active"
                    : "songlist-card"
                }
                onClick={logger(() => {
                  return chooseSong(songToRender, songsToRender);
                }, "Chosen Song: ")}
              >
                <img src={import.meta.env.BASE_URL + songToRender.img} className="songs-list-img" />
                <div className="song-info">
                  <h3>{songToRender.name}</h3>
                  <h5>{songToRender.duration}</h5>
                </div>
                <div className="song-info">
                  <h5 className="song-author">{songToRender.author}</h5>
                  <div>
                    <QueueButton
                      songToRender={songToRender}
                    />
                   <Heart songToRender={songToRender} />
                  </div>
                </div>
              </div>
    );
});