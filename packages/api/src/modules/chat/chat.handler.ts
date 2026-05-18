import type {
  CreateOrGetConversationRoute,
  ListConversationsRoute,
  ListMessagesRoute,
  SendMessageRoute,
} from './chat.route';
import type { AppRouteHandler } from '@/lib/types';

import { UnauthorizedError } from '@/core/errors';
import { successResponse, successResponseWithPagination } from '@/lib/api-response';
import { auth } from '@/lib/auth';
import * as HttpStatusCodes from '@/lib/http-status-codes';

import { ChatService } from './chat.service';

const service = new ChatService();

async function requireUserId(headers: Headers): Promise<string> {
  const session = await auth.api.getSession({ headers });
  if (!session?.user?.id) {
    throw new UnauthorizedError('Authentication required');
  }
  return session.user.id;
}

export const listConversations: AppRouteHandler<ListConversationsRoute> = async (c) => {
  const userId = await requireUserId(c.req.raw.headers);
  const { page, limit } = c.req.valid('query');
  const { items, pagination } = await service.listConversations(userId, page, limit);
  return c.json(
    successResponseWithPagination(items, pagination, [], 'Conversations retrieved successfully'),
    HttpStatusCodes.OK,
  );
};

export const createOrGetConversation: AppRouteHandler<CreateOrGetConversationRoute> = async (c) => {
  const userId = await requireUserId(c.req.raw.headers);
  const { providerId, bookingId } = c.req.valid('json');
  const conversation = await service.getOrCreateConversation(userId, providerId, bookingId);
  return c.json(successResponse(conversation, 'Conversation ready'), HttpStatusCodes.OK);
};

export const listMessages: AppRouteHandler<ListMessagesRoute> = async (c) => {
  const userId = await requireUserId(c.req.raw.headers);
  const { id } = c.req.valid('param');
  const { page, limit } = c.req.valid('query');
  const { items, pagination } = await service.listMessages(userId, id, page, limit);
  return c.json(
    successResponseWithPagination(items, pagination, [], 'Messages retrieved successfully'),
    HttpStatusCodes.OK,
  );
};

export const sendMessage: AppRouteHandler<SendMessageRoute> = async (c) => {
  const userId = await requireUserId(c.req.raw.headers);
  const { id } = c.req.valid('param');
  const { content, messageType } = c.req.valid('json');
  const message = await service.sendMessage(userId, id, content, messageType);
  return c.json(successResponse(message, 'Message sent successfully'), HttpStatusCodes.OK);
};
