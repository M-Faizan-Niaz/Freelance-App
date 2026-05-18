import { createRoute, z } from '@hono/zod-openapi';

import * as HttpStatusCodes from '@/lib/http-status-codes';
import { commonErrorResponses, jsonContent, jsonContentRequired } from '@/lib/openapi/helpers';
import { createSuccessResponseSchema } from '@/lib/openapi/schemas';

import {
  listNotificationsQuerySchema,
  markReadRequestSchema,
  notificationResponseSchema,
} from './notifications.schema';

const tags = ['Notifications'];

export const list = createRoute({
  operationId: 'listNotifications',
  path: '/notifications',
  method: 'get',
  tags,
  summary: 'List notifications for the authenticated user (paginated)',
  request: {
    query: listNotificationsQuerySchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createSuccessResponseSchema(
        z.array(notificationResponseSchema),
        'Notifications retrieved successfully',
      ),
      'Paginated list of notifications',
    ),
    ...commonErrorResponses(
      [HttpStatusCodes.UNAUTHORIZED, HttpStatusCodes.INTERNAL_SERVER_ERROR],
      notificationResponseSchema,
    ),
  },
});

export const markRead = createRoute({
  operationId: 'markNotificationsRead',
  path: '/notifications/read',
  method: 'patch',
  tags,
  summary: 'Mark specific notifications as read',
  request: {
    body: jsonContentRequired(markReadRequestSchema, 'List of notification IDs to mark as read'),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createSuccessResponseSchema(z.object({}), 'Notifications marked as read'),
      'Success',
    ),
    ...commonErrorResponses(
      [
        HttpStatusCodes.UNAUTHORIZED,
        HttpStatusCodes.UNPROCESSABLE_ENTITY,
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
      ],
      markReadRequestSchema,
    ),
  },
});

export const markAllRead = createRoute({
  operationId: 'markAllNotificationsRead',
  path: '/notifications/read-all',
  method: 'patch',
  tags,
  summary: 'Mark all notifications as read',
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createSuccessResponseSchema(z.object({}), 'All notifications marked as read'),
      'Success',
    ),
    ...commonErrorResponses(
      [HttpStatusCodes.UNAUTHORIZED, HttpStatusCodes.INTERNAL_SERVER_ERROR],
      z.object({}),
    ),
  },
});

export type ListRoute = typeof list;
export type MarkReadRoute = typeof markRead;
export type MarkAllReadRoute = typeof markAllRead;
