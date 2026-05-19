import type { MessageTypeName } from './chat.constants';

import { ForbiddenError, NotFoundError } from '@/core/errors';
import db from '@/db';
import { createPagination, getPaginationValues } from '@/lib/searching-sorting';

import { MESSAGE_TYPE } from './chat.constants';
import { ChatRepository } from './chat.repository';

type ConversationWithParties = NonNullable<
  Awaited<ReturnType<ChatRepository['findConversationWithParties']>>
>;

export class ChatService {
  private readonly repo = new ChatRepository();

  async listConversations(userId: string, page: number, limit: number) {
    const { limit: take, offset } = getPaginationValues(page, limit);
    const [items, total] = await Promise.all([
      this.repo.findManyForUser(userId, take, offset),
      this.repo.countForUser(userId),
    ]);
    return { items, pagination: createPagination(total, page, limit) };
  }

  async getOrCreateConversation(userId: string, providerId: number, bookingId?: number) {
    const customer = await this.repo.findCustomerByUserId(userId);
    if (!customer) {
      throw new ForbiddenError('Only customers can initiate conversations');
    }

    const provider = await this.repo.findProviderById(providerId);
    if (!provider) {
      throw new NotFoundError('Service provider not found');
    }

    if (bookingId !== undefined) {
      const booking = await this.repo.findBookingById(bookingId);
      if (!booking) {
        throw new NotFoundError(`Booking ${bookingId} not found`);
      }
    }

    const existing = await this.repo.findExisting(customer.id, providerId, bookingId);
    if (existing) {
      const row = await this.repo.findConversationWithParties(existing.id);
      return this.formatConversation(row!, userId);
    }

    const created = await db.transaction((tx) =>
      this.repo.createConversation(tx, { customerId: customer.id, providerId, bookingId }),
    );

    const row = await this.repo.findConversationWithParties((created as { id: number }).id);
    return this.formatConversation(row!, userId);
  }

  async listMessages(userId: string, conversationId: number, page: number, limit: number) {
    const isParticipant = await this.repo.isParticipant(conversationId, userId);
    if (!isParticipant) {
      throw new ForbiddenError('You are not a participant in this conversation');
    }

    const { limit: take, offset } = getPaginationValues(page, limit);

    await db.transaction((tx) => this.repo.markMessagesAsRead(tx, conversationId, userId));

    const [items, total] = await Promise.all([
      this.repo.findManyByConversationId(conversationId, take, offset),
      this.repo.countByConversationId(conversationId),
    ]);

    return { items, pagination: createPagination(total, page, limit) };
  }

  async sendMessage(
    userId: string,
    conversationId: number,
    content: string,
    messageTypeName: MessageTypeName = MESSAGE_TYPE.TEXT,
  ) {
    const isParticipant = await this.repo.isParticipant(conversationId, userId);
    if (!isParticipant) {
      throw new ForbiddenError('You are not a participant in this conversation');
    }

    const msgType = await this.repo.findMessageTypeByName(messageTypeName);
    if (!msgType) {
      throw new NotFoundError(`Message type "${messageTypeName}" not found`);
    }

    const msg = await db.transaction((tx) =>
      this.repo.createMessage(tx, {
        conversationId,
        senderId: userId,
        content,
        messageTypeId: msgType.id,
      }),
    ) as Awaited<ReturnType<ChatRepository['createMessage']>>;

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

  private formatConversation(row: ConversationWithParties, userId: string) {
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
