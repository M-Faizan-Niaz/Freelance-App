import type { ListRoute, MarkAllReadRoute, MarkReadRoute } from './notifications.route';
import type { AppRouteHandler } from '@/lib/types';

import { UnauthorizedError } from '@/core/errors';
import { successResponse, successResponseWithPagination } from '@/lib/api-response';
import { auth } from '@/lib/auth';
import * as HttpStatusCodes from '@/lib/http-status-codes';

import { NotificationsService } from './notifications.service';

const service = new NotificationsService();

async function requireUserId(headers: Headers): Promise<string> {
  const session = await auth.api.getSession({ headers });
  if (!session?.user?.id) {
    throw new UnauthorizedError('Authentication required');
  }
  return session.user.id;
}

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const userId = await requireUserId(c.req.raw.headers);
  const { page, limit } = c.req.valid('query');
  const { items, pagination } = await service.listForUser(userId, page, limit);
  return c.json(
    successResponseWithPagination(items, pagination, [], 'Notifications retrieved successfully'),
    HttpStatusCodes.OK,
  );
};

export const markRead: AppRouteHandler<MarkReadRoute> = async (c) => {
  const userId = await requireUserId(c.req.raw.headers);
  const { ids } = c.req.valid('json');
  await service.markRead(userId, ids);
  return c.json(successResponse({}, 'Notifications marked as read'), HttpStatusCodes.OK);
};

export const markAllRead: AppRouteHandler<MarkAllReadRoute> = async (c) => {
  const userId = await requireUserId(c.req.raw.headers);
  await service.markAllRead(userId);
  return c.json(successResponse({}, 'All notifications marked as read'), HttpStatusCodes.OK);
};
