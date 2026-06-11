import { Shuffle } from "./Shuffle";
import logger from "../../utils/logger";

export const PlayerControls = ({handleSongChange, isPlaying, playSong}) => {
    return (
        <div>
        <img
          onClick={logger(() => {return handleSongChange("prev")}, "previous track is playing")}
          src="images/previous.png"
          className="play-button"
        ></img>

        <img
          className="play-button"
          src={isPlaying ? "images/pause.png" : "images/play.png"}
          onClick={logger(playSong, "playback status: ")}
        ></img>
        <img
          onClick={logger(() =>{ return handleSongChange("next")}, "next track is playing")}
          src="images/next.png"
          className="play-button"
        ></img>
        <Shuffle />
      </div>
    );
}