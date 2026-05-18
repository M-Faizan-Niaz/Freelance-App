import type { NotificationTypeName } from './notifications.constants';

import db from '@/db';
import { createPagination, getPaginationValues } from '@/lib/searching-sorting';

import { NotificationsRepository } from './notifications.repository';

const repo = new NotificationsRepository();

export class NotificationsService {
  async listForUser(userId: string, page: number, limit: number) {
    const { limit: take, offset } = getPaginationValues(page, limit);
    const [items, total] = await Promise.all([
      repo.findManyByUserId(userId, take, offset),
      repo.countByUserId(userId),
    ]);
    return { items, pagination: createPagination(total, page, limit) };
  }

  async markRead(userId: string, ids: number[]) {
    await db.transaction((tx) => repo.markReadByIds(tx, userId, ids));
  }

  async markAllRead(userId: string) {
    await db.transaction((tx) => repo.markAllRead(tx, userId));
  }

  static async send(
    userId: string,
    typeName: NotificationTypeName,
    title: string,
    body: string,
    data?: unknown,
  ): Promise<void> {
    const type = await repo.findTypeByName(typeName);
    if (!type) {
      console.warn(`[NotificationsService.send] unknown type: ${typeName}`);
      return;
    }
    await db.transaction((tx) =>
      repo.createNotification(tx, { userId, notificationTypeId: type.id, title, body, data }),
    );
  }
}
