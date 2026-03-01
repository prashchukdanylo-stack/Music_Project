import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";


export function HomePage({setIsPlaying ,setSong}) {
  
  const [songs, setSongs] = useState([]);
  const navigate = useNavigate();
  
  
  

  const trackGenRef = useRef(null);


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

  const randomTrack = () => {
    if (!trackGenRef.current) throw new Error("Track is not ready yet");
    const song = trackGenRef.current.next().value;
    if (!song) return;
    setSong(song);
    setIsPlaying(true);
    navigate("/song", {state: {song}});
  };

 
  



  return (
    <div className="all-page">
    <div className="welcome">
      <p className="welcome-text">Welcome to Fluire!</p>
      <div className="welcome-about-container">
        <p>
          This is a beautiful place to chill and throw away all your problems
          and just feel hapiness!Here, the music flows like a gentle river,
          carrying your thoughts away and wrapping you in a cocoon of sound.
          Every beat, every note, is designed to lift your spirit and let your
          soul breathe. The colors, the rhythm, the atmosphere—they all blend
          together to create a sanctuary where worries fade and only the joy of
          the moment remains. Whether you want to dance like nobody’s watching,
          relax with soothing melodies, or discover new tunes that speak to your
          heart, this is the space where happiness isn’t just a feeling—it’s an
          experience. Here, every track is a doorway to peace, every playlist a
          companion for your mind to wander, and every sound a reminder that
          life can be simple, beautiful, and full of bliss.
        </p>
      </div>
    </div>

      <div className="play-button-container">
        <button className="random-button" onClick={randomTrack}>
        Random song
          
        </button>

      </div>

      </div>
  );
}
