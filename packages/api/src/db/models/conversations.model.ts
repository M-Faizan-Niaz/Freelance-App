import type { z } from 'zod';

import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

import users from '@/modules/users/users.model';
import { bookings } from './bookings.model';
import { customers } from './customers.model';
import { messageTypes } from './lookups.model';
import { serviceProviders } from './service-providers.model';

// ---------------------------------------------------------------------------
// conversations
// ---------------------------------------------------------------------------

export const conversations = pgTable('conversations', {
  id: serial().primaryKey(),
  customerId: integer()
    .notNull()
    .references(() => customers.id),
  providerId: integer()
    .notNull()
    .references(() => serviceProviders.id),
  bookingId: integer().references(() => bookings.id),
  lastMessageAt: timestamp({ mode: 'string' }),
  createdAt: timestamp({ mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp({ mode: 'string' }).notNull().defaultNow(),
  isDeleted: boolean().notNull().default(false),
  deletedAt: timestamp({ mode: 'string' }),
});

export const conversationsSchema = createSelectSchema(conversations);
export type Conversations = z.infer<typeof conversationsSchema>;
export const insertConversationsSchema = createInsertSchema(conversations);
export type NewConversations = z.infer<typeof insertConversationsSchema>;

// ---------------------------------------------------------------------------
// messages
// ---------------------------------------------------------------------------

export const messages = pgTable('messages', {
  id: serial().primaryKey(),
  conversationId: integer()
    .notNull()
    .references(() => conversations.id, { onDelete: 'cascade' }),
  senderId: text()
    .notNull()
    .references(() => users.id),
  content: text().notNull(),
  messageTypeId: integer()
    .notNull()
    .references(() => messageTypes.id),
  isRead: boolean().notNull().default(false),
  readAt: timestamp({ mode: 'string' }),
  isDeleted: boolean().notNull().default(false),
  deletedAt: timestamp({ mode: 'string' }),
  createdAt: timestamp({ mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp({ mode: 'string' }).notNull().defaultNow(),
});

export const messagesSchema = createSelectSchema(messages);
export type Messages = z.infer<typeof messagesSchema>;
export const insertMessagesSchema = createInsertSchema(messages);
export type NewMessages = z.infer<typeof insertMessagesSchema>;
