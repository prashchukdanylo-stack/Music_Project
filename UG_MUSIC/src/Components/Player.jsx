export function Player({isPlaying, playTrack}) {
    return (
        <div>
            <img className="play-button" src={isPlaying ? "images/pause.png":"images/play.png"} onClick={playTrack}></img>
        </div>
    )
}