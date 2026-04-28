export async function* streamLoader(songs, chunkSize = 10) {
    let index = 0;
    while (index < songs.length) {
        const chunk = songs.slice(index, index + chunkSize);
        await new Promise(resolve => setTimeout(resolve, 1000));
        index += chunkSize;
        
        yield chunk;
    }
};