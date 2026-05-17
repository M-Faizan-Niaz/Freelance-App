import { relations } from 'drizzle-orm';
import { boolean, integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { accounts } from './auth/models/accounts.model';
import { sessions } from './auth/models/sessions.model';
import { twoFactors } from './auth/models/two-factors.model';

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  name: text('name'),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').default(false).notNull(),
  image: text('image'),
  loginAttempts: integer('loginAttempts').default(0).notNull(),
  lockedAt: timestamp('lockedAt', { mode: 'string' }),
  twoFactorEnabled: boolean('twoFactorEnabled').default(false).notNull(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  country: text('country'),
  city: text('city'),
  institution: text('institution'),
  department: text('department'),
  isCompleted: boolean('is_completed').notNull().default(false),
  isAdmin: boolean('is_admin').notNull().default(false),
  createdAt: timestamp('createdAt', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  twoFactors: many(twoFactors),
}));

export default users;
