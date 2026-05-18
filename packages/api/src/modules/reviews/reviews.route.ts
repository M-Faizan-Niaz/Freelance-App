import { createRoute, z } from '@hono/zod-openapi';

import * as HttpStatusCodes from '@/lib/http-status-codes';
import { commonErrorResponses, jsonContent, jsonContentRequired } from '@/lib/openapi/helpers';
import { createSuccessResponseSchema, idParams } from '@/lib/openapi/schemas';

import {
  createReviewRequestSchema,
  listProviderReviewsQuerySchema,
  providerReviewItemSchema,
  reviewResponseSchema,
} from './reviews.schema';

const tags = ['Reviews'];

export const create = createRoute({
  operationId: 'createReview',
  path: '/reviews',
  method: 'post',
  tags,
  summary: 'Create a review for a completed booking (customer only)',
  request: {
    body: jsonContentRequired(createReviewRequestSchema, 'Review details'),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createSuccessResponseSchema(reviewResponseSchema, 'Review created successfully'),
      'The created review',
    ),
    ...commonErrorResponses(
      [
        HttpStatusCodes.BAD_REQUEST,
        HttpStatusCodes.UNAUTHORIZED,
        HttpStatusCodes.FORBIDDEN,
        HttpStatusCodes.NOT_FOUND,
        HttpStatusCodes.CONFLICT,
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
      ],
      createReviewRequestSchema,
    ),
  },
});

export const listByProvider = createRoute({
  operationId: 'listProviderReviews',
  path: '/reviews/provider/{id}',
  method: 'get',
  tags,
  summary: 'List reviews for a service provider (public)',
  request: {
    params: idParams,
    query: listProviderReviewsQuerySchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createSuccessResponseSchema(
        z.array(providerReviewItemSchema),
        'Reviews retrieved successfully',
      ),
      'Paginated list of provider reviews',
    ),
    ...commonErrorResponses(
      [HttpStatusCodes.NOT_FOUND, HttpStatusCodes.INTERNAL_SERVER_ERROR],
      providerReviewItemSchema,
    ),
  },
});

export type CreateReviewRoute = typeof create;
export type ListByProviderRoute = typeof listByProvider;
