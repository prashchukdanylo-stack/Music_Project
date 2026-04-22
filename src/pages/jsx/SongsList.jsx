import { useContext, useState} from "react";
import "../css/SongsList.css";
import { SongsGrid } from "../../Components/jsx/SongsGrid.jsx";
import { QueueContext } from "../../contexts/QueueContext.jsx";
import { PlayerContext } from "../../contexts/PlayerContext.jsx";


export function SongsList({
  songs,
  priorityQueue
}) {
  const {chooseSong} = useContext(PlayerContext);
  const {setCurrentSongPlaylist} = useContext(QueueContext);
  const [search, setSearch] = useState("");
  const filteredSong = () => {
    return songs.filter((song) => {
      return song.name.toLowerCase().includes(search.toLowerCase());
    });
  };

  const songsToRender = search ? filteredSong() : songs;

  const highestPrioritySong = () => {
    const song = priorityQueue.current.peek("highest");
    console.log(song);
    if (song) {
      chooseSong(song.item, songsToRender);
      setCurrentSongPlaylist(priorityQueue.current.items.map((s) => s.item));
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
      <div className="bottom"></div>
    </>
  );
}
