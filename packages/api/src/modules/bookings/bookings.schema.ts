import { z } from '@hono/zod-openapi';

export const createBookingRequestSchema = z.object({
  providerId: z.number().int().positive(),
  categoryId: z.number().int().positive(),
  scheduledAt: z.string().datetime(),
  customerAddress: z.string().min(1),
  customerLatitude: z.number().optional(),
  customerLongitude: z.number().optional(),
  description: z.string().optional(),
  estimatedPrice: z.number().positive().optional(),
});
export type CreateBookingRequest = z.infer<typeof createBookingRequestSchema>;

export const updateBookingStatusRequestSchema = z.object({
  status: z.enum(['accepted', 'travelling', 'arrived', 'in_progress', 'completed']),
});
export type UpdateBookingStatusRequest = z.infer<typeof updateBookingStatusRequestSchema>;

export const cancelBookingRequestSchema = z.object({
  reason: z.string().min(1),
});
export type CancelBookingRequest = z.infer<typeof cancelBookingRequestSchema>;

export const rescheduleBookingRequestSchema = z.object({
  scheduledAt: z.string().datetime(),
});
export type RescheduleBookingRequest = z.infer<typeof rescheduleBookingRequestSchema>;

export const listBookingsQuerySchema = z.object({
  role: z.enum(['customer', 'provider']).optional().default('customer'),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});
export type ListBookingsQuery = z.infer<typeof listBookingsQuerySchema>;

export const completionPhotoItemSchema = z.object({
  id: z.number(),
  bookingId: z.number(),
  imageUrl: z.string(),
  fileName: z.string(),
  createdAt: z.string(),
});

export const completionPhotoUploadResponseSchema = z.object({
  uploaded: z.array(completionPhotoItemSchema),
  failed: z.array(
    z.object({
      fileName: z.string(),
      error: z.string(),
    }),
  ),
});
export type CompletionPhotoUploadResponse = z.infer<typeof completionPhotoUploadResponseSchema>;

export const uploadCompletionPhotoRequestSchema = z.object({
  images: z.custom<File>().openapi({
    type: 'string',
    format: 'binary',
    description: 'One or more completion photo files (image/*, max 5 MB each)',
  }),
});
export type UploadCompletionPhotoRequest = z.infer<typeof uploadCompletionPhotoRequestSchema>;

export const bookingResponseSchema = z.object({
  id: z.number(),
  customerId: z.number(),
  providerId: z.number(),
  categoryId: z.number(),
  scheduledAt: z.string(),
  completedAt: z.string().nullable(),
  customerLatitude: z.string().nullable(),
  customerLongitude: z.string().nullable(),
  customerAddress: z.string(),
  description: z.string().nullable(),
  estimatedPrice: z.string().nullable(),
  finalPrice: z.string().nullable(),
  commissionRate: z.string().nullable(),
  commissionAmount: z.string().nullable(),
  statusId: z.number(),
  statusName: z.string(),
  providerName: z.string(),
  cancelledBy: z.string().nullable(),
  cancellationReason: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type BookingResponse = z.infer<typeof bookingResponseSchema>;
