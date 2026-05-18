import type { z } from 'zod';

import {
  boolean,
  integer,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

import users from '@/modules/users/users.model';
import { paymentMethods, paymentStatuses, payoutStatuses } from './lookups.model';
import { customers } from './customers.model';
import { bookings } from './bookings.model';
import { serviceProviders } from './service-providers.model';

// ---------------------------------------------------------------------------
// payments
// ---------------------------------------------------------------------------

export const payments = pgTable('payments', {
  id: serial().primaryKey(),
  bookingId: integer()
    .notNull()
    .unique()
    .references(() => bookings.id),
  customerId: integer()
    .notNull()
    .references(() => customers.id),
  amount: numeric({ precision: 10, scale: 2 }).notNull(),
  paymentMethodId: integer()
    .notNull()
    .references(() => paymentMethods.id),
  paymentStatusId: integer()
    .notNull()
    .references(() => paymentStatuses.id),
  proofImageUrl: varchar({ length: 1024 }),
  proofImageKey: varchar({ length: 512 }),
  transactionReference: varchar({ length: 255 }),
  notes: text(),
  reviewedBy: text().references(() => users.id),
  reviewedAt: timestamp({ mode: 'string' }),
  rejectionReason: text(),
  createdAt: timestamp({ mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp({ mode: 'string' }).notNull().defaultNow(),
  isDeleted: boolean().notNull().default(false),
  deletedAt: timestamp({ mode: 'string' }),
});

export const paymentsSchema = createSelectSchema(payments);
export type Payments = z.infer<typeof paymentsSchema>;
export const insertPaymentsSchema = createInsertSchema(payments);
export type NewPayments = z.infer<typeof insertPaymentsSchema>;

// ---------------------------------------------------------------------------
// payout_requests
// ---------------------------------------------------------------------------

export const payoutRequests = pgTable('payout_requests', {
  id: serial().primaryKey(),
  providerId: integer()
    .notNull()
    .references(() => serviceProviders.id),
  amount: numeric({ precision: 10, scale: 2 }).notNull(),
  payoutStatusId: integer()
    .notNull()
    .references(() => payoutStatuses.id),
  requestedAt: timestamp({ mode: 'string' }).notNull().defaultNow(),
  processedAt: timestamp({ mode: 'string' }),
  processedBy: text(),
  createdAt: timestamp({ mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp({ mode: 'string' }).notNull().defaultNow(),
  isDeleted: boolean().notNull().default(false),
  deletedAt: timestamp({ mode: 'string' }),
});

export const payoutRequestsSchema = createSelectSchema(payoutRequests);
export type PayoutRequests = z.infer<typeof payoutRequestsSchema>;
export const insertPayoutRequestsSchema = createInsertSchema(payoutRequests);
export type NewPayoutRequests = z.infer<typeof insertPayoutRequestsSchema>;
