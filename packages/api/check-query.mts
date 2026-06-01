import pg from 'pg'

const c = new pg.Pool({ host: 'localhost', port: 5433, user: 'nabeel', password: 'supersecret', database: 'viteplus' })

// Simulate the exact listByProvider query (after my fix)
const r = await c.query(`
  SELECT
    bookings.id,
    bookings.customer_id as "customerId",
    bookings.provider_id as "providerId",
    bookings.category_id as "categoryId",
    bookings.scheduled_at as "scheduledAt",
    bookings.status_id as "statusId",
    booking_statuses.name as "statusName",
    user_profiles.full_name as "providerName",
    bookings.is_deleted as "isDeleted"
  FROM bookings
  INNER JOIN booking_statuses ON booking_statuses.id = bookings.status_id
  INNER JOIN service_providers ON service_providers.id = bookings.provider_id
  INNER JOIN user_profiles ON user_profiles.user_id = service_providers.user_id
  WHERE bookings.provider_id = 11 AND bookings.is_deleted = false
`)
console.log('listByProvider(11) result:', JSON.stringify(r.rows, null, 2))

// Also check what happens with listByCustomer
const r2 = await c.query(`
  SELECT
    bookings.id,
    bookings.provider_id as "providerId",
    booking_statuses.name as "statusName",
    user_profiles.full_name as "providerName"
  FROM bookings
  INNER JOIN booking_statuses ON booking_statuses.id = bookings.status_id
  INNER JOIN service_providers ON service_providers.id = bookings.provider_id
  INNER JOIN user_profiles ON user_profiles.user_id = service_providers.user_id
  WHERE bookings.customer_id = 1 AND bookings.is_deleted = false
`)
console.log('listByCustomer(1) result:', JSON.stringify(r2.rows, null, 2))

await c.end()
