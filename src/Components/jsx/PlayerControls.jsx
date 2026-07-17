import { Shuffle } from "./Shuffle";
import logger from "../../utils/logger";
import "../css/PlayerControls.css";

export const PlayerControls = ({handleSongChange, isPlaying, playSong}) => {
    return (
        <div className="player-controls">
        <img
          onClick={logger(() => {return handleSongChange("prev")}, "previous track is playing")}
          src={`${import.meta.env.BASE_URL}images/previous.webp`}
          className="play-button"
        ></img>

        <img
          className="play-button"
          src={import.meta.env.BASE_URL + (isPlaying ? "images/pause.webp" : "images/play.webp")}
          onClick={logger(playSong, "playback status: ")}
        ></img>
        <img
          onClick={logger(() =>{ return handleSongChange("next")}, "next track is playing")}
          src={`${import.meta.env.BASE_URL}images/next.webp`}
          className="play-button"
        ></img>
        <Shuffle />
        
      </div>
    );
}