import { createRoute, z } from '@hono/zod-openapi';

import * as HttpStatusCodes from '@/lib/http-status-codes';
import { commonErrorResponses, jsonContent, jsonContentRequired } from '@/lib/openapi/helpers';
import { createSuccessResponseSchema, idParams } from '@/lib/openapi/schemas';
import { createSuccessResponseSchemaWithPagination } from '@/lib/openapi/schemas/create-api-response';

import {
  deletePortfolioRequestSchema,
  deletePortfolioResponseSchema,
  listProvidersQuerySchema,
  myProviderProfileResponseSchema,
  portfolioImageSchema,
  portfolioUploadResultSchema,
  publicProviderDetailSchema,
  updateProviderProfileSchema,
  uploadDocumentsRequestSchema,
  uploadDocumentsResultSchema,
  uploadPortfolioRequestSchema,
} from './service-providers.schema';

const tags = ['Service Providers'];

export const getMyProfile = createRoute({
  operationId: 'getMyProviderProfile',
  path: '/service-providers/me',
  method: 'get',
  tags,
  summary: 'Get own provider profile',
  description: "Returns the authenticated provider's full profile including mutable fields.",
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createSuccessResponseSchema(
        myProviderProfileResponseSchema,
        'Profile retrieved successfully',
      ),
      'Own provider profile',
    ),
    ...commonErrorResponses(
      [
        HttpStatusCodes.UNAUTHORIZED,
        HttpStatusCodes.NOT_FOUND,
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
      ],
      myProviderProfileResponseSchema,
    ),
  },
});

export const updateMyProfile = createRoute({
  operationId: 'updateMyProviderProfile',
  path: '/service-providers/me',
  method: 'patch',
  tags,
  summary: 'Update own provider profile',
  description: 'Update bio, hourly rate, coverage radius, and selected service category IDs.',
  request: {
    body: jsonContentRequired(updateProviderProfileSchema, 'Profile fields to update'),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createSuccessResponseSchema(myProviderProfileResponseSchema, 'Profile updated successfully'),
      'Updated provider profile',
    ),
    ...commonErrorResponses(
      [
        HttpStatusCodes.UNAUTHORIZED,
        HttpStatusCodes.NOT_FOUND,
        HttpStatusCodes.UNPROCESSABLE_ENTITY,
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
      ],
      updateProviderProfileSchema,
    ),
  },
});

export const uploadDocuments = createRoute({
  operationId: 'uploadServiceProviderDocuments',
  path: '/service-providers/me/documents',
  method: 'post',
  tags,
  summary: 'Upload CNIC verification documents',
  description:
    'Upload CNIC front and back images. Send as multipart/form-data with fields "cnicFront" and "cnicBack" (jpeg, png, webp, pdf — max 10 MB each).',
  request: {
    body: {
      content: {
        'multipart/form-data': {
          schema: uploadDocumentsRequestSchema,
        },
      },
      required: true,
    },
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createSuccessResponseSchema(uploadDocumentsResultSchema, 'Documents uploaded successfully'),
      'Upload result with CNIC URLs',
    ),
    ...commonErrorResponses(
      [
        HttpStatusCodes.BAD_REQUEST,
        HttpStatusCodes.UNAUTHORIZED,
        HttpStatusCodes.NOT_FOUND,
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
      ],
      uploadDocumentsResultSchema,
    ),
  },
});

export const listPortfolio = createRoute({
  operationId: 'listServiceProviderPortfolio',
  path: '/service-providers/{id}/portfolio',
  method: 'get',
  tags,
  summary: 'List portfolio images',
  description: 'Returns all portfolio images for the given service provider.',
  request: {
    params: idParams,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createSuccessResponseSchema(
        z.array(portfolioImageSchema),
        'Portfolio images retrieved successfully',
      ),
      'List of portfolio images',
    ),
    ...commonErrorResponses(
      [HttpStatusCodes.NOT_FOUND, HttpStatusCodes.INTERNAL_SERVER_ERROR],
      portfolioImageSchema,
    ),
  },
});

export const uploadPortfolio = createRoute({
  operationId: 'uploadPortfolioImages',
  path: '/service-providers/me/portfolio',
  method: 'post',
  tags,
  summary: 'Upload portfolio images',
  description:
    'Upload up to 10 portfolio images total. Send as multipart/form-data with field "images" (jpeg, png, webp, gif — max 5 MB each, 10 images max across all uploads).',
  request: {
    body: {
      content: {
        'multipart/form-data': {
          schema: uploadPortfolioRequestSchema,
        },
      },
      required: true,
    },
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createSuccessResponseSchema(portfolioUploadResultSchema, 'Portfolio images processed'),
      'Upload result with success and failure details',
    ),
    ...commonErrorResponses(
      [
        HttpStatusCodes.BAD_REQUEST,
        HttpStatusCodes.UNAUTHORIZED,
        HttpStatusCodes.NOT_FOUND,
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
      ],
      portfolioUploadResultSchema,
    ),
  },
});

export const deletePortfolio = createRoute({
  operationId: 'deletePortfolioImages',
  path: '/service-providers/me/portfolio',
  method: 'delete',
  tags,
  summary: 'Delete portfolio images',
  description:
    'Delete one or more portfolio images by file name. Only images belonging to the authenticated provider can be deleted.',
  request: {
    body: jsonContentRequired(deletePortfolioRequestSchema, 'File names to delete'),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createSuccessResponseSchema(deletePortfolioResponseSchema, 'Images deleted successfully'),
      'Deleted file names',
    ),
    ...commonErrorResponses(
      [
        HttpStatusCodes.BAD_REQUEST,
        HttpStatusCodes.UNAUTHORIZED,
        HttpStatusCodes.NOT_FOUND,
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
      ],
      deletePortfolioRequestSchema,
    ),
  },
});

export const listProviders = createRoute({
  operationId: 'listServiceProviders',
  path: '/service-providers',
  method: 'get',
  tags,
  summary: 'List approved providers',
  description: 'Returns a paginated list of approved service providers. Optionally filter by city.',
  request: {
    query: listProvidersQuerySchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createSuccessResponseSchemaWithPagination(
        z.array(publicProviderDetailSchema),
        'Providers retrieved successfully',
      ),
      'Paginated list of providers',
    ),
    ...commonErrorResponses([HttpStatusCodes.INTERNAL_SERVER_ERROR], publicProviderDetailSchema),
  },
});

export const getProviderById = createRoute({
  operationId: 'getServiceProviderById',
  path: '/service-providers/{id}',
  method: 'get',
  tags,
  summary: 'Get public provider profile',
  description: 'Returns the public profile of an approved service provider by their numeric ID.',
  request: {
    params: idParams,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createSuccessResponseSchema(
        publicProviderDetailSchema,
        'Provider profile retrieved successfully',
      ),
      'Provider public profile',
    ),
    ...commonErrorResponses(
      [HttpStatusCodes.NOT_FOUND, HttpStatusCodes.INTERNAL_SERVER_ERROR],
      publicProviderDetailSchema,
    ),
  },
});

export type GetMyProfileRoute = typeof getMyProfile;
export type UpdateMyProfileRoute = typeof updateMyProfile;
export type ListProvidersRoute = typeof listProviders;
export type GetProviderByIdRoute = typeof getProviderById;
export type UploadDocumentsRoute = typeof uploadDocuments;
export type ListPortfolioRoute = typeof listPortfolio;
export type UploadPortfolioRoute = typeof uploadPortfolio;
export type DeletePortfolioRoute = typeof deletePortfolio;
