import { z } from '@hono/zod-openapi';

export const otherPartySchema = z.object({
  userId: z.string(),
  fullName: z.string().nullable(),
  profilePhotoUrl: z.string().nullable().optional(),
});

export const conversationListItemSchema = z.object({
  id: z.number(),
  customerId: z.number(),
  providerId: z.number(),
  bookingId: z.number().nullable().optional(),
  lastMessageAt: z.string().nullable().optional(),
  lastMessage: z.string().nullable().optional(),
  otherParty: otherPartySchema,
  unreadCount: z.number(),
  createdAt: z.string(),
});
export type ConversationListItem = z.infer<typeof conversationListItemSchema>;

export const messageItemSchema = z.object({
  id: z.number(),
  conversationId: z.number(),
  senderId: z.string(),
  content: z.string(),
  messageType: z.string(),
  isRead: z.boolean(),
  readAt: z.string().nullable().optional(),
  isDeleted: z.boolean(),
  createdAt: z.string(),
});
export type MessageItem = z.infer<typeof messageItemSchema>;

export const createConversationRequestSchema = z.object({
  providerId: z.number().int().positive().describe('Service provider ID to start a conversation with'),
  bookingId: z.number().int().positive().optional().describe('Optional booking to link this conversation to'),
});
export type CreateConversationRequest = z.infer<typeof createConversationRequestSchema>;

export const listMessagesQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(30),
});
export type ListMessagesQuery = z.infer<typeof listMessagesQuerySchema>;

export const listConversationsQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(20),
});
export type ListConversationsQuery = z.infer<typeof listConversationsQuerySchema>;

export const sendMessageRequestSchema = z.object({
  content: z.string().min(1).max(2000).describe('Message content'),
  messageType: z.enum(['text', 'image', 'quick_reply']).optional().default('text'),
});
export type SendMessageRequest = z.infer<typeof sendMessageRequestSchema>;
