import type { TX } from '@/lib/types';

import { and, count, desc, eq, gte, ilike, lte, or, sql, sum } from 'drizzle-orm';
import db from '@/db';
import { adminActions, commissionSettings, fraudFlags } from '@/db/models/admin.model';
import { ACTIVE_BOOKING_STATUSES } from './admin.constants';
import { bookings } from '@/db/models/bookings.model';
import { customers } from '@/db/models/customers.model';
import { userProfiles } from '@/db/models/user-profiles.model';
import {
  actionTypes,
  bookingStatuses,
  customerStatuses,
  paymentMethods,
  paymentStatuses,
  payoutStatuses,
  tiers,
} from '@/db/models/lookups.model';
import { payments, payoutRequests } from '@/db/models/payments.model';
import { serviceProviders } from '@/db/models/service-providers.model';
import users from '@/modules/users/users.model';
import { getPaginationValues } from '@/lib/searching-sorting';

export class AdminRepository {
  // ---------------------------------------------------------------------------
  // Lookups
  // ---------------------------------------------------------------------------

  async lookupActionTypeByName(name: string) {
    return db.query.actionTypes.findFirst({ where: eq(actionTypes.name, name) });
  }

  async lookupCustomerStatusByName(name: string) {
    return db.query.customerStatuses.findFirst({ where: eq(customerStatuses.name, name) });
  }

  async lookupPaymentStatusByName(name: string) {
    return db.query.paymentStatuses.findFirst({ where: eq(paymentStatuses.name, name) });
  }

  async lookupBookingStatusByName(name: string) {
    return db.query.bookingStatuses.findFirst({ where: eq(bookingStatuses.name, name) });
  }

  async lookupPayoutStatusByName(name: string) {
    return db.query.payoutStatuses.findFirst({ where: eq(payoutStatuses.name, name) });
  }

  // ---------------------------------------------------------------------------
  // Dashboard
  // ---------------------------------------------------------------------------

  async getDashboardKpis() {
    const [activeBookingsResult, pendingProvidersResult, revenueResult, onlineProvidersResult] =
      await Promise.all([
        db
          .select({ value: count() })
          .from(bookings)
          .innerJoin(bookingStatuses, eq(bookingStatuses.id, bookings.statusId))
          .where(
            and(
              eq(bookings.isDeleted, false),
              or(...ACTIVE_BOOKING_STATUSES.map((s) => eq(bookingStatuses.name, s))),
            ),
          ),
        db
          .select({ value: count() })
          .from(serviceProviders)
          .where(
            and(
              eq(serviceProviders.isDeleted, false),
              eq(serviceProviders.verificationStatus, 'pending'),
            ),
          ),
        db
          .select({ value: sum(payments.amount) })
          .from(payments)
          .innerJoin(paymentStatuses, eq(paymentStatuses.id, payments.paymentStatusId))
          .where(and(eq(payments.isDeleted, false), eq(paymentStatuses.name, 'completed'))),
        db
          .select({ value: count() })
          .from(serviceProviders)
          .where(
            and(eq(serviceProviders.isDeleted, false), eq(serviceProviders.isOnline, true)),
          ),
      ]);

    return {
      activeBookings: activeBookingsResult[0]?.value ?? 0,
      pendingProviders: pendingProvidersResult[0]?.value ?? 0,
      totalRevenue: revenueResult[0]?.value ?? '0.00',
      onlineProviders: onlineProvidersResult[0]?.value ?? 0,
    };
  }

  // ---------------------------------------------------------------------------
  // Providers
  // ---------------------------------------------------------------------------

  async listProviders(params: { status?: string; page: number; limit: number }) {
    const { limit: limitVal, offset } = getPaginationValues(params.page, params.limit);

    const conditions = [eq(serviceProviders.isDeleted, false)];
    if (params.status) {
      conditions.push(eq(serviceProviders.verificationStatus, params.status));
    }
    const where = and(...conditions);

    const [{ value: total }] = await db
      .select({ value: count() })
      .from(serviceProviders)
      .where(where);

    const data = await db
      .select({
        id: serviceProviders.id,
        userId: serviceProviders.userId,
        fullName: userProfiles.fullName,
        email: users.email,
        phoneNumber: userProfiles.phoneNumber,
        verificationStatus: serviceProviders.verificationStatus,
        isCnicVerified: serviceProviders.isCnicVerified,
        hourlyRate: serviceProviders.hourlyRate,
        tierName: tiers.name,
        isOnline: serviceProviders.isOnline,
        totalJobsCompleted: serviceProviders.totalJobsCompleted,
        averageRating: serviceProviders.averageRating,
        city: serviceProviders.city,
        createdAt: serviceProviders.createdAt,
      })
      .from(serviceProviders)
      .innerJoin(userProfiles, eq(userProfiles.userId, serviceProviders.userId))
      .innerJoin(users, eq(users.id, serviceProviders.userId))
      .innerJoin(tiers, eq(tiers.id, serviceProviders.tierId))
      .where(where)
      .orderBy(desc(serviceProviders.createdAt))
      .limit(limitVal)
      .offset(offset);

    return { data, total };
  }

