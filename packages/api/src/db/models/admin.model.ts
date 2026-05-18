import type { z } from 'zod';

import {
  boolean,
  integer,
  json,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

import { actionTypes, disputeStatuses, tiers } from './lookups.model';
import { bookings } from './bookings.model';

// ---------------------------------------------------------------------------
// commission_settings
// One row per tier defining the platform commission rate.
// ---------------------------------------------------------------------------

export const commissionSettings = pgTable('commission_settings', {
  id: serial().primaryKey(),
  tierId: integer()
    .notNull()
    .references(() => tiers.id)
    .unique(),
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

// ---------------------------------------------------------------------------
// disputes
// ---------------------------------------------------------------------------

export const disputes = pgTable('disputes', {
  id: serial().primaryKey(),
  bookingId: integer()
    .notNull()
    .references(() => bookings.id),
  raisedBy: text().notNull(),
  reason: text().notNull(),
  disputeStatusId: integer()
    .notNull()
    .references(() => disputeStatuses.id),
  resolvedBy: text(),
  resolutionNote: text(),
  createdAt: timestamp({ mode: 'string' }).notNull().defaultNow(),
  resolvedAt: timestamp({ mode: 'string' }),
  isDeleted: boolean().notNull().default(false),
  deletedAt: timestamp({ mode: 'string' }),
});

export const disputesSchema = createSelectSchema(disputes);
export type Disputes = z.infer<typeof disputesSchema>;
export const insertDisputesSchema = createInsertSchema(disputes);
export type NewDisputes = z.infer<typeof insertDisputesSchema>;

// ---------------------------------------------------------------------------
// fraud_flags
// ---------------------------------------------------------------------------

export const fraudFlags = pgTable('fraud_flags', {
  id: serial().primaryKey(),
  userId: text().notNull(),
  reason: text().notNull(),
  riskScore: integer().notNull().default(0),
  flaggedBySystem: boolean().notNull().default(false),
  flaggedByAdmin: text(),
  isResolved: boolean().notNull().default(false),
  resolvedAt: timestamp({ mode: 'string' }),
  createdAt: timestamp({ mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp({ mode: 'string' }).notNull().defaultNow(),
});

export const fraudFlagsSchema = createSelectSchema(fraudFlags);
export type FraudFlags = z.infer<typeof fraudFlagsSchema>;
export const insertFraudFlagsSchema = createInsertSchema(fraudFlags);
export type NewFraudFlags = z.infer<typeof insertFraudFlagsSchema>;

// ---------------------------------------------------------------------------
// admin_actions (audit log)
// ---------------------------------------------------------------------------

export const adminActions = pgTable('admin_actions', {
  id: serial().primaryKey(),
  adminId: text().notNull(),
  actionTypeId: integer()
    .notNull()
    .references(() => actionTypes.id),
  targetUserId: text().notNull(),
  reason: text(),
  metadata: json(),
  createdAt: timestamp({ mode: 'string' }).notNull().defaultNow(),
});

export const adminActionsSchema = createSelectSchema(adminActions);
export type AdminActions = z.infer<typeof adminActionsSchema>;
export const insertAdminActionsSchema = createInsertSchema(adminActions);
export type NewAdminActions = z.infer<typeof insertAdminActionsSchema>;
