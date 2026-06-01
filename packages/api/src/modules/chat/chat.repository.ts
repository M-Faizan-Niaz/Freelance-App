import type { TX } from '@/lib/types';

import { and, count, desc, eq, inArray, ne, or, sql, asc } from 'drizzle-orm';

import db from '@/db';
import { bookings } from '@/db/models/bookings.model';
import { conversations, messages } from '@/db/models/conversations.model';
import { customers } from '@/db/models/customers.model';
import { messageTypes } from '@/db/models/lookups.model';
import { serviceProviders } from '@/db/models/service-providers.model';
import users from '@/modules/users/users.model';
import { userProfiles } from '@/db/models/user-profiles.model';

export class ChatRepository {
  async findManyForUser(userId: string, limit: number, offset: number) {
    // One row per conversation: the most recent non-deleted message
    const lastMessageSq = db
      .selectDistinctOn([messages.conversationId], {
        conversationId: messages.conversationId,
        content: messages.content,
        sentAt: messages.createdAt,
      })
      .from(messages)
      .where(eq(messages.isDeleted, false))
      .orderBy(asc(messages.conversationId), desc(messages.createdAt))
      .as('last_msg');

    const rows = await db
      .select({
        id: conversations.id,
        customerId: conversations.customerId,
        providerId: conversations.providerId,
        bookingId: conversations.bookingId,
        lastMessageAt: conversations.lastMessageAt,
        lastMessage: lastMessageSq.content,
        createdAt: conversations.createdAt,
        // customer side
        customerUserId: customers.userId,
        customerFullName: sql<string>`cust_profile.full_name`.as('customer_full_name'),
        customerPhotoUrl: sql<string>`cust_profile.profile_photo_url`.as('customer_photo_url'),
        // provider side
        providerUserId: serviceProviders.userId,
        providerFullName: sql<string>`prov_profile.full_name`.as('provider_full_name'),
        providerPhotoUrl: sql<string>`prov_profile.profile_photo_url`.as('provider_photo_url'),
      })
      .from(conversations)
      .innerJoin(customers, eq(customers.id, conversations.customerId))
      .innerJoin(serviceProviders, eq(serviceProviders.id, conversations.providerId))
      .leftJoin(
        sql`user_profiles as cust_profile`,
        sql`cust_profile.user_id = ${customers.userId}`,
      )
      .leftJoin(
        sql`user_profiles as prov_profile`,
        sql`prov_profile.user_id = ${serviceProviders.userId}`,
      )
      .leftJoin(lastMessageSq, eq(lastMessageSq.conversationId, conversations.id))
      .where(
        and(
          eq(conversations.isDeleted, false),
          or(eq(customers.userId, userId), eq(serviceProviders.userId, userId)),
        ),
      )
      .orderBy(desc(conversations.lastMessageAt))
      .limit(limit)
      .offset(offset);

    // Get unread counts separately per conversation for this user
    const conversationIds = rows.map((r) => r.id);
    const unreadMap = new Map<number, number>();

    if (conversationIds.length > 0) {
      const unreadRows = await db
        .select({
          conversationId: messages.conversationId,
          total: count(),
        })
        .from(messages)
        .where(
          and(
            inArray(messages.conversationId, conversationIds),
            ne(messages.senderId, userId),
            eq(messages.isRead, false),
            eq(messages.isDeleted, false),
          ),
        )
        .groupBy(messages.conversationId);

      for (const row of unreadRows) {
        unreadMap.set(row.conversationId, Number(row.total));
      }
    }

    return rows.map((row) => {
      const isCustomer = row.customerUserId === userId;
      return {
        id: row.id,
        customerId: row.customerId,
        providerId: row.providerId,
        bookingId: row.bookingId,
        lastMessageAt: row.lastMessageAt,
        lastMessage: row.lastMessage ?? null,
        otherParty: {
          userId: isCustomer ? row.providerUserId : row.customerUserId,
          fullName: isCustomer ? row.providerFullName : row.customerFullName,
          profilePhotoUrl: isCustomer ? row.providerPhotoUrl : row.customerPhotoUrl,
        },
        unreadCount: unreadMap.get(row.id) ?? 0,
        createdAt: row.createdAt,
      };
    });
  }

  async countForUser(userId: string) {
    const [row] = await db
      .select({ total: count() })
      .from(conversations)
      .innerJoin(customers, eq(customers.id, conversations.customerId))
      .innerJoin(serviceProviders, eq(serviceProviders.id, conversations.providerId))
      .where(
        and(
          eq(conversations.isDeleted, false),
          or(eq(customers.userId, userId), eq(serviceProviders.userId, userId)),
        ),
      );
    return row?.total ?? 0;
  }

