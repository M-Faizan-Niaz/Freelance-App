import type { z } from 'zod';

import { boolean, pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

// ---------------------------------------------------------------------------
// tiers
// ---------------------------------------------------------------------------

export const tiers = pgTable('tiers', {
  id: serial().primaryKey(),
  name: varchar({ length: 50 }).unique().notNull(),
  description: text(),
  createdAt: timestamp({ mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp({ mode: 'string' }).notNull().defaultNow(),
  isDeleted: boolean().notNull().default(false),
  deletedAt: timestamp({ mode: 'string' }),
});

export const tiersSchema = createSelectSchema(tiers);
export type Tiers = z.infer<typeof tiersSchema>;
export const insertTiersSchema = createInsertSchema(tiers);
export type NewTiers = z.infer<typeof insertTiersSchema>;

// ---------------------------------------------------------------------------
// roles
// ---------------------------------------------------------------------------

export const roles = pgTable('roles', {
  id: serial().primaryKey(),
  name: varchar({ length: 50 }).unique().notNull(),
  description: text(),
  createdAt: timestamp({ mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp({ mode: 'string' }).notNull().defaultNow(),
  isDeleted: boolean().notNull().default(false),
  deletedAt: timestamp({ mode: 'string' }),
});

export const rolesSchema = createSelectSchema(roles);
export type Roles = z.infer<typeof rolesSchema>;
export const insertRolesSchema = createInsertSchema(roles);
export type NewRoles = z.infer<typeof insertRolesSchema>;

// ---------------------------------------------------------------------------
// service_categories
// ---------------------------------------------------------------------------

export const serviceCategories = pgTable('service_categories', {
  id: serial().primaryKey(),
  name: varchar({ length: 100 }).unique().notNull(),
  description: text(),
  isActive: boolean().notNull().default(true),
  createdAt: timestamp({ mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp({ mode: 'string' }).notNull().defaultNow(),
  isDeleted: boolean().notNull().default(false),
  deletedAt: timestamp({ mode: 'string' }),
});

export const serviceCategoriesSchema = createSelectSchema(serviceCategories);
export type ServiceCategories = z.infer<typeof serviceCategoriesSchema>;
export const insertServiceCategoriesSchema = createInsertSchema(serviceCategories);
export type NewServiceCategories = z.infer<typeof insertServiceCategoriesSchema>;

// ---------------------------------------------------------------------------
// booking_statuses
// ---------------------------------------------------------------------------

export const bookingStatuses = pgTable('booking_statuses', {
  id: serial().primaryKey(),
  name: varchar({ length: 50 }).unique().notNull(),
  description: text(),
  createdAt: timestamp({ mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp({ mode: 'string' }).notNull().defaultNow(),
  isDeleted: boolean().notNull().default(false),
  deletedAt: timestamp({ mode: 'string' }),
});

export const bookingStatusesSchema = createSelectSchema(bookingStatuses);
export type BookingStatuses = z.infer<typeof bookingStatusesSchema>;
export const insertBookingStatusesSchema = createInsertSchema(bookingStatuses);
export type NewBookingStatuses = z.infer<typeof insertBookingStatusesSchema>;

// ---------------------------------------------------------------------------
// customer_statuses
// ---------------------------------------------------------------------------

export const customerStatuses = pgTable('customer_statuses', {
  id: serial().primaryKey(),
  name: varchar({ length: 50 }).unique().notNull(),
  description: text(),
  createdAt: timestamp({ mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp({ mode: 'string' }).notNull().defaultNow(),
  isDeleted: boolean().notNull().default(false),
  deletedAt: timestamp({ mode: 'string' }),
});

export const customerStatusesSchema = createSelectSchema(customerStatuses);
export type CustomerStatuses = z.infer<typeof customerStatusesSchema>;
export const insertCustomerStatusesSchema = createInsertSchema(customerStatuses);
export type NewCustomerStatuses = z.infer<typeof insertCustomerStatusesSchema>;

// ---------------------------------------------------------------------------
// payment_methods
// ---------------------------------------------------------------------------

export const paymentMethods = pgTable('payment_methods', {
  id: serial().primaryKey(),
  name: varchar({ length: 50 }).unique().notNull(),
  description: text(),
  createdAt: timestamp({ mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp({ mode: 'string' }).notNull().defaultNow(),
  isDeleted: boolean().notNull().default(false),
  deletedAt: timestamp({ mode: 'string' }),
});

export const paymentMethodsSchema = createSelectSchema(paymentMethods);
export type PaymentMethods = z.infer<typeof paymentMethodsSchema>;
export const insertPaymentMethodsSchema = createInsertSchema(paymentMethods);
export type NewPaymentMethods = z.infer<typeof insertPaymentMethodsSchema>;

// ---------------------------------------------------------------------------
// payment_statuses
// ---------------------------------------------------------------------------

export const paymentStatuses = pgTable('payment_statuses', {
  id: serial().primaryKey(),
  name: varchar({ length: 50 }).unique().notNull(),
  description: text(),
  createdAt: timestamp({ mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp({ mode: 'string' }).notNull().defaultNow(),
  isDeleted: boolean().notNull().default(false),
  deletedAt: timestamp({ mode: 'string' }),
});

export const paymentStatusesSchema = createSelectSchema(paymentStatuses);
export type PaymentStatuses = z.infer<typeof paymentStatusesSchema>;
export const insertPaymentStatusesSchema = createInsertSchema(paymentStatuses);
export type NewPaymentStatuses = z.infer<typeof insertPaymentStatusesSchema>;

// ---------------------------------------------------------------------------
// action_types
// ---------------------------------------------------------------------------

export const actionTypes = pgTable('action_types', {
  id: serial().primaryKey(),
  name: varchar({ length: 50 }).unique().notNull(),
  description: text(),
  createdAt: timestamp({ mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp({ mode: 'string' }).notNull().defaultNow(),
  isDeleted: boolean().notNull().default(false),
  deletedAt: timestamp({ mode: 'string' }),
});

export const actionTypesSchema = createSelectSchema(actionTypes);
export type ActionTypes = z.infer<typeof actionTypesSchema>;
export const insertActionTypesSchema = createInsertSchema(actionTypes);
export type NewActionTypes = z.infer<typeof insertActionTypesSchema>;

// ---------------------------------------------------------------------------
// dispute_statuses
// ---------------------------------------------------------------------------

export const disputeStatuses = pgTable('dispute_statuses', {
  id: serial().primaryKey(),
  name: varchar({ length: 50 }).unique().notNull(),
  description: text(),
  createdAt: timestamp({ mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp({ mode: 'string' }).notNull().defaultNow(),
  isDeleted: boolean().notNull().default(false),
  deletedAt: timestamp({ mode: 'string' }),
});

export const disputeStatusesSchema = createSelectSchema(disputeStatuses);
export type DisputeStatuses = z.infer<typeof disputeStatusesSchema>;
export const insertDisputeStatusesSchema = createInsertSchema(disputeStatuses);
export type NewDisputeStatuses = z.infer<typeof insertDisputeStatusesSchema>;

// ---------------------------------------------------------------------------
// payout_statuses
// ---------------------------------------------------------------------------

export const payoutStatuses = pgTable('payout_statuses', {
  id: serial().primaryKey(),
  name: varchar({ length: 50 }).unique().notNull(),
  description: text(),
  createdAt: timestamp({ mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp({ mode: 'string' }).notNull().defaultNow(),
  isDeleted: boolean().notNull().default(false),
  deletedAt: timestamp({ mode: 'string' }),
});

export const payoutStatusesSchema = createSelectSchema(payoutStatuses);
export type PayoutStatuses = z.infer<typeof payoutStatusesSchema>;
export const insertPayoutStatusesSchema = createInsertSchema(payoutStatuses);
export type NewPayoutStatuses = z.infer<typeof insertPayoutStatusesSchema>;

// ---------------------------------------------------------------------------
// notification_types
// ---------------------------------------------------------------------------

export const notificationTypes = pgTable('notification_types', {
  id: serial().primaryKey(),
  name: varchar({ length: 50 }).unique().notNull(),
  description: text(),
  createdAt: timestamp({ mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp({ mode: 'string' }).notNull().defaultNow(),
  isDeleted: boolean().notNull().default(false),
  deletedAt: timestamp({ mode: 'string' }),
});

export const notificationTypesSchema = createSelectSchema(notificationTypes);
export type NotificationTypes = z.infer<typeof notificationTypesSchema>;
export const insertNotificationTypesSchema = createInsertSchema(notificationTypes);
export type NewNotificationTypes = z.infer<typeof insertNotificationTypesSchema>;

// ---------------------------------------------------------------------------
// message_types
// ---------------------------------------------------------------------------

export const messageTypes = pgTable('message_types', {
  id: serial().primaryKey(),
  name: varchar({ length: 50 }).unique().notNull(),
  description: text(),
  createdAt: timestamp({ mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp({ mode: 'string' }).notNull().defaultNow(),
  isDeleted: boolean().notNull().default(false),
  deletedAt: timestamp({ mode: 'string' }),
});

export const messageTypesSchema = createSelectSchema(messageTypes);
export type MessageTypes = z.infer<typeof messageTypesSchema>;
export const insertMessageTypesSchema = createInsertSchema(messageTypes);
export type NewMessageTypes = z.infer<typeof insertMessageTypesSchema>;
