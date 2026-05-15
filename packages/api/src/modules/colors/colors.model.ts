import type { z } from 'zod';

import { boolean, pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const colors = pgTable('colors', {
  id: serial().primaryKey(),
  name: varchar({ length: 255 }).unique().notNull(),
  description: varchar({ length: 255 }),
  createdAt: timestamp({ mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp({ mode: 'string' }).notNull().defaultNow(),
  isDeleted: boolean().notNull().default(false),
  deletedAt: timestamp({ mode: 'string' }),
});

export const colorsSchema = createSelectSchema(colors);

export type Colors = z.infer<typeof colorsSchema>;

/**
 * Colors insert schema
 */
export const insertColorsSchema = createInsertSchema(colors);

/**
 * New colors type definition
 */
export type NewColors = z.infer<typeof insertColorsSchema>;

export default colors;
