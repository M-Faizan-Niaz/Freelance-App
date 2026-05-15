import type { z } from 'zod';

import { boolean, integer, numeric, pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

import users from '@/modules/users/users.model';
import { tiers } from './lookups.model';

// ---------------------------------------------------------------------------
// service_providers
// Full table — provider_services, provider_documents, portfolio_images,
// availability_slots are added in Module 5.
// ---------------------------------------------------------------------------

export const serviceProviders = pgTable('service_providers', {
  id: serial().primaryKey(),
  userId: text().notNull().unique().references(() => users.id),
  cnicNumber: varchar({ length: 20 }).notNull().unique(),
  isCnicVerified: boolean().notNull().default(false),
  hourlyRate: numeric({ precision: 10, scale: 2 }).notNull().default('0.00'),
  tierId: integer().notNull().references(() => tiers.id),
  isOnline: boolean().notNull().default(false),
  totalJobsCompleted: integer().notNull().default(0),
  averageRating: numeric({ precision: 3, scale: 2 }).default('0.00'),
  bio: text(),
  coverageRadiusKm: numeric({ precision: 6, scale: 2 }),
  city: varchar({ length: 100 }),
  createdAt: timestamp({ mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp({ mode: 'string' }).notNull().defaultNow(),
  isDeleted: boolean().notNull().default(false),
  deletedAt: timestamp({ mode: 'string' }),
});

export const serviceProvidersSchema = createSelectSchema(serviceProviders);
export type ServiceProviders = z.infer<typeof serviceProvidersSchema>;
export const insertServiceProvidersSchema = createInsertSchema(serviceProviders);
export type NewServiceProviders = z.infer<typeof insertServiceProvidersSchema>;
