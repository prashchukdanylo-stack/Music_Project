import {BrowserRouter, Routes, Route} from "react-router-dom";
import './App.css'
import { HomePage } from "./pages/HomePage";
import { Song } from "./pages/Song";
function App() {

  return (
   <BrowserRouter>
   <Routes>
    <Route index element = {<HomePage />} />
    <Route path="/song" element = {<Song />} />
   </Routes>
   </BrowserRouter>
  )
}

export default App
