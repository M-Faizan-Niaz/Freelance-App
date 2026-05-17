import { z } from '@hono/zod-openapi';

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
