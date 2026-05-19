import { createRoute, z } from '@hono/zod-openapi';
import * as HttpStatusCodes from '@/lib/http-status-codes';
import { commonErrorResponses, jsonContent, jsonContentRequired } from '@/lib/openapi/helpers';
import { createSuccessResponseSchema, idParams } from '@/lib/openapi/schemas';
import { createSuccessResponseSchemaWithPagination } from '@/lib/openapi/schemas/create-api-response';
import commonQueryParamsSchema from '@/lib/openapi/schemas/query-params-schema';

import {
  createColorsRequestSchema,
  createColorsResponseSchema,
  deleteColorsRequestSchema,
  getColorsResponseSchema,
  listColorsResponseSchema,
  updateColorsRequestSchema,
} from './colors.schema';

const tags = ['Colors'];

export const list = createRoute({
  operationId: 'listColors',
  path: '/colors',
  method: 'get',
  tags,
  request: {
    query: commonQueryParamsSchema,
  },
  summary: 'List colors',
  description: 'List colors with pagination, filtering, and sorting',
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createSuccessResponseSchemaWithPagination(listColorsResponseSchema),
      'The list of colors',
    ),
    ...commonErrorResponses(
      [
        HttpStatusCodes.UNPROCESSABLE_ENTITY,
        HttpStatusCodes.UNAUTHORIZED,
        HttpStatusCodes.FORBIDDEN,
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
      ],
      commonQueryParamsSchema,
    ),
  },
});

export const create = createRoute({
  operationId: 'createColor',
  path: '/colors',
  method: 'post',
  tags,
  summary: 'Create a colors',
  description: 'Create a colors',
  request: {
    body: jsonContentRequired(createColorsRequestSchema, 'Create Colors'),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createSuccessResponseSchema(createColorsResponseSchema, 'Colors created successfully'),
    ),
    ...commonErrorResponses(
      [
        HttpStatusCodes.UNAUTHORIZED,
        HttpStatusCodes.FORBIDDEN,
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
      ],
      z.object({}),
    ),
  },
});

export const getOne = createRoute({
  operationId: 'getColor',
  path: '/colors/{id}',
  method: 'get',
  request: {
    params: idParams,
  },
  summary: 'Get a colors by id',
  description: 'Get a colors by id',
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createSuccessResponseSchema(getColorsResponseSchema),
      'The colors',
    ),
    ...commonErrorResponses(
      [
        HttpStatusCodes.UNPROCESSABLE_ENTITY,
        HttpStatusCodes.UNAUTHORIZED,
        HttpStatusCodes.FORBIDDEN,
        HttpStatusCodes.NOT_FOUND,
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
      ],
      idParams,
    ),
  },
});

export const patch = createRoute({
  operationId: 'updateColor',
  path: '/colors/{id}',
  method: 'patch',
  request: {
    params: idParams,
    body: jsonContentRequired(updateColorsRequestSchema, 'The colors to update'),
  },
  tags,
  summary: 'Update a colors',
  description: 'Update a colors',
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createSuccessResponseSchema(createColorsResponseSchema),
      'The updated colors',
    ),
    ...commonErrorResponses(
      [
        HttpStatusCodes.UNPROCESSABLE_ENTITY,
        HttpStatusCodes.UNAUTHORIZED,
        HttpStatusCodes.FORBIDDEN,
        HttpStatusCodes.NOT_FOUND,
        HttpStatusCodes.BAD_REQUEST,
        HttpStatusCodes.CONFLICT,
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
      ],
      idParams,
    ),
  },
});

export const removeSelected = createRoute({
  operationId: 'deleteColors',
  path: '/colors',
  method: 'delete',
  request: {
    body: jsonContentRequired(deleteColorsRequestSchema, 'The colors IDs to remove'),
  },
  tags,
  summary: 'Delete multiple colors',
  description: 'Delete multiple colors by their IDs',
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: 'Colors removed successfully',
    },
    ...commonErrorResponses(
      [
        HttpStatusCodes.UNPROCESSABLE_ENTITY,
        HttpStatusCodes.UNAUTHORIZED,
        HttpStatusCodes.FORBIDDEN,
        HttpStatusCodes.NOT_FOUND,
        HttpStatusCodes.BAD_REQUEST,
        HttpStatusCodes.CONFLICT,
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
      ],
      idParams,
    ),
  },
});

export type ListRoute = typeof list;
export type CreateRoute = typeof create;
export type GetOneRoute = typeof getOne;
export type PatchRoute = typeof patch;
export type RemoveSelectedRoute = typeof removeSelected;
