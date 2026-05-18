import type { CreateReviewRequest } from './reviews.schema';

import { and, eq } from 'drizzle-orm';
import db from '@/db';
import { customers } from '@/db/models/customers.model';
import { AppError, ConflictError, ForbiddenError, NotFoundError } from '@/core/errors';
import { createPagination } from '@/lib/searching-sorting';
import * as HttpStatusCodes from '@/lib/http-status-codes';

import { ReviewsRepository } from './reviews.repository';

export class ReviewsService {
  private readonly repo: ReviewsRepository;

  constructor() {
    this.repo = new ReviewsRepository();
  }

  async createReview(userId: string, body: CreateReviewRequest) {
    const customer = await this.requireCustomer(userId);

    const booking = await this.repo.findBookingWithStatus(body.bookingId);
    if (!booking) throw new NotFoundError('Booking not found');

    if (booking.customerId !== customer.id) {
      throw new ForbiddenError('You can only review your own bookings');
    }

    if (booking.statusName !== 'completed') {
      throw new AppError(
        `Cannot review a booking with status '${booking.statusName}'`,
        HttpStatusCodes.BAD_REQUEST,
        'invalid_status',
      );
    }

    const existing = await this.repo.findByBookingId(body.bookingId);
    if (existing) throw new ConflictError('A review already exists for this booking');

    const review = await db.transaction(async (tx) => {
      const created = await this.repo.create(tx, {
        bookingId: body.bookingId,
        customerId: customer.id,
        providerId: booking.providerId,
        rating: body.rating,
        comment: body.comment ?? null,
      });
      await this.repo.recalculateProviderRating(tx, booking.providerId);
      return created;
    });

    return review;
  }

  async listProviderReviews(
    providerId: number,
    params: { page: number; limit: number; sortOrder?: 'asc' | 'desc' },
  ) {
    const provider = await this.repo.findProviderById(providerId);
    if (!provider) throw new NotFoundError('Service provider not found');

    const { data, total } = await this.repo.listByProvider(providerId, params);
    return { data, pagination: createPagination(total, params.page, params.limit) };
  }

  private async requireCustomer(userId: string) {
    const customer = await db.query.customers.findFirst({
      where: and(eq(customers.userId, userId), eq(customers.isDeleted, false)),
    });
    if (!customer) throw new NotFoundError('Customer profile not found');
    return customer;
  }
}
