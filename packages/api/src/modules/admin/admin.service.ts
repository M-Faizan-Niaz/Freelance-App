import type {
  AssignProviderRequest,
  BanUserRequest,
  SuspendUserRequest,
  UpdateCommissionSettingsRequest,
  UpdateFraudFlagRequest,
  VerifyProviderRequest,
} from './admin.schema';

import { AppError, NotFoundError } from '@/core/errors';
import db from '@/db';
import * as HttpStatusCodes from '@/lib/http-status-codes';
import { createPagination } from '@/lib/searching-sorting';

import {
  BOOKING_STATUS,
  CUSTOMER_STATUS,
  FRAUD_ACTION,
  PAYMENT_STATUS,
  PAYOUT_STATUS,
  REASSIGNABLE_BOOKING_STATUSES,
  USER_ACTION,
  VERIFICATION_STATUS,
} from './admin.constants';
import { AdminRepository } from './admin.repository';

export class AdminService {
  private readonly repo: AdminRepository;

  constructor() {
    this.repo = new AdminRepository();
  }

  // ---------------------------------------------------------------------------
  // Dashboard
  // ---------------------------------------------------------------------------

  async getDashboard() {
    const kpis = await this.repo.getDashboardKpis();
    return {
      activeBookings: Number(kpis.activeBookings),
      pendingProviders: Number(kpis.pendingProviders),
      totalRevenue: kpis.totalRevenue ?? '0.00',
      onlineProviders: Number(kpis.onlineProviders),
    };
  }

  // ---------------------------------------------------------------------------
  // Providers
  // ---------------------------------------------------------------------------

  async listProviders(params: { status?: string; page: number; limit: number }) {
    const { data, total } = await this.repo.listProviders(params);
    return { data, pagination: createPagination(total, params.page, params.limit) };
  }

  async getProviderDetail(id: number) {
    const provider = await this.repo.getProviderDetail(id);
    if (!provider) throw new NotFoundError('Service provider not found');
    return provider;
  }

  async verifyProvider(adminId: string, providerId: number, body: VerifyProviderRequest) {
    const provider = await this.repo.getProviderDetail(providerId);
    if (!provider) throw new NotFoundError('Service provider not found');

    const actionName =
      body.action === 'approve'
        ? USER_ACTION.APPROVE_PROVIDER
        : body.action === 'reject'
          ? USER_ACTION.REJECT_PROVIDER
          : USER_ACTION.APPROVE_PROVIDER;

    const actionType = await this.repo.lookupActionTypeByName(actionName);
    if (!actionType) throw new AppError('Action type configuration missing');

    const verificationStatus =
      body.action === 'approve'
        ? VERIFICATION_STATUS.APPROVED
        : body.action === 'reject'
          ? VERIFICATION_STATUS.REJECTED
          : VERIFICATION_STATUS.INFO_REQUESTED;

    const isCnicVerified = body.action === 'approve';

    await db.transaction(async (tx) => {
      await this.repo.updateProviderVerification(tx, providerId, verificationStatus, isCnicVerified);
      await this.repo.logAdminAction(tx, {
        adminId,
        actionTypeId: actionType.id,
        targetUserId: provider.userId,
        reason: body.note,
        metadata: { providerId, action: body.action },
      });
    });

    return this.repo.getProviderDetail(providerId);
  }

  // ---------------------------------------------------------------------------
  // Customers
  // ---------------------------------------------------------------------------

  async listCustomers(params: { search?: string; page: number; limit: number }) {
    const { data, total } = await this.repo.listCustomers(params);
    return { data, pagination: createPagination(total, params.page, params.limit) };
  }

  // ---------------------------------------------------------------------------
  // User actions
  // ---------------------------------------------------------------------------

  async suspendUser(adminId: string, targetUserId: string, body: SuspendUserRequest) {
    const profile = await this.repo.findUserProfile(targetUserId);
    if (!profile) throw new NotFoundError('User not found');

    const actionType = await this.repo.lookupActionTypeByName(USER_ACTION.SUSPEND);
    if (!actionType) throw new AppError('Action type configuration missing');

    await db.transaction(async (tx) => {
      await this.repo.setUserProfileActive(tx, targetUserId, false);
      const customer = await this.repo.findCustomerByUserId(targetUserId);
      if (customer) {
        const blockedStatus = await this.repo.lookupCustomerStatusByName(CUSTOMER_STATUS.BLOCKED);
        if (blockedStatus) {
          await this.repo.updateCustomerStatus(tx, targetUserId, blockedStatus.id);
        }
      }
      await this.repo.logAdminAction(tx, {
        adminId,
        actionTypeId: actionType.id,
        targetUserId,
        reason: body.reason,
        metadata: { durationDays: body.durationDays },
      });
    });

    return { userId: targetUserId, action: 'suspend', isActive: false };
  }

