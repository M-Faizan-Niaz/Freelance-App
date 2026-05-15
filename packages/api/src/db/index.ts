import { drizzle } from 'drizzle-orm/postgres-js';

import { appConfig, env } from '@/config';
import * as schema from '@/db/models';

export const db = drizzle({
  connection: {
    url: env.DATABASE_URL,
    max: env.DB_MIGRATING || env.DB_SEEDING ? 1 : undefined,
    onnotice: env.DB_MIGRATING || env.DB_SEEDING ? () => {} : undefined, // Ignore notices during migration and seeding
  },
  schema,
  casing: 'snake_case',
  logger: appConfig.isDevelopment,
});

export type Database = typeof db;

export default db;
