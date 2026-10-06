import { backup } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { openDatabase } from '../src/db/database.js';
mkdirSync('./backups', { recursive: true });
const db = openDatabase();
const path = `./backups/agenda-${new Date().toISOString().replaceAll(':', '-')}.sqlite`;
try { await backup(db, path); console.log(path); } finally { db.close(); }
// Copiar o resultado para outro equipamento. Backup na própria Raspberry não protege contra perda do cartão.
