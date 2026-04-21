import { QueueButton } from "./QueueButton";
export function SongsGrid({
  songsToRender,
  song,
  chooseSong,
  setQueueShuffle,
  favourite,
  setFavourite,
  shuffle
}) {
  return (
    <>
      {songsToRender.length === 0 ? (
        <div className="sorry-text">
          <h1>
            Sorry, there are no songs! Choose the best songs on "Songs" page to
            see them here!
          </h1>
        </div>
      ) : (
        <div className="songs-grid">
          {songsToRender.map((songToRender) => {
            return (
              <div
                key={songToRender.id}
                className={
                  songToRender === song
                    ? "songlist-card-active"
                    : "songlist-card"
                }
                onClick={() => chooseSong(songToRender, songsToRender)}
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
                      setQueueShuffle={setQueueShuffle}
                      songToRender={songToRender}
                      shuffle={shuffle}
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
          })}
        </div>
      )}
    </>
  );
}
