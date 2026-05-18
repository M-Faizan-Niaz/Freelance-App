import { createRoute, z } from '@hono/zod-openapi';

import * as HttpStatusCodes from '@/lib/http-status-codes';
import { commonErrorResponses, jsonContent, jsonContentRequired } from '@/lib/openapi/helpers';
import { createSuccessResponseSchema, idParams } from '@/lib/openapi/schemas';

import {
  conversationListItemSchema,
  createConversationRequestSchema,
  listConversationsQuerySchema,
  listMessagesQuerySchema,
  messageItemSchema,
  sendMessageRequestSchema,
} from './chat.schema';

const tags = ['Chat'];

export const listConversations = createRoute({
  operationId: 'listConversations',
  path: '/conversations',
  method: 'get',
  tags,
  summary: 'List conversations for the authenticated user (paginated)',
  request: {
    query: listConversationsQuerySchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createSuccessResponseSchema(
        z.array(conversationListItemSchema),
        'Conversations retrieved successfully',
      ),
      'Paginated list of conversations',
    ),
    ...commonErrorResponses(
      [HttpStatusCodes.UNAUTHORIZED, HttpStatusCodes.INTERNAL_SERVER_ERROR],
      conversationListItemSchema,
    ),
  },
});

export const createOrGetConversation = createRoute({
  operationId: 'createOrGetConversation',
  path: '/conversations',
  method: 'post',
  tags,
  summary: 'Start or retrieve an existing conversation with a service provider',
  request: {
    body: jsonContentRequired(createConversationRequestSchema, 'Conversation details'),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createSuccessResponseSchema(conversationListItemSchema, 'Conversation ready'),
      'The conversation (new or existing)',
    ),
    ...commonErrorResponses(
      [
        HttpStatusCodes.UNAUTHORIZED,
        HttpStatusCodes.FORBIDDEN,
        HttpStatusCodes.NOT_FOUND,
        HttpStatusCodes.UNPROCESSABLE_ENTITY,
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
      ],
      createConversationRequestSchema,
    ),
  },
});

export const listMessages = createRoute({
  operationId: 'listMessages',
  path: '/conversations/{id}/messages',
  method: 'get',
  tags,
  summary: 'Get paginated message history for a conversation',
  request: {
    params: idParams,
    query: listMessagesQuerySchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createSuccessResponseSchema(
        z.array(messageItemSchema),
        'Messages retrieved successfully',
      ),
      'Paginated message history',
    ),
    ...commonErrorResponses(
      [
        HttpStatusCodes.UNAUTHORIZED,
        HttpStatusCodes.FORBIDDEN,
        HttpStatusCodes.NOT_FOUND,
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
      ],
      messageItemSchema,
    ),
  },
});

export const sendMessage = createRoute({
  operationId: 'sendMessage',
  path: '/conversations/{id}/messages',
  method: 'post',
  tags,
  summary: 'Send a message in a conversation',
  request: {
    params: idParams,
    body: jsonContentRequired(sendMessageRequestSchema, 'Message to send'),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createSuccessResponseSchema(messageItemSchema, 'Message sent successfully'),
      'The sent message',
    ),
    ...commonErrorResponses(
      [
        HttpStatusCodes.UNAUTHORIZED,
        HttpStatusCodes.FORBIDDEN,
        HttpStatusCodes.NOT_FOUND,
        HttpStatusCodes.UNPROCESSABLE_ENTITY,
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
      ],
      sendMessageRequestSchema,
    ),
  },
});

export type ListConversationsRoute = typeof listConversations;
export type CreateOrGetConversationRoute = typeof createOrGetConversation;
export type ListMessagesRoute = typeof listMessages;
export type SendMessageRoute = typeof sendMessage;
