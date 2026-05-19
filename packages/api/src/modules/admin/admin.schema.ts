import { z } from '@hono/zod-openapi';

// ---------------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------------

export const dashboardResponseSchema = z.object({
  activeBookings: z.number(),
  pendingProviders: z.number(),
  totalRevenue: z.string(),
  onlineProviders: z.number(),
});
export type DashboardResponse = z.infer<typeof dashboardResponseSchema>;

// ---------------------------------------------------------------------------
// Providers
// ---------------------------------------------------------------------------

export const listAdminProvidersQuerySchema = z.object({
  status: z.enum(['pending', 'approved', 'rejected', 'info_requested']).optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(20),
});
export type ListAdminProvidersQuery = z.infer<typeof listAdminProvidersQuerySchema>;

export const adminProviderSchema = z.object({
  id: z.number(),
  userId: z.string(),
  fullName: z.string(),
  email: z.string(),
  phoneNumber: z.string().nullable(),
  verificationStatus: z.string(),
  isCnicVerified: z.boolean(),
  hourlyRate: z.string(),
  tierName: z.string(),
  isOnline: z.boolean(),
  totalJobsCompleted: z.number(),
  averageRating: z.string().nullable(),
  city: z.string().nullable(),
  createdAt: z.string(),
});
export type AdminProvider = z.infer<typeof adminProviderSchema>;

