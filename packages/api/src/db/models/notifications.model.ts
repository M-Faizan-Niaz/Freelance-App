import type { z } from 'zod';

import { boolean, integer, json, pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

import users from '@/modules/users/users.model';
import { notificationTypes } from './lookups.model';

export const notifications = pgTable('notifications', {
  id: serial().primaryKey(),
  userId: text()
    .notNull()
    .references(() => users.id),
  notificationTypeId: integer()
    .notNull()
    .references(() => notificationTypes.id),
  title: varchar({ length: 255 }).notNull(),
  body: text().notNull(),
  data: json(),
  isRead: boolean().notNull().default(false),
  readAt: timestamp({ mode: 'string' }),
  createdAt: timestamp({ mode: 'string' }).notNull().defaultNow(),
});

export const notificationsSchema = createSelectSchema(notifications);
export type Notifications = z.infer<typeof notificationsSchema>;
export const insertNotificationsSchema = createInsertSchema(notifications);
export type NewNotifications = z.infer<typeof insertNotificationsSchema>;
