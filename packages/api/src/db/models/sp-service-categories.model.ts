import type { z } from 'zod';

import { integer, pgTable, serial, unique } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

import { serviceCategories } from './lookups.model';
import { serviceProviders } from './service-providers.model';

export const spServiceCategories = pgTable(
  'sp_service_categories',
  {
    id: serial().primaryKey(),
    spId: integer()
      .notNull()
      .references(() => serviceProviders.id, { onDelete: 'cascade' }),
    categoryId: integer()
      .notNull()
      .references(() => serviceCategories.id, { onDelete: 'cascade' }),
  },
  (t) => [unique().on(t.spId, t.categoryId)],
);

export const spServiceCategoriesSchema = createSelectSchema(spServiceCategories);
export type SpServiceCategories = z.infer<typeof spServiceCategoriesSchema>;
export const insertSpServiceCategoriesSchema = createInsertSchema(spServiceCategories);
export type NewSpServiceCategories = z.infer<typeof insertSpServiceCategoriesSchema>;
