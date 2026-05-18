import { createRoute, z } from '@hono/zod-openapi';

import * as HttpStatusCodes from '@/lib/http-status-codes';
import { commonErrorResponses, jsonContent, jsonContentRequired } from '@/lib/openapi/helpers';
import { createSuccessResponseSchema, idParams, idUuidParams } from '@/lib/openapi/schemas';

import {
  adminBookingSchema,
  adminCustomerSchema,
  adminPaymentSchema,
  adminPayoutRequestSchema,
  adminProviderDetailSchema,
  adminProviderSchema,
  analyticsQuerySchema,
  analyticsResponseSchema,
  assignProviderRequestSchema,
  banUserRequestSchema,
  commissionSettingSchema,
  dashboardResponseSchema,
  fraudFlagSchema,
  listAdminBookingsQuerySchema,
  listAdminCustomersQuerySchema,
  listAdminPaymentsQuerySchema,
  listAdminProvidersQuerySchema,
  suspendUserRequestSchema,
  updateCommissionSettingsRequestSchema,
  updateFraudFlagRequestSchema,
  userActionResponseSchema,
  verifyProviderRequestSchema,
} from './admin.schema';

const tags = ['Admin'];

const paginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(20),
});

// ---------------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------------

export const getDashboard = createRoute({
  operationId: 'getAdminDashboard',
  path: '/admin/dashboard',
  method: 'get',
  tags,
  summary: 'Get admin dashboard KPIs',
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createSuccessResponseSchema(dashboardResponseSchema, 'Dashboard KPIs retrieved'),
      'Dashboard KPIs',
    ),
    ...commonErrorResponses(
      [HttpStatusCodes.UNAUTHORIZED, HttpStatusCodes.FORBIDDEN, HttpStatusCodes.INTERNAL_SERVER_ERROR],
      dashboardResponseSchema,
    ),
  },
});

// ---------------------------------------------------------------------------
// Providers
// ---------------------------------------------------------------------------

export const getAdminProviders = createRoute({
  operationId: 'getAdminProviders',
  path: '/admin/providers',
  method: 'get',
  tags,
  summary: 'List providers with optional status filter',
  request: { query: listAdminProvidersQuerySchema },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createSuccessResponseSchema(z.array(adminProviderSchema), 'Providers retrieved successfully'),
      'List of providers',
    ),
    ...commonErrorResponses(
      [HttpStatusCodes.UNAUTHORIZED, HttpStatusCodes.FORBIDDEN, HttpStatusCodes.INTERNAL_SERVER_ERROR],
      adminProviderSchema,
    ),
  },
});

export const getProviderDetail = createRoute({
  operationId: 'getAdminProviderDetail',
  path: '/admin/providers/{id}',
  method: 'get',
  tags,
  summary: 'Get full provider profile with documents',
  request: { params: idParams },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createSuccessResponseSchema(adminProviderDetailSchema, 'Provider details retrieved'),
      'Provider detail',
    ),
    ...commonErrorResponses(
      [
        HttpStatusCodes.UNAUTHORIZED,
        HttpStatusCodes.FORBIDDEN,
        HttpStatusCodes.NOT_FOUND,
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
      ],
      adminProviderDetailSchema,
    ),
  },
});

export const verifyProvider = createRoute({
  operationId: 'verifyAdminProvider',
  path: '/admin/providers/{id}/verify',
  method: 'patch',
  tags,
  summary: 'Approve, reject, or request info from a provider',
  request: {
    params: idParams,
    body: jsonContentRequired(verifyProviderRequestSchema, 'Verification action'),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createSuccessResponseSchema(adminProviderDetailSchema, 'Provider verification updated'),
      'Updated provider',
    ),
    ...commonErrorResponses(
      [
        HttpStatusCodes.UNAUTHORIZED,
        HttpStatusCodes.FORBIDDEN,
        HttpStatusCodes.NOT_FOUND,
        HttpStatusCodes.UNPROCESSABLE_ENTITY,
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
      ],
      verifyProviderRequestSchema,
    ),
  },
});

// ---------------------------------------------------------------------------
// Customers
// ---------------------------------------------------------------------------

