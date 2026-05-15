import type { z } from 'zod';

import { boolean, pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

import { users } from '@/modules/users/users.model';

export const todos = pgTable('todos', {
  id: serial().primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  title: varchar({ length: 255 }).notNull(),
  completed: boolean().notNull().default(false),
  createdAt: timestamp({ mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp({ mode: 'string' }).notNull().defaultNow(),
  isDeleted: boolean().notNull().default(false),
  deletedAt: timestamp({ mode: 'string' }),
});

export const todosSchema = createSelectSchema(todos);
export type Todo = z.infer<typeof todosSchema>;

export const insertTodosSchema = createInsertSchema(todos);
export type NewTodo = z.infer<typeof insertTodosSchema>;

export default todos;
