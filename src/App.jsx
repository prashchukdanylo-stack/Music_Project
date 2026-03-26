import { useState, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { HomePage } from "./pages/HomePage";
import { Song } from "./pages/Song";
import { SongsList } from "./pages/SongsList";
import { Sidebar } from "./Components/Sidebar";
import { Player } from "./Components/Player";
import { Favourite } from "./pages/Favourite";

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
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
  const [shuffle, setShuffle] = useState(false);
  const [favourite, setFavourite] = useState(() => {
    const saved = localStorage.getItem("favourite");
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });


  

  useEffect(() => {
    const getSongsData = async () => {
      const response = await fetch("/songs.json");
      const data = await response.json();
      setSongs(data);
    };
    const timeExpire =Number(localStorage.getItem("timeExpire"));
     if (timeExpire && Date.now() > timeExpire) {
      localStorage.removeItem("player");
      localStorage.removeItem("timeExpire");
      console.log("complete")
    }
    
    const savedPlayer = localStorage.getItem("player");
    const favPlayer = localStorage.getItem("favourite");
    
    if (savedPlayer) {
      const { song, currentSongPlaylist, currentIndex } =
        JSON.parse(savedPlayer);
      setCurrentIndex(currentIndex ?? -1);
      setCurrentSongPlaylist(currentSongPlaylist || []);
      setSong(song || null);
      setIsPlaying(false);
    }
    if (favPlayer) {
      const favourite = JSON.parse(favPlayer);
      setFavourite(new Set(favourite));
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

  useEffect(()=> {
    localStorage.setItem(
      "favourite",
      JSON.stringify(
        Array.from(favourite)
      )
    )
    console.log(localStorage);
  }, [favourite])

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
      <Sidebar song={song} />
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
        <Route path="/song" element={<Song song={song} time={time} />} />
        <Route
          path="/songslist"
          element={
            <SongsList
              songs={songs}
              progress={progress}
              setProgress={setProgress}
              setTime={setTime}
              setDuration={setDuration}
              setSong={setSong}
              setIsPlaying={setIsPlaying}
              setCurrentSongPlaylist={setCurrentSongPlaylist}
              setCurrentIndex={setCurrentIndex}
            />
          }
        />
        <Route path="/favourite" element = {<Favourite
              songs = {songs}
              progress={progress}
              setProgress={setProgress}
              setTime={setTime}
              setDuration={setDuration}
              setSong={setSong}
              setIsPlaying={setIsPlaying}
              setCurrentSongPlaylist={setCurrentSongPlaylist}
              setCurrentIndex={setCurrentIndex}
              favourite={favourite}
              setFavourite={setFavourite}
        />}>

        </Route>
      </Routes>

      {song && <Player
        setTime={setTime}
        duration={duration}
        setDuration={setDuration}
        shuffle={shuffle}
        setShuffle={setShuffle}
        setSong={setSong}
        trackGenRef={trackGenRef}
        currentSongPlaylist={currentSongPlaylist}
        setCurrentSongPlaylist={setCurrentSongPlaylist}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
        audioRef={audioRef}
        progress={progress}
        setProgress={setProgress}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        song={song}
        songs={songs}
        time={time}
        favourite={favourite}
        setFavourite={setFavourite}
      />}
    </BrowserRouter>
  );
}

export default App;
