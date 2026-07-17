import { useContext, useState, useMemo, useEffect, useRef} from "react";
import "../css/SongsList.css";
import { SongsGrid } from "../../Components/jsx/SongsGrid.jsx";
import { PlayerContext } from "../../contexts/PlayerContext.jsx";
import emitter from "../../utils/eventBus.js";
import logger from "../../utils/logger.js";
export function SongsList({
  songs,
  priorityQueue
}) {
  const {chooseSong} = useContext(PlayerContext);
  const [search, setSearch] = useState("");
  const searchRef = useRef(null);
  useEffect(()=> {

    const handleFocus = () => {
      searchRef.current.focus();
    }

    emitter.on("openInput", handleFocus);

    return () => emitter.off("openInput", handleFocus);
  },[]);

  const songsToRender = useMemo(()=> {
    if (!search) return songs;

    return songs.filter((song)=> song.name.toLowerCase().includes(search.toLowerCase()));
  }, [search, songs]);

  
  const highestPrioritySong = () => {
    const song = priorityQueue.current.peek("highest");
    
    if (song) {
      chooseSong(song.item, songsToRender);
      priorityQueue.current.dequeue("highest");
    }
    return song;
  };

  const lowestPrioritySong = () => {
    const song = priorityQueue.current.peek("lowest");
    if (song) {
      chooseSong(song.item, songsToRender);
      priorityQueue.current.dequeue("lowest");
    }
    return song;
  };

  return (
    <>
      <div className="songs-list-header">
        <input
        ref={searchRef}
          placeholder="Search song"
          className="songs-list-search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        ></input>
        <div>
        <img
          onClick={logger(highestPrioritySong, "Highest Priority Song")}
          src={`${import.meta.env.BASE_URL}images/top.webp`}
          className="priority-button"
        ></img>
        <img
          onClick={logger(lowestPrioritySong, "Lowest Priority Song")}
          src={`${import.meta.env.BASE_URL}images/bad.webp`}
          className="priority-button"
        ></img>
        </div>
      </div>
      <SongsGrid
        songsToRender={songsToRender}
        chooseSong={chooseSong}
      />
      <div style={{height:"200px"}}></div>
    </>
  );
}
