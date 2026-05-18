import { z } from '@hono/zod-openapi';

export const createReviewRequestSchema = z.object({
  bookingId: z.number().int().positive(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(1000).optional(),
});
export type CreateReviewRequest = z.infer<typeof createReviewRequestSchema>;

export const reviewResponseSchema = z.object({
  id: z.number(),
  bookingId: z.number(),
  customerId: z.number(),
  providerId: z.number(),
  rating: z.number(),
  comment: z.string().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type ReviewResponse = z.infer<typeof reviewResponseSchema>;

export const providerReviewItemSchema = z.object({
  id: z.number(),
  bookingId: z.number(),
  rating: z.number(),
  comment: z.string().nullable().optional(),
  createdAt: z.string(),
  reviewer: z.object({
    fullName: z.string(),
    profilePhotoUrl: z.string().nullable().optional(),
  }),
});
export type ProviderReviewItem = z.infer<typeof providerReviewItemSchema>;

export const listProviderReviewsQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(20),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});
export type ListProviderReviewsQuery = z.infer<typeof listProviderReviewsQuerySchema>;
