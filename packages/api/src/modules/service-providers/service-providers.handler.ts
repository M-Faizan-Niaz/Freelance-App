import type {
  DeletePortfolioRoute,
  ListPortfolioRoute,
  UploadDocumentsRoute,
  UploadPortfolioRoute,
} from './service-providers.route';
import type { AppRouteHandler } from '@/lib/types';

import { AppError, UnauthorizedError } from '@/core/errors';
import { successResponse } from '@/lib/api-response';
import { auth } from '@/lib/auth';
import * as HttpStatusCodes from '@/lib/http-status-codes';
import { validateDocumentFile, validateFileSize } from '@/common/upload-helpers';

import { ServiceProvidersService } from './service-providers.service';

const service = new ServiceProvidersService();

async function requireUserId(headers: Headers): Promise<string> {
  const session = await auth.api.getSession({ headers });
  if (!session?.user?.id) {
    throw new UnauthorizedError('Authentication required');
  }
  return session.user.id;
}

export const uploadDocuments: AppRouteHandler<UploadDocumentsRoute> = async (c) => {
  const userId = await requireUserId(c.req.raw.headers);

  const body = await c.req.parseBody();
  const cnicFront = body['cnicFront'];
  const cnicBack = body['cnicBack'];

  if (!(cnicFront instanceof File)) {
    throw new AppError('Missing required field: cnicFront', HttpStatusCodes.BAD_REQUEST);
  }
  if (!(cnicBack instanceof File)) {
    throw new AppError('Missing required field: cnicBack', HttpStatusCodes.BAD_REQUEST);
  }

  validateDocumentFile(cnicFront);
  validateFileSize(cnicFront, 10);
  validateDocumentFile(cnicBack);
  validateFileSize(cnicBack, 10);

  const result = await service.uploadDocuments(userId, cnicFront, cnicBack);
  return c.json(successResponse(result, 'Documents uploaded successfully'), HttpStatusCodes.OK);
};

export const listPortfolio: AppRouteHandler<ListPortfolioRoute> = async (c) => {
  const { id } = c.req.valid('param');
  const images = await service.listPortfolioImages(id);
  return c.json(successResponse(images, 'Portfolio images retrieved successfully'), HttpStatusCodes.OK);
};

export const uploadPortfolio: AppRouteHandler<UploadPortfolioRoute> = async (c) => {
  const userId = await requireUserId(c.req.raw.headers);

  const body = await c.req.parseBody({ all: true });
  const raw = body['images'];
  const files = (Array.isArray(raw) ? raw : [raw]).filter((v): v is File => v instanceof File);

  if (files.length === 0) {
    throw new AppError('No images provided in field "images"', HttpStatusCodes.BAD_REQUEST);
  }

  const result = await service.uploadPortfolioImages(userId, files);
  return c.json(successResponse(result, 'Portfolio images processed'), HttpStatusCodes.OK);
};

export const deletePortfolio: AppRouteHandler<DeletePortfolioRoute> = async (c) => {
  const userId = await requireUserId(c.req.raw.headers);
  const { fileNames } = c.req.valid('json');
  const result = await service.deletePortfolioImages(userId, fileNames);
  return c.json(successResponse(result, 'Images deleted successfully'), HttpStatusCodes.OK);
};