  async banUser(adminId: string, targetUserId: string, body: BanUserRequest) {
    const profile = await this.repo.findUserProfile(targetUserId);
    if (!profile) throw new NotFoundError('User not found');

    const actionType = await this.repo.lookupActionTypeByName(USER_ACTION.BAN);
    if (!actionType) throw new AppError('Action type configuration missing');

    await db.transaction(async (tx) => {
      await this.repo.setUserProfileActive(tx, targetUserId, false);
      const customer = await this.repo.findCustomerByUserId(targetUserId);
      if (customer) {
        const blockedStatus = await this.repo.lookupCustomerStatusByName(CUSTOMER_STATUS.BLOCKED);
        if (blockedStatus) {
          await this.repo.updateCustomerStatus(tx, targetUserId, blockedStatus.id);
        }
      }
      await this.repo.logAdminAction(tx, {
        adminId,
        actionTypeId: actionType.id,
        targetUserId,
        reason: body.reason,
      });
    });

    return { userId: targetUserId, action: 'ban', isActive: false };
  }

  async unsuspendUser(adminId: string, targetUserId: string) {
    const profile = await this.repo.findUserProfile(targetUserId);
    if (!profile) throw new NotFoundError('User not found');

    const actionType = await this.repo.lookupActionTypeByName(USER_ACTION.UNSUSPEND);
    if (!actionType) throw new AppError('Action type configuration missing');

    await db.transaction(async (tx) => {
      await this.repo.setUserProfileActive(tx, targetUserId, true);
      const customer = await this.repo.findCustomerByUserId(targetUserId);
      if (customer) {
        const activeStatus = await this.repo.lookupCustomerStatusByName(CUSTOMER_STATUS.ACTIVE);
        if (activeStatus) {
          await this.repo.updateCustomerStatus(tx, targetUserId, activeStatus.id);
        }
      }
      await this.repo.logAdminAction(tx, {
        adminId,
        actionTypeId: actionType.id,
        targetUserId,
      });
    });

    return { userId: targetUserId, action: 'unsuspend', isActive: true };
  }

  // ---------------------------------------------------------------------------
  // Bookings
  // ---------------------------------------------------------------------------

  async listAllBookings(params: {
    statusId?: number;
    dateFrom?: string;
    dateTo?: string;
    page: number;
    limit: number;
  }) {
    const { data, total } = await this.repo.listAllBookings(params);
    return { data, pagination: createPagination(total, params.page, params.limit) };
  }

  async reassignBooking(adminId: string, bookingId: number, body: AssignProviderRequest) {
    const booking = await this.repo.findBookingById(bookingId);
    if (!booking) throw new NotFoundError('Booking not found');

    const bookingStatus = await this.repo.lookupBookingStatusByName(booking.statusId.toString());
    const currentStatusName = await this.getBookingStatusName(booking.statusId);

    if (!REASSIGNABLE_BOOKING_STATUSES.includes(currentStatusName as 'pending' | 'accepted')) {
      throw new AppError(
        `Cannot reassign a booking with status '${currentStatusName}'`,
        HttpStatusCodes.BAD_REQUEST,
        'invalid_operation',
      );
    }

    await db.transaction(async (tx) => {
      await this.repo.reassignBookingProvider(tx, bookingId, body.providerId);
    });

    return this.repo.findBookingById(bookingId);
  }

  async refundBooking(adminId: string, bookingId: number) {
    const booking = await this.repo.findBookingById(bookingId);
    if (!booking) throw new NotFoundError('Booking not found');

    const payment = await this.repo.findPaymentByBookingId(bookingId);
    if (!payment) throw new NotFoundError('No payment found for this booking');

    const refundedStatus = await this.repo.lookupPaymentStatusByName(PAYMENT_STATUS.REFUNDED);
    if (!refundedStatus) throw new AppError('Payment status configuration missing');

    const cancelledStatus = await this.repo.lookupBookingStatusByName(BOOKING_STATUS.CANCELLED);
    if (!cancelledStatus) throw new AppError('Booking status configuration missing');

    await db.transaction(async (tx) => {
      await this.repo.updatePaymentStatus(tx, payment.id, refundedStatus.id);
      await this.repo.updateBookingStatus(tx, bookingId, cancelledStatus.id);
    });

    return { bookingId, paymentId: payment.id, refunded: true };
  }

