import type {
  CreateAddressRoute,
  DeleteAddressRoute,
  GetMeRoute,
  ListAddressesRoute,
  SetDefaultAddressRoute,
  UpdateAddressRoute,
} from './customers.route';
import type { AppRouteHandler } from '@/lib/types';

import { successResponse } from '@/lib/api-response';
import { requireUserId } from '@/lib/require-auth';
import * as HttpStatusCodes from '@/lib/http-status-codes';

import { CustomersService } from './customers.service';

const service = new CustomersService();

export const getMe: AppRouteHandler<GetMeRoute> = async (c) => {
  const userId = await requireUserId(c.req.raw.headers);
  const profile = await service.getMyProfile(userId);
  return c.json(
    successResponse(profile, 'Customer profile retrieved successfully'),
    HttpStatusCodes.OK,
  );
};

export const listAddresses: AppRouteHandler<ListAddressesRoute> = async (c) => {
  const userId = await requireUserId(c.req.raw.headers);
  const addresses = await service.listMyAddresses(userId);
  return c.json(successResponse(addresses, 'Addresses retrieved successfully'), HttpStatusCodes.OK);
};

export const createAddress: AppRouteHandler<CreateAddressRoute> = async (c) => {
  const userId = await requireUserId(c.req.raw.headers);
  const body = c.req.valid('json');
  const address = await service.addAddress(userId, body);
  return c.json(successResponse(address, 'Address created successfully'), HttpStatusCodes.OK);
};

export const updateAddress: AppRouteHandler<UpdateAddressRoute> = async (c) => {
  const userId = await requireUserId(c.req.raw.headers);
  const { id } = c.req.valid('param');
  const body = c.req.valid('json');
  const address = await service.updateAddress(userId, id, body);
  return c.json(successResponse(address, 'Address updated successfully'), HttpStatusCodes.OK);
};

export const deleteAddress: AppRouteHandler<DeleteAddressRoute> = async (c) => {
  const userId = await requireUserId(c.req.raw.headers);
  const { id } = c.req.valid('param');
  await service.deleteAddress(userId, id);
  return c.body(null, HttpStatusCodes.NO_CONTENT);
};

export const setDefaultAddress: AppRouteHandler<SetDefaultAddressRoute> = async (c) => {
  const userId = await requireUserId(c.req.raw.headers);
  const { id } = c.req.valid('param');
  const address = await service.setDefaultAddress(userId, id);
  return c.json(
    successResponse(address, 'Default address updated successfully'),
    HttpStatusCodes.OK,
  );
};
