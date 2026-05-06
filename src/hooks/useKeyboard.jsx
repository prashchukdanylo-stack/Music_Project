import {useEffect} from "react";
import emitter from "../utils/eventBus";

export function useKeyboard() {
    useEffect(()=> {
        const handleKeyDown = (e) => {
            if ("INPUT" === e.target.tagName) return;

            switch (e.code) {
                case "Space": 
                e.preventDefault();
                emitter.emit("togglePlay");
                break;
                case "ArrowRight":
                case "KeyD":
                e.preventDefault();
                emitter.emit("nextSong");
                break;
                case "ArrowLeft":
                    case "KeyA":
                e.preventDefault();
                emitter.emit("previousSong");
                break;
                case "KeyS":
                e.preventDefault();
                emitter.emit("toggleShuffle");
                break;
                case "Escape":
                e.preventDefault();
                emitter.emit("toggleSidebar");
                break;
                case "Enter":
                e.preventDefault();
                emitter.emit("openInput");
                break;
                default:
                    break;
            }
        }

        window.addEventListener("keyup", handleKeyDown);
        
        return () => window.removeEventListener("keyup", handleKeyDown);
    }, [])
}