import { createRoute, z } from '@hono/zod-openapi';
import * as HttpStatusCodes from '@/lib/http-status-codes';
import { commonErrorResponses, jsonContent, jsonContentRequired } from '@/lib/openapi/helpers';
import { createSuccessResponseSchema, idParams } from '@/lib/openapi/schemas';

import {
  createServiceCategoryRequestSchema,
  listServiceCategoriesResponseSchema,
  serviceCategoryResponseSchema,
  updateServiceCategoryRequestSchema,
} from './service-categories.schema';

const tags = ['Service Categories'];

export const list = createRoute({
  operationId: 'listServiceCategories',
  path: '/service-categories',
  method: 'get',
  tags,
  summary: 'List active service categories',
  description: 'Returns all active, non-deleted service categories ordered by name',
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createSuccessResponseSchema(listServiceCategoriesResponseSchema, 'Service categories retrieved successfully'),
      'List of active service categories',
    ),
    ...commonErrorResponses([HttpStatusCodes.INTERNAL_SERVER_ERROR], z.object({})),
  },
});

export const create = createRoute({
  operationId: 'createServiceCategory',
  path: '/service-categories',
  method: 'post',
  tags,
  summary: 'Create a service category',
  description: 'Admin only. Creates a new service category.',
  request: {
    body: jsonContentRequired(createServiceCategoryRequestSchema, 'Service category to create'),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createSuccessResponseSchema(serviceCategoryResponseSchema, 'Service category created successfully'),
      'The created service category',
    ),
    ...commonErrorResponses(
      [
        HttpStatusCodes.UNAUTHORIZED,
        HttpStatusCodes.FORBIDDEN,
        HttpStatusCodes.UNPROCESSABLE_ENTITY,
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
      ],
      createServiceCategoryRequestSchema,
    ),
  },
});

export const patch = createRoute({
  operationId: 'updateServiceCategory',
  path: '/service-categories/{id}',
  method: 'patch',
  tags,
  summary: 'Update a service category',
  description: 'Admin only. Updates name, description, or active status.',
  request: {
    params: idParams,
    body: jsonContentRequired(updateServiceCategoryRequestSchema, 'Fields to update'),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createSuccessResponseSchema(serviceCategoryResponseSchema, 'Service category updated successfully'),
      'The updated service category',
    ),
    ...commonErrorResponses(
      [
        HttpStatusCodes.UNAUTHORIZED,
        HttpStatusCodes.FORBIDDEN,
        HttpStatusCodes.NOT_FOUND,
        HttpStatusCodes.UNPROCESSABLE_ENTITY,
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
      ],
      idParams,
    ),
  },
});

export const removeSelected = createRoute({
  operationId: 'deleteServiceCategories',
  path: '/service-categories',
  method: 'delete',
  tags,
  summary: 'Soft-delete service categories',
  description: 'Admin only. Soft-deletes one or more service categories by ID.',
  request: {
    body: jsonContentRequired(
      z.object({ ids: z.array(z.number()).min(1) }),
      'IDs of categories to delete',
    ),
  },
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: 'Categories deleted successfully',
    },
    ...commonErrorResponses(
      [
        HttpStatusCodes.UNAUTHORIZED,
        HttpStatusCodes.FORBIDDEN,
        HttpStatusCodes.UNPROCESSABLE_ENTITY,
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
      ],
      z.object({ ids: z.array(z.number()) }),
    ),
  },
});

export const uploadImage = createRoute({
  operationId: 'uploadServiceCategoryImage',
  path: '/service-categories/{id}/image',
  method: 'patch',
  tags,
  summary: 'Upload category image',
  description: 'Admin only. Upload or replace the cover image for a service category. Send as multipart/form-data with field "image" (jpeg, png, webp, gif — max 5 MB).',
  request: {
    params: idParams,
    body: {
      content: {
        'multipart/form-data': {
          schema: z.object({
            image: z.custom<File>().openapi({ type: 'string', format: 'binary', description: 'Category image (max 5 MB)' }),
          }),
        },
      },
      required: true,
    },
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createSuccessResponseSchema(serviceCategoryResponseSchema, 'Category image uploaded successfully'),
      'The updated service category',
    ),
    ...commonErrorResponses(
      [HttpStatusCodes.BAD_REQUEST, HttpStatusCodes.UNAUTHORIZED, HttpStatusCodes.FORBIDDEN, HttpStatusCodes.NOT_FOUND, HttpStatusCodes.INTERNAL_SERVER_ERROR],
      serviceCategoryResponseSchema,
    ),
  },
});

export type ListRoute = typeof list;
export type CreateRoute = typeof create;
export type PatchRoute = typeof patch;
export type RemoveSelectedRoute = typeof removeSelected;
export type UploadImageRoute = typeof uploadImage;
