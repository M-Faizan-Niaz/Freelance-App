import { createRoute, z } from '@hono/zod-openapi';

import * as HttpStatusCodes from '@/lib/http-status-codes';
import { commonErrorResponses, jsonContent, jsonContentRequired } from '@/lib/openapi/helpers';
import { createSuccessResponseSchema, idParams } from '@/lib/openapi/schemas';

import {
  addressResponseSchema,
  createAddressRequestSchema,
  customerProfileResponseSchema,
  updateAddressRequestSchema,
} from './customers.schema';

const tags = ['Customers'];

export const getMe = createRoute({
  operationId: 'getMyCustomerProfile',
  path: '/customers/me',
  method: 'get',
  tags,
  summary: 'Get own customer profile',
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createSuccessResponseSchema(customerProfileResponseSchema, 'Customer profile retrieved successfully'),
      'Customer profile',
    ),
    ...commonErrorResponses(
      [HttpStatusCodes.UNAUTHORIZED, HttpStatusCodes.NOT_FOUND, HttpStatusCodes.INTERNAL_SERVER_ERROR],
      customerProfileResponseSchema,
    ),
  },
});

export const listAddresses = createRoute({
  operationId: 'listMyAddresses',
  path: '/customers/me/addresses',
  method: 'get',
  tags,
  summary: 'List saved addresses',
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createSuccessResponseSchema(z.array(addressResponseSchema), 'Addresses retrieved successfully'),
      'List of saved addresses',
    ),
    ...commonErrorResponses(
      [HttpStatusCodes.UNAUTHORIZED, HttpStatusCodes.NOT_FOUND, HttpStatusCodes.INTERNAL_SERVER_ERROR],
      addressResponseSchema,
    ),
  },
});

export const createAddress = createRoute({
  operationId: 'createAddress',
  path: '/customers/me/addresses',
  method: 'post',
  tags,
  summary: 'Add a saved address',
  request: {
    body: jsonContentRequired(createAddressRequestSchema, 'Address to add'),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createSuccessResponseSchema(addressResponseSchema, 'Address created successfully'),
      'The created address',
    ),
    ...commonErrorResponses(
      [HttpStatusCodes.UNAUTHORIZED, HttpStatusCodes.NOT_FOUND, HttpStatusCodes.UNPROCESSABLE_ENTITY, HttpStatusCodes.INTERNAL_SERVER_ERROR],
      createAddressRequestSchema,
    ),
  },
});

export const updateAddress = createRoute({
  operationId: 'updateAddress',
  path: '/customers/me/addresses/{id}',
  method: 'patch',
  tags,
  summary: 'Update a saved address',
  request: {
    params: idParams,
    body: jsonContentRequired(updateAddressRequestSchema, 'Fields to update'),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createSuccessResponseSchema(addressResponseSchema, 'Address updated successfully'),
      'The updated address',
    ),
    ...commonErrorResponses(
      [HttpStatusCodes.UNAUTHORIZED, HttpStatusCodes.NOT_FOUND, HttpStatusCodes.UNPROCESSABLE_ENTITY, HttpStatusCodes.INTERNAL_SERVER_ERROR],
      updateAddressRequestSchema,
    ),
  },
});

export const deleteAddress = createRoute({
  operationId: 'deleteAddress',
  path: '/customers/me/addresses/{id}',
  method: 'delete',
  tags,
  summary: 'Delete a saved address',
  request: {
    params: idParams,
  },
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: 'Address deleted successfully',
    },
    ...commonErrorResponses(
      [HttpStatusCodes.UNAUTHORIZED, HttpStatusCodes.NOT_FOUND, HttpStatusCodes.INTERNAL_SERVER_ERROR],
      idParams,
    ),
  },
});

export const setDefaultAddress = createRoute({
  operationId: 'setDefaultAddress',
  path: '/customers/me/addresses/{id}/default',
  method: 'patch',
  tags,
  summary: 'Set address as default',
  request: {
    params: idParams,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createSuccessResponseSchema(addressResponseSchema, 'Default address updated successfully'),
      'The address set as default',
    ),
    ...commonErrorResponses(
      [HttpStatusCodes.UNAUTHORIZED, HttpStatusCodes.NOT_FOUND, HttpStatusCodes.INTERNAL_SERVER_ERROR],
      idParams,
    ),
  },
});

export type GetMeRoute = typeof getMe;
export type ListAddressesRoute = typeof listAddresses;
export type CreateAddressRoute = typeof createAddress;
export type UpdateAddressRoute = typeof updateAddress;
export type DeleteAddressRoute = typeof deleteAddress;
export type SetDefaultAddressRoute = typeof setDefaultAddress;