export const adminProviderDetailSchema = z.object({
  id: z.number(),
  userId: z.string(),
  fullName: z.string(),
  email: z.string(),
  phoneNumber: z.string().nullable(),
  verificationStatus: z.string(),
  isCnicVerified: z.boolean(),
  cnicNumber: z.string(),
  cnicFrontUrl: z.string().nullable(),
  cnicBackUrl: z.string().nullable(),
  hourlyRate: z.string(),
  tierId: z.number(),
  tierName: z.string(),
  isOnline: z.boolean(),
  totalJobsCompleted: z.number(),
  averageRating: z.string().nullable(),
  bio: z.string().nullable(),
  city: z.string().nullable(),
  coverageRadiusKm: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type AdminProviderDetail = z.infer<typeof adminProviderDetailSchema>;

export const verifyProviderRequestSchema = z.object({
  action: z.enum(['approve', 'reject', 'request_info']),
  note: z.string().optional(),
});
export type VerifyProviderRequest = z.infer<typeof verifyProviderRequestSchema>;

// ---------------------------------------------------------------------------
// Customers
// ---------------------------------------------------------------------------

export const listAdminCustomersQuerySchema = z.object({
  search: z.string().optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(20),
});
export type ListAdminCustomersQuery = z.infer<typeof listAdminCustomersQuerySchema>;

export const adminCustomerSchema = z.object({
  id: z.number(),
  userId: z.string(),
  fullName: z.string(),
  email: z.string(),
  phoneNumber: z.string().nullable(),
  customerStatus: z.string(),
  totalBookings: z.number(),
  totalSpent: z.string(),
  isActive: z.boolean(),
  createdAt: z.string(),
});
export type AdminCustomer = z.infer<typeof adminCustomerSchema>;

// ---------------------------------------------------------------------------
// User actions
// ---------------------------------------------------------------------------

export const suspendUserRequestSchema = z.object({
  reason: z.string().min(1),
  durationDays: z.number().int().positive(),
});
export type SuspendUserRequest = z.infer<typeof suspendUserRequestSchema>;

export const banUserRequestSchema = z.object({
  reason: z.string().min(1),
});
export type BanUserRequest = z.infer<typeof banUserRequestSchema>;

export const userActionResponseSchema = z.object({
  userId: z.string(),
  action: z.string(),
  isActive: z.boolean(),
});
export type UserActionResponse = z.infer<typeof userActionResponseSchema>;

// ---------------------------------------------------------------------------
// Bookings
// ---------------------------------------------------------------------------

export const listAdminBookingsQuerySchema = z.object({
  statusId: z.coerce.number().int().positive().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(20),
});
export type ListAdminBookingsQuery = z.infer<typeof listAdminBookingsQuerySchema>;

export const adminBookingSchema = z.object({
  id: z.number(),
  customerId: z.number(),
  customerName: z.string(),
  providerId: z.number(),
  providerName: z.string(),
  categoryId: z.number(),
  scheduledAt: z.string(),
  completedAt: z.string().nullable(),
  customerAddress: z.string(),
  estimatedPrice: z.string().nullable(),
  finalPrice: z.string().nullable(),
  commissionAmount: z.string().nullable(),
  statusId: z.number(),
  statusName: z.string(),
  cancelledBy: z.string().nullable(),
  cancellationReason: z.string().nullable(),
  createdAt: z.string(),
});
export type AdminBooking = z.infer<typeof adminBookingSchema>;

export const assignProviderRequestSchema = z.object({
  providerId: z.number().int().positive(),
});
export type AssignProviderRequest = z.infer<typeof assignProviderRequestSchema>;

// ---------------------------------------------------------------------------
// Payments
// ---------------------------------------------------------------------------

export const listAdminPaymentsQuerySchema = z.object({
  statusId: z.coerce.number().int().positive().optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(20),
});
export type ListAdminPaymentsQuery = z.infer<typeof listAdminPaymentsQuerySchema>;

export const adminPaymentSchema = z.object({
  id: z.number(),
  bookingId: z.number(),
  customerId: z.number(),
  customerName: z.string(),
  amount: z.string(),
  paymentMethodName: z.string(),
  paymentStatusName: z.string(),
  transactionReference: z.string().nullable(),
  reviewedBy: z.string().nullable(),
  reviewedAt: z.string().nullable(),
  createdAt: z.string(),
});
export type AdminPayment = z.infer<typeof adminPaymentSchema>;

// ---------------------------------------------------------------------------
// Payouts
// ---------------------------------------------------------------------------

export const adminPayoutRequestSchema = z.object({
  id: z.number(),
  providerId: z.number(),
  providerName: z.string(),
  amount: z.string(),
  payoutStatus: z.string(),
  requestedAt: z.string(),
  processedAt: z.string().nullable(),
  processedBy: z.string().nullable(),
  createdAt: z.string(),
});
export type AdminPayoutRequest = z.infer<typeof adminPayoutRequestSchema>;

// ---------------------------------------------------------------------------
// Fraud flags
// ---------------------------------------------------------------------------

export const fraudFlagSchema = z.object({
  id: z.number(),
  userId: z.string(),
  userName: z.string().nullable(),
  reason: z.string(),
  riskScore: z.number(),
  flaggedBySystem: z.boolean(),
  flaggedByAdmin: z.string().nullable(),
  isResolved: z.boolean(),
  resolvedAt: z.string().nullable(),
  createdAt: z.string(),
});
export type FraudFlag = z.infer<typeof fraudFlagSchema>;

export const updateFraudFlagRequestSchema = z.object({
  action: z.enum(['investigate', 'suspend', 'clear']),
});
export type UpdateFraudFlagRequest = z.infer<typeof updateFraudFlagRequestSchema>;

// ---------------------------------------------------------------------------
// Commission settings
// ---------------------------------------------------------------------------

export const commissionSettingSchema = z.object({
  tierId: z.number(),
  tierName: z.string(),
  commissionRate: z.string(),
  effectiveFrom: z.string(),
  createdBy: z.string().nullable(),
  createdAt: z.string(),
});
export type CommissionSetting = z.infer<typeof commissionSettingSchema>;

export const updateCommissionSettingsRequestSchema = z.object({
  settings: z
    .array(
      z.object({
        tierId: z.number().int().positive(),
        commissionRate: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Must be a valid decimal rate'),
      }),
    )
    .min(1),
});
export type UpdateCommissionSettingsRequest = z.infer<typeof updateCommissionSettingsRequestSchema>;

// ---------------------------------------------------------------------------
// Analytics
// ---------------------------------------------------------------------------

export const analyticsQuerySchema = z.object({
  period: z.enum(['day', 'week', 'month']).optional().default('week'),
});
export type AnalyticsQuery = z.infer<typeof analyticsQuerySchema>;

export const adminPaginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(20),
});
export type AdminPaginationQuery = z.infer<typeof adminPaginationQuerySchema>;

export const refundBookingResponseSchema = z.object({
  bookingId: z.number(),
  paymentId: z.number(),
  refunded: z.boolean(),
});
export type RefundBookingResponse = z.infer<typeof refundBookingResponseSchema>;

export const approvePayoutResponseSchema = z.object({
  payoutRequestId: z.number(),
  approved: z.boolean(),
});
export type ApprovePayoutResponse = z.infer<typeof approvePayoutResponseSchema>;

export const updateFraudFlagResponseSchema = z.object({
  flagId: z.number(),
  action: z.string(),
});
export type UpdateFraudFlagResponse = z.infer<typeof updateFraudFlagResponseSchema>;

export const analyticsResponseSchema = z.object({
  revenue: z.array(z.object({ date: z.string(), amount: z.string() })),
  bookingsByStatus: z.array(z.object({ status: z.string(), count: z.number() })),
  newUsers: z.array(z.object({ date: z.string(), count: z.number() })),
  topProviders: z.array(
    z.object({
      id: z.number(),
      fullName: z.string(),
      totalJobsCompleted: z.number(),
      averageRating: z.string().nullable(),
    }),
  ),
});
export type AnalyticsResponse = z.infer<typeof analyticsResponseSchema>;
