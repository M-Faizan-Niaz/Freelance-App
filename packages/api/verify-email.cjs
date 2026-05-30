const { Pool } = require('pg');
const pool = new Pool({ host: 'localhost', port: 5433, user: 'nabeel', password: 'supersecret', database: 'viteplus' });
pool.query('UPDATE users SET "emailVerified" = true WHERE email = $1 RETURNING id, email, "emailVerified"', ['testcustomer@serveease.test'], (err, res) => {
  if (err) console.error(err.message);
  else console.log('updated:', res.rows);
  pool.end();
});