export const getAdminCustomers = createRoute({
  operationId: 'getAdminCustomers',
  path: '/admin/customers',
  method: 'get',
  tags,
  summary: 'List customers with optional search',
  request: { query: listAdminCustomersQuerySchema },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createSuccessResponseSchema(z.array(adminCustomerSchema), 'Customers retrieved successfully'),
      'List of customers',
    ),
    ...commonErrorResponses(
      [HttpStatusCodes.UNAUTHORIZED, HttpStatusCodes.FORBIDDEN, HttpStatusCodes.INTERNAL_SERVER_ERROR],
      adminCustomerSchema,
    ),
  },
});

// ---------------------------------------------------------------------------
// User actions
// ---------------------------------------------------------------------------

export const suspendUser = createRoute({
  operationId: 'adminSuspendUser',
  path: '/admin/users/{id}/suspend',
  method: 'patch',
  tags,
  summary: 'Suspend a user account',
  request: {
    params: idUuidParams,
    body: jsonContentRequired(suspendUserRequestSchema, 'Suspension details'),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createSuccessResponseSchema(userActionResponseSchema, 'User suspended successfully'),
      'Suspension result',
    ),
    ...commonErrorResponses(
      [
        HttpStatusCodes.UNAUTHORIZED,
        HttpStatusCodes.FORBIDDEN,
        HttpStatusCodes.NOT_FOUND,
        HttpStatusCodes.UNPROCESSABLE_ENTITY,
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
      ],
      suspendUserRequestSchema,
    ),
  },
});

export const banUser = createRoute({
  operationId: 'adminBanUser',
  path: '/admin/users/{id}/ban',
  method: 'patch',
  tags,
  summary: 'Permanently ban a user account',
  request: {
    params: idUuidParams,
    body: jsonContentRequired(banUserRequestSchema, 'Ban reason'),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createSuccessResponseSchema(userActionResponseSchema, 'User banned successfully'),
      'Ban result',
    ),
    ...commonErrorResponses(
      [
        HttpStatusCodes.UNAUTHORIZED,
        HttpStatusCodes.FORBIDDEN,
        HttpStatusCodes.NOT_FOUND,
        HttpStatusCodes.UNPROCESSABLE_ENTITY,
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
      ],
      banUserRequestSchema,
    ),
  },
});

export const unsuspendUser = createRoute({
  operationId: 'adminUnsuspendUser',
  path: '/admin/users/{id}/unsuspend',
  method: 'patch',
  tags,
  summary: 'Unsuspend a user account',
  request: { params: idUuidParams },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createSuccessResponseSchema(userActionResponseSchema, 'User unsuspended successfully'),
      'Unsuspend result',
    ),
    ...commonErrorResponses(
      [
        HttpStatusCodes.UNAUTHORIZED,
        HttpStatusCodes.FORBIDDEN,
        HttpStatusCodes.NOT_FOUND,
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
      ],
      userActionResponseSchema,
    ),
  },
});

// ---------------------------------------------------------------------------
// Bookings
// ---------------------------------------------------------------------------

export const getAdminBookings = createRoute({
  operationId: 'getAdminBookings',
  path: '/admin/bookings',
  method: 'get',
  tags,
  summary: 'List all bookings with optional filters',
  request: { query: listAdminBookingsQuerySchema },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createSuccessResponseSchema(z.array(adminBookingSchema), 'Bookings retrieved successfully'),
      'List of bookings',
    ),
    ...commonErrorResponses(
      [HttpStatusCodes.UNAUTHORIZED, HttpStatusCodes.FORBIDDEN, HttpStatusCodes.INTERNAL_SERVER_ERROR],
      adminBookingSchema,
    ),
  },
});

export const assignBookingProvider = createRoute({
  operationId: 'adminAssignBookingProvider',
  path: '/admin/bookings/{id}/assign',
  method: 'patch',
  tags,
  summary: 'Reassign a booking to a different provider',
  request: {
    params: idParams,
    body: jsonContentRequired(assignProviderRequestSchema, 'New provider'),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createSuccessResponseSchema(adminBookingSchema, 'Provider reassigned successfully'),
      'Updated booking',
    ),
    ...commonErrorResponses(
      [
        HttpStatusCodes.UNAUTHORIZED,
        HttpStatusCodes.FORBIDDEN,
        HttpStatusCodes.NOT_FOUND,
        HttpStatusCodes.UNPROCESSABLE_ENTITY,
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
      ],
      assignProviderRequestSchema,
    ),
  },
});

