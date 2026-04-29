import "../css/HomePage.css";

export function HomePage() {
  return (
    <div>
      <div className="all-page">
        <div className="welcome">
          <p className="welcome-text">Welcome to Fluire!</p>
          <div className="welcome-about-container">
            <p className="welcome-descr">
              This is a beautiful place to chill and throw away all your
              problems and just feel happiness!Here, the music flows like a
              gentle river, carrying your thoughts away and wrapping you in a
              cocoon of sound. Every beat, every note, is designed to lift your
              spirit and let your soul breathe. The colors, the rhythm, the
              atmosphere—they all blend together to create a sanctuary where
              worries fade and only the joy of the moment remains. Whether you
              want to dance like nobody’s watching, relax with soothing
              melodies, or discover new tunes that speak to your heart, this is
              the space where happiness isn’t just a feeling—it’s an experience.
              Here, every track is a doorway to peace, every playlist a
              companion for your mind to wander, and every sound a reminder that
              life can be simple, beautiful, and full of bliss.
            </p>
          </div>
        </div>
      </div>
      <div className="erase-button-container">
        <button
          className="erase-button"
          onClick={() => {
            localStorage.removeItem("songs");
            localStorage.removeItem("playback");
            localStorage.removeItem("author");
            localStorage.removeItem("authors");
            window.location.reload();
          }}
        >
          Erase localStorage
        </button>
      </div>
    </div>
  );
}
