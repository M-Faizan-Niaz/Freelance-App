import type { CreateBookingRequest } from './bookings.schema';

import { AppError, ForbiddenError, NotFoundError } from '@/core/errors';
import db from '@/db';
import * as HttpStatusCodes from '@/lib/http-status-codes';
import { createPagination } from '@/lib/searching-sorting';
import { CustomersRepository } from '@/modules/customers/customers.repository';
import { NOTIFICATION_TYPE } from '@/modules/notifications/notifications.constants';
import { NotificationsService } from '@/modules/notifications/notifications.service';
import { ServiceProvidersRepository } from '@/modules/service-providers/service-providers.repository';

import {
  BOOKING_STATUS,
  CANCELLABLE_STATUSES,
  COMPLETION_PHOTO_STATUSES,
  MAX_COMPLETION_PHOTOS,
  VALID_STATUS_TRANSITIONS,
} from './bookings.constants';
import { BookingsRepository } from './bookings.repository';

export class BookingsService {
  private readonly repo: BookingsRepository;
  private readonly customersRepo: CustomersRepository;
  private readonly providersRepo: ServiceProvidersRepository;

  constructor() {
    this.repo = new BookingsRepository();
    this.customersRepo = new CustomersRepository();
    this.providersRepo = new ServiceProvidersRepository();
  }

  private async requireCustomer(userId: string) {
    const customer = await this.customersRepo.findByUserId(userId);
    if (!customer) throw new NotFoundError('Customer profile not found');
    return customer;
  }

  private async requireProviderByUserId(userId: string) {
    const provider = await this.providersRepo.findByUserId(userId);
    if (!provider) throw new NotFoundError('Service provider profile not found');
    return provider;
  }

  async createBooking(userId: string, data: CreateBookingRequest) {
    const customer = await this.requireCustomer(userId);

    const provider = await this.providersRepo.findById(data.providerId);
    if (!provider) throw new NotFoundError('Service provider not found');

    const commissionRate = await this.repo.lookupCommissionRate(provider.tierId);
    const commissionAmount =
      data.estimatedPrice && commissionRate
        ? String((data.estimatedPrice * parseFloat(commissionRate)) / 100)
        : null;

    const pendingStatus = await this.repo.lookupStatusByName(BOOKING_STATUS.PENDING);
    if (!pendingStatus) throw new AppError('Booking status configuration missing');

    const booking = await db.transaction(async (tx) =>
      this.repo.create(tx, {
        customerId: customer.id,
        providerId: data.providerId,
        categoryId: data.categoryId,
        scheduledAt: data.scheduledAt,
        customerAddress: data.customerAddress,
        customerLatitude:
          data.customerLatitude !== undefined ? String(data.customerLatitude) : null,
        customerLongitude:
          data.customerLongitude !== undefined ? String(data.customerLongitude) : null,
        description: data.description ?? null,
        estimatedPrice: data.estimatedPrice !== undefined ? String(data.estimatedPrice) : null,
        commissionRate,
        commissionAmount,
        statusId: pendingStatus.id,
      }),
    );

    const full = await this.repo.findById(booking.id);
    if (!full) throw new AppError('Booking could not be fetched after creation');

    NotificationsService.send(
      full.providerUserId,
      NOTIFICATION_TYPE.SYSTEM,
      'New Booking Request',
      'You have a new booking request from a customer.',
      { bookingId: full.id },
    ).catch(console.error);

    return full;
  }

  async listBookings(
    userId: string,
    role: 'customer' | 'provider',
    params: { page: number; limit: number; sortOrder?: 'asc' | 'desc' },
  ) {
    if (role === 'provider') {
      const provider = await this.requireProviderByUserId(userId);
      const { data, total } = await this.repo.listByProvider(provider.id, params);
      return { data, pagination: createPagination(total, params.page, params.limit) };
    }

    const customer = await this.requireCustomer(userId);
    const { data, total } = await this.repo.listByCustomer(customer.id, params);
    return { data, pagination: createPagination(total, params.page, params.limit) };
  }

  async getBooking(userId: string, bookingId: number) {
    const booking = await this.repo.findById(bookingId);
    if (!booking) throw new NotFoundError('Booking not found');

    if (booking.customerUserId !== userId && booking.providerUserId !== userId) {
      throw new ForbiddenError('Access denied');
    }

    return booking;
  }

