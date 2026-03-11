export function formatTime(time = 0) {
    const minutes = Math.floor(time/60);
    const seconds = Math.floor(time % 60);

    return `${minutes}:${seconds.toFixed(0).toString().padStart(2, "0")}`;
}