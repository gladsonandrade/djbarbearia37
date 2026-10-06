import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { Worker } from 'node:worker_threads';
import { openDatabase } from '../src/db/database.js';
import { createHold } from '../src/modules/bookings/repository.js';

const sample = { customerName: 'Cliente de teste', customerPhone: '5579999999999', mode: 'home',
  startsAt: 10000000, endsAt: 11800000, occupiedStart: 8800000, occupiedEnd: 13600000 };

test('reserva domiciliar impede conflito na barbearia; expiração libera o período', () => {
  const db = openDatabase(':memory:');
  try {
    createHold(db, sample, { now: 1000 });
    assert.throws(() => createHold(db, { ...sample, mode: 'shop' }, { now: 1001 }), /SLOT_UNAVAILABLE/);
    const next = createHold(db, { ...sample, mode: 'shop' }, { now: 3601000 });
    assert.equal(next.status, 'pending');
    assert.equal(db.prepare("SELECT COUNT(*) AS n FROM bookings WHERE status='expired'").get().n, 1);
  } finally { db.close(); }
});

test('bloqueio manual também impede a reserva', () => {
  const db = openDatabase(':memory:');
  try {
    db.prepare('INSERT INTO schedule_blocks VALUES (?, ?, ?, ?)').run('folga', 8000000, 14000000, 'Compromisso');
    assert.throws(() => createHold(db, sample, { now: 1000 }), /SLOT_UNAVAILABLE/);
    assert.equal(db.prepare('SELECT COUNT(*) AS n FROM bookings').get().n, 0);
  } finally { db.close(); }
});

test('duas conexões concorrentes não reservam o mesmo período', async () => {
  const directory = mkdtempSync(join(tmpdir(), 'dj-agenda-'));
  const path = join(directory, 'test.sqlite');
  openDatabase(path).close();
  const barrier = new SharedArrayBuffer(4);
  const source = `
    const { workerData, parentPort } = require('node:worker_threads');
    (async () => {
      const { openDatabase } = await import(workerData.databaseModule);
      const { createHold } = await import(workerData.repositoryModule);
      const db = openDatabase(workerData.path);
      const gate = new Int32Array(workerData.barrier);
      Atomics.add(gate, 0, 1); Atomics.notify(gate, 0);
      while (Atomics.load(gate, 0) < 2) Atomics.wait(gate, 0, 1, 1000);
      try { createHold(db, workerData.sample, { now: 1000 }); parentPort.postMessage('ok'); }
      catch (error) { parentPort.postMessage(error.message); }
      finally { db.close(); }
    })().catch(error => { throw error; });
  `;
  const workers = [];
  try {
    const results = await Promise.all([1, 2].map(() => new Promise((resolve, reject) => {
      const worker = new Worker(source, { eval: true, workerData: { path, sample, barrier,
        databaseModule: new URL('../src/db/database.js', import.meta.url).href,
        repositoryModule: new URL('../src/modules/bookings/repository.js', import.meta.url).href } });
      workers.push(worker);
      worker.once('message', resolve); worker.once('error', reject);
    })));
    assert.deepEqual(results.sort(), ['SLOT_UNAVAILABLE', 'ok']);
  } finally {
    await Promise.all(workers.map(worker => worker.terminate()));
    rmSync(directory, { recursive: true, force: true });
  }
});
