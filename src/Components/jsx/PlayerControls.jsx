import { Shuffle } from "./Shuffle";
import logger from "../../utils/logger";

export const PlayerControls = ({handleSongChange, isPlaying, playSong}) => {
    return (
        <div>
        <img
          onClick={logger(() => {return handleSongChange("prev")}, "previous track is playing")}
          src="images/previous.webp"
          className="play-button"
        ></img>

        <img
          className="play-button"
          src={isPlaying ? "images/pause.webp" : "images/play.webp"}
          onClick={logger(playSong, "playback status: ")}
        ></img>
        <img
          onClick={logger(() =>{ return handleSongChange("next")}, "next track is playing")}
          src="images/next.webp"
          className="play-button"
        ></img>
        <Shuffle />
      </div>
    );
}