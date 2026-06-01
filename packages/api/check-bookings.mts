import pg from 'pg'

const c = new pg.Pool({ host: 'localhost', port: 5433, user: 'nabeel', password: 'supersecret', database: 'viteplus' })
const r = await c.query(`
  SELECT b.id, bs.name as status, sp_up.full_name as provider_name,
         c_up.full_name as customer_name, sp_u.email as provider_email
  FROM bookings b
  JOIN booking_statuses bs ON bs.id = b.status_id
  JOIN service_providers sp ON sp.id = b.provider_id
  JOIN user_profiles sp_up ON sp_up.user_id = sp.user_id
  JOIN users sp_u ON sp_u.id = sp.user_id
  JOIN customers c ON c.id = b.customer_id
  JOIN user_profiles c_up ON c_up.user_id = c.user_id
  WHERE b.is_deleted = false
  ORDER BY b.created_at DESC LIMIT 10
`)
console.log(JSON.stringify(r.rows, null, 2))
await c.end()
