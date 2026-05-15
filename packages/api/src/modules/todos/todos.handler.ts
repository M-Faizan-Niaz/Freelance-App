import type { AppRouteHandler } from '@/lib/types';
import type { CreateRoute, ListRoute, PatchRoute, RemoveRoute } from './todos.route';

import * as HttpStatusCodes from '@/lib/http-status-codes';
import { successResponse } from '@/lib/api-response';
import { auth } from '@/lib/auth';
import { UnauthorizedError } from '@/core/errors';

import { TodosService } from './todos.service';

const todosService = new TodosService();

async function requireUserId(headers: Headers): Promise<string> {
  const session = await auth.api.getSession({ headers });
  if (!session?.user?.id) {
    throw new UnauthorizedError('You must be signed in to access todos');
  }
  return session.user.id;
}

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const userId = await requireUserId(c.req.raw.headers);
  const todos = await todosService.list(userId);
  return c.json(successResponse(todos, 'Todos retrieved'), HttpStatusCodes.OK);
};

export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const userId = await requireUserId(c.req.raw.headers);
  const body = c.req.valid('json');
  const todo = await todosService.create(userId, body);
  return c.json(successResponse(todo, 'Todo created'), HttpStatusCodes.OK);
};

export const patch: AppRouteHandler<PatchRoute> = async (c) => {
  const userId = await requireUserId(c.req.raw.headers);
  const { id } = c.req.valid('param');
  const body = c.req.valid('json');
  const todo = await todosService.update(id, userId, body);
  return c.json(successResponse(todo, 'Todo updated'), HttpStatusCodes.OK);
};

export const remove: AppRouteHandler<RemoveRoute> = async (c) => {
  const userId = await requireUserId(c.req.raw.headers);
  const { id } = c.req.valid('param');
  await todosService.remove(id, userId);
  return c.body(null, HttpStatusCodes.NO_CONTENT);
};
