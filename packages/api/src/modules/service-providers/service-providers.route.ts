import { createRoute, z } from '@hono/zod-openapi';

import * as HttpStatusCodes from '@/lib/http-status-codes';
import { commonErrorResponses, jsonContent, jsonContentRequired } from '@/lib/openapi/helpers';
import { createSuccessResponseSchema, idParams } from '@/lib/openapi/schemas';

import {
  deletePortfolioRequestSchema,
  deletePortfolioResponseSchema,
  portfolioImageSchema,
  portfolioUploadResultSchema,
  uploadDocumentsRequestSchema,
  uploadDocumentsResultSchema,
  uploadPortfolioRequestSchema,
} from './service-providers.schema';

const tags = ['Service Providers'];

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

export type UploadDocumentsRoute = typeof uploadDocuments;
export type ListPortfolioRoute = typeof listPortfolio;
export type UploadPortfolioRoute = typeof uploadPortfolio;
export type DeletePortfolioRoute = typeof deletePortfolio;
