import { z } from '@hono/zod-openapi';

export const updateProviderProfileSchema = z.object({
  bio: z.string().trim().max(1000).optional(),
  hourlyRate: z.number().min(0).max(999999).optional(),
});
export type UpdateProviderProfile = z.infer<typeof updateProviderProfileSchema>;

export const updateProviderProfileResponseSchema = z.object({
  bio: z.string().nullable(),
  hourlyRate: z.string(),
});

export const setProviderCategoriesSchema = z.object({
  categoryIds: z.array(z.number().int().positive()).max(20),
});
export type SetProviderCategories = z.infer<typeof setProviderCategoriesSchema>;

export const setProviderCategoriesResponseSchema = z.object({
  categoryIds: z.array(z.number()),
});

export const portfolioImageSchema = z.object({
  id: z.number(),
  serviceProviderId: z.number(),
  fileName: z.string(),
  url: z.string(),
  createdAt: z.string(),
});

export type PortfolioImage = z.infer<typeof portfolioImageSchema>;

export const portfolioUploadResultSchema = z.object({
  uploaded: z.array(portfolioImageSchema),
  failed: z.array(z.object({ fileName: z.string(), error: z.string() })),
});

export const deletePortfolioRequestSchema = z.object({
  fileNames: z.array(z.string()).min(1),
});

export type DeletePortfolioRequest = z.infer<typeof deletePortfolioRequestSchema>;

export const uploadDocumentsResultSchema = z.object({
  cnicFrontUrl: z.string(),
  cnicBackUrl: z.string(),
});

export const uploadDocumentsRequestSchema = z.object({
  cnicFront: z.custom<File>().openapi({ type: 'string', format: 'binary', description: 'CNIC front (image or PDF, max 10 MB)' }),
  cnicBack: z.custom<File>().openapi({ type: 'string', format: 'binary', description: 'CNIC back (image or PDF, max 10 MB)' }),
});
export type UploadDocumentsRequest = z.infer<typeof uploadDocumentsRequestSchema>;

export const uploadPortfolioRequestSchema = z.object({
  images: z.custom<File>().openapi({ type: 'string', format: 'binary', description: 'Portfolio images (multiple allowed)' }),
});
export type UploadPortfolioRequest = z.infer<typeof uploadPortfolioRequestSchema>;

export const deletePortfolioResponseSchema = z.object({
  deleted: z.array(z.string()),
});
export type DeletePortfolioResponse = z.infer<typeof deletePortfolioResponseSchema>;
