import type { TX } from '@/lib/types';

import { and, count, eq, inArray } from 'drizzle-orm';

import db from '@/db';
import { notifications } from '@/db/models/notifications.model';
import { notificationTypes } from '@/db/models/lookups.model';

export class NotificationsRepository {
  async findManyByUserId(userId: string, limit: number, offset: number) {
    return db
      .select({
        id: notifications.id,
        userId: notifications.userId,
        notificationTypeId: notifications.notificationTypeId,
        typeName: notificationTypes.name,
        title: notifications.title,
        body: notifications.body,
        data: notifications.data,
        isRead: notifications.isRead,
        readAt: notifications.readAt,
        createdAt: notifications.createdAt,
      })
      .from(notifications)
      .innerJoin(notificationTypes, eq(notificationTypes.id, notifications.notificationTypeId))
      .where(eq(notifications.userId, userId))
      .orderBy(notifications.createdAt)
      .limit(limit)
      .offset(offset);
  }

  async countByUserId(userId: string) {
    const [row] = await db
      .select({ total: count() })
      .from(notifications)
      .where(eq(notifications.userId, userId));
    return row?.total ?? 0;
  }

  async markReadByIds(tx: TX, userId: string, ids: number[]) {
    await tx
      .update(notifications)
      .set({ isRead: true, readAt: new Date().toISOString() })
      .where(
        and(
          inArray(notifications.id, ids),
          eq(notifications.userId, userId),
          eq(notifications.isRead, false),
        ),
      );
  }

  async markAllRead(tx: TX, userId: string) {
    await tx
      .update(notifications)
      .set({ isRead: true, readAt: new Date().toISOString() })
      .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));
  }

  async findTypeByName(typeName: string) {
    return db.query.notificationTypes.findFirst({
      where: eq(notificationTypes.name, typeName),
    });
  }

  async createNotification(
    tx: TX,
    data: {
      userId: string;
      notificationTypeId: number;
      title: string;
      body: string;
      data?: unknown;
    },
  ) {
    const [row] = await tx
      .insert(notifications)
      .values({
        userId: data.userId,
        notificationTypeId: data.notificationTypeId,
        title: data.title,
        body: data.body,
        data: data.data ?? null,
      })
      .returning();
    return row;
  }
}
