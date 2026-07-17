import logger from "../../utils/logger";
import { favouriteHandler } from "../../utils/favouriteHandler";
import { useContext } from "react";
import { LibraryContext } from "../../contexts/LibraryContext";

export const Heart = ({songToRender}) => {
    const {favourite, setFavourite} = useContext(LibraryContext);

    return (
         <img
                      className="player-song-heart"
                      src={
                        favourite.has(songToRender.id)
                          ? "images/heart-active.webp"
                          : "images/heart.webp"
                      }
                      onClick={logger((event) => favouriteHandler(event, setFavourite, songToRender), "Favourite Song: ")}
                    ></img>
    )
}