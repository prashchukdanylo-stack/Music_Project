 export const randomTrackGenerator = (songs) => {
    let copyOfSongs = [...songs];

    return function* () {
      while (true) {
        if (copyOfSongs.length === 0) {
          copyOfSongs = [...songs];
        }
        const index = Math.floor(Math.random() * copyOfSongs.length);
        yield copyOfSongs.splice(index, 1)[0];
      }
    };
  };