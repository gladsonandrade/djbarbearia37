import test from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { openDatabase } from '../src/db/database.js';
import { createApp } from '../src/server/app.js';

test('servidor responde, não publica dados privados nem agenda ainda não configurada', async () => {
  const db = openDatabase(':memory:');
  const app = createApp(db);
  app.listen(0, '127.0.0.1');
  await once(app, 'listening');
  const base = `http://127.0.0.1:${app.address().port}`;
  try {
    assert.equal((await (await fetch(`${base}/api/health`)).json()).status, 'ok');
    assert.deepEqual(await (await fetch(`${base}/api/services`)).json(), { services: [] });
    assert.equal((await fetch(`${base}/admin`)).status, 501);
    assert.equal((await fetch(`${base}/data/agenda.sqlite`)).status, 404);
    assert.equal((await fetch(`${base}/api/bookings`, { method: 'POST' })).status, 405);
    assert.match(await (await fetch(base)).text(), /DJ Barbearia/);
    for (const [path, type] of [
      ['/app.js', 'text/javascript'],
      ['/styles.css', 'text/css'],
      ['/assets/logo-dj-barbearia.jpeg', 'image/jpeg'],
      ['/assets/favicon.svg', 'image/svg+xml'],
    ]) {
      const asset = await fetch(base + path);
      assert.equal(asset.status, 200, path);
      assert.ok(asset.headers.get('content-type').startsWith(type), path);
      assert.ok((await asset.arrayBuffer()).byteLength > 0, path);
    }
    assert.equal((await fetch(`${base}/assets/unknown.jpeg`)).status, 404);
  } finally {
    await new Promise(resolve => app.close(resolve)); db.close();
  }
});
