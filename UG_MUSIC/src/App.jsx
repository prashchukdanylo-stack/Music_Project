import { useState, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { HomePage } from "./pages/HomePage";
import { Song } from "./pages/Song";
import { SongsList } from "./pages/SongsList";

function App() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [song, setSong] = useState();
  const [songs, setSongs] = useState([]);
  const trackGenRef = useRef(null);
  const [currentSongPlaylist, setCurrentSongPlaylist] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [time, setTime] = useState("0:00 / 0:00");
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    const getSongsData = async () => {
      const response = await fetch("/songs.json");
      const data = await response.json();
      setSongs(data);
    };
    const savedPlayer = localStorage.getItem("player");
    if (savedPlayer) {
      const { song, currentSongPlaylist, currentIndex } =
        JSON.parse(savedPlayer);
      setCurrentIndex(currentIndex ?? -1);
      setCurrentSongPlaylist(currentSongPlaylist || []);
      setSong(song || null);
      setIsPlaying(false);
    }
    setIsPlayerReady(true);
    getSongsData();
  }, []);

  useEffect(() => {
    if (!song) return;
    localStorage.setItem(
      "player",
      JSON.stringify({
        song,
        currentSongPlaylist,
        currentIndex,
      }),
    );
  }, [song, currentSongPlaylist, currentIndex]);

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
    };
  };

  useEffect(() => {
    if (songs.length > 0) {
      trackGenRef.current = randomTrackGenerator(songs)();
    }
  }, [songs]);

  if (!isPlayerReady) return null;
  return (
    <BrowserRouter>
      <Routes>
        <Route
          index
          element={
            <HomePage
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
              setSong={setSong}
              trackGenRef={trackGenRef}
              setCurrentSongPlaylist={setCurrentSongPlaylist}
              currentIndex={currentIndex}
              setCurrentIndex={setCurrentIndex}
              song={song}
            />
          }
        />
        <Route
          path="/song"
          element={
            <Song
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
              song={song}
              setSong={setSong}
              trackGenRef={trackGenRef}
              currentSongPlaylist={currentSongPlaylist}
              setCurrentSongPlaylist={setCurrentSongPlaylist}
              currentIndex={currentIndex}
              setCurrentIndex={setCurrentIndex}
              audioRef={audioRef}
              progress={progress}
              setProgress={setProgress}
              time={time}
              setTime={setTime}
              duration={duration}
              setDuration={setDuration}
            />
          }
        />
        <Route
          path="/songslist"
          element={
            <SongsList
              songs={songs}
              audioRef={audioRef}
              progress={progress}
              setProgress={setProgress}
              time={time}
              setTime={setTime}
              duration={duration}
              setDuration={setDuration}
              setSong={setSong}
              setisPlaying={setIsPlaying}
              setCurrentSongPlaylist={setCurrentSongPlaylist}
              setCurrentIndex={setCurrentIndex}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
