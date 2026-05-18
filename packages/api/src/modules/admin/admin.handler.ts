import type {
  ApprovePayout,
  AssignBookingProvider,
  BanUser,
  GetAdminBookings,
  GetAdminCustomers,
  GetAdminDashboard,
  GetAdminPayments,
  GetAdminPayouts,
  GetCommissionSettings,
  GetFraudFlags,
  GetProviderDetail,
  GetAdminProviders,
  RefundBooking,
  SuspendUser,
  UnsuspendUser,
  UpdateCommissionSettings,
  UpdateFraudFlag,
  VerifyProvider,
  GetAnalytics,
} from './admin.route';
import type { AppRouteHandler } from '@/lib/types';

import { successResponse, successResponseWithPagination } from '@/lib/api-response';
import * as HttpStatusCodes from '@/lib/http-status-codes';

import { AdminService } from './admin.service';

const service = new AdminService();

function getAdminId(c: { get: (key: string) => unknown }): string {
  const user = c.get('users') as { id: string };
  return user.id;
}

export const getDashboard: AppRouteHandler<GetAdminDashboard> = async (c) => {
  const data = await service.getDashboard();
  return c.json(successResponse(data, 'Dashboard KPIs retrieved'), HttpStatusCodes.OK);
};

export const getAdminProviders: AppRouteHandler<GetAdminProviders> = async (c) => {
  const { status, page, limit } = c.req.valid('query');
  const { data, pagination } = await service.listProviders({ status, page, limit });
  return c.json(
    successResponseWithPagination(data, pagination, [], 'Providers retrieved successfully'),
    HttpStatusCodes.OK,
  );
};

export const getProviderDetail: AppRouteHandler<GetProviderDetail> = async (c) => {
  const { id } = c.req.valid('param');
  const provider = await service.getProviderDetail(id);
  return c.json(successResponse(provider, 'Provider details retrieved'), HttpStatusCodes.OK);
};

export const verifyProvider: AppRouteHandler<VerifyProvider> = async (c) => {
  const adminId = getAdminId(c);
  const { id } = c.req.valid('param');
  const body = c.req.valid('json');
  const provider = await service.verifyProvider(adminId, id, body);
  return c.json(successResponse(provider, 'Provider verification updated'), HttpStatusCodes.OK);
};

export const getAdminCustomers: AppRouteHandler<GetAdminCustomers> = async (c) => {
  const { search, page, limit } = c.req.valid('query');
  const { data, pagination } = await service.listCustomers({ search, page, limit });
  return c.json(
    successResponseWithPagination(data, pagination, [], 'Customers retrieved successfully'),
    HttpStatusCodes.OK,
  );
};

export const suspendUser: AppRouteHandler<SuspendUser> = async (c) => {
  const adminId = getAdminId(c);
  const { id } = c.req.valid('param');
  const body = c.req.valid('json');
  const result = await service.suspendUser(adminId, id, body);
  return c.json(successResponse(result, 'User suspended successfully'), HttpStatusCodes.OK);
};

export const banUser: AppRouteHandler<BanUser> = async (c) => {
  const adminId = getAdminId(c);
  const { id } = c.req.valid('param');
  const body = c.req.valid('json');
  const result = await service.banUser(adminId, id, body);
  return c.json(successResponse(result, 'User banned successfully'), HttpStatusCodes.OK);
};

export const unsuspendUser: AppRouteHandler<UnsuspendUser> = async (c) => {
  const adminId = getAdminId(c);
  const { id } = c.req.valid('param');
  const result = await service.unsuspendUser(adminId, id);
  return c.json(successResponse(result, 'User unsuspended successfully'), HttpStatusCodes.OK);
};

export const getAdminBookings: AppRouteHandler<GetAdminBookings> = async (c) => {
  const { statusId, dateFrom, dateTo, page, limit } = c.req.valid('query');
  const { data, pagination } = await service.listAllBookings({
    statusId,
    dateFrom,
    dateTo,
    page,
    limit,
  });
  return c.json(
    successResponseWithPagination(data, pagination, [], 'Bookings retrieved successfully'),
    HttpStatusCodes.OK,
  );
};

export const assignBookingProvider: AppRouteHandler<AssignBookingProvider> = async (c) => {
  const adminId = getAdminId(c);
  const { id } = c.req.valid('param');
  const body = c.req.valid('json');
  const booking = await service.reassignBooking(adminId, id, body);
  return c.json(successResponse(booking, 'Provider reassigned successfully'), HttpStatusCodes.OK);
};

export const refundBooking: AppRouteHandler<RefundBooking> = async (c) => {
  const adminId = getAdminId(c);
  const { id } = c.req.valid('param');
  const result = await service.refundBooking(adminId, id);
  return c.json(successResponse(result, 'Booking refunded successfully'), HttpStatusCodes.OK);
};

export const getAdminPayments: AppRouteHandler<GetAdminPayments> = async (c) => {
  const { statusId, page, limit } = c.req.valid('query');
  const { data, pagination } = await service.listAllPayments({ statusId, page, limit });
  return c.json(
    successResponseWithPagination(data, pagination, [], 'Payments retrieved successfully'),
    HttpStatusCodes.OK,
  );
};

export const getAdminPayouts: AppRouteHandler<GetAdminPayouts> = async (c) => {
  const { page, limit } = c.req.valid('query');
  const { data, pagination } = await service.listPayouts({ page, limit });
  return c.json(
    successResponseWithPagination(data, pagination, [], 'Payout requests retrieved'),
    HttpStatusCodes.OK,
  );
};

export const approvePayout: AppRouteHandler<ApprovePayout> = async (c) => {
  const adminId = getAdminId(c);
  const { id } = c.req.valid('param');
  const result = await service.approvePayout(adminId, id);
  return c.json(successResponse(result, 'Payout approved successfully'), HttpStatusCodes.OK);
};

export const getFraudFlags: AppRouteHandler<GetFraudFlags> = async (c) => {
  const { page, limit } = c.req.valid('query');
  const { data, pagination } = await service.listFraudFlags({ page, limit });
  return c.json(
    successResponseWithPagination(data, pagination, [], 'Fraud flags retrieved'),
    HttpStatusCodes.OK,
  );
};

export const updateFraudFlag: AppRouteHandler<UpdateFraudFlag> = async (c) => {
  const adminId = getAdminId(c);
  const { id } = c.req.valid('param');
  const body = c.req.valid('json');
  const result = await service.updateFraudFlag(adminId, id, body);
  return c.json(successResponse(result, 'Fraud flag updated'), HttpStatusCodes.OK);
};

export const getCommissionSettings: AppRouteHandler<GetCommissionSettings> = async (c) => {
  const settings = await service.getCommissionSettings();
  return c.json(successResponse(settings, 'Commission settings retrieved'), HttpStatusCodes.OK);
};

export const updateCommissionSettings: AppRouteHandler<UpdateCommissionSettings> = async (c) => {
  const adminId = getAdminId(c);
  const body = c.req.valid('json');
  const settings = await service.updateCommissionSettings(adminId, body);
  return c.json(successResponse(settings, 'Commission settings updated'), HttpStatusCodes.OK);
};

export const getAnalytics: AppRouteHandler<GetAnalytics> = async (c) => {
  const { period } = c.req.valid('query');
  const analytics = await service.getAnalytics(period);
  return c.json(successResponse(analytics, 'Analytics retrieved'), HttpStatusCodes.OK);
};
