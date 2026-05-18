import type { MessageTypeName } from './chat.constants';

import { ForbiddenError, NotFoundError } from '@/core/errors';
import db from '@/db';
import { createPagination, getPaginationValues } from '@/lib/searching-sorting';

import { MESSAGE_TYPE } from './chat.constants';
import { ChatRepository } from './chat.repository';

const repo = new ChatRepository();

export class ChatService {
  async listConversations(userId: string, page: number, limit: number) {
    const { limit: take, offset } = getPaginationValues(page, limit);
    const [items, total] = await Promise.all([
      repo.findManyForUser(userId, take, offset),
      repo.countForUser(userId),
    ]);
    return { items, pagination: createPagination(total, page, limit) };
  }

  async getOrCreateConversation(userId: string, providerId: number, bookingId?: number) {
    const customer = await repo.findCustomerByUserId(userId);
    if (!customer) {
      throw new ForbiddenError('Only customers can initiate conversations');
    }

    const provider = await repo.findProviderById(providerId);
    if (!provider) {
      throw new NotFoundError('Service provider not found');
    }

    if (bookingId !== undefined) {
      const booking = await repo.findBookingById(bookingId);
      if (!booking) {
        throw new NotFoundError(`Booking ${bookingId} not found`);
      }
    }

    const existing = await repo.findExisting(customer.id, providerId, bookingId);
    if (existing) {
      const row = await repo.findConversationWithParties(existing.id);
      return this.formatConversation(row!, userId);
    }

    const created = await db.transaction((tx) =>
      repo.createConversation(tx, { customerId: customer.id, providerId, bookingId }),
    );

    const row = await repo.findConversationWithParties(created.id);
    return this.formatConversation(row!, userId);
  }

  async listMessages(userId: string, conversationId: number, page: number, limit: number) {
    const isParticipant = await repo.isParticipant(conversationId, userId);
    if (!isParticipant) {
      throw new ForbiddenError('You are not a participant in this conversation');
    }

    const { limit: take, offset } = getPaginationValues(page, limit);

    // Mark incoming messages as read before fetching
    await db.transaction((tx) => repo.markMessagesAsRead(tx, conversationId, userId));

    const [items, total] = await Promise.all([
      repo.findManyByConversationId(conversationId, take, offset),
      repo.countByConversationId(conversationId),
    ]);

    return { items, pagination: createPagination(total, page, limit) };
  }

  async sendMessage(
    userId: string,
    conversationId: number,
    content: string,
    messageTypeName: MessageTypeName = MESSAGE_TYPE.TEXT,
  ) {
    const isParticipant = await repo.isParticipant(conversationId, userId);
    if (!isParticipant) {
      throw new ForbiddenError('You are not a participant in this conversation');
    }

    const msgType = await repo.findMessageTypeByName(messageTypeName);
    if (!msgType) {
      throw new NotFoundError(`Message type "${messageTypeName}" not found`);
    }

    const msg = await db.transaction((tx) =>
      repo.createMessage(tx, {
        conversationId,
        senderId: userId,
        content,
        messageTypeId: msgType.id,
      }),
    );

    return {
      id: msg.id,
      conversationId: msg.conversationId,
      senderId: msg.senderId,
      content: msg.content,
      messageType: messageTypeName,
      isRead: msg.isRead,
      readAt: msg.readAt,
      isDeleted: msg.isDeleted,
      createdAt: msg.createdAt,
    };
  }

  private formatConversation(
    row: NonNullable<Awaited<ReturnType<typeof repo.findConversationWithParties>>>,
    userId: string,
  ) {
    const isCustomer = row.customerUserId === userId;
    return {
      id: row.id,
      customerId: row.customerId,
      providerId: row.providerId,
      bookingId: row.bookingId ?? null,
      lastMessageAt: row.lastMessageAt ?? null,
      lastMessage: null,
      otherParty: {
        userId: isCustomer ? row.providerUserId : row.customerUserId,
        fullName: row.customerFullName ?? null,
        profilePhotoUrl: row.customerPhotoUrl ?? null,
      },
      unreadCount: 0,
      createdAt: row.createdAt,
    };
  }
}
