import { relations } from 'drizzle-orm';
import { boolean, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

import { users } from '../../users.model';

// This table is managed by better-auth 2FA plugin. Schema must match better-auth's expected schema.
// Note: Table name is "two-factors" (camelCase) it is not as expected by better-auth but we are passing it in auth.ts
export const twoFactors = pgTable('two-factors', {
  id: serial('id').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => users.id),
  secret: text('secret').notNull(),
  backupCodes: text('backupCodes').notNull(),
  totpEnabled: boolean('totpEnabled').notNull().default(false),
  otpEnabled: boolean('otpEnabled').notNull().default(false),
  otpSecret: text('otpSecret'),
  lastCode: text('lastCode'),
  codeExpiresAt: timestamp('codeExpiresAt', { mode: 'string' }),
  createdAt: timestamp('createdAt', { mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'string' }).notNull().defaultNow(),
});

export const twoFactorsRelations = relations(twoFactors, ({ one }) => ({
  user: one(users, {
    fields: [twoFactors.userId],
    references: [users.id],
  }),
}));

export default twoFactors;