export const refundBooking = createRoute({
  operationId: 'adminRefundBooking',
  path: '/admin/bookings/{id}/refund',
  method: 'post',
  tags,
  summary: 'Trigger a refund for a booking',
  request: { params: idParams },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createSuccessResponseSchema(
        z.object({ bookingId: z.number(), paymentId: z.number(), refunded: z.boolean() }),
        'Booking refunded successfully',
      ),
      'Refund result',
    ),
    ...commonErrorResponses(
      [
        HttpStatusCodes.UNAUTHORIZED,
        HttpStatusCodes.FORBIDDEN,
        HttpStatusCodes.NOT_FOUND,
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
      ],
      z.object({ bookingId: z.number(), paymentId: z.number(), refunded: z.boolean() }),
    ),
  },
});

// ---------------------------------------------------------------------------
// Payments
// ---------------------------------------------------------------------------

export const getAdminPayments = createRoute({
  operationId: 'getAdminPayments',
  path: '/admin/payments',
  method: 'get',
  tags,
  summary: 'List all payments',
  request: { query: listAdminPaymentsQuerySchema },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createSuccessResponseSchema(z.array(adminPaymentSchema), 'Payments retrieved successfully'),
      'List of payments',
    ),
    ...commonErrorResponses(
      [HttpStatusCodes.UNAUTHORIZED, HttpStatusCodes.FORBIDDEN, HttpStatusCodes.INTERNAL_SERVER_ERROR],
      adminPaymentSchema,
    ),
  },
});

// ---------------------------------------------------------------------------
// Payouts
// ---------------------------------------------------------------------------

export const getAdminPayouts = createRoute({
  operationId: 'getAdminPayouts',
  path: '/admin/payouts',
  method: 'get',
  tags,
  summary: 'List payout requests',
  request: { query: paginationQuerySchema },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createSuccessResponseSchema(
        z.array(adminPayoutRequestSchema),
        'Payout requests retrieved',
      ),
      'List of payout requests',
    ),
    ...commonErrorResponses(
      [HttpStatusCodes.UNAUTHORIZED, HttpStatusCodes.FORBIDDEN, HttpStatusCodes.INTERNAL_SERVER_ERROR],
      adminPayoutRequestSchema,
    ),
  },
});

export const approvePayout = createRoute({
  operationId: 'adminApprovePayout',
  path: '/admin/payouts/{id}/approve',
  method: 'post',
  tags,
  summary: 'Approve a payout request',
  request: { params: idParams },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createSuccessResponseSchema(
        z.object({ payoutRequestId: z.number(), approved: z.boolean() }),
        'Payout approved successfully',
      ),
      'Approval result',
    ),
    ...commonErrorResponses(
      [
        HttpStatusCodes.UNAUTHORIZED,
        HttpStatusCodes.FORBIDDEN,
        HttpStatusCodes.NOT_FOUND,
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
      ],
      z.object({ payoutRequestId: z.number(), approved: z.boolean() }),
    ),
  },
});

// ---------------------------------------------------------------------------
// Fraud flags
// ---------------------------------------------------------------------------

export const getFraudFlags = createRoute({
  operationId: 'getAdminFraudFlags',
  path: '/admin/fraud-flags',
  method: 'get',
  tags,
  summary: 'List flagged accounts',
  request: { query: paginationQuerySchema },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createSuccessResponseSchema(z.array(fraudFlagSchema), 'Fraud flags retrieved'),
      'List of fraud flags',
    ),
    ...commonErrorResponses(
      [HttpStatusCodes.UNAUTHORIZED, HttpStatusCodes.FORBIDDEN, HttpStatusCodes.INTERNAL_SERVER_ERROR],
      fraudFlagSchema,
    ),
  },
});