  async updateStatus(userId: string, bookingId: number, newStatus: string) {
    const booking = await this.repo.findById(bookingId);
    if (!booking) throw new NotFoundError('Booking not found');

    if (booking.providerUserId !== userId) {
      throw new ForbiddenError('Only the assigned provider can update the booking status');
    }

    const allowedTransitions = VALID_STATUS_TRANSITIONS[booking.statusName] ?? [];
    if (!allowedTransitions.includes(newStatus)) {
      throw new AppError(
        `Cannot transition from '${booking.statusName}' to '${newStatus}'`,
        HttpStatusCodes.BAD_REQUEST,
        'invalid_transition',
      );
    }

    const statusRow = await this.repo.lookupStatusByName(newStatus);
    if (!statusRow) throw new AppError('Status configuration missing');

    const extra: { completedAt?: string } = {};
    if (newStatus === BOOKING_STATUS.COMPLETED) {
      extra.completedAt = new Date().toISOString();
    }

    await db.transaction(async (tx) => {
      await this.repo.updateStatus(tx, bookingId, statusRow.id, extra);
    });

    const updated = await this.repo.findById(bookingId);
    if (!updated) throw new AppError('Booking could not be fetched after update');

    const statusNotifications: Partial<Record<string, { type: typeof NOTIFICATION_TYPE[keyof typeof NOTIFICATION_TYPE]; title: string; body: string }>> = {
      [BOOKING_STATUS.ACCEPTED]: {
        type: NOTIFICATION_TYPE.BOOKING_CONFIRMED,
        title: 'Booking Confirmed',
        body: 'Your booking has been confirmed. The provider will be on their way soon.',
      },
      [BOOKING_STATUS.REJECTED]: {
        type: NOTIFICATION_TYPE.SYSTEM,
        title: 'Booking Declined',
        body: 'Unfortunately, the provider was unable to accept your booking.',
      },
      [BOOKING_STATUS.TRAVELLING]: {
        type: NOTIFICATION_TYPE.PROVIDER_ON_WAY,
        title: 'Provider On The Way',
        body: 'Your provider is heading to your location.',
      },
      [BOOKING_STATUS.ARRIVED]: {
        type: NOTIFICATION_TYPE.SYSTEM,
        title: 'Provider Arrived',
        body: 'Your provider has arrived at your location.',
      },
      [BOOKING_STATUS.IN_PROGRESS]: {
        type: NOTIFICATION_TYPE.SYSTEM,
        title: 'Service In Progress',
        body: 'Your service is now underway.',
      },
      [BOOKING_STATUS.COMPLETED]: {
        type: NOTIFICATION_TYPE.REVIEW_REMINDER,
        title: 'Service Completed',
        body: "Your service is complete! Don't forget to leave a review.",
      },
    };

    const notif = statusNotifications[newStatus];
    if (notif) {
      NotificationsService.send(
        updated.customerUserId,
        notif.type,
        notif.title,
        notif.body,
        { bookingId: updated.id },
      ).catch(console.error);
    }

    return updated;
  }

  async cancelBooking(userId: string, bookingId: number, reason: string) {
    const booking = await this.repo.findById(bookingId);
    if (!booking) throw new NotFoundError('Booking not found');

    if (booking.customerUserId !== userId && booking.providerUserId !== userId) {
      throw new ForbiddenError('Access denied');
    }

    if (!CANCELLABLE_STATUSES.includes(booking.statusName)) {
      throw new AppError(
        `Cannot cancel a booking with status '${booking.statusName}'`,
        HttpStatusCodes.BAD_REQUEST,
        'invalid_transition',
      );
    }

    const cancelledStatus = await this.repo.lookupStatusByName(BOOKING_STATUS.CANCELLED);
    if (!cancelledStatus) throw new AppError('Status configuration missing');

    await db.transaction(async (tx) => {
      await this.repo.cancel(tx, bookingId, cancelledStatus.id, userId, reason);
    });

    const updated = await this.repo.findById(bookingId);
    if (!updated) throw new AppError('Booking could not be fetched after cancellation');

    const cancelledByCustomer = userId === updated.customerUserId;
    NotificationsService.send(
      cancelledByCustomer ? updated.providerUserId : updated.customerUserId,
      NOTIFICATION_TYPE.SYSTEM,
      'Booking Cancelled',
      cancelledByCustomer
        ? 'A customer has cancelled their booking.'
        : 'Your provider has cancelled the booking.',
      { bookingId: updated.id },
    ).catch(console.error);

    return updated;
  }

  async rescheduleBooking(userId: string, bookingId: number, scheduledAt: string) {
    const booking = await this.repo.findById(bookingId);
    if (!booking) throw new NotFoundError('Booking not found');

    if (booking.customerUserId !== userId) {
      throw new ForbiddenError('Only the customer can reschedule the booking');
    }

    if (booking.statusName !== BOOKING_STATUS.PENDING) {
      throw new AppError(
        `Cannot reschedule a booking with status '${booking.statusName}'`,
        HttpStatusCodes.BAD_REQUEST,
        'invalid_operation',
      );
    }

    await db.transaction(async (tx) => {
      await this.repo.reschedule(tx, bookingId, scheduledAt);
    });

    const updated = await this.repo.findById(bookingId);
    if (!updated) throw new AppError('Booking could not be fetched after reschedule');

    NotificationsService.send(
      updated.providerUserId,
      NOTIFICATION_TYPE.SYSTEM,
      'Booking Rescheduled',
      'A customer has rescheduled their booking to a new time.',
      { bookingId: updated.id },
    ).catch(console.error);

    return updated;
  }

  async uploadCompletionPhotos(
    userId: string,
    bookingId: number,
    photos: { imageUrl: string; fileName: string }[],
  ) {
    const booking = await this.repo.findById(bookingId);
    if (!booking) throw new NotFoundError('Booking not found');

    if (booking.providerUserId !== userId) {
      throw new ForbiddenError('Only the assigned provider can upload completion photos');
    }

    if (!COMPLETION_PHOTO_STATUSES.includes(booking.statusName)) {
      throw new AppError(
        `Cannot upload photos for a booking with status '${booking.statusName}'`,
        HttpStatusCodes.BAD_REQUEST,
        'invalid_operation',
      );
    }

    const existing = await this.repo.countCompletionPhotos(bookingId);
    if (existing + photos.length > MAX_COMPLETION_PHOTOS) {
      throw new AppError(
        `Cannot upload ${photos.length} photo(s). You have ${existing} and the limit is ${MAX_COMPLETION_PHOTOS}.`,
        HttpStatusCodes.BAD_REQUEST,
      );
    }

    await db.transaction(async (tx) => {
      await this.repo.insertCompletionPhotos(tx, bookingId, photos);
    });

    return this.repo.listCompletionPhotos(bookingId);
  }
}