  // ---------------------------------------------------------------------------
  // Payments
  // ---------------------------------------------------------------------------

  async listAllPayments(params: { statusId?: number; page: number; limit: number }) {
    const { data, total } = await this.repo.listAllPayments(params);
    return { data, pagination: createPagination(total, params.page, params.limit) };
  }

  // ---------------------------------------------------------------------------
  // Payouts
  // ---------------------------------------------------------------------------

  async listPayouts(params: { page: number; limit: number }) {
    const { data, total } = await this.repo.listPayoutRequests(params);
    return { data, pagination: createPagination(total, params.page, params.limit) };
  }

  async approvePayout(adminId: string, payoutRequestId: number) {
    const request = await this.repo.findPayoutRequestById(payoutRequestId);
    if (!request) throw new NotFoundError('Payout request not found');

    const requestedStatus = await this.repo.lookupPayoutStatusByName(PAYOUT_STATUS.REQUESTED);
    if (!requestedStatus || request.payoutStatusId !== requestedStatus.id) {
      throw new AppError(
        'Payout request is not in a pending state',
        HttpStatusCodes.BAD_REQUEST,
        'invalid_operation',
      );
    }

    const approvedStatus = await this.repo.lookupPayoutStatusByName(PAYOUT_STATUS.APPROVED);
    if (!approvedStatus) throw new AppError('Payout status configuration missing');

    await db.transaction(async (tx) => {
      await this.repo.approvePayoutRequest(tx, payoutRequestId, adminId, approvedStatus.id);
    });

    return { payoutRequestId, approved: true };
  }

  // ---------------------------------------------------------------------------
  // Fraud flags
  // ---------------------------------------------------------------------------

  async listFraudFlags(params: { page: number; limit: number }) {
    const { data, total } = await this.repo.listFraudFlags(params);
    return { data, pagination: createPagination(total, params.page, params.limit) };
  }

  async updateFraudFlag(adminId: string, flagId: number, body: UpdateFraudFlagRequest) {
    const flag = await this.repo.findFraudFlagById(flagId);
    if (!flag) throw new NotFoundError('Fraud flag not found');

    if (body.action === FRAUD_ACTION.CLEAR) {
      await db.transaction(async (tx) => {
        await this.repo.resolveFraudFlag(tx, flagId);
      });
    } else if (body.action === FRAUD_ACTION.SUSPEND) {
      const actionType = await this.repo.lookupActionTypeByName(USER_ACTION.SUSPEND);
      if (!actionType) throw new AppError('Action type configuration missing');

      await db.transaction(async (tx) => {
        await this.repo.setUserProfileActive(tx, flag.userId, false);
        const customer = await this.repo.findCustomerByUserId(flag.userId);
        if (customer) {
          const blockedStatus = await this.repo.lookupCustomerStatusByName(CUSTOMER_STATUS.BLOCKED);
          if (blockedStatus) {
            await this.repo.updateCustomerStatus(tx, flag.userId, blockedStatus.id);
          }
        }
        await this.repo.logAdminAction(tx, {
          adminId,
          actionTypeId: actionType.id,
          targetUserId: flag.userId,
          reason: `Suspended via fraud flag #${flagId}`,
          metadata: { flagId },
        });
      });
    }

    return { flagId, action: body.action };
  }

  // ---------------------------------------------------------------------------
  // Commission settings
  // ---------------------------------------------------------------------------

  async getCommissionSettings() {
    return this.repo.getCommissionSettings();
  }

  async updateCommissionSettings(adminId: string, body: UpdateCommissionSettingsRequest) {
    for (const setting of body.settings) {
      const tier = await this.repo.findTierById(setting.tierId);
      if (!tier) throw new NotFoundError(`Tier with id ${setting.tierId} not found`);
    }

    await db.transaction(async (tx) => {
      for (const setting of body.settings) {
        await this.repo.upsertCommissionSetting(tx, setting.tierId, setting.commissionRate, adminId);
      }
    });

    return this.repo.getCommissionSettings();
  }

  // ---------------------------------------------------------------------------
  // Analytics
  // ---------------------------------------------------------------------------

  async getAnalytics(period: 'day' | 'week' | 'month') {
    return this.repo.getAnalytics(period);
  }

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  private async getBookingStatusName(statusId: number): Promise<string> {
    const { bookingStatuses } = await import('@/db/models/lookups.model');
    const { eq } = await import('drizzle-orm');
    const row = await db.query.bookingStatuses.findFirst({
      where: eq(bookingStatuses.id, statusId),
    });
    return row?.name ?? '';
  }
}
