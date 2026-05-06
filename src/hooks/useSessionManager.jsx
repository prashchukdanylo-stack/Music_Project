import { useEffect } from "react";
import emitter from "../utils/eventBus";

export function useSessionManager() {
    useEffect(() => {
        const handleTimeExpire = (data) => {
            localStorage.setItem("timeExpire", data.time + 600000)
        }
        const handleSongEnded = (data) => {
            localStorage.setItem("songEnded", data.songId);
        }

        
        emitter.on("timeExpire", handleTimeExpire);
        emitter.on("songEnded", handleSongEnded);
        return () => {
            emitter.off("songEnded", handleSongEnded);
            emitter.off("timeExpire", handleTimeExpire);
        };
    }, []);

}