  async getProviderDetail(id: number) {
    const rows = await db
      .select({
        id: serviceProviders.id,
        userId: serviceProviders.userId,
        fullName: userProfiles.fullName,
        email: users.email,
        phoneNumber: userProfiles.phoneNumber,
        verificationStatus: serviceProviders.verificationStatus,
        isCnicVerified: serviceProviders.isCnicVerified,
        cnicNumber: serviceProviders.cnicNumber,
        cnicFrontUrl: serviceProviders.cnicFrontUrl,
        cnicBackUrl: serviceProviders.cnicBackUrl,
        hourlyRate: serviceProviders.hourlyRate,
        tierId: serviceProviders.tierId,
        tierName: tiers.name,
        isOnline: serviceProviders.isOnline,
        totalJobsCompleted: serviceProviders.totalJobsCompleted,
        averageRating: serviceProviders.averageRating,
        bio: serviceProviders.bio,
        city: serviceProviders.city,
        coverageRadiusKm: serviceProviders.coverageRadiusKm,
        createdAt: serviceProviders.createdAt,
        updatedAt: serviceProviders.updatedAt,
      })
      .from(serviceProviders)
      .innerJoin(userProfiles, eq(userProfiles.userId, serviceProviders.userId))
      .innerJoin(users, eq(users.id, serviceProviders.userId))
      .innerJoin(tiers, eq(tiers.id, serviceProviders.tierId))
      .where(and(eq(serviceProviders.id, id), eq(serviceProviders.isDeleted, false)))
      .limit(1);

    return rows[0] ?? null;
  }

