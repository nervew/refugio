import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { normalizeBasePath } from '../src/domain/base-path.ts';
const basePath = normalizeBasePath(process.env.BASE_PATH ?? '/');
const port = Number(process.env.PORT ?? 4173);
const root = resolve('dist');
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webmanifest': 'application/manifest+json',
};
const csp =
  "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'";
http
  .createServer(async (req, res) => {
    let path;
    try {
      const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
      if (basePath !== '/' && pathname === basePath.slice(0, -1)) {
        res.writeHead(308, { Location: basePath }).end();
        return;
      }
      if (!pathname.startsWith(basePath)) {
        res.writeHead(404).end();
        return;
      }
      path = resolve(root, pathname.slice(basePath.length));
    } catch {
      res.writeHead(400).end();
      return;
    }
    if (path !== root && !path.startsWith(root + sep)) {
      res.writeHead(403).end();
      return;
    }
    if (!extname(path)) path = resolve(root, 'index.html');
    try {
      const body = await readFile(path);
      res.writeHead(200, {
        'Content-Type': mime[extname(path)] ?? 'application/octet-stream',
        'Content-Security-Policy': csp,
        'Referrer-Policy': 'no-referrer',
        'X-Content-Type-Options': 'nosniff',
        'Cross-Origin-Opener-Policy': 'same-origin',
        'Cache-Control': path.includes('/assets/')
          ? 'public, max-age=31536000, immutable'
          : 'no-cache',
      });
      res.end(body);
    } catch {
      res.writeHead(404, { 'Content-Type': 'text/plain' }).end('Recurso no disponible');
    }
  })
  .listen(port, '0.0.0.0', () =>
    process.stdout.write(`Refugio disponible en http://localhost:${port}${basePath}\n`),
  );
