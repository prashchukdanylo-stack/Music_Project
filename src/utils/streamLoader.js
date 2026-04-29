export async function* streamLoader(songs, chunkSize = 10) {

    if (!Array.isArray(songs)) throw new Error("songs must be array");
    if (chunkSize < 1) throw new Error("chunkSize is incorrect");
    
    let index = 0;
    while (index < songs.length) {
        const chunk = songs.slice(index, index + chunkSize);
        await new Promise(resolve => setTimeout(resolve, 200));
        index += chunkSize;
        
        yield chunk;
    }
};