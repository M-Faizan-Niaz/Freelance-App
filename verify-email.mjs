import pg from 'D:/Freelance-App/node_modules/pg/lib/index.js';
const { Pool } = pg;
const pool = new Pool({ host: 'localhost', port: 5433, user: 'nabeel', password: 'supersecret', database: 'viteplus' });
const res = await pool.query('UPDATE "user" SET "emailVerified" = true WHERE email = $1', ['testcustomer@serveease.test']);
console.log('rows updated:', res.rowCount);
await pool.end();
