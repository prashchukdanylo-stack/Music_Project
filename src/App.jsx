import { useState, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PriorityQueue from "./utils/queue";
import "./App.css";
import { HomePage } from "./pages/jsx/HomePage";
import { Song } from "./pages/jsx/Song";
import { SongsList } from "./pages/jsx/SongsList";
import { Sidebar } from "./Components/jsx/Sidebar";
import { Player } from "./Components/jsx/Player";
import { Favourite } from "./pages/jsx/Favourite";
import { Author } from "./pages/jsx/Author";

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [authors, setAuthors] = useState("");
  const [song, setSong] = useState();
  const [songs, setSongs] = useState([]);
  const trackGenRef = useRef(null);
  const [currentSongPlaylist, setCurrentSongPlaylist] = useState([]);
  const [currentGenerator, setCurrentGenerator] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [time, setTime] = useState(() => {
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


  const queue = useRef(new PriorityQueue());
  const [author, setAuthor] = useState("");

  useEffect(() => {
    console.log("1. useEffect");
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
        loadedSongs = data.map((song) => ({
          ...song,
          playCount: song.playCount || 0,
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
      const response = await fetch("/authors.json");
      const data = await response.json();
      setAuthors(data);
    };

    const timeExpire = Number(localStorage.getItem("timeExpire"));
    if (timeExpire && Date.now() > timeExpire) {
      localStorage.removeItem("player");
      localStorage.removeItem("timeExpire");
      console.log("complete");
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

  useEffect(() => {
    localStorage.setItem("favourite", JSON.stringify(Array.from(favourite)));
    console.log(localStorage);
  }, [favourite]);

  useEffect(() => {
    if (songs.length > 0 && Array.isArray(songs)) {
      localStorage.setItem("songs", JSON.stringify(songs));
    }
  }, [songs]);

  const randomTrackGenerator = (songs) => {
    let copyOfSongs = [...songs];

    return function* () {
      while (true) {
        if (copyOfSongs.length === 0) {
          copyOfSongs = [...songs];
        }
        const index = Math.floor(Math.random() * copyOfSongs.length);
        yield copyOfSongs.splice(index, 1)[0];
      }
    };
  };
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
              song={song}
              favourite={favourite}
              setFavourite={setFavourite}
              setSongs={setSongs}
              queue={queue}
            />
          }
        />
        <Route
          path="/favourite"
          element={
            <Favourite
              songs={songs}
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
              setSongs={setSongs}
              queue={queue}
            />
          }
        ></Route>
        <Route
          path="/author"
          element={
            <Author
              authorInfo={author}
              songs={songs}
              song={song}
              setFavourite={setFavourite}
              favourite={favourite}
              setSongs={setSongs}
              setProgress={setProgress}
              setTime={setTime}
              setDuration={setDuration}
              setSong={setSong}
              setCurrentSongPlaylist={setCurrentSongPlaylist}
              setCurrentIndex={setCurrentIndex}
              setIsPlaying={setIsPlaying}
              setCurrentGenerator={setCurrentGenerator}
              queue={queue}
              authors={authors}
            />
          }
        ></Route>
      </Routes>

      {song && (
        <Player
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
          setAuthor={setAuthor}
        />
      )}
    </BrowserRouter>
  );
}

export default App;
