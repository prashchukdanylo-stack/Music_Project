import { useContext, useState, useMemo, useEffect, useRef} from "react";
import "../css/SongsList.css";
import { SongsGrid } from "../../Components/jsx/SongsGrid.jsx";
import { PlayerContext } from "../../contexts/PlayerContext.jsx";


export function SongsList({
  songs,
  priorityQueue
}) {
  const {chooseSong} = useContext(PlayerContext);
  const [search, setSearch] = useState("");
  const searchRef = useRef(null);
  useEffect(()=> {

    const handleKeyDown = (e) => {
      if ("INPUT" === e.target.tagName) return;
      if (e.code === "Enter") {
        e.preventDefault();
        searchRef.current.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    }
  },[searchRef]);

  const songsToRender = useMemo(()=> {
    if (!search) return songs;

    return songs.filter((song)=> song.name.toLowerCase().includes(search.toLowerCase()));
  }, [search, songs]);

  
  const highestPrioritySong = () => {
    const song = priorityQueue.current.peek("highest");
    console.log(song);
    if (song) {
      chooseSong(song.item, songsToRender);
      priorityQueue.current.dequeue("highest");
    }
    priorityQueue.current.print();
  };

  const lowestPrioritySong = () => {
    const song = priorityQueue.current.peek("lowest");
    console.log(song);
    if (song) {
      chooseSong(song.item, songsToRender);
      priorityQueue.current.dequeue("lowest");
    }
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
        <img
          onClick={highestPrioritySong}
          src="images/top.png"
          className="priority-button"
        ></img>
        <img
          onClick={lowestPrioritySong}
          src="images/bad.png"
          className="priority-button"
        ></img>
      </div>
      <SongsGrid
        songsToRender={songsToRender}
        chooseSong={chooseSong}
      />
      <div style={{height:"200px"}}></div>
    </>
  );
}
