import type { z } from 'zod';

import { boolean, integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

import { bookings } from './bookings.model';
import { customers } from './customers.model';
import { serviceProviders } from './service-providers.model';

export const reviews = pgTable('reviews', {
  id: serial().primaryKey(),
  bookingId: integer()
    .notNull()
    .unique()
    .references(() => bookings.id),
  customerId: integer()
    .notNull()
    .references(() => customers.id),
  providerId: integer()
    .notNull()
    .references(() => serviceProviders.id),
  rating: integer().notNull(),
  comment: text(),
  createdAt: timestamp({ mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp({ mode: 'string' }).notNull().defaultNow(),
  isDeleted: boolean().notNull().default(false),
  deletedAt: timestamp({ mode: 'string' }),
});

export const reviewsSchema = createSelectSchema(reviews);
export type Reviews = z.infer<typeof reviewsSchema>;
export const insertReviewsSchema = createInsertSchema(reviews);
export type NewReviews = z.infer<typeof insertReviewsSchema>;