  async findExisting(customerId: number, providerId: number, bookingId?: number) {
    const conditions = [
      eq(conversations.customerId, customerId),
      eq(conversations.providerId, providerId),
      eq(conversations.isDeleted, false),
    ];
    if (bookingId !== undefined) {
      conditions.push(eq(conversations.bookingId, bookingId));
    }
    return db.query.conversations.findFirst({ where: and(...conditions) });
  }

  async findById(id: number) {
    return db.query.conversations.findFirst({
      where: and(eq(conversations.id, id), eq(conversations.isDeleted, false)),
    });
  }

  async isParticipant(conversationId: number, userId: string): Promise<boolean> {
    const [customer, provider] = await Promise.all([
      db.query.customers.findFirst({
        where: and(eq(customers.userId, userId), eq(customers.isDeleted, false)),
      }),
      db.query.serviceProviders.findFirst({
        where: and(eq(serviceProviders.userId, userId), eq(serviceProviders.isDeleted, false)),
      }),
    ]);
    if (!customer && !provider) return false;

    const conv = await db.query.conversations.findFirst({
      where: and(eq(conversations.id, conversationId), eq(conversations.isDeleted, false)),
    });
    if (!conv) return false;

    return (
      (customer != null && conv.customerId === customer.id) ||
      (provider != null && conv.providerId === provider.id)
    );
  }

  async findBookingById(id: number) {
    return db.query.bookings.findFirst({ where: eq(bookings.id, id) });
  }

  async createConversation(
    tx: TX,
    data: { customerId: number; providerId: number; bookingId?: number },
  ) {
    const [row] = await tx
      .insert(conversations)
      .values({
        customerId: data.customerId,
        providerId: data.providerId,
        bookingId: data.bookingId ?? null,
      })
      .returning();
    return row;
  }

  async findConversationWithParties(id: number) {
    const [row] = await db
      .select({
        id: conversations.id,
        customerId: conversations.customerId,
        providerId: conversations.providerId,
        bookingId: conversations.bookingId,
        lastMessageAt: conversations.lastMessageAt,
        createdAt: conversations.createdAt,
        customerUserId: customers.userId,
        customerFullName: userProfiles.fullName,
        customerPhotoUrl: userProfiles.profilePhotoUrl,
        providerUserId: serviceProviders.userId,
      })
      .from(conversations)
      .innerJoin(customers, eq(customers.id, conversations.customerId))
      .innerJoin(serviceProviders, eq(serviceProviders.id, conversations.providerId))
      .leftJoin(userProfiles, eq(userProfiles.userId, customers.userId))
      .where(and(eq(conversations.id, id), eq(conversations.isDeleted, false)))
      .limit(1);
    return row ?? null;
  }

  // --- Messages ---

  async findManyByConversationId(conversationId: number, limit: number, offset: number) {
    return db
      .select({
        id: messages.id,
        conversationId: messages.conversationId,
        senderId: messages.senderId,
        content: messages.content,
        messageType: messageTypes.name,
        isRead: messages.isRead,
        readAt: messages.readAt,
        isDeleted: messages.isDeleted,
        createdAt: messages.createdAt,
      })
      .from(messages)
      .innerJoin(messageTypes, eq(messageTypes.id, messages.messageTypeId))
      .where(eq(messages.conversationId, conversationId))
      .orderBy(messages.createdAt)
      .limit(limit)
      .offset(offset);
  }

  async countByConversationId(conversationId: number) {
    const [row] = await db
      .select({ total: count() })
      .from(messages)
      .where(eq(messages.conversationId, conversationId));
    return row?.total ?? 0;
  }

  async markMessagesAsRead(tx: TX, conversationId: number, readerUserId: string) {
    await tx
      .update(messages)
      .set({ isRead: true, readAt: new Date().toISOString() })
      .where(
        and(
          eq(messages.conversationId, conversationId),
          ne(messages.senderId, readerUserId),
          eq(messages.isRead, false),
          eq(messages.isDeleted, false),
        ),
      );
  }

  async createMessage(
    tx: TX,
    data: { conversationId: number; senderId: string; content: string; messageTypeId: number },
  ) {
    const now = new Date().toISOString();

    const [msg] = await tx
      .insert(messages)
      .values({
        conversationId: data.conversationId,
        senderId: data.senderId,
        content: data.content,
        messageTypeId: data.messageTypeId,
      })
      .returning();

    await tx
      .update(conversations)
      .set({ lastMessageAt: now, updatedAt: now })
      .where(eq(conversations.id, data.conversationId));

    return msg;
  }

  async findMessageTypeByName(name: string) {
    return db.query.messageTypes.findFirst({
      where: eq(messageTypes.name, name),
    });
  }

  async findCustomerByUserId(userId: string) {
    return db.query.customers.findFirst({
      where: and(eq(customers.userId, userId), eq(customers.isDeleted, false)),
    });
  }

  async findProviderById(id: number) {
    return db.query.serviceProviders.findFirst({
      where: and(eq(serviceProviders.id, id), eq(serviceProviders.isDeleted, false)),
    });
  }
}
