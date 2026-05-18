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
import { bookingStatuses, serviceCategories } from './lookups.model';
import { customers } from './customers.model';
import { serviceProviders } from './service-providers.model';

// ---------------------------------------------------------------------------
// bookings
// ---------------------------------------------------------------------------

export const bookings = pgTable('bookings', {
  id: serial().primaryKey(),
  customerId: integer()
    .notNull()
    .references(() => customers.id),
  providerId: integer()
    .notNull()
    .references(() => serviceProviders.id),
  categoryId: integer()
    .notNull()
    .references(() => serviceCategories.id),
  scheduledAt: timestamp({ mode: 'string' }).notNull(),
  completedAt: timestamp({ mode: 'string' }),
  customerLatitude: numeric({ precision: 10, scale: 7 }),
  customerLongitude: numeric({ precision: 10, scale: 7 }),
  customerAddress: text().notNull(),
  description: text(),
  estimatedPrice: numeric({ precision: 10, scale: 2 }),
  finalPrice: numeric({ precision: 10, scale: 2 }),
  commissionRate: numeric({ precision: 5, scale: 2 }),
  commissionAmount: numeric({ precision: 10, scale: 2 }),
  statusId: integer()
    .notNull()
    .references(() => bookingStatuses.id),
  cancelledBy: text().references(() => users.id),
  cancellationReason: text(),
  createdAt: timestamp({ mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp({ mode: 'string' }).notNull().defaultNow(),
  isDeleted: boolean().notNull().default(false),
  deletedAt: timestamp({ mode: 'string' }),
});

export const bookingsSchema = createSelectSchema(bookings);
export type Bookings = z.infer<typeof bookingsSchema>;
export const insertBookingsSchema = createInsertSchema(bookings);
export type NewBookings = z.infer<typeof insertBookingsSchema>;

// ---------------------------------------------------------------------------
// booking_completion_photos
// ---------------------------------------------------------------------------

export const bookingCompletionPhotos = pgTable('booking_completion_photos', {
  id: serial().primaryKey(),
  bookingId: integer()
    .notNull()
    .references(() => bookings.id, { onDelete: 'cascade' }),
  imageUrl: varchar({ length: 1024 }).notNull(),
  fileName: varchar({ length: 512 }).notNull(),
  createdAt: timestamp({ mode: 'string' }).notNull().defaultNow(),
});

export const bookingCompletionPhotosSchema = createSelectSchema(bookingCompletionPhotos);
export type BookingCompletionPhotos = z.infer<typeof bookingCompletionPhotosSchema>;
export const insertBookingCompletionPhotosSchema = createInsertSchema(bookingCompletionPhotos);
export type NewBookingCompletionPhotos = z.infer<typeof insertBookingCompletionPhotosSchema>;
