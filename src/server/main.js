import { openDatabase } from '../db/database.js';
import { createApp } from './app.js';
const db = openDatabase();
const server = createApp(db);
const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || '127.0.0.1';
server.listen(port, host, () => console.log(`Base DJ Barbearia 37: http://${host}:${port}`));
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.once(signal, () => server.close(() => { db.close(); process.exit(0); }));
}
