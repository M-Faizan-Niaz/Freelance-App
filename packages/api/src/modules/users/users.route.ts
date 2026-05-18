import { createRoute, z } from '@hono/zod-openapi';

import * as HttpStatusCodes from '@/lib/http-status-codes';
import { commonErrorResponses, jsonContent, jsonContentRequired } from '@/lib/openapi/helpers';
import { createSuccessResponseSchema } from '@/lib/openapi/schemas';

import { getMeResponseSchema, updateMeRequestSchema } from './users.schema';

const tags = ['Users'];

export const getMe = createRoute({
  operationId: 'getMe',
  path: '/users/me',
  method: 'get',
  tags,
  summary: 'Get own profile',
  description: 'Get the authenticated user profile merged with user_profiles data',
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createSuccessResponseSchema(getMeResponseSchema, 'Profile retrieved successfully'),
      'The user profile',
    ),
    ...commonErrorResponses(
      [
        HttpStatusCodes.UNAUTHORIZED,
        HttpStatusCodes.NOT_FOUND,
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
      ],
      getMeResponseSchema,
    ),
  },
});

export const updateMe = createRoute({
  operationId: 'updateMe',
  path: '/users/me',
  method: 'patch',
  tags,
  summary: 'Update own profile',
  description: 'Update name, phone number, or profile photo URL',
  request: {
    body: jsonContentRequired(updateMeRequestSchema, 'Fields to update'),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createSuccessResponseSchema(getMeResponseSchema, 'Profile updated successfully'),
      'The updated user profile',
    ),
    ...commonErrorResponses(
      [
        HttpStatusCodes.UNPROCESSABLE_ENTITY,
        HttpStatusCodes.UNAUTHORIZED,
        HttpStatusCodes.NOT_FOUND,
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
      ],
      updateMeRequestSchema,
    ),
  },
});

export const uploadProfilePhoto = createRoute({
  operationId: 'uploadProfilePhoto',
  path: '/users/me/profile-photo',
  method: 'patch',
  tags,
  summary: 'Upload profile photo',
  description:
    'Upload or replace the authenticated user profile photo. Send as multipart/form-data with field "photo" (jpeg, png, webp, gif — max 5 MB).',
  request: {
    body: {
      content: {
        'multipart/form-data': {
          schema: z.object({
            photo: z.custom<File>().openapi({
              type: 'string',
              format: 'binary',
              description: 'Image file (jpeg, png, webp, gif) max 5 MB',
            }),
          }),
        },
      },
      required: true,
    },
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createSuccessResponseSchema(getMeResponseSchema, 'Profile photo uploaded successfully'),
      'Updated user profile',
    ),
    ...commonErrorResponses(
      [
        HttpStatusCodes.BAD_REQUEST,
        HttpStatusCodes.UNAUTHORIZED,
        HttpStatusCodes.NOT_FOUND,
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
      ],
      getMeResponseSchema,
    ),
  },
});

export type GetMeRoute = typeof getMe;
export type UpdateMeRoute = typeof updateMe;
export type UploadProfilePhotoRoute = typeof uploadProfilePhoto;
