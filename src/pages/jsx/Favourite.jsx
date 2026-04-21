import { SongsGrid } from "../../Components/jsx/SongsGrid";

export function Favourite({
  favourite,
  songs,
  song,
  setFavourite,
  setQueueShuffle,
  chooseSong,
  shuffle
}) {
  const songsMap = new Map(songs.map((song) => [song.id, song]));
  let songsToRender = Array.from(favourite)
    .map((id) => songsMap.get(id))
    .filter(Boolean);
  console.log(songsToRender);

  return (
    <SongsGrid
      songsToRender={songsToRender}
      chooseSong={chooseSong}
      setQueueShuffle={setQueueShuffle}
      favourite={favourite}
      setFavourite={setFavourite}
      song={song}
      shuffle={shuffle}
    />
  );
}
