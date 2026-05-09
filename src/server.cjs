const http  = require('http');


const PORT = 8080;

const EXTERNAL_API_KEY = process.env.EXTERNAL_API_KEY || 'default_api_key';

const server = http.createServer(async(req, res) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if(req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    if (req.url === '/api/sigma' && req.method === 'GET') {
        try {
            const response = await fetch("https://api.sigma.com/data", {
                headers: {
                    "Authorization": `Bearer ${EXTERNAL_API_KEY}`
                }
        });
        const data = await response.text();
        res.writeHead(response.status, { 'Content-Type': 'application/json' });
            res.end(data);
    } catch(error) {
        console.error('Помилка проксі:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Внутрішня помилка сервера' }));
    }
}

else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Маршрут не знайдено' }));
    }
}
)
server.listen(PORT, () => {
    console.log(`Сервер працює на http://localhost:${PORT}`);
});