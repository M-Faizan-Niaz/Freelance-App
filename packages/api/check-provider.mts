import pg from 'pg'

const c = new pg.Pool({ host: 'localhost', port: 5433, user: 'nabeel', password: 'supersecret', database: 'viteplus' })

const r = await c.query(`
  SELECT u.id as user_id, u.email, up.full_name, up.role_id,
         sp.id as sp_id, sp.verification_status, sp.is_online
  FROM users u
  LEFT JOIN user_profiles up ON up.user_id = u.id
  LEFT JOIN service_providers sp ON sp.user_id = u.id
  WHERE u.email = 'rimaw51378@ifcoat.com'
`)
console.log('Provider record:', JSON.stringify(r.rows, null, 2))

const roles = await c.query(`SELECT id, name FROM roles`)
console.log('Roles:', JSON.stringify(roles.rows, null, 2))

await c.end()
