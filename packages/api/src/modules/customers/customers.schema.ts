import { z } from '@hono/zod-openapi';

export const customerProfileResponseSchema = z.object({
  id: z.number(),
  userId: z.string(),
  totalBookings: z.number(),
  totalSpent: z.string(),
  status: z.string(),
  fullName: z.string().nullable(),
  email: z.string(),
  phoneNumber: z.string().nullable(),
  profilePhotoUrl: z.string().nullable(),
  createdAt: z.string(),
});

export type CustomerProfileResponse = z.infer<typeof customerProfileResponseSchema>;

export const addressResponseSchema = z.object({
  id: z.number(),
  customerId: z.number(),
  label: z.string(),
  addressText: z.string(),
  latitude: z.string().nullable(),
  longitude: z.string().nullable(),
  isDefault: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type AddressResponse = z.infer<typeof addressResponseSchema>;

export const createAddressRequestSchema = z.object({
  label: z.string().min(1).max(100).describe('Address label (e.g. Home, Office)'),
  addressText: z.string().min(1).describe('Full address text'),
  latitude: z.number().optional().describe('Latitude coordinate'),
  longitude: z.number().optional().describe('Longitude coordinate'),
  isDefault: z.boolean().optional().default(false).describe('Set as default address'),
});

export type CreateAddressRequest = z.infer<typeof createAddressRequestSchema>;

export const updateAddressRequestSchema = createAddressRequestSchema.partial();
export type UpdateAddressRequest = z.infer<typeof updateAddressRequestSchema>;
