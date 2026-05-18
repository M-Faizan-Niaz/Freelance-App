import { createRoute, z } from '@hono/zod-openapi';

import * as HttpStatusCodes from '@/lib/http-status-codes';
import { commonErrorResponses, jsonContent, jsonContentRequired } from '@/lib/openapi/helpers';
import { createSuccessResponseSchema, idParams } from '@/lib/openapi/schemas';

import {
  listPaymentsQuerySchema,
  paymentResponseSchema,
  rejectPaymentRequestSchema,
} from './payments.schema';

const tags = ['Payments'];

const bookingIdParams = z.object({
  bookingId: z.coerce.number().int().positive().openapi({ param: { name: 'bookingId', in: 'path' } }),
});

export const submitPayment = createRoute({
  operationId: 'submitPayment',
  path: '/payments',
  method: 'post',
  tags,
  summary: 'Submit payment with proof of payment image',
  request: {
    body: {
      content: {
        'multipart/form-data': {
          schema: z.object({
            bookingId: z.coerce.number().openapi({ description: 'Booking ID to pay for' }),
            amount: z.coerce.number().openapi({ description: 'Payment amount' }),
            paymentMethodId: z.coerce.number().openapi({ description: 'Payment method ID (jazzcash, easypaisa, etc.)' }),
            proofImage: z.custom<File>().openapi({
              type: 'string',
              format: 'binary',
              description: 'Screenshot or receipt of the payment (image/*, max 10 MB)',
            }),
            transactionReference: z.string().optional().openapi({ description: 'Transaction reference number from payment app' }),
            notes: z.string().optional().openapi({ description: 'Optional notes for the admin' }),
          }),
        },
      },
      required: true,
    },
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createSuccessResponseSchema(paymentResponseSchema, 'Payment submitted successfully'),
      'Submitted payment with pending status',
    ),
    ...commonErrorResponses(
      [
        HttpStatusCodes.BAD_REQUEST,
        HttpStatusCodes.UNAUTHORIZED,
        HttpStatusCodes.FORBIDDEN,
        HttpStatusCodes.NOT_FOUND,
        HttpStatusCodes.CONFLICT,
        HttpStatusCodes.UNPROCESSABLE_ENTITY,
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
      ],
      paymentResponseSchema,
    ),
  },
});

export const listPayments = createRoute({
  operationId: 'listPayments',
  path: '/payments',
  method: 'get',
  tags,
  summary: 'List payments (customer: own; admin: all)',
  request: {
    query: listPaymentsQuerySchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createSuccessResponseSchema(z.array(paymentResponseSchema), 'Payments retrieved successfully'),
      'List of payments',
    ),
    ...commonErrorResponses(
      [
        HttpStatusCodes.UNAUTHORIZED,
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
      ],
      paymentResponseSchema,
    ),
  },
});

export const getPaymentByBooking = createRoute({
  operationId: 'getPaymentByBooking',
  path: '/payments/booking/{bookingId}',
  method: 'get',
  tags,
  summary: 'Get payment by booking ID',
  request: {
    params: bookingIdParams,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createSuccessResponseSchema(paymentResponseSchema, 'Payment retrieved successfully'),
      'Payment detail',
    ),
    ...commonErrorResponses(
      [
        HttpStatusCodes.UNAUTHORIZED,
        HttpStatusCodes.FORBIDDEN,
        HttpStatusCodes.NOT_FOUND,
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
      ],
      paymentResponseSchema,
    ),
  },
});

export const getPayment = createRoute({
  operationId: 'getPayment',
  path: '/payments/{id}',
  method: 'get',
  tags,
  summary: 'Get payment detail',
  request: {
    params: idParams,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createSuccessResponseSchema(paymentResponseSchema, 'Payment retrieved successfully'),
      'Payment detail',
    ),
    ...commonErrorResponses(
      [
        HttpStatusCodes.UNAUTHORIZED,
        HttpStatusCodes.FORBIDDEN,
        HttpStatusCodes.NOT_FOUND,
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
      ],
      paymentResponseSchema,
    ),
  },
});

export const approvePayment = createRoute({
  operationId: 'approvePayment',
  path: '/payments/{id}/approve',
  method: 'patch',
  tags,
  summary: '[Admin] Approve a pending payment',
  request: {
    params: idParams,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createSuccessResponseSchema(paymentResponseSchema, 'Payment approved successfully'),
      'Approved payment',
    ),
    ...commonErrorResponses(
      [
        HttpStatusCodes.BAD_REQUEST,
        HttpStatusCodes.UNAUTHORIZED,
        HttpStatusCodes.FORBIDDEN,
        HttpStatusCodes.NOT_FOUND,
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
      ],
      paymentResponseSchema,
    ),
  },
});

export const rejectPayment = createRoute({
  operationId: 'rejectPayment',
  path: '/payments/{id}/reject',
  method: 'patch',
  tags,
  summary: '[Admin] Reject a pending payment',
  request: {
    params: idParams,
    body: jsonContentRequired(rejectPaymentRequestSchema, 'Rejection reason'),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createSuccessResponseSchema(paymentResponseSchema, 'Payment rejected'),
      'Rejected payment',
    ),
    ...commonErrorResponses(
      [
        HttpStatusCodes.BAD_REQUEST,
        HttpStatusCodes.UNAUTHORIZED,
        HttpStatusCodes.FORBIDDEN,
        HttpStatusCodes.NOT_FOUND,
        HttpStatusCodes.UNPROCESSABLE_ENTITY,
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
      ],
      rejectPaymentRequestSchema,
    ),
  },
});

export type SubmitPaymentRoute = typeof submitPayment;
export type ListPaymentsRoute = typeof listPayments;
export type GetPaymentByBookingRoute = typeof getPaymentByBooking;
export type GetPaymentRoute = typeof getPayment;
export type ApprovePaymentRoute = typeof approvePayment;
export type RejectPaymentRoute = typeof rejectPayment;
