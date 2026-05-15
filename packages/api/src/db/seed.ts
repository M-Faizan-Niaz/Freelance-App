/* eslint-disable no-console */
import type { Table } from 'drizzle-orm';

import type { Database } from '@/db';

import { getTableName, sql } from 'drizzle-orm';

import { env } from '@/config';
import db from '@/db';
import { allTables } from '@/db/tables';

import * as seeds from './seeds';

if (!env.DB_SEEDING) {
  throw new Error('You must set DB_SEEDING to true when running seeds');
}

async function resetTable(db: Database, table: Table) {
  const tableName = getTableName(table);
  // Always quote table name to preserve case sensitivity (e.g., camelCase)
  const quotedTableName = `"${tableName}"`;

  return db.execute(sql.raw(`TRUNCATE TABLE ${quotedTableName} RESTART IDENTITY CASCADE`));
}

async function setTimeZone(db: Database) {
  // set time to karachi
  return db.execute(sql.raw(`SET timezone = 'Asia/Karachi';`));
}

async function resetSequence(db: Database, tableName: string) {
  return db.execute(
    sql.raw(
      `SELECT setval(pg_get_serial_sequence('${tableName}', 'id'), COALESCE((SELECT MAX(id) FROM "${tableName}"), 1))`,
    ),
  );
}

await setTimeZone(db);

for (const table of allTables) {
  await resetTable(db, table);
}

await seeds.lookups(db);
await resetSequence(db, 'tiers');
await resetSequence(db, 'roles');
await resetSequence(db, 'service_categories');
await resetSequence(db, 'booking_statuses');
await resetSequence(db, 'customer_statuses');
await resetSequence(db, 'payment_methods');
await resetSequence(db, 'payment_statuses');
await resetSequence(db, 'action_types');
await resetSequence(db, 'dispute_statuses');
await resetSequence(db, 'payout_statuses');
await resetSequence(db, 'notification_types');
await resetSequence(db, 'message_types');
console.log('\n--- Lookup tables seeded ---\n');

await seeds.commissionSettings(db);
await resetSequence(db, 'commission_settings');
console.log('\n--- Commission settings seeded ---\n');

await seeds.colors(db);
await resetSequence(db, 'colors');
console.log('\n--- Colors seeded (drizzle-seed) ---\n');

await seeds.countries(db);
await resetSequence(db, 'countries');
console.log('\n--- Countries seeded ---\n');

await seeds.cities(db);
await resetSequence(db, 'cities');
console.log('\n--- Cities seeded ---\n');

await db.$client.end();
