const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 5000;
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8'
};

const SECURITY_HEADERS = {
  'Cache-Control': 'no-cache, no-store, must-revalidate',
  'X-Frame-Options': 'SAMEORIGIN',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin'
};

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  // Default to index.html for root
  if (pathname === '/' || pathname === '') {
    pathname = '/index.html';
  }

  let filePath = path.join(PUBLIC_DIR, pathname);

  // Clean URLs: If file doesn't exist, check for .html extension
  if (!fs.existsSync(filePath) && fs.existsSync(filePath + '.html')) {
    filePath = filePath + '.html';
  }

  // SPA fallback to /index.html if requested route is not an asset with an extension
  if (!fs.existsSync(filePath) && !path.extname(pathname)) {
    filePath = path.join(PUBLIC_DIR, 'index.html');
  }

  // Check if file exists
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    res.writeHead(404, Object.assign({ 'Content-Type': 'text/plain; charset=utf-8' }, SECURITY_HEADERS));
    res.end('404 Not Found: ' + pathname);
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  try {
    const data = fs.readFileSync(filePath);
    res.writeHead(200, Object.assign({ 'Content-Type': contentType }, SECURITY_HEADERS));
    res.end(data);
  } catch (err) {
    res.writeHead(500, Object.assign({ 'Content-Type': 'text/plain; charset=utf-8' }, SECURITY_HEADERS));
    res.end('500 Internal Server Error: ' + err.message);
  }
});

server.listen(PORT, () => {
  console.log(`\n👑 ========================================================`);
  console.log(`🚀 Sree Krushna Marriage OS — Local Dev Server Running!`);
  console.log(`==========================================================`);
  console.log(`🔗 Local URL:   http://localhost:${PORT}`);
  console.log(`📂 Serving:     ${PUBLIC_DIR}`);
  console.log(`🛡️  Headers:     Clean URLs & Security Headers Active`);
  console.log(`==========================================================`);
  console.log(`Press Ctrl+C to stop the server.\n`);
});

module.exports = server;