export const updateFraudFlag = createRoute({
  operationId: 'adminUpdateFraudFlag',
  path: '/admin/fraud-flags/{id}',
  method: 'patch',
  tags,
  summary: 'Investigate, suspend, or clear a fraud flag',
  request: {
    params: idParams,
    body: jsonContentRequired(updateFraudFlagRequestSchema, 'Action to perform'),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createSuccessResponseSchema(
        z.object({ flagId: z.number(), action: z.string() }),
        'Fraud flag updated',
      ),
      'Update result',
    ),
    ...commonErrorResponses(
      [
        HttpStatusCodes.UNAUTHORIZED,
        HttpStatusCodes.FORBIDDEN,
        HttpStatusCodes.NOT_FOUND,
        HttpStatusCodes.UNPROCESSABLE_ENTITY,
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
      ],
      updateFraudFlagRequestSchema,
    ),
  },
});

// ---------------------------------------------------------------------------
// Commission settings
// ---------------------------------------------------------------------------

export const getCommissionSettings = createRoute({
  operationId: 'getAdminCommissionSettings',
  path: '/admin/commission-settings',
  method: 'get',
  tags,
  summary: 'Get commission rates per tier',
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createSuccessResponseSchema(z.array(commissionSettingSchema), 'Commission settings retrieved'),
      'Commission settings',
    ),
    ...commonErrorResponses(
      [HttpStatusCodes.UNAUTHORIZED, HttpStatusCodes.FORBIDDEN, HttpStatusCodes.INTERNAL_SERVER_ERROR],
      commissionSettingSchema,
    ),
  },
});

export const updateCommissionSettings = createRoute({
  operationId: 'updateAdminCommissionSettings',
  path: '/admin/commission-settings',
  method: 'patch',
  tags,
  summary: 'Update commission rates for one or more tiers',
  request: {
    body: jsonContentRequired(updateCommissionSettingsRequestSchema, 'Updated rates'),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createSuccessResponseSchema(z.array(commissionSettingSchema), 'Commission settings updated'),
      'Updated commission settings',
    ),
    ...commonErrorResponses(
      [
        HttpStatusCodes.UNAUTHORIZED,
        HttpStatusCodes.FORBIDDEN,
        HttpStatusCodes.NOT_FOUND,
        HttpStatusCodes.UNPROCESSABLE_ENTITY,
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
      ],
      updateCommissionSettingsRequestSchema,
    ),
  },
});

// ---------------------------------------------------------------------------
// Analytics
// ---------------------------------------------------------------------------

export const getAnalytics = createRoute({
  operationId: 'getAdminAnalytics',
  path: '/admin/analytics',
  method: 'get',
  tags,
  summary: 'Get aggregated analytics data',
  request: { query: analyticsQuerySchema },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createSuccessResponseSchema(analyticsResponseSchema, 'Analytics retrieved'),
      'Analytics data',
    ),
    ...commonErrorResponses(
      [HttpStatusCodes.UNAUTHORIZED, HttpStatusCodes.FORBIDDEN, HttpStatusCodes.INTERNAL_SERVER_ERROR],
      analyticsResponseSchema,
    ),
  },
});

// ---------------------------------------------------------------------------
// Route type exports
// ---------------------------------------------------------------------------

export type GetAdminDashboard = typeof getDashboard;
export type GetAdminProviders = typeof getAdminProviders;
export type GetProviderDetail = typeof getProviderDetail;
export type VerifyProvider = typeof verifyProvider;
export type GetAdminCustomers = typeof getAdminCustomers;
export type SuspendUser = typeof suspendUser;
export type BanUser = typeof banUser;
export type UnsuspendUser = typeof unsuspendUser;
export type GetAdminBookings = typeof getAdminBookings;
export type AssignBookingProvider = typeof assignBookingProvider;
export type RefundBooking = typeof refundBooking;
export type GetAdminPayments = typeof getAdminPayments;
export type GetAdminPayouts = typeof getAdminPayouts;
export type ApprovePayout = typeof approvePayout;
export type GetFraudFlags = typeof getFraudFlags;
export type UpdateFraudFlag = typeof updateFraudFlag;
export type GetCommissionSettings = typeof getCommissionSettings;
export type UpdateCommissionSettings = typeof updateCommissionSettings;
export type GetAnalytics = typeof getAnalytics;
