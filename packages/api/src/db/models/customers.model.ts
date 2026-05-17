import type { z } from 'zod';

import { boolean, integer, numeric, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

import users from '@/modules/users/users.model';
import { customerStatuses } from './lookups.model';

export const customers = pgTable('customers', {
  id: serial().primaryKey(),
  userId: text()
    .notNull()
    .unique()
    .references(() => users.id),
  customerStatusId: integer()
    .notNull()
    .references(() => customerStatuses.id),
  totalBookings: integer().notNull().default(0),
  totalSpent: numeric({ precision: 12, scale: 2 }).notNull().default('0.00'),
  createdAt: timestamp({ mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp({ mode: 'string' }).notNull().defaultNow(),
  isDeleted: boolean().notNull().default(false),
  deletedAt: timestamp({ mode: 'string' }),
});

export const customersSchema = createSelectSchema(customers);
export type Customers = z.infer<typeof customersSchema>;
export const insertCustomersSchema = createInsertSchema(customers);
export type NewCustomers = z.infer<typeof insertCustomersSchema>;