  async updateProviderVerification(
    tx: TX,
    providerId: number,
    verificationStatus: string,
    isCnicVerified: boolean,
  ) {
    await tx
      .update(serviceProviders)
      .set({
        verificationStatus,
        isCnicVerified,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(serviceProviders.id, providerId));
  }

  // ---------------------------------------------------------------------------
  // Customers
  // ---------------------------------------------------------------------------

  async listCustomers(params: { search?: string; page: number; limit: number }) {
    const { limit: limitVal, offset } = getPaginationValues(params.page, params.limit);

    const searchCondition = params.search
      ? or(
          ilike(userProfiles.fullName, `%${params.search}%`),
          ilike(users.email, `%${params.search}%`),
          ilike(userProfiles.phoneNumber, `%${params.search}%`),
        )
      : undefined;

    const baseWhere = and(eq(customers.isDeleted, false), searchCondition);

    const [{ value: total }] = await db
      .select({ value: count() })
      .from(customers)
      .innerJoin(userProfiles, eq(userProfiles.userId, customers.userId))
      .innerJoin(users, eq(users.id, customers.userId))
      .where(baseWhere);

    const data = await db
      .select({
        id: customers.id,
        userId: customers.userId,
        fullName: userProfiles.fullName,
        email: users.email,
        phoneNumber: userProfiles.phoneNumber,
        customerStatus: customerStatuses.name,
        totalBookings: customers.totalBookings,
        totalSpent: customers.totalSpent,
        isActive: userProfiles.isActive,
        createdAt: customers.createdAt,
      })
      .from(customers)
      .innerJoin(userProfiles, eq(userProfiles.userId, customers.userId))
      .innerJoin(users, eq(users.id, customers.userId))
      .innerJoin(customerStatuses, eq(customerStatuses.id, customers.customerStatusId))
      .where(baseWhere)
      .orderBy(desc(customers.createdAt))
      .limit(limitVal)
      .offset(offset);

    return { data, total };
  }

  // ---------------------------------------------------------------------------
  // User profile management
  // ---------------------------------------------------------------------------

  async findUserProfile(userId: string) {
    return db.query.userProfiles.findFirst({
      where: and(eq(userProfiles.userId, userId), eq(userProfiles.isDeleted, false)),
    });
  }

  async findCustomerByUserId(userId: string) {
    return db.query.customers.findFirst({
      where: and(eq(customers.userId, userId), eq(customers.isDeleted, false)),
    });
  }

  async setUserProfileActive(tx: TX, userId: string, isActive: boolean) {
    await tx
      .update(userProfiles)
      .set({ isActive, updatedAt: new Date().toISOString() })
      .where(eq(userProfiles.userId, userId));
  }

  async updateCustomerStatus(tx: TX, userId: string, statusId: number) {
    await tx
      .update(customers)
      .set({ customerStatusId: statusId, updatedAt: new Date().toISOString() })
      .where(eq(customers.userId, userId));
  }

  async logAdminAction(
    tx: TX,
    data: {
      adminId: string;
      actionTypeId: number;
      targetUserId: string;
      reason?: string;
      metadata?: Record<string, unknown>;
    },
  ) {
    await tx.insert(adminActions).values({
      adminId: data.adminId,
      actionTypeId: data.actionTypeId,
      targetUserId: data.targetUserId,
      reason: data.reason ?? null,
      metadata: data.metadata ?? null,
      createdAt: new Date().toISOString(),
    });
  }

  // ---------------------------------------------------------------------------
  // Bookings (admin view)
  // ---------------------------------------------------------------------------

  async listAllBookings(params: {
    statusId?: number;
    dateFrom?: string;
    dateTo?: string;
    page: number;
    limit: number;
  }) {
    const { limit: limitVal, offset } = getPaginationValues(params.page, params.limit);

    const conditions = [eq(bookings.isDeleted, false)];
    if (params.statusId) conditions.push(eq(bookings.statusId, params.statusId));
    if (params.dateFrom) conditions.push(gte(bookings.scheduledAt, params.dateFrom));
    if (params.dateTo) conditions.push(lte(bookings.scheduledAt, params.dateTo));
    const where = and(...conditions);

    const [{ value: total }] = await db.select({ value: count() }).from(bookings).where(where);

    const data = await db
      .select({
        id: bookings.id,
        customerId: bookings.customerId,
        customerName: userProfiles.fullName,
        providerId: bookings.providerId,
        providerName: sql<string>`sp_profile.full_name`,
        categoryId: bookings.categoryId,
        scheduledAt: bookings.scheduledAt,
        completedAt: bookings.completedAt,
        customerAddress: bookings.customerAddress,
        estimatedPrice: bookings.estimatedPrice,
        finalPrice: bookings.finalPrice,
        commissionAmount: bookings.commissionAmount,
        statusId: bookings.statusId,
        statusName: bookingStatuses.name,
        cancelledBy: bookings.cancelledBy,
        cancellationReason: bookings.cancellationReason,
        createdAt: bookings.createdAt,
      })
      .from(bookings)
      .innerJoin(bookingStatuses, eq(bookingStatuses.id, bookings.statusId))
      .innerJoin(customers, eq(customers.id, bookings.customerId))
      .innerJoin(userProfiles, eq(userProfiles.userId, customers.userId))
      .innerJoin(serviceProviders, eq(serviceProviders.id, bookings.providerId))
      .innerJoin(
        sql`user_profiles sp_profile`,
        sql`sp_profile.user_id = ${serviceProviders.userId}`,
      )
      .where(where)
      .orderBy(desc(bookings.createdAt))
      .limit(limitVal)
      .offset(offset);

    return { data, total };
  }

  async findBookingById(id: number) {
    return db.query.bookings.findFirst({
      where: and(eq(bookings.id, id), eq(bookings.isDeleted, false)),
    });
  }

  async reassignBookingProvider(tx: TX, bookingId: number, newProviderId: number) {
    await tx
      .update(bookings)
      .set({ providerId: newProviderId, updatedAt: new Date().toISOString() })
      .where(eq(bookings.id, bookingId));
  }

  async updateBookingStatus(tx: TX, bookingId: number, statusId: number) {
    await tx
      .update(bookings)
      .set({ statusId, updatedAt: new Date().toISOString() })
      .where(eq(bookings.id, bookingId));
  }

  // ---------------------------------------------------------------------------
  // Payments (admin view)
  // ---------------------------------------------------------------------------

  async listAllPayments(params: { statusId?: number; page: number; limit: number }) {
    const { limit: limitVal, offset } = getPaginationValues(params.page, params.limit);

    const conditions = [eq(payments.isDeleted, false)];
    if (params.statusId) conditions.push(eq(payments.paymentStatusId, params.statusId));
    const where = and(...conditions);

    const [{ value: total }] = await db.select({ value: count() }).from(payments).where(where);

    const data = await db
      .select({
        id: payments.id,
        bookingId: payments.bookingId,
        customerId: payments.customerId,
        customerName: userProfiles.fullName,
        amount: payments.amount,
        paymentMethodName: paymentMethods.name,
        paymentStatusName: paymentStatuses.name,
        transactionReference: payments.transactionReference,
        reviewedBy: payments.reviewedBy,
        reviewedAt: payments.reviewedAt,
        createdAt: payments.createdAt,
      })
      .from(payments)
      .innerJoin(paymentMethods, eq(paymentMethods.id, payments.paymentMethodId))
      .innerJoin(paymentStatuses, eq(paymentStatuses.id, payments.paymentStatusId))
      .innerJoin(customers, eq(customers.id, payments.customerId))
      .innerJoin(userProfiles, eq(userProfiles.userId, customers.userId))
      .where(where)
      .orderBy(desc(payments.createdAt))
      .limit(limitVal)
      .offset(offset);

    return { data, total };
  }

  async findPaymentByBookingId(bookingId: number) {
    return db.query.payments.findFirst({
      where: and(eq(payments.bookingId, bookingId), eq(payments.isDeleted, false)),
    });
  }

  async updatePaymentStatus(tx: TX, paymentId: number, statusId: number) {
    await tx
      .update(payments)
      .set({ paymentStatusId: statusId, updatedAt: new Date().toISOString() })
      .where(eq(payments.id, paymentId));
  }

  // ---------------------------------------------------------------------------
  // Payout requests
  // ---------------------------------------------------------------------------

  async listPayoutRequests(params: { page: number; limit: number }) {
    const { limit: limitVal, offset } = getPaginationValues(params.page, params.limit);

    const where = and(eq(payoutRequests.isDeleted, false));

    const [{ value: total }] = await db
      .select({ value: count() })
      .from(payoutRequests)
      .where(where);

    const data = await db
      .select({
        id: payoutRequests.id,
        providerId: payoutRequests.providerId,
        providerName: userProfiles.fullName,
        amount: payoutRequests.amount,
        payoutStatus: payoutStatuses.name,
        requestedAt: payoutRequests.requestedAt,
        processedAt: payoutRequests.processedAt,
        processedBy: payoutRequests.processedBy,
        createdAt: payoutRequests.createdAt,
      })
      .from(payoutRequests)
      .innerJoin(serviceProviders, eq(serviceProviders.id, payoutRequests.providerId))
      .innerJoin(userProfiles, eq(userProfiles.userId, serviceProviders.userId))
      .innerJoin(payoutStatuses, eq(payoutStatuses.id, payoutRequests.payoutStatusId))
      .where(where)
      .orderBy(desc(payoutRequests.createdAt))
      .limit(limitVal)
      .offset(offset);

    return { data, total };
  }

  async findPayoutRequestById(id: number) {
    return db.query.payoutRequests.findFirst({
      where: and(eq(payoutRequests.id, id), eq(payoutRequests.isDeleted, false)),
    });
  }

  async approvePayoutRequest(tx: TX, id: number, adminId: string, approvedStatusId: number) {
    await tx
      .update(payoutRequests)
      .set({
        payoutStatusId: approvedStatusId,
        processedBy: adminId,
        processedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .where(eq(payoutRequests.id, id));
  }

  // ---------------------------------------------------------------------------
  // Fraud flags
  // ---------------------------------------------------------------------------

  async listFraudFlags(params: { page: number; limit: number }) {
    const { limit: limitVal, offset } = getPaginationValues(params.page, params.limit);

    const [{ value: total }] = await db.select({ value: count() }).from(fraudFlags);

    const data = await db
      .select({
        id: fraudFlags.id,
        userId: fraudFlags.userId,
        userName: userProfiles.fullName,
        reason: fraudFlags.reason,
        riskScore: fraudFlags.riskScore,
        flaggedBySystem: fraudFlags.flaggedBySystem,
        flaggedByAdmin: fraudFlags.flaggedByAdmin,
        isResolved: fraudFlags.isResolved,
        resolvedAt: fraudFlags.resolvedAt,
        createdAt: fraudFlags.createdAt,
      })
      .from(fraudFlags)
      .leftJoin(userProfiles, eq(userProfiles.userId, fraudFlags.userId))
      .orderBy(desc(fraudFlags.createdAt))
      .limit(limitVal)
      .offset(offset);

    return { data, total };
  }

  async findFraudFlagById(id: number) {
    return db.query.fraudFlags.findFirst({ where: eq(fraudFlags.id, id) });
  }

  async resolveFraudFlag(tx: TX, id: number) {
    await tx
      .update(fraudFlags)
      .set({ isResolved: true, resolvedAt: new Date().toISOString(), updatedAt: new Date().toISOString() })
      .where(eq(fraudFlags.id, id));
  }

  // ---------------------------------------------------------------------------
  // Commission settings
  // ---------------------------------------------------------------------------

  async getCommissionSettings() {
    return db
      .select({
        tierId: commissionSettings.tierId,
        tierName: tiers.name,
        commissionRate: commissionSettings.commissionRate,
        effectiveFrom: commissionSettings.effectiveFrom,
        createdBy: commissionSettings.createdBy,
        createdAt: commissionSettings.createdAt,
      })
      .from(commissionSettings)
      .innerJoin(tiers, eq(tiers.id, commissionSettings.tierId))
      .orderBy(tiers.id);
  }

  async upsertCommissionSetting(
    tx: TX,
    tierId: number,
    commissionRate: string,
    adminId: string,
  ) {
    await tx
      .insert(commissionSettings)
      .values({
        tierId,
        commissionRate,
        effectiveFrom: new Date().toISOString(),
        createdBy: adminId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .onConflictDoUpdate({
        target: commissionSettings.tierId,
        set: {
          commissionRate,
          effectiveFrom: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      });
  }

  async findBookingStatusById(id: number) {
    return db.query.bookingStatuses.findFirst({ where: eq(bookingStatuses.id, id) });
  }

  async findTierById(id: number) {
    return db.query.tiers.findFirst({ where: eq(tiers.id, id) });
  }

  // ---------------------------------------------------------------------------
  // Analytics
  // ---------------------------------------------------------------------------

  async getAnalytics(period: 'day' | 'week' | 'month') {
    const truncUnit = period === 'day' ? 'hour' : period === 'week' ? 'day' : 'day';
    const intervalSql =
      period === 'day' ? sql`NOW() - INTERVAL '1 day'`
      : period === 'week' ? sql`NOW() - INTERVAL '7 days'`
      : sql`NOW() - INTERVAL '30 days'`;

    const [revenueRows, bookingStatusRows, newUserRows, topProviderRows] = await Promise.all([
      db.execute<{ date: string; amount: string }>(sql`
        SELECT date_trunc(${truncUnit}, p.created_at::timestamptz) AS date,
               COALESCE(SUM(p.amount), 0)::text AS amount
        FROM payments p
        JOIN payment_statuses ps ON ps.id = p.payment_status_id
        WHERE ps.name = 'completed'
          AND p.created_at::timestamptz >= ${intervalSql}
          AND p.is_deleted = false
        GROUP BY 1
        ORDER BY 1
      `),
      db.execute<{ status: string; count: string }>(sql`
        SELECT bs.name AS status, COUNT(b.id)::text AS count
        FROM bookings b
        JOIN booking_statuses bs ON bs.id = b.status_id
        WHERE b.is_deleted = false
        GROUP BY bs.name
      `),
      db.execute<{ date: string; count: string }>(sql`
        SELECT date_trunc(${truncUnit}, up.created_at::timestamptz) AS date,
               COUNT(up.id)::text AS count
        FROM user_profiles up
        WHERE up.is_deleted = false
          AND up.created_at::timestamptz >= ${intervalSql}
        GROUP BY 1
        ORDER BY 1
      `),
      db
        .select({
          id: serviceProviders.id,
          fullName: userProfiles.fullName,
          totalJobsCompleted: serviceProviders.totalJobsCompleted,
          averageRating: serviceProviders.averageRating,
        })
        .from(serviceProviders)
        .innerJoin(userProfiles, eq(userProfiles.userId, serviceProviders.userId))
        .where(eq(serviceProviders.isDeleted, false))
        .orderBy(desc(serviceProviders.totalJobsCompleted))
        .limit(5),
    ]);

    return {
      revenue: (revenueRows as unknown as { date: string; amount: string }[]).map((r) => ({
        date: String(r.date),
        amount: String(r.amount),
      })),
      bookingsByStatus: (bookingStatusRows as unknown as { status: string; count: string }[]).map(
        (r) => ({ status: String(r.status), count: Number(r.count) }),
      ),
      newUsers: (newUserRows as unknown as { date: string; count: string }[]).map((r) => ({
        date: String(r.date),
        count: Number(r.count),
      })),
      topProviders: topProviderRows,
    };
  }
}
