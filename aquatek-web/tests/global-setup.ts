import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve } from 'node:path';

export default async function globalSetup(): Promise<() => Promise<void>> {
  const root = resolve('dist');
  const contentTypes: Record<string, string> = {
    '.css': 'text/css; charset=utf-8',
    '.html': 'text/html; charset=utf-8',
    '.ico': 'image/x-icon',
    '.js': 'text/javascript; charset=utf-8',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.txt': 'text/plain; charset=utf-8',
    '.woff2': 'font/woff2',
    '.xml': 'application/xml; charset=utf-8',
  };

  const server = createServer((request, response) => {
    const requestedPath = decodeURIComponent(
      new URL(request.url ?? '/', 'http://localhost').pathname,
    );
    const relativePath = normalize(requestedPath).replace(/^([/\\])+/, '');
    let filePath = join(root, relativePath || 'index.html');

    if (!filePath.startsWith(root)) {
      response.writeHead(400).end('Invalid path');
      return;
    }

    if (existsSync(filePath) && statSync(filePath).isDirectory()) {
      filePath = join(filePath, 'index.html');
    }

    if (!existsSync(filePath)) {
      filePath = join(root, '404.html');
      response.statusCode = 404;
    }

    response.setHeader(
      'Content-Type',
      contentTypes[extname(filePath)] ?? 'application/octet-stream',
    );
    createReadStream(filePath).pipe(response);
  });

  await new Promise<void>((resolveListening) => {
    server.listen(4321, '127.0.0.1', resolveListening);
  });

  return () => new Promise<void>((resolveClosed) => server.close(() => resolveClosed()));
}
