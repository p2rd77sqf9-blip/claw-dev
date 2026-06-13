import { createServer } from 'http';
import { readFile } from 'fs/promises';
import { extname, join, resolve } from 'path';
import { fileURLToPath } from 'url';

const PORT = 3333;
const ROOT = fileURLToPath(new URL('.', import.meta.url));

const MIME = {
    '.html': 'text/html; charset=utf-8',
    '.js':   'application/javascript',
    '.css':  'text/css',
    '.ico':  'image/x-icon',
    '.png':  'image/png',
    '.svg':  'image/svg+xml',
};

const server = createServer(async (req, res) => {
    const urlPath  = req.url === '/' ? '/index.html' : req.url.split('?')[0];
    const filePath = resolve(join(ROOT, urlPath));

    // Prevent directory traversal
    if (!filePath.startsWith(ROOT)) {
        res.writeHead(403);
        return res.end('Forbidden');
    }

    try {
        const data = await readFile(filePath);
        const mime = MIME[extname(filePath)] ?? 'application/octet-stream';
        res.writeHead(200, { 'Content-Type': mime });
        res.end(data);
    } catch {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not found');
    }
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`\n  Audio Reactive Visualizer\n`);
    console.log(`  Local:   http://localhost:${PORT}`);
    console.log(`\n  Press Ctrl+C to stop.\n`);
});
