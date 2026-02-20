export function formatTime(time) {
    const minutes = Math.floor(time/60);
    const seconds = time % 60;

    return `${minutes}:${seconds.toFixed(0).toString().padStart(2, "0")}`;
}