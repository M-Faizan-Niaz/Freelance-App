import config from '$/drizzle.config';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { env } from '@/config';
import db from '@/db';

if (!env.DB_MIGRATING) {
  throw new Error('You must set DB_MIGRATING to true when running migrations');
}

await migrate(db, {
  migrationsFolder: config.out!,
  migrationsSchema: config.migrations!.schema,
});

await db.$client.end();
