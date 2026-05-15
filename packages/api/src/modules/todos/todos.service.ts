import type { CreateTodoRequest, UpdateTodoRequest } from './todos.schema';

import db from '@/db';
import { NotFoundError } from '@/core/errors';

import { TodosRepository } from './todos.repository';

export class TodosService {
  private readonly repo = new TodosRepository();

  list(userId: string) {
    return this.repo.listByUser(userId);
  }

  async getOne(id: number, userId: string) {
    const todo = await this.repo.findById(id, userId);
    if (!todo) throw new NotFoundError('Todo not found');
    return todo;
  }

  async create(userId: string, data: CreateTodoRequest) {
    return db.transaction((tx) => this.repo.create(tx, { ...data, userId }));
  }

  async update(id: number, userId: string, data: UpdateTodoRequest) {
    const existing = await this.repo.findById(id, userId);
    if (!existing) throw new NotFoundError('Todo not found');
    return db.transaction((tx) => this.repo.update(tx, id, userId, data));
  }

  async remove(id: number, userId: string) {
    const existing = await this.repo.findById(id, userId);
    if (!existing) throw new NotFoundError('Todo not found');
    return db.transaction((tx) => this.repo.softDelete(tx, id, userId));
  }
}
