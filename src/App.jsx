import { useState, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PriorityQueue from "./utils/queue";
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
  const [currentGenerator, setCurrentGenerator] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [time, setTime] = useState(()=> {
  const Parsedtime = localStorage.getItem("time");
  return Parsedtime ? Parsedtime : "0:00 / 0:00";
  });

  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);
  const [shuffle, setShuffle] = useState(false);
  const [favourite, setFavourite] = useState(() => {
    const saved = localStorage.getItem("favourite");
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  const [path, setPath] = useState("");
  const queue = useRef (new PriorityQueue());
  
  


  

  useEffect(() => {
    console.log("1. useEffect")
    const getSongsData = async () => {
     
      let loadedSongs = [];
      const savedSongs = localStorage.getItem("songs");
      if (savedSongs) {
      
          const parsed = JSON.parse(savedSongs);
          loadedSongs = parsed;
        
      }

      if (loadedSongs.length === 0) {
        const response = await fetch("/songs.json");
        const data = await response.json();
        loadedSongs = data.map(song => ({
          ...song,
          playCount: song.playCount || 0
        }));

        localStorage.setItem("songs", JSON.stringify(loadedSongs));
      }

        setSongs(loadedSongs);
        setCurrentSongPlaylist(loadedSongs);


    const savedPlayer = localStorage.getItem("player");
   
    
    if (savedPlayer) {
      const { song, currentSongPlaylist, currentIndex } =
        JSON.parse(savedPlayer);
      setCurrentIndex(currentIndex ?? -1);
      setCurrentSongPlaylist(currentSongPlaylist || []);
      setSong(song || null);
      setIsPlaying(false);
    }
   
   
     }
    
   

    const timeExpire =Number(localStorage.getItem("timeExpire"));
     if (timeExpire && Date.now() > timeExpire) {
      localStorage.removeItem("player");
      localStorage.removeItem("timeExpire");
      console.log("complete")
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
  }, [favourite]);



  useEffect(()=> {
    if (songs.length > 0 && Array.isArray(songs)) {
      localStorage.setItem("songs", JSON.stringify(songs));
    }
  }, [songs]);



  
  
  
  const randomTrackGenerator = (songs) => {
    let copyOfSongs = [...songs];


    return function* () {
      while (true) {
        if (copyOfSongs.length===0) {
          copyOfSongs = [...songs];
        }
        const index = Math.floor(Math.random() * copyOfSongs.length);
        yield copyOfSongs.splice(index, 1)[0];
    };
  };
  }
  useEffect(() => {
    if (currentGenerator.length > 0) {
      trackGenRef.current = randomTrackGenerator(currentGenerator)();
    }
  }, [currentGenerator]);

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
              shuffle={shuffle}
              setCurrentGenerator={setCurrentGenerator}
              setPath={setPath}
              song = {song}
              favourite={favourite}
              setFavourite={setFavourite}
              setSongs={setSongs}
              queue = {queue}
              
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
              currentSongPlaylist={currentSongPlaylist}
              song={song}
              setCurrentGenerator={setCurrentGenerator}
              shuffle={shuffle}
              setPath={setPath}
              setSongs={setSongs}
              queue = {queue}
              
              
              
              

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
        randomTrackGenerator={randomTrackGenerator}
        path={path}
      
      />}
    </BrowserRouter>
  );
}

export default App;