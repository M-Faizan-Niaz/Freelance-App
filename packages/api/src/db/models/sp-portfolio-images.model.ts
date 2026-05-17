import type { z } from 'zod';

import { integer, pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

import { serviceProviders } from './service-providers.model';

export const spPortfolioImages = pgTable('sp_portfolio_images', {
  id: serial().primaryKey(),
  serviceProviderId: integer()
    .notNull()
    .references(() => serviceProviders.id, { onDelete: 'cascade' }),
  fileName: varchar({ length: 512 }).notNull(),
  url: varchar({ length: 1024 }).notNull(),
  createdAt: timestamp({ mode: 'string' }).notNull().defaultNow(),
});

export const spPortfolioImagesSchema = createSelectSchema(spPortfolioImages);
export type SpPortfolioImages = z.infer<typeof spPortfolioImagesSchema>;
export const insertSpPortfolioImagesSchema = createInsertSchema(spPortfolioImages);
export type NewSpPortfolioImages = z.infer<typeof insertSpPortfolioImagesSchema>;
