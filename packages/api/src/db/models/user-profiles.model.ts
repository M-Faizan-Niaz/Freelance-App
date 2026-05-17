import type { z } from 'zod';

import { boolean, integer, pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

import users from '@/modules/users/users.model';
import { roles } from './lookups.model';

export const userProfiles = pgTable('user_profiles', {
  id: serial().primaryKey(),
  userId: text()
    .notNull()
    .unique()
    .references(() => users.id),
  roleId: integer()
    .notNull()
    .references(() => roles.id),
  fullName: varchar({ length: 100 }).notNull(),
  phoneNumber: varchar({ length: 20 }),
  phoneVerified: boolean().notNull().default(false),
  profilePhotoUrl: varchar({ length: 255 }),
  isActive: boolean().notNull().default(true),
  createdBy: text(),
  updatedBy: text(),
  createdAt: timestamp({ mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp({ mode: 'string' }).notNull().defaultNow(),
  isDeleted: boolean().notNull().default(false),
  deletedAt: timestamp({ mode: 'string' }),
});

export const userProfilesSchema = createSelectSchema(userProfiles);
export type UserProfiles = z.infer<typeof userProfilesSchema>;
export const insertUserProfilesSchema = createInsertSchema(userProfiles);
export type NewUserProfiles = z.infer<typeof insertUserProfilesSchema>;
