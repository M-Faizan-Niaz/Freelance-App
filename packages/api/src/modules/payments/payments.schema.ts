import { z } from '@hono/zod-openapi';

export const submitPaymentRequestSchema = z.object({
  bookingId: z.coerce.number().int().positive().openapi({ description: 'Booking ID to pay for' }),
  amount: z.coerce.number().positive().openapi({ description: 'Payment amount' }),
  paymentMethodId: z.coerce.number().int().positive().openapi({ description: 'Payment method ID (jazzcash, easypaisa, etc.)' }),
  proofImage: z.custom<File>().openapi({
    type: 'string',
    format: 'binary',
    description: 'Screenshot or receipt of the payment (image/*, max 10 MB)',
  }),
  transactionReference: z.string().max(255).optional().openapi({ description: 'Transaction reference number from payment app' }),
  notes: z.string().optional().openapi({ description: 'Optional notes for the admin' }),
});
export type SubmitPaymentRequest = z.infer<typeof submitPaymentRequestSchema>;

export const rejectPaymentRequestSchema = z.object({
  rejectionReason: z.string().min(1).max(1000),
});
export type RejectPaymentRequest = z.infer<typeof rejectPaymentRequestSchema>;

export const listPaymentsQuerySchema = z.object({
  statusId: z.coerce.number().int().positive().optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(20),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});
export type ListPaymentsQuery = z.infer<typeof listPaymentsQuerySchema>;

export const paymentResponseSchema = z.object({
  id: z.number(),
  bookingId: z.number(),
  customerId: z.number(),
  amount: z.string(),
  paymentMethodId: z.number(),
  paymentMethodName: z.string(),
  paymentStatusId: z.number(),
  paymentStatusName: z.string(),
  proofImageUrl: z.string().nullable(),
  transactionReference: z.string().nullable(),
  notes: z.string().nullable(),
  reviewedBy: z.string().nullable(),
  reviewedAt: z.string().nullable(),
  rejectionReason: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type PaymentResponse = z.infer<typeof paymentResponseSchema>;
