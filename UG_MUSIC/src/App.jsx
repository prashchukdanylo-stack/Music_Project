import {useState, useEffect, useRef} from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import './App.css'
import { HomePage } from "./pages/HomePage";
import { Song } from "./pages/Song";
function App() {
const [isPlaying, setIsPlaying] = useState(true);
const [song, setSong] = useState();
const [songs, setSongs] = useState([]);
const trackGenRef = useRef(null);
const [currentSongPlaylist, setCurrentSongPlaylist] = useState([]);
const [currentIndex, setCurrentIndex] = useState(-1);

 useEffect(() => {
    const getSongsData = async () => {
      const response = await fetch("/songs.json");
      const data = await response.json();
      setSongs(data);
    };

    getSongsData();
    
  }, []);


  const randomTrackGenerator = (songs) => {
    const copyOfSongs = [...songs];
    let previousSong = 0;
    
    return function* () {
      while (true) {
          const numberOfSong = Math.floor(Math.random() * copyOfSongs.length);
          const randomSong = copyOfSongs.splice(numberOfSong, 1)[0];
          yield randomSong;
          if (previousSong) copyOfSongs.push(previousSong);
          previousSong = randomSong;
        }
      }
    }
  

  useEffect(() => {
    if (songs.length > 0) {
      trackGenRef.current = randomTrackGenerator(songs)();
    }
  }, [songs]);

  return (
   <BrowserRouter>
   <Routes>
    <Route index element = {<HomePage isPlaying={isPlaying} setIsPlaying={setIsPlaying} setSong={setSong} trackGenRef={trackGenRef} currentSongPlaylist={currentSongPlaylist} setCurrentSongPlaylist={setCurrentSongPlaylist} currentIndex={setCurrentIndex} setCurrentIndex={setCurrentIndex} />} />
    <Route path="/song" element = {<Song isPlaying={isPlaying} setIsPlaying={setIsPlaying} song={song} setSong={setSong} trackGenRef={trackGenRef} currentSongPlaylist={currentSongPlaylist} setCurrentSongPlaylist={setCurrentSongPlaylist} currentIndex={currentIndex} setCurrentIndex={setCurrentIndex} />} />
   </Routes>
   </BrowserRouter>
  )
}

export default App
