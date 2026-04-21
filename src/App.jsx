import { useState, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PriorityQueue from "./utils/queue";
import { asyncMap } from "./utils/asyncMap";
import "./App.css";
import { HomePage } from "./pages/jsx/HomePage";
import { Song } from "./pages/jsx/Song";
import { SongsList } from "./pages/jsx/SongsList";
import { Sidebar } from "./Components/jsx/Sidebar";
import { Player } from "./Components/jsx/Player";
import { Favourite } from "./pages/jsx/Favourite";
import { Author } from "./pages/jsx/Author";

function App() {
  const audioRef = useRef(null);
  const priorityQueue = useRef(new PriorityQueue());
  const [isPlaying, setIsPlaying] = useState(false);
  const [authors, setAuthors] = useState([]);
  const [song, setSong] = useState();
  const [songs, setSongs] = useState([]);
  const trackGenRef = useRef(null);
  const [currentSongPlaylist, setCurrentSongPlaylist] = useState([]);
  const [currentGenerator, setCurrentGenerator] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [author, setAuthor] = useState(()=>{
    const saved = localStorage.getItem("author");
    return saved ? JSON.parse(saved) : "";
  });
  const [queueShuffle, setQueueShuffle] = useState([]);
  const [shuffle, setShuffle] = useState(false);
  const [time, setTime] = useState(() => {
    const Parsedtime = localStorage.getItem("time");
    return Parsedtime ? Parsedtime : "0:00 / 0:00";
  });
  const [favourite, setFavourite] = useState(() => {
    const saved = localStorage.getItem("favourite");
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  useEffect(() => {
    const controller = new AbortController();

    const getSongsData = async () => {
      try {
        let loadedSongs = [];
        const savedSongs = localStorage.getItem("songs");
        const savedAuthors = localStorage.getItem("authors");
        if (savedAuthors) {
          setAuthors(JSON.parse(savedAuthors));
        }
        if (savedSongs) {
          loadedSongs = JSON.parse(savedSongs);
        }


        if (loadedSongs.length === 0) {
          const response = await fetch("/songs.json", {
            signal: controller.signal,
          });

          if (!response.ok) {
            throw new Error("Failed to load songs");
          }

          const data = await response.json();
          const verifySongs = async (song) => {
            try {
              const audioLink = song.audio;
              const result = await fetch(audioLink, {
                method: "HEAD",
                signal: controller.signal,
              });
              const contentType = result.headers.get("content-type");
              if (
                result.ok &&
                contentType &&
                !contentType.includes("text/html")
              ) {
                return song;
              } else {
                console.log(`Song ${song.name} cannot be played`);
                return null;
              }
            } catch (error) {
              console.log(error);
              return null;
            }
          };

          const mappedData = await asyncMap(data, verifySongs);

          loadedSongs = mappedData
            .filter((song) => song !== null)
            .map((song) => ({
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

        const response = await fetch("/authors.json", {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to load authors");
        }

        const data = await response.json();
        setAuthors(data);
        localStorage.setItem("authors", JSON.stringify(data));
      } catch (error) {
        console.error("Loading error:", error);
      } finally {
        setIsPlayerReady(true);
      }
    };

    const timeExpire = Number(localStorage.getItem("timeExpire"));

    if (timeExpire && Date.now() > timeExpire) {
      localStorage.removeItem("player");
      localStorage.removeItem("timeExpire");
      console.log("complete");
    }

    getSongsData();
    return () => controller.abort();
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
    localStorage.setItem("author", JSON.stringify(author));

  }, [author]);

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

  const chooseSong = (song, songsToRender) => {
    setProgress(0);
    setTime("0:00 / 0:00");
    setDuration(0);

    const updatedSongs = songs.map((s) => {
      if (s.id === song.id) {
        return {
          ...s,
          playCount: (s.playCount || 0) + 1,
        };
      }
      return s;
    });

    setSongs(updatedSongs);

    const updatedSong = updatedSongs.find((s) => s.id === song.id);

    const index = songsToRender.findIndex((s) => s.id === song.id);
    setSong(updatedSong);
    setCurrentSongPlaylist(songsToRender);
    setCurrentGenerator(songsToRender);
    setCurrentIndex(index);

    setIsPlaying(true);
    priorityQueue.current.enqueue(updatedSong, updatedSong.playCount || 0);
    priorityQueue.current.print();
  };

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
              setCurrentSongPlaylist={setCurrentSongPlaylist}
              song={song}
              favourite={favourite}
              setFavourite={setFavourite}
              priorityQueue={priorityQueue}
              setQueueShuffle={setQueueShuffle}
              chooseSong={chooseSong}
              shuffle= {shuffle}
            />
          }
        />
        <Route
          path="/favourite"
          element={
            <Favourite
              songs={songs}
              favourite={favourite}
              setFavourite={setFavourite}
              song={song}
              setQueueShuffle={setQueueShuffle}
              chooseSong={chooseSong}
              shuffle={shuffle}
            />
          }
        ></Route>
        <Route
          path="/author"
          element={
            <Author
              author={author}
              setAuthor={setAuthor}
              songs={songs}
              song={song}
              setFavourite={setFavourite}
              favourite={favourite}
              authors={authors}
              setQueueShuffle={setQueueShuffle}
              chooseSong={chooseSong}
              shuffle={shuffle}
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
          queueShuffle={queueShuffle}
          setQueueShuffle={setQueueShuffle}
        />
      )}
    </BrowserRouter>
  );
}

export default App;
