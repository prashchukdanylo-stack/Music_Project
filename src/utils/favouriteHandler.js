 export const favouriteHandler = (event , setFavourite, songToRender) => {
                        event.stopPropagation();
                        setFavourite((prev) => {
                          const newSet = new Set(prev);
                          newSet.has(songToRender.id)
                            ? newSet.delete(songToRender.id)
                            : newSet.add(songToRender.id);
                          return newSet;
                        });
                        return songToRender;
                      }