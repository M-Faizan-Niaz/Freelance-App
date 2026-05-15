import { createRoute } from '@hono/zod-openapi';

import * as HttpStatusCodes from '@/lib/http-status-codes';
import { commonErrorResponses, jsonContent, jsonContentRequired } from '@/lib/openapi/helpers';
import { createSuccessResponseSchema, idParams } from '@/lib/openapi/schemas';

import {
  createTodoRequestSchema,
  listTodosResponseSchema,
  todoResponseSchema,
  updateTodoRequestSchema,
} from './todos.schema';

const tags = ['Todos'];

export const list = createRoute({
  path: '/todos',
  method: 'get',
  tags,
  summary: 'List my todos',
  description: 'List todos for the authenticated user',
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createSuccessResponseSchema(listTodosResponseSchema),
      'List of todos',
    ),
    ...commonErrorResponses(
      [HttpStatusCodes.UNAUTHORIZED, HttpStatusCodes.INTERNAL_SERVER_ERROR],
      idParams,
    ),
  },
});

export const create = createRoute({
  path: '/todos',
  method: 'post',
  tags,
  summary: 'Create a todo',
  description: 'Create a todo for the authenticated user',
  request: {
    body: jsonContentRequired(createTodoRequestSchema, 'Create todo'),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createSuccessResponseSchema(todoResponseSchema, 'Todo created'),
    ),
    ...commonErrorResponses(
      [
        HttpStatusCodes.UNAUTHORIZED,
        HttpStatusCodes.UNPROCESSABLE_ENTITY,
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
      ],
      idParams,
    ),
  },
});

export const patch = createRoute({
  path: '/todos/{id}',
  method: 'patch',
  tags,
  summary: 'Update a todo',
  description: 'Update a todo by id',
  request: {
    params: idParams,
    body: jsonContentRequired(updateTodoRequestSchema, 'Updates'),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(createSuccessResponseSchema(todoResponseSchema), 'Updated'),
    ...commonErrorResponses(
      [
        HttpStatusCodes.UNAUTHORIZED,
        HttpStatusCodes.NOT_FOUND,
        HttpStatusCodes.UNPROCESSABLE_ENTITY,
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
      ],
      idParams,
    ),
  },
});

export const remove = createRoute({
  path: '/todos/{id}',
  method: 'delete',
  tags,
  summary: 'Delete a todo',
  description: 'Soft-delete a todo by id',
  request: { params: idParams },
  responses: {
    [HttpStatusCodes.NO_CONTENT]: { description: 'Todo deleted' },
    ...commonErrorResponses(
      [
        HttpStatusCodes.UNAUTHORIZED,
        HttpStatusCodes.NOT_FOUND,
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
      ],
      idParams,
    ),
  },
});

export type ListRoute = typeof list;
export type CreateRoute = typeof create;
export type PatchRoute = typeof patch;
export type RemoveRoute = typeof remove;
