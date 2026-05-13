import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { randomTrackGenerator } from "./utils/randomTrackGenerator";
import PriorityQueue from "./utils/queue";
import "./App.css";
import { HomePage } from "./pages/jsx/HomePage";
import { Song } from "./pages/jsx/Song";
import { SongsList } from "./pages/jsx/SongsList";
import { Sidebar } from "./Components/jsx/Sidebar";
import { Player } from "./Components/jsx/Player";
import { Favourite } from "./pages/jsx/Favourite";
import { Author } from "./pages/jsx/Author";
import { Toast } from "./Components/jsx/Toast";
import { PlayerContext } from "./contexts/PlayerContext";
import { LibraryContext } from "./contexts/LibraryContext";
import { QueueContext } from "./contexts/QueueContext";
import { TimeProvider } from "./contexts/TimeContext";
import { useStorage } from "./hooks/useStorage";
import { useKeyboard } from "./hooks/useKeyboard";
import { useSessionManager } from "./hooks/useSessionManager";
import { LyricsViewer } from "./Components/jsx/LyricsViewer";
import { useAppInit } from "./hooks/useAppInit";
import { useFavourite } from "./hooks/useFavourite";
function App() {
  const audioRef = useRef(null);
  const priorityQueue = useRef(new PriorityQueue());
  const [isPlaying, setIsPlaying] = useState(false);
  const [authors, setAuthors] = useStorage("authors", []);
  const [song, setSong] = useState();
  const [songs, setSongs] = useStorage("songs", []);
  const trackGenRef = useRef(null);
  const [player, setPlayer] = useState([]);
  const [currentGenerator, setCurrentGenerator] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [duration, setDuration] = useState(0);
  const [author, setAuthor] = useStorage("author", "");
  const [queueShuffle, setQueueShuffle] = useStorage("queueShuffle", []);
  const [shuffle, setShuffle] = useStorage("shuffle", false);

  const [favourite, setFavourite] = useFavourite();
  const [isPlayerClosed, setIsPlayerClosed] = useState(true);

  useKeyboard();
  useSessionManager();
  const { isPlayerReady } = useAppInit(
    songs,
    setSongs,
    authors,
    setAuthors,
    setCurrentIndex,
    setSong,
    setPlayer,
    setCurrentGenerator,
  );

  useEffect(() => {
    if (!song) return;
    localStorage.setItem(
      "playback",
      JSON.stringify({
        song,
        player,
        currentIndex,
      }),
    );
  }, [song, player, currentIndex]);

  useEffect(() => {
    if (currentGenerator.length > 0) {
      trackGenRef.current = randomTrackGenerator(currentGenerator)();
    }
  }, [currentGenerator]);

  const chooseSong = useCallback(
    (song, songsToRender) => {
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

      const updatedSong = updatedSongs.find((s) => s.id === song.id);
      const index = songsToRender.findIndex((s) => s.id === song.id);
      setSongs(updatedSongs);
      setSong(updatedSong);
      setPlayer(songsToRender);
      setCurrentGenerator(songsToRender);
      setCurrentIndex(index);

      setIsPlaying(true);
      priorityQueue.current.enqueue(updatedSong, updatedSong.playCount || 0);
      return song;
    },
    [songs, setSongs, setPlayer],
  );

  const playerContextValue = useMemo(
    () => ({
      song,
      setSong,
      isPlaying,
      setIsPlaying,
      duration,
      setDuration,
      shuffle,
      setShuffle,
      audioRef,
      chooseSong,
    }),
    [song, isPlaying, duration, shuffle, chooseSong, setShuffle],
  );

  const libraryContextValue = useMemo(
    () => ({
      songs,
      setSongs,
      authors,
      setAuthors,
      author,
      setAuthor,
      favourite,
      setFavourite,
    }),
    [
      songs,
      authors,
      author,
      favourite,
      setSongs,
      setAuthors,
      setAuthor,
      setFavourite,
    ],
  );

  const queueContextValue = useMemo(
    () => ({
      player,
      setPlayer,
      currentIndex,
      setCurrentIndex,
      queueShuffle,
      setQueueShuffle,
    }),
    [player, currentIndex, queueShuffle, setPlayer, setQueueShuffle],
  );

  if (!isPlayerReady) return null;
  return (
    <TimeProvider>
      <PlayerContext.Provider value={playerContextValue}>
        <LibraryContext.Provider value={libraryContextValue}>
          <QueueContext.Provider value={queueContextValue}>
            <BrowserRouter>
              <Sidebar />
              <Routes>
                <Route index element={<HomePage />} />
                <Route path="/song" element={<Song song={song} />} />
                <Route
                  path="/songslist"
                  element={
                    <SongsList songs={songs} priorityQueue={priorityQueue} />
                  }
                />
                <Route
                  path="/favourite"
                  element={<Favourite songs={songs} favourite={favourite} />}
                ></Route>
                <Route
                  path="/author"
                  element={
                    <Author
                      author={author}
                      setAuthor={setAuthor}
                      songs={songs}
                      authors={authors}
                    />
                  }
                ></Route>
                <Route path="/lyrics" element={<LyricsViewer song={song} />} />
              </Routes>

              {song && (
                <Player
                  trackGenRef={trackGenRef}
                  player={player}
                  currentIndex={currentIndex}
                  setCurrentIndex={setCurrentIndex}
                  songs={songs}
                  favourite={favourite}
                  setFavourite={setFavourite}
                  randomTrackGenerator={randomTrackGenerator}
                  setAuthor={setAuthor}
                  queueShuffle={queueShuffle}
                  setQueueShuffle={setQueueShuffle}
                  isPlayerClosed={isPlayerClosed}
                  setIsPlayerClosed={setIsPlayerClosed}
                />
              )}

              <Toast />
            </BrowserRouter>
          </QueueContext.Provider>
        </LibraryContext.Provider>
      </PlayerContext.Provider>
    </TimeProvider>
  );
}

export default App;
