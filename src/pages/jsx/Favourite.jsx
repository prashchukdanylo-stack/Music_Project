import {useMemo} from "react";
import { SongsGrid } from "../../Components/jsx/SongsGrid";

export function Favourite({
  favourite,
  songs
}) {
  
  const songsToRender = useMemo(() => {
    const songsMap = new Map(songs.map((song) => [song.id, song]));

    return Array.from(favourite)
    .map((id) => songsMap.get(id))
    .filter(Boolean);
  },[favourite, songs]);

  return (
    <SongsGrid
      songsToRender={songsToRender}
    />
  );
}
