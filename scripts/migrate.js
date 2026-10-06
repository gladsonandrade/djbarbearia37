import { openDatabase } from '../src/db/database.js';
const db = openDatabase();
db.close();
console.log('Migrações aplicadas. Serviços aguardam configuração.');
