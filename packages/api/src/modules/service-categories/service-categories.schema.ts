import { z } from '@hono/zod-openapi';
import { serviceCategoriesSchema } from '@/db/models/lookups.model';
import { nameSchema } from '@/lib/zod-schemas/common-schemas';

export const createServiceCategoryRequestSchema = z.object({
  name: nameSchema.describe('Service category name'),
  description: z.string().optional().describe('Service category description'),
  isActive: z.boolean().optional().describe('Whether this category is active'),
});

export type CreateServiceCategoryRequest = z.infer<typeof createServiceCategoryRequestSchema>;

export const updateServiceCategoryRequestSchema = createServiceCategoryRequestSchema.partial();
export type UpdateServiceCategoryRequest = z.infer<typeof updateServiceCategoryRequestSchema>;

export const serviceCategoryResponseSchema = serviceCategoriesSchema;
export type ServiceCategoryResponse = z.infer<typeof serviceCategoryResponseSchema>;

export const listServiceCategoriesResponseSchema = z.array(serviceCategoryResponseSchema);
export type ListServiceCategoriesResponse = z.infer<typeof listServiceCategoriesResponseSchema>;

export const deleteServiceCategoriesRequestSchema = z.object({
  ids: z.array(z.number()).min(1),
});
export type DeleteServiceCategoriesRequest = z.infer<typeof deleteServiceCategoriesRequestSchema>;

export const uploadServiceCategoryImageRequestSchema = z.object({
  image: z.custom<File>().openapi({
    type: 'string',
    format: 'binary',
    description: 'Category image (max 5 MB)',
  }),
});
export type UploadServiceCategoryImageRequest = z.infer<typeof uploadServiceCategoryImageRequestSchema>;
