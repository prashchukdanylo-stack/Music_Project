import { useContext, memo } from "react";
import { PlayerContext } from "../../contexts/PlayerContext";
import { QueueButton } from "./QueueButton";
import { LibraryContext } from "../../contexts/LibraryContext";

export const SongCard = memo(({songToRender, songsToRender}) => {
    const {favourite, setFavourite} = useContext(LibraryContext);
  const {song, chooseSong} = useContext(PlayerContext);

    return (
        <div
                key={songToRender.id}
                className={
                  songToRender.id === song?.id
                    ? "songlist-card-active"
                    : "songlist-card"
                }
                onClick={() => {
                  chooseSong(songToRender, songsToRender);
                }}
              >
                <img src={songToRender.img} className="songs-list-img" />
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
              </div>
    );
});