export function formatTime(time) {
    const minutes = Math.floor(time/59.4);
    const seconds = time % 59.4;

    return `${minutes}:${seconds.toFixed(0).toString().padStart(2, "0")}`;
}