import { AppError, ConflictError, ForbiddenError, NotFoundError } from '@/core/errors';
import db from '@/db';
import * as HttpStatusCodes from '@/lib/http-status-codes';
import { createPagination } from '@/lib/searching-sorting';
import { CustomersRepository } from '@/modules/customers/customers.repository';
import { BookingsRepository } from '@/modules/bookings/bookings.repository';

import {
  PAYABLE_BOOKING_STATUS,
  PAYMENT_STATUS,
  TERMINAL_PAYMENT_STATUSES,
} from './payments.constants';
import { PaymentsRepository } from './payments.repository';

export class PaymentsService {
  private readonly repo: PaymentsRepository;
  private readonly customersRepo: CustomersRepository;
  private readonly bookingsRepo: BookingsRepository;

  constructor() {
    this.repo = new PaymentsRepository();
    this.customersRepo = new CustomersRepository();
    this.bookingsRepo = new BookingsRepository();
  }

  private async requireCustomer(userId: string) {
    const customer = await this.customersRepo.findByUserId(userId);
    if (!customer) throw new NotFoundError('Customer profile not found');
    return customer;
  }

  private async requireBookingCompleted(bookingId: number, customerId: number) {
    const booking = await this.bookingsRepo.findById(bookingId);
    if (!booking) throw new NotFoundError('Booking not found');

    if (booking.customerId !== customerId) {
      throw new ForbiddenError('You can only pay for your own bookings');
    }

    if (booking.statusName !== PAYABLE_BOOKING_STATUS) {
      throw new AppError(
        `Payment can only be submitted for completed bookings. Current status: '${booking.statusName}'`,
        HttpStatusCodes.BAD_REQUEST,
        'invalid_booking_status',
      );
    }

    return booking;
  }

  async submitPayment(
    userId: string,
    data: {
      bookingId: number;
      amount: number;
      paymentMethodId: number;
      transactionReference?: string;
      notes?: string;
    },
    proof: { proofImageUrl: string; proofImageKey: string },
  ) {
    const customer = await this.requireCustomer(userId);
    await this.requireBookingCompleted(data.bookingId, customer.id);

    const alreadyExists = await this.repo.existsForBooking(data.bookingId);
    if (alreadyExists) {
      throw new ConflictError('A payment has already been submitted for this booking');
    }

    const pendingStatus = await this.repo.lookupStatusByName(PAYMENT_STATUS.PENDING);
    if (!pendingStatus) throw new AppError('Payment status configuration missing');

    const created = await db.transaction(async (tx) =>
      this.repo.create(tx, {
        bookingId: data.bookingId,
        customerId: customer.id,
        amount: String(data.amount),
        paymentMethodId: data.paymentMethodId,
        paymentStatusId: pendingStatus.id,
        proofImageUrl: proof.proofImageUrl,
        proofImageKey: proof.proofImageKey,
        transactionReference: data.transactionReference ?? null,
        notes: data.notes ?? null,
      }),
    );

    const full = await this.repo.findById(created.id);
    if (!full) throw new AppError('Payment could not be fetched after creation');
    return full;
  }

  async listPayments(
    userId: string,
    isAdmin: boolean,
    params: { page: number; limit: number; statusId?: number; sortOrder?: 'asc' | 'desc' },
  ) {
    if (isAdmin) {
      const { data, total } = await this.repo.listAll(params);
      return { data, pagination: createPagination(total, params.page, params.limit) };
    }

    const customer = await this.requireCustomer(userId);
    const { data, total } = await this.repo.listByCustomer(customer.id, params);
    return { data, pagination: createPagination(total, params.page, params.limit) };
  }

  async getPayment(userId: string, isAdmin: boolean, paymentId: number) {
    const payment = await this.repo.findById(paymentId);
    if (!payment) throw new NotFoundError('Payment not found');

    if (!isAdmin && payment.customerUserId !== userId) {
      throw new ForbiddenError('Access denied');
    }

    return payment;
  }

  async getPaymentByBooking(userId: string, isAdmin: boolean, bookingId: number) {
    const payment = await this.repo.findByBookingId(bookingId);
    if (!payment) throw new NotFoundError('Payment not found for this booking');

    if (!isAdmin && payment.customerUserId !== userId) {
      throw new ForbiddenError('Access denied');
    }

    return payment;
  }

  async approvePayment(adminUserId: string, paymentId: number) {
    const payment = await this.repo.findById(paymentId);
    if (!payment) throw new NotFoundError('Payment not found');

    if (TERMINAL_PAYMENT_STATUSES.includes(payment.paymentStatusName)) {
      throw new AppError('Payment has already been reviewed', HttpStatusCodes.BAD_REQUEST);
    }

    const completedStatus = await this.repo.lookupStatusByName(PAYMENT_STATUS.COMPLETED);
    if (!completedStatus) throw new AppError('Payment status configuration missing');

    await db.transaction(async (tx) => {
      await this.repo.updateStatus(tx, paymentId, completedStatus.id, {
        reviewedBy: adminUserId,
        reviewedAt: new Date().toISOString(),
      });
    });

    const updated = await this.repo.findById(paymentId);
    if (!updated) throw new AppError('Payment could not be fetched after approval');
    return updated;
  }

  async rejectPayment(adminUserId: string, paymentId: number, rejectionReason: string) {
    const payment = await this.repo.findById(paymentId);
    if (!payment) throw new NotFoundError('Payment not found');

    if (TERMINAL_PAYMENT_STATUSES.includes(payment.paymentStatusName)) {
      throw new AppError('Payment has already been reviewed', HttpStatusCodes.BAD_REQUEST);
    }

    const failedStatus = await this.repo.lookupStatusByName(PAYMENT_STATUS.FAILED);
    if (!failedStatus) throw new AppError('Payment status configuration missing');

    await db.transaction(async (tx) => {
      await this.repo.updateStatus(tx, paymentId, failedStatus.id, {
        reviewedBy: adminUserId,
        reviewedAt: new Date().toISOString(),
        rejectionReason,
      });
    });

    const updated = await this.repo.findById(paymentId);
    if (!updated) throw new AppError('Payment could not be fetched after rejection');
    return updated;
  }
}
