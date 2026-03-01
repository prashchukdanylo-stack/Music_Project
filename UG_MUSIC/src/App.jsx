import {useState} from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import './App.css'
import { HomePage } from "./pages/HomePage";
import { Song } from "./pages/Song";
function App() {
const [isPlaying, setIsPlaying] = useState(true);
const [song, setSong] = useState();


  return (
   <BrowserRouter>
   <Routes>
    <Route index element = {<HomePage isPlaying={isPlaying} setIsPlaying={setIsPlaying} setSong={setSong} />} />
    <Route path="/song" element = {<Song isPlaying={isPlaying} setIsPlaying={setIsPlaying} song={song} />} />
   </Routes>
   </BrowserRouter>
  )
}

export default App
