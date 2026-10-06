import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';

// Rotas deliberadamente limitadas: painel e endpoints de escrita serão habilitados
// somente após login, autorização, validação e controle de abuso.
const publicFiles = new Map([
  ['/', ['../../web/public/index.html', 'text/html; charset=utf-8']],
  ['/styles.css', ['../../web/public/styles.css', 'text/css; charset=utf-8']],
  ['/app.js', ['../../web/public/app.js', 'text/javascript; charset=utf-8']],
  ['/assets/logo-dj-barbearia.jpeg', ['../../web/public/assets/logo-dj-barbearia.jpeg', 'image/jpeg']],
  ['/assets/favicon.svg', ['../../web/public/assets/favicon.svg', 'image/svg+xml']],
]);

export function createApp(db) {
  return createServer((request, response) => {
    response.setHeader('X-Content-Type-Options', 'nosniff');
    response.setHeader('Referrer-Policy', 'no-referrer');
    response.setHeader('Content-Security-Policy', "default-src 'self'; style-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'");
    response.setHeader('Cache-Control', 'no-store');
    const json = (status, value) => {
      response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
      response.end(JSON.stringify(value));
    };
    try {
      const path = new URL(request.url, 'http://localhost').pathname;
      if (request.method !== 'GET') return json(405, { error: 'METHOD_NOT_ALLOWED' });
      if (path === '/api/health') {
        db.prepare('SELECT 1').get();
        return json(200, { status: 'ok', version: '0.1.0', stage: 'landing' });
      }
      if (path === '/api/services') {
        return json(200, { services: db.prepare('SELECT id, name, price_cents, duration_minutes FROM services WHERE active = 1').all() });
      }
      if (path === '/admin' || path.startsWith('/api/admin/')) return json(501, { error: 'ADMIN_NOT_IMPLEMENTED' });
      const file = publicFiles.get(path);
      if (!file) return json(404, { error: 'NOT_FOUND' });
      const content = readFileSync(new URL(file[0], import.meta.url));
      response.writeHead(200, { 'Content-Type': file[1] });
      response.end(content);
    } catch {
      json(500, { error: 'INTERNAL_ERROR' });
    }
  });
}
