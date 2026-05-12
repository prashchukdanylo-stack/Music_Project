import { useState } from "react";

import "../css/LyricsViewer.css";
export function LyricsViewer({ song }) {
    const [lyrics, setLyrics] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchLyrics = async () => {
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
    };

    return (
        <div className="lyrics-container">
            <button 
                onClick={fetchLyrics} 
                disabled={loading || !song}
                className="lyrics-button"
            >
                {loading ? "Searching for text..." : "Show text"}
            </button>

            {error && <h1 className="lyrics-error">{error}</h1>}

            {lyrics && (
                <div className="lyrics-text">
                    {lyrics}
                </div>
            )}
        </div>
    );
}