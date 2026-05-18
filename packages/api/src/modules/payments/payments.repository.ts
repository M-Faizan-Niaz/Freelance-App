import type { TX } from '@/lib/types';

import { and, asc, count, desc, eq } from 'drizzle-orm';
import db from '@/db';
import { payments } from '@/db/models/payments.model';
import { paymentMethods, paymentStatuses } from '@/db/models/lookups.model';
import { customers } from '@/db/models/customers.model';
import { getPaginationValues } from '@/lib/searching-sorting';

const paymentSelect = {
  id: payments.id,
  bookingId: payments.bookingId,
  customerId: payments.customerId,
  amount: payments.amount,
  paymentMethodId: payments.paymentMethodId,
  paymentMethodName: paymentMethods.name,
  paymentStatusId: payments.paymentStatusId,
  paymentStatusName: paymentStatuses.name,
  proofImageUrl: payments.proofImageUrl,
  transactionReference: payments.transactionReference,
  notes: payments.notes,
  reviewedBy: payments.reviewedBy,
  reviewedAt: payments.reviewedAt,
  rejectionReason: payments.rejectionReason,
  createdAt: payments.createdAt,
  updatedAt: payments.updatedAt,
  customerUserId: customers.userId,
};

export class PaymentsRepository {
  async lookupStatusByName(name: string) {
    return db.query.paymentStatuses.findFirst({
      where: and(eq(paymentStatuses.name, name), eq(paymentStatuses.isDeleted, false)),
    });
  }

  async create(
    tx: TX,
    data: {
      bookingId: number;
      customerId: number;
      amount: string;
      paymentMethodId: number;
      paymentStatusId: number;
      proofImageUrl?: string | null;
      proofImageKey?: string | null;
      transactionReference?: string | null;
      notes?: string | null;
    },
  ) {
    const [row] = await tx.insert(payments).values(data).returning();
    return row;
  }

  async updateStatus(
    tx: TX,
    id: number,
    paymentStatusId: number,
    extra: {
      reviewedBy?: string;
      reviewedAt?: string;
      rejectionReason?: string;
    } = {},
  ) {
    const [row] = await tx
      .update(payments)
      .set({
        paymentStatusId,
        updatedAt: new Date().toISOString(),
        ...extra,
      })
      .where(eq(payments.id, id))
      .returning();
    return row;
  }

  async findById(id: number) {
    const rows = await db
      .select(paymentSelect)
      .from(payments)
      .innerJoin(paymentMethods, eq(paymentMethods.id, payments.paymentMethodId))
      .innerJoin(paymentStatuses, eq(paymentStatuses.id, payments.paymentStatusId))
      .innerJoin(customers, eq(customers.id, payments.customerId))
      .where(and(eq(payments.id, id), eq(payments.isDeleted, false)))
      .limit(1);

    return rows[0] ?? null;
  }

  async findByBookingId(bookingId: number) {
    const rows = await db
      .select(paymentSelect)
      .from(payments)
      .innerJoin(paymentMethods, eq(paymentMethods.id, payments.paymentMethodId))
      .innerJoin(paymentStatuses, eq(paymentStatuses.id, payments.paymentStatusId))
      .innerJoin(customers, eq(customers.id, payments.customerId))
      .where(and(eq(payments.bookingId, bookingId), eq(payments.isDeleted, false)))
      .limit(1);

    return rows[0] ?? null;
  }

  async existsForBooking(bookingId: number) {
    const [{ value }] = await db
      .select({ value: count() })
      .from(payments)
      .where(and(eq(payments.bookingId, bookingId), eq(payments.isDeleted, false)));
    return value > 0;
  }

  async listByCustomer(
    customerId: number,
    params: { page: number; limit: number; statusId?: number; sortOrder?: 'asc' | 'desc' },
  ) {
    const { limit: limitVal, offset } = getPaginationValues(params.page, params.limit);

    const conditions = and(
      eq(payments.customerId, customerId),
      eq(payments.isDeleted, false),
      params.statusId ? eq(payments.paymentStatusId, params.statusId) : undefined,
    );

    const [{ value: total }] = await db.select({ value: count() }).from(payments).where(conditions);

    const orderFn = params.sortOrder === 'asc' ? asc : desc;

    const data = await db
      .select(paymentSelect)
      .from(payments)
      .innerJoin(paymentMethods, eq(paymentMethods.id, payments.paymentMethodId))
      .innerJoin(paymentStatuses, eq(paymentStatuses.id, payments.paymentStatusId))
      .innerJoin(customers, eq(customers.id, payments.customerId))
      .where(conditions)
      .orderBy(orderFn(payments.createdAt))
      .limit(limitVal)
      .offset(offset);

    return { data, total };
  }

  async listAll(params: {
    page: number;
    limit: number;
    statusId?: number;
    sortOrder?: 'asc' | 'desc';
  }) {
    const { limit: limitVal, offset } = getPaginationValues(params.page, params.limit);

    const conditions = and(
      eq(payments.isDeleted, false),
      params.statusId ? eq(payments.paymentStatusId, params.statusId) : undefined,
    );

    const [{ value: total }] = await db.select({ value: count() }).from(payments).where(conditions);

    const orderFn = params.sortOrder === 'asc' ? asc : desc;

    const data = await db
      .select(paymentSelect)
      .from(payments)
      .innerJoin(paymentMethods, eq(paymentMethods.id, payments.paymentMethodId))
      .innerJoin(paymentStatuses, eq(paymentStatuses.id, payments.paymentStatusId))
      .innerJoin(customers, eq(customers.id, payments.customerId))
      .where(conditions)
      .orderBy(orderFn(payments.createdAt))
      .limit(limitVal)
      .offset(offset);

    return { data, total };
  }
}
