import type { CreateReviewRoute, ListByProviderRoute } from './reviews.route';
import type { AppRouteHandler } from '@/lib/types';

import { UnauthorizedError } from '@/core/errors';
import { successResponse, successResponseWithPagination } from '@/lib/api-response';
import { auth } from '@/lib/auth';
import * as HttpStatusCodes from '@/lib/http-status-codes';

import { ReviewsService } from './reviews.service';

const service = new ReviewsService();

async function requireUserId(headers: Headers): Promise<string> {
  const session = await auth.api.getSession({ headers });
  if (!session?.user?.id) {
    throw new UnauthorizedError('Authentication required');
  }
  return session.user.id;
}

export const create: AppRouteHandler<CreateReviewRoute> = async (c) => {
  const userId = await requireUserId(c.req.raw.headers);
  const body = c.req.valid('json');
  const review = await service.createReview(userId, body);
  return c.json(successResponse(review, 'Review submitted successfully'), HttpStatusCodes.OK);
};

export const listByProvider: AppRouteHandler<ListByProviderRoute> = async (c) => {
  const { id } = c.req.valid('param');
  const { page, limit, sortOrder } = c.req.valid('query');
  const { data, pagination } = await service.listProviderReviews(id, { page, limit, sortOrder });
  return c.json(
    successResponseWithPagination(data, pagination, [], 'Reviews retrieved successfully'),
    HttpStatusCodes.OK,
  );
};
