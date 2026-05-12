import { useState, useEffect, useCallback } from "react";

import "../css/LyricsViewer.css";
export function LyricsViewer({ song }) {
    const [lyrics, setLyrics] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    

    const fetchLyrics = useCallback(async function(){
        if (!song) return;
        
        setLoading(true);
        setError("");
        setLyrics("");

        try {
            
            const query = `${song.author}${song.name}`;
            
            
            const response = await fetch(`http://localhost:8080/api/lyrics?q=${encodeURIComponent(query)}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Щось пішло не так");
            }

            setLyrics(data.lyrics);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [song]);

    useEffect(() => {
        fetchLyrics();
    }, [fetchLyrics]);

    return (
        <>
        <div className="lyrics-viewer">
        <div className="lyrics-container" >
            <h1>{loading ? "Loading lyrics..." : ""}</h1>
            {error && <h1 className="lyrics-error">{error}</h1>}

            {lyrics && (
                <div className="lyrics-text">
                    {lyrics}
                </div>
            )}
            
        </div>
        </div>
        <div style={{height:"200px"}}></div>
        </>
    );
}