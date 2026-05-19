import type { TX } from '@/lib/types';

import { and, count, desc, eq } from 'drizzle-orm';
import db from '@/db';
import { bookingCompletionPhotos, bookings } from '@/db/models/bookings.model';
import { bookingStatuses } from '@/db/models/lookups.model';
import { commissionSettings } from '@/db/models/admin.model';
import { customers } from '@/db/models/customers.model';
import { serviceProviders } from '@/db/models/service-providers.model';
import { getPaginationValues } from '@/lib/searching-sorting';

const bookingSelect = {
  id: bookings.id,
  customerId: bookings.customerId,
  providerId: bookings.providerId,
  categoryId: bookings.categoryId,
  scheduledAt: bookings.scheduledAt,
  completedAt: bookings.completedAt,
  customerLatitude: bookings.customerLatitude,
  customerLongitude: bookings.customerLongitude,
  customerAddress: bookings.customerAddress,
  description: bookings.description,
  estimatedPrice: bookings.estimatedPrice,
  finalPrice: bookings.finalPrice,
  commissionRate: bookings.commissionRate,
  commissionAmount: bookings.commissionAmount,
  statusId: bookings.statusId,
  statusName: bookingStatuses.name,
  cancelledBy: bookings.cancelledBy,
  cancellationReason: bookings.cancellationReason,
  createdAt: bookings.createdAt,
  updatedAt: bookings.updatedAt,
};

export class BookingsRepository {
  async lookupStatusByName(name: string) {
    return db.query.bookingStatuses.findFirst({
      where: and(eq(bookingStatuses.name, name), eq(bookingStatuses.isDeleted, false)),
    });
  }

  async lookupCommissionRate(tierId: number) {
    const row = await db.query.commissionSettings.findFirst({
      where: eq(commissionSettings.tierId, tierId),
    });
    return row?.commissionRate ?? '0.00';
  }

  async create(
    tx: TX,
    data: {
      customerId: number;
      providerId: number;
      categoryId: number;
      scheduledAt: string;
      customerAddress: string;
      customerLatitude?: string | null;
      customerLongitude?: string | null;
      description?: string | null;
      estimatedPrice?: string | null;
      commissionRate?: string | null;
      commissionAmount?: string | null;
      statusId: number;
    },
  ) {
    const [row] = await tx.insert(bookings).values(data).returning();
    return row;
  }

  async findById(id: number) {
    const rows = await db
      .select({
        ...bookingSelect,
        customerUserId: customers.userId,
        providerUserId: serviceProviders.userId,
      })
      .from(bookings)
      .innerJoin(bookingStatuses, eq(bookingStatuses.id, bookings.statusId))
      .innerJoin(customers, eq(customers.id, bookings.customerId))
      .innerJoin(serviceProviders, eq(serviceProviders.id, bookings.providerId))
      .where(and(eq(bookings.id, id), eq(bookings.isDeleted, false)))
      .limit(1);

    return rows[0] ?? null;
  }

  async findByIdRaw(id: number) {
    return db.query.bookings.findFirst({
      where: and(eq(bookings.id, id), eq(bookings.isDeleted, false)),
    });
  }

  async listByCustomer(
    customerId: number,
    params: { page: number; limit: number; sortOrder?: 'asc' | 'desc' },
  ) {
    const { limit: limitVal, offset } = getPaginationValues(params.page, params.limit);

    const [{ value: total }] = await db
      .select({ value: count() })
      .from(bookings)
      .where(and(eq(bookings.customerId, customerId), eq(bookings.isDeleted, false)));

    const data = await db
      .select(bookingSelect)
      .from(bookings)
      .innerJoin(bookingStatuses, eq(bookingStatuses.id, bookings.statusId))
      .where(and(eq(bookings.customerId, customerId), eq(bookings.isDeleted, false)))
      .orderBy(desc(bookings.createdAt))
      .limit(limitVal)
      .offset(offset);

    return { data, total };
  }

  async listByProvider(
    providerId: number,
    params: { page: number; limit: number; sortOrder?: 'asc' | 'desc' },
  ) {
    const { limit: limitVal, offset } = getPaginationValues(params.page, params.limit);

    const [{ value: total }] = await db
      .select({ value: count() })
      .from(bookings)
      .where(and(eq(bookings.providerId, providerId), eq(bookings.isDeleted, false)));

    const data = await db
      .select(bookingSelect)
      .from(bookings)
      .innerJoin(bookingStatuses, eq(bookingStatuses.id, bookings.statusId))
      .where(and(eq(bookings.providerId, providerId), eq(bookings.isDeleted, false)))
      .orderBy(desc(bookings.createdAt))
      .limit(limitVal)
      .offset(offset);

    return { data, total };
  }

  async updateStatus(tx: TX, id: number, statusId: number, extra: { completedAt?: string } = {}) {
    const [row] = await tx
      .update(bookings)
      .set({
        statusId,
        updatedAt: new Date().toISOString(),
        ...extra,
      })
      .where(eq(bookings.id, id))
      .returning();
    return row;
  }

  async cancel(
    tx: TX,
    id: number,
    statusId: number,
    cancelledBy: string,
    cancellationReason: string,
  ) {
    const [row] = await tx
      .update(bookings)
      .set({
        statusId,
        cancelledBy,
        cancellationReason,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(bookings.id, id))
      .returning();
    return row;
  }

  async reschedule(tx: TX, id: number, scheduledAt: string) {
    const [row] = await tx
      .update(bookings)
      .set({ scheduledAt, updatedAt: new Date().toISOString() })
      .where(eq(bookings.id, id))
      .returning();
    return row;
  }

  async countCompletionPhotos(bookingId: number) {
    const [{ value }] = await db
      .select({ value: count() })
      .from(bookingCompletionPhotos)
      .where(eq(bookingCompletionPhotos.bookingId, bookingId));
    return value;
  }

  async insertCompletionPhotos(
    tx: TX,
    bookingId: number,
    photos: { imageUrl: string; fileName: string }[],
  ) {
    await tx.insert(bookingCompletionPhotos).values(photos.map((p) => ({ bookingId, ...p })));
  }

  async listCompletionPhotos(bookingId: number) {
    return db.query.bookingCompletionPhotos.findMany({
      where: eq(bookingCompletionPhotos.bookingId, bookingId),
      orderBy: [desc(bookingCompletionPhotos.createdAt)],
    });
  }
}
