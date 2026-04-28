
import { SongCard } from "./SongCard";


export function SongsGrid({
  songsToRender
}) {

  
  return (
    <>
      {songsToRender.length === 0 ? (
        <div className="sorry-text">
          <h1>
            Sorry, there are no songs! Something truly bad happened!
          </h1>
        </div>
      ) : (
        <div className="songs-grid">
          {songsToRender.map((songToRender) => {
            return (
              <SongCard songToRender={songToRender} songsToRender={songsToRender} />
            );
          })}
        </div>
      )}
    </>
  );
}
