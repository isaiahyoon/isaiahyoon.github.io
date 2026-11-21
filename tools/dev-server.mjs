import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(fileURLToPath(new URL('../', import.meta.url)));
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.pdf': 'application/pdf' };

export function createDevServer() {
  return createServer(async (request, response) => {
    let pathname;
    try {
      pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    } catch {
      response.writeHead(400).end('Bad request');
      return;
    }
    if (pathname !== '/' && pathname.endsWith('/')) {
      const query = new URL(request.url, 'http://localhost').search;
      response.writeHead(301, { Location: `${pathname.slice(0, -1)}${query}` }).end();
      return;
    }
    const relative = pathname.endsWith('/') || !path.extname(pathname)
      ? path.join(pathname.slice(1), 'index.html')
      : pathname.slice(1);
    const file = path.resolve(root, relative);
    if (!file.startsWith(`${root}${path.sep}`) || !types[path.extname(file)]) {
      response.writeHead(404).end('Not found');
      return;
    }
    try {
      const content = await readFile(file);
      response.writeHead(200, { 'Content-Type': types[path.extname(file)] });
      response.end(content);
    } catch (error) {
      if (error.code === 'ENOENT' || error.code === 'EISDIR') {
        response.writeHead(404).end('Not found');
      } else {
        console.error('Unable to serve requested file:', error);
        response.writeHead(500).end('Server error');
      }
    }
  });
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  createDevServer().listen(8002, '127.0.0.1', () => console.log('Site available at http://localhost:8002'));
}
