import type { z } from 'zod';

import { integer, numeric, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

import { tiers } from './lookups.model';

// ---------------------------------------------------------------------------
// commission_settings
// One row per tier defining the platform commission rate.
// Remaining admin tables (disputes, fraud_flags, admin_actions) are added in Module 12.
// ---------------------------------------------------------------------------

export const commissionSettings = pgTable('commission_settings', {
  id: serial().primaryKey(),
  tierId: integer().notNull().references(() => tiers.id).unique(),
  commissionRate: numeric({ precision: 5, scale: 2 }).notNull(),
  effectiveFrom: timestamp({ mode: 'string' }).notNull(),
  createdBy: text(),
  createdAt: timestamp({ mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp({ mode: 'string' }).notNull().defaultNow(),
});

export const commissionSettingsSchema = createSelectSchema(commissionSettings);
export type CommissionSettings = z.infer<typeof commissionSettingsSchema>;
export const insertCommissionSettingsSchema = createInsertSchema(commissionSettings);
export type NewCommissionSettings = z.infer<typeof insertCommissionSettingsSchema>;
