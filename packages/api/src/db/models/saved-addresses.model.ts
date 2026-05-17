import type { z } from 'zod';

import { boolean, integer, numeric, pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

import { customers } from './customers.model';

export const savedAddresses = pgTable('saved_addresses', {
  id: serial().primaryKey(),
  customerId: integer()
    .notNull()
    .references(() => customers.id, { onDelete: 'cascade' }),
  label: varchar({ length: 100 }).notNull(),
  addressText: text().notNull(),
  latitude: numeric({ precision: 10, scale: 7 }),
  longitude: numeric({ precision: 10, scale: 7 }),
  isDefault: boolean().notNull().default(false),
  createdAt: timestamp({ mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp({ mode: 'string' }).notNull().defaultNow(),
});

export const savedAddressesSchema = createSelectSchema(savedAddresses);
export type SavedAddresses = z.infer<typeof savedAddressesSchema>;
export const insertSavedAddressesSchema = createInsertSchema(savedAddresses);
export type NewSavedAddresses = z.infer<typeof insertSavedAddressesSchema>;
