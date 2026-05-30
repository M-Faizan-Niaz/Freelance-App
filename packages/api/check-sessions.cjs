const { Pool } = require('pg');
const pool = new Pool({ host: 'localhost', port: 5433, user: 'nabeel', password: 'supersecret', database: 'viteplus' });

pool.query(`
  SELECT s.id, s."userId", s."expiresAt", s."createdAt", u.email
  FROM sessions s
  JOIN users u ON u.id = s."userId"
  WHERE u.email = 'ahmed.khan@serveease.test'
  ORDER BY s."createdAt" DESC
  LIMIT 5
`, (err, res) => {
  if (err) console.error(err.message);
  else console.log('sessions:', JSON.stringify(res.rows, null, 2));
  pool.end();
});
