import { defineConfig } from 'drizzle-kit';

import { env } from './src/config';

export default defineConfig({
  schema: './src/db/models/index.ts',
  out: './src/db/migrations',
  dialect: 'postgresql',
  verbose: false,
  strict: true,
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  migrations: {
    schema: 'public',
  },
  casing: 'snake_case',
});
