import type {
  DeletePortfolioRoute,
  ListPortfolioRoute,
  SetMyCategoriesRoute,
  UpdateMyProfileRoute,
  UploadDocumentsRoute,
  UploadPortfolioRoute,
} from './service-providers.route';
import type { AppRouteHandler } from '@/lib/types';

import { AppError, UnauthorizedError } from '@/core/errors';
import { storageService } from '@/common/services/storage.service';
import {
  generateUniqueFileName,
  validateDocumentFile,
  validateFileSize,
  validateImageFile,
} from '@/common/upload-helpers';
import { successResponse } from '@/lib/api-response';
import { auth } from '@/lib/auth';
import * as HttpStatusCodes from '@/lib/http-status-codes';

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

  const frontFileName = generateUniqueFileName(cnicFront, 'sp-documents');
  const backFileName = generateUniqueFileName(cnicBack, 'sp-documents');

  const [cnicFrontUrl, cnicBackUrl] = await Promise.all([
    storageService.uploadFile(cnicFront, frontFileName),
    storageService.uploadFile(cnicBack, backFileName),
  ]);

  const { oldUrls } = await service.uploadDocuments(userId, { cnicFrontUrl, cnicBackUrl });

  for (const oldUrl of [oldUrls.cnicFrontUrl, oldUrls.cnicBackUrl]) {
    if (oldUrl) {
      const oldName = storageService.extractFileNameFromUrl(oldUrl);
      if (oldName) {
        try { await storageService.deleteFile(oldName); } catch { /* best-effort cleanup */ }
      }
    }
  }

  return c.json(
    successResponse({ cnicFrontUrl, cnicBackUrl }, 'Documents uploaded successfully'),
    HttpStatusCodes.OK,
  );
};

export const listPortfolio: AppRouteHandler<ListPortfolioRoute> = async (c) => {
  const { id } = c.req.valid('param');
  const images = await service.listPortfolioImages(id);
  return c.json(
    successResponse(images, 'Portfolio images retrieved successfully'),
    HttpStatusCodes.OK,
  );
};

export const uploadPortfolio: AppRouteHandler<UploadPortfolioRoute> = async (c) => {
  const userId = await requireUserId(c.req.raw.headers);

  const body = await c.req.parseBody({ all: true });
  const raw = body['images'];
  const files = (Array.isArray(raw) ? raw : [raw]).filter((v): v is File => v instanceof File);

  if (files.length === 0) {
    throw new AppError('No images provided in field "images"', HttpStatusCodes.BAD_REQUEST);
  }

  const uploaded: { imageUrl: string; fileName: string }[] = [];
  const failed: { fileName: string; error: string }[] = [];

  for (const file of files) {
    try {
      validateImageFile(file);
      validateFileSize(file, 5);
      const fileName = generateUniqueFileName(file, 'sp-portfolio');
      const imageUrl = await storageService.uploadFile(file, fileName);
      uploaded.push({ imageUrl, fileName });
    } catch (error) {
      failed.push({
        fileName: file.name,
        error: error instanceof Error ? error.message : 'Upload failed',
      });
    }
  }

  if (uploaded.length === 0) {
    return c.json(successResponse({ uploaded: [], failed }, 'No images were uploaded'), HttpStatusCodes.OK);
  }

  const rows = await service.uploadPortfolioImages(userId, uploaded);
  return c.json(successResponse({ uploaded: rows, failed }, 'Portfolio images processed'), HttpStatusCodes.OK);
};

export const deletePortfolio: AppRouteHandler<DeletePortfolioRoute> = async (c) => {
  const userId = await requireUserId(c.req.raw.headers);
  const { fileNames } = c.req.valid('json');

  const deletedFileNames = await service.deletePortfolioImages(userId, fileNames);

  await Promise.allSettled(deletedFileNames.map((name) => storageService.deleteFile(name)));

  return c.json(
    successResponse({ deleted: deletedFileNames }, 'Images deleted successfully'),
    HttpStatusCodes.OK,
  );
};

export const updateMyProfile: AppRouteHandler<UpdateMyProfileRoute> = async (c) => {
  const userId = await requireUserId(c.req.raw.headers);
  const body = c.req.valid('json');
  const result = await service.updateProfile(userId, body);
  return c.json(successResponse(result, 'Profile updated successfully'), HttpStatusCodes.OK);
};

export const setMyCategories: AppRouteHandler<SetMyCategoriesRoute> = async (c) => {
  const userId = await requireUserId(c.req.raw.headers);
  const { categoryIds } = c.req.valid('json');
  const result = await service.setCategories(userId, categoryIds);
  return c.json(successResponse(result, 'Categories updated successfully'), HttpStatusCodes.OK);
};
