import type { TX } from '@/lib/types';
import type { NewTodo } from './todos.model';
import type { UpdateTodoRequest } from './todos.schema';

import { and, desc, eq } from 'drizzle-orm';

import db from '@/db';
import { todos } from '@/db/models';

export class TodosRepository {
  async findById(id: number, userId: string) {
    return db.query.todos.findFirst({
      where: and(eq(todos.id, id), eq(todos.userId, userId), eq(todos.isDeleted, false)),
    });
  }

  async listByUser(userId: string) {
    return db.query.todos.findMany({
      where: and(eq(todos.userId, userId), eq(todos.isDeleted, false)),
      orderBy: [desc(todos.createdAt)],
    });
  }

  async create(tx: TX, data: NewTodo) {
    const [result] = await tx.insert(todos).values(data).returning();
    return result;
  }

  async update(tx: TX, id: number, userId: string, data: UpdateTodoRequest) {
    const [result] = await tx
      .update(todos)
      .set({ ...data, updatedAt: new Date().toISOString() })
      .where(and(eq(todos.id, id), eq(todos.userId, userId)))
      .returning();
    return result;
  }

  async softDelete(tx: TX, id: number, userId: string) {
    const [result] = await tx
      .update(todos)
      .set({ isDeleted: true, deletedAt: new Date().toISOString() })
      .where(and(eq(todos.id, id), eq(todos.userId, userId)))
      .returning();
    return Boolean(result);
  }
}
