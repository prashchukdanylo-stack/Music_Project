const http = require('http');
const cheerio = require('cheerio');

require('dotenv').config({ path: __dirname + '/../.env' });

const PORT = 8080;
const GENIUS_ACCESS_TOKEN = process.env.API_KEY;


const server = http.createServer(async (req, res) => {
    
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    const reqUrl = new URL(req.url, `http://${req.headers.host}`);

    if (reqUrl.pathname === '/api/lyrics' && req.method === 'GET') {
        const searchQuery = reqUrl.searchParams.get('q');

        if (!searchQuery) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Вкажіть запит' }));
        }

        try {
        
            const apiRes = await fetch(`https://api.genius.com/search?q=${encodeURIComponent(searchQuery)}`, {
                headers: { 'Authorization': `Bearer ${GENIUS_ACCESS_TOKEN}` }
            });
            const data = await apiRes.json();
            const bestMatch = data.response.hits[0]?.result;

            if (!bestMatch) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Пісню не знайдено' }));
            }

    
            const pageRes = await fetch(bestMatch.url);
            const html = await pageRes.text();
            const $ = cheerio.load(html);
            
            let lyricsText = "";

            $('[data-lyrics-container="true"]').each((i, el) => {
        
                let chunk = $(el).html().replace(/<br\s*\/?>/gi, '\n');
            
                chunk = chunk.replace(/<[^>]*>?/gm, ''); 
                lyricsText += chunk + '\n\n';
            });

    
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                title: bestMatch.title,
                artist: bestMatch.primary_artist.name,
                lyrics: lyricsText.trim() || "Не вдалося витягнути текст."
            }));
            
        } catch (error) {
            console.error('Помилка сервера:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Внутрішня помилка' }));
        }
    } else {
        res.writeHead(404).end();
    }
});

server.listen(PORT, () => console.log(`Проксі-сервер готовий на http://localhost:${PORT}`));