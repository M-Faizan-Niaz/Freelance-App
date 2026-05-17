import { z } from '@hono/zod-openapi';

export const getMeResponseSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  email: z.string(),
  emailVerified: z.boolean(),
  image: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  fullName: z.string(),
  phoneNumber: z.string().nullable(),
  phoneVerified: z.boolean(),
  profilePhotoUrl: z.string().nullable(),
  roleId: z.number().nullable(),
  isActive: z.boolean(),
});

export type GetMeResponse = z.infer<typeof getMeResponseSchema>;

export const updateMeRequestSchema = z.object({
  name: z.string().optional().describe('Display name'),
  phoneNumber: z.string().optional().describe('Phone number'),
  profilePhotoUrl: z.string().optional().describe('Profile photo URL'),
});

export type UpdateMeRequest = z.infer<typeof updateMeRequestSchema>;
