import { useNavigate } from "react-router-dom";
import "./HomePage.css";


export function HomePage({setIsPlaying ,setSong, trackGenRef,setCurrentSongPlaylist, currentIndex, setCurrentIndex}) {
  
  
  const navigate = useNavigate();
  
  
  

  

 

  const randomTrack = () => {
    if (!trackGenRef.current) throw new Error("Track is not ready yet");
    const song = trackGenRef.current.next().value;
    if (!song) return;
    setSong(song);
    setIsPlaying(true);
    setCurrentSongPlaylist(prev => {
      const newArr = [...prev.slice(0, currentIndex + 1), song];
      setCurrentIndex(newArr.length - 1);
      return newArr;
    });
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
