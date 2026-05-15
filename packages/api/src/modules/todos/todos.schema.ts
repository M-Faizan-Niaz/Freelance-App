import { z } from '@hono/zod-openapi';

import { todosSchema } from './todos.model';

export const createTodoRequestSchema = z.object({
  title: z.string().trim().min(1, 'Title cannot be empty').max(255).describe('Todo title'),
});
export type CreateTodoRequest = z.infer<typeof createTodoRequestSchema>;

export const updateTodoRequestSchema = z
  .object({
    title: z.string().trim().min(1).max(255).optional(),
    completed: z.boolean().optional(),
  })
  .refine((v) => v.title !== undefined || v.completed !== undefined, {
    message: 'Provide at least one field to update',
  });
export type UpdateTodoRequest = z.infer<typeof updateTodoRequestSchema>;

export const todoResponseSchema = todosSchema;
export type TodoResponse = z.infer<typeof todoResponseSchema>;

export const listTodosResponseSchema = z.array(todoResponseSchema);
export type ListTodosResponse = z.infer<typeof listTodosResponseSchema>;
