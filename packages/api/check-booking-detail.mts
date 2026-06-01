import pg from 'pg'

const c = new pg.Pool({ host: 'localhost', port: 5433, user: 'nabeel', password: 'supersecret', database: 'viteplus' })

const b = await c.query(`SELECT b.*, bs.name as status_name FROM bookings b JOIN booking_statuses bs ON bs.id = b.status_id WHERE b.is_deleted = false`)
console.log('Bookings:', JSON.stringify(b.rows, null, 2))

const bs = await c.query(`SELECT * FROM booking_statuses`)
console.log('Booking statuses:', JSON.stringify(bs.rows, null, 2))

await c.end()
