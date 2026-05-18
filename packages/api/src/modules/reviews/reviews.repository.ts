import type { TX } from '@/lib/types';
import type { NewReviews } from '@/db/models/reviews.model';

import { and, avg, count, desc, asc, eq } from 'drizzle-orm';
import db from '@/db';
import { reviews } from '@/db/models/reviews.model';
import { bookings } from '@/db/models/bookings.model';
import { bookingStatuses } from '@/db/models/lookups.model';
import { customers } from '@/db/models/customers.model';
import { serviceProviders } from '@/db/models/service-providers.model';
import { userProfiles } from '@/db/models/user-profiles.model';
import { getPaginationValues } from '@/lib/searching-sorting';

export class ReviewsRepository {
  async findBookingWithStatus(bookingId: number) {
    const rows = await db
      .select({
        id: bookings.id,
        customerId: bookings.customerId,
        providerId: bookings.providerId,
        statusName: bookingStatuses.name,
      })
      .from(bookings)
      .innerJoin(bookingStatuses, eq(bookingStatuses.id, bookings.statusId))
      .where(and(eq(bookings.id, bookingId), eq(bookings.isDeleted, false)))
      .limit(1);

    return rows[0] ?? null;
  }

  async findByBookingId(bookingId: number) {
    return db.query.reviews.findFirst({
      where: and(eq(reviews.bookingId, bookingId), eq(reviews.isDeleted, false)),
    });
  }

  async create(tx: TX, data: NewReviews) {
    const [row] = await tx.insert(reviews).values(data).returning();
    return row;
  }

  async recalculateProviderRating(tx: TX, providerId: number) {
    const [result] = await tx
      .select({ average: avg(reviews.rating) })
      .from(reviews)
      .where(and(eq(reviews.providerId, providerId), eq(reviews.isDeleted, false)));

    const newRating = result?.average ? Number(result.average).toFixed(2) : '0.00';

    await tx
      .update(serviceProviders)
      .set({ averageRating: newRating, updatedAt: new Date().toISOString() })
      .where(eq(serviceProviders.id, providerId));
  }

  async listByProvider(
    providerId: number,
    params: { page: number; limit: number; sortOrder?: 'asc' | 'desc' },
  ) {
    const { limit: limitVal, offset } = getPaginationValues(params.page, params.limit);

    const [{ value: total }] = await db
      .select({ value: count() })
      .from(reviews)
      .where(and(eq(reviews.providerId, providerId), eq(reviews.isDeleted, false)));

    const data = await db
      .select({
        id: reviews.id,
        bookingId: reviews.bookingId,
        rating: reviews.rating,
        comment: reviews.comment,
        createdAt: reviews.createdAt,
        reviewer: {
          fullName: userProfiles.fullName,
          profilePhotoUrl: userProfiles.profilePhotoUrl,
        },
      })
      .from(reviews)
      .innerJoin(customers, eq(customers.id, reviews.customerId))
      .innerJoin(userProfiles, eq(userProfiles.userId, customers.userId))
      .where(and(eq(reviews.providerId, providerId), eq(reviews.isDeleted, false)))
      .orderBy(params.sortOrder === 'asc' ? asc(reviews.createdAt) : desc(reviews.createdAt))
      .limit(limitVal)
      .offset(offset);

    return { data, total };
  }

  async findProviderById(id: number) {
    return db.query.serviceProviders.findFirst({
      where: and(eq(serviceProviders.id, id), eq(serviceProviders.isDeleted, false)),
    });
  }
}
