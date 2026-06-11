import {useState, useEffect} from 'react';
import {streamLoader} from "../utils/streamLoader";

export const useAppInit = (songs, setSongs, authors, setAuthors, setCurrentIndex, setSong, setPlayer, setCurrentGenerator) => {
    const [isPlayerReady, setIsPlayerReady] = useState(false);

    useEffect(()=> {
        const controller = new AbortController();

        const initData = async () => {
            try {
                let loadedSongs = songs;

                if (loadedSongs.length === 0) {
                    const response = await fetch("songs.json", {
                        signal: controller.signal,
                    });
                    if (response.ok) {
                        loadedSongs = await response.json();
                        loadedSongs = loadedSongs.map((song) => ({...song, playCount: song.playCount || 0}));
                    }
                }

                const processSongsStreams = async (data) => {
                    const songsStream = streamLoader(data);
                    for await(const chunk of songsStream) {
                        setSongs((prev)=> {
                            const newSongs = chunk.filter((newSong) => !prev.some((song) => song.id === newSong.id));
                            return [...prev, ...newSongs];
                        })
                    }
                }

                processSongsStreams(loadedSongs);
                const timeExpire = Number(localStorage.getItem("timeExpire"));

                     if (timeExpire && Date.now() > timeExpire) {
                     localStorage.removeItem("playback");
                    localStorage.removeItem("timeExpire");
                } else {
            
                    const savedPlayback = localStorage.getItem("playback");
                    if (savedPlayback) {

                        const { song: savedSong, player: savedPlayer, currentIndex: savedIdx } = JSON.parse(savedPlayback);
                        setCurrentIndex(savedIdx ?? -1);
                        setSong(savedSong || null);
                        setPlayer(savedPlayer || []);
                        setCurrentGenerator(savedPlayer || []);
                }
               
                 if (authors.length === 0) {
                    const response = await fetch("authors.json", {signal: controller.signal});
                    if (response.ok) {
                        const data = await response.json();
                        setAuthors(data);
                    }
                }
                } 
    
    } catch (error) {
        if (error.name !== "AbortError") {
            console.error("init error: ", error);
        }
        } finally {
            setIsPlayerReady(true);
        }
    }
        initData();
        
        return () => {
            controller.abort();
        }
        
    }, []);

    return {isPlayerReady};
}