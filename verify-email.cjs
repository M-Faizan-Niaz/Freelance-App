const { Pool } = require('./node_modules/pg');
const pool = new Pool({ host: 'localhost', port: 5433, user: 'nabeel', password: 'supersecret', database: 'viteplus' });
pool.query('UPDATE "user" SET "emailVerified" = true WHERE email = $1', ['testcustomer@serveease.test'], (err, res) => {
  if (err) console.error(err.message);
  else console.log('rows updated:', res.rowCount);
  pool.end();
});
