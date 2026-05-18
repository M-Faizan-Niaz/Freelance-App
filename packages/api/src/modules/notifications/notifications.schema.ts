import { z } from '@hono/zod-openapi';

export const notificationResponseSchema = z.object({
  id: z.number(),
  userId: z.string(),
  notificationTypeId: z.number(),
  typeName: z.string(),
  title: z.string(),
  body: z.string(),
  data: z.unknown().nullable().optional(),
  isRead: z.boolean(),
  readAt: z.string().nullable().optional(),
  createdAt: z.string(),
});
export type NotificationResponse = z.infer<typeof notificationResponseSchema>;

export const listNotificationsQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(20),
});
export type ListNotificationsQuery = z.infer<typeof listNotificationsQuerySchema>;

export const markReadRequestSchema = z.object({
  ids: z.array(z.number().int().positive()).min(1).describe('Notification IDs to mark as read'),
});
export type MarkReadRequest = z.infer<typeof markReadRequestSchema>;
