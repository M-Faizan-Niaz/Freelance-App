import type {
  ApprovePaymentRoute,
  GetPaymentByBookingRoute,
  GetPaymentRoute,
  ListPaymentsRoute,
  RejectPaymentRoute,
  SubmitPaymentRoute,
} from './payments.route';
import type { AppRouteHandler } from '@/lib/types';

import { AppError, UnauthorizedError } from '@/core/errors';
import { storageService } from '@/common/services/storage.service';
import { generateUniqueFileName, validateFileSize, validateImageFile } from '@/common/upload-helpers';
import { successResponse, successResponseWithPagination } from '@/lib/api-response';
import { auth } from '@/lib/auth';
import * as HttpStatusCodes from '@/lib/http-status-codes';

import { PAYMENT_PROOF_FOLDER, PAYMENT_PROOF_MAX_MB } from './payments.constants';
import { PaymentsService } from './payments.service';

const service = new PaymentsService();

async function requireSession(headers: Headers) {
  const session = await auth.api.getSession({ headers });
  if (!session?.user?.id) {
    throw new UnauthorizedError('Authentication required');
  }
  return session;
}

export const submitPayment: AppRouteHandler<SubmitPaymentRoute> = async (c) => {
  const session = await requireSession(c.req.raw.headers);

  const formData = await c.req.formData();
  const bookingId = Number(formData.get('bookingId'));
  const amount = Number(formData.get('amount'));
  const paymentMethodId = Number(formData.get('paymentMethodId'));
  const transactionReference = (formData.get('transactionReference') as string | null) ?? undefined;
  const notes = (formData.get('notes') as string | null) ?? undefined;
  const proofImage = formData.get('proofImage');

  if (!(proofImage instanceof File)) {
    throw new AppError('Missing required file field: proofImage', HttpStatusCodes.BAD_REQUEST);
  }
  if (!bookingId || !amount || !paymentMethodId) {
    throw new AppError(
      'bookingId, amount, and paymentMethodId are required',
      HttpStatusCodes.BAD_REQUEST,
    );
  }

  validateImageFile(proofImage);
  validateFileSize(proofImage, PAYMENT_PROOF_MAX_MB);

  const proofImageKey = generateUniqueFileName(proofImage, PAYMENT_PROOF_FOLDER);
  const proofImageUrl = await storageService.uploadFile(proofImage, proofImageKey);

  const payment = await service.submitPayment(
    session.user.id,
    { bookingId, amount, paymentMethodId, transactionReference, notes },
    { proofImageUrl, proofImageKey },
  );
  return c.json(successResponse(payment, 'Payment submitted successfully'), HttpStatusCodes.OK);
};

export const listPayments: AppRouteHandler<ListPaymentsRoute> = async (c) => {
  const session = await requireSession(c.req.raw.headers);
  const { page, limit, statusId, sortOrder } = c.req.valid('query');
  const { data, pagination } = await service.listPayments(
    session.user.id,
    session.user.isAdmin ?? false,
    { page, limit, statusId, sortOrder },
  );
  return c.json(
    successResponseWithPagination(data, pagination, [], 'Payments retrieved successfully'),
    HttpStatusCodes.OK,
  );
};

export const getPaymentByBooking: AppRouteHandler<GetPaymentByBookingRoute> = async (c) => {
  const session = await requireSession(c.req.raw.headers);
  const { bookingId } = c.req.valid('param');
  const payment = await service.getPaymentByBooking(
    session.user.id,
    session.user.isAdmin ?? false,
    bookingId,
  );
  return c.json(successResponse(payment, 'Payment retrieved successfully'), HttpStatusCodes.OK);
};

export const getPayment: AppRouteHandler<GetPaymentRoute> = async (c) => {
  const session = await requireSession(c.req.raw.headers);
  const { id } = c.req.valid('param');
  const payment = await service.getPayment(session.user.id, session.user.isAdmin ?? false, id);
  return c.json(successResponse(payment, 'Payment retrieved successfully'), HttpStatusCodes.OK);
};

export const approvePayment: AppRouteHandler<ApprovePaymentRoute> = async (c) => {
  const adminUser = c.get('users') as { id: string };
  const { id } = c.req.valid('param');
  const payment = await service.approvePayment(adminUser.id, id);
  return c.json(successResponse(payment, 'Payment approved successfully'), HttpStatusCodes.OK);
};

export const rejectPayment: AppRouteHandler<RejectPaymentRoute> = async (c) => {
  const adminUser = c.get('users') as { id: string };
  const { id } = c.req.valid('param');
  const { rejectionReason } = c.req.valid('json');
  const payment = await service.rejectPayment(adminUser.id, id, rejectionReason);
  return c.json(successResponse(payment, 'Payment rejected'), HttpStatusCodes.OK);
};
