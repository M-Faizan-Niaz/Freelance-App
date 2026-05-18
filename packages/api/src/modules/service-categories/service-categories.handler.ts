import type {
  CreateRoute,
  ListRoute,
  PatchRoute,
  RemoveSelectedRoute,
  UploadImageRoute,
} from './service-categories.route';
import type { AppRouteHandler } from '@/lib/types';
import { successResponse } from '@/lib/api-response';
import * as HttpStatusCodes from '@/lib/http-status-codes';
import { validateFileSize, validateImageFile } from '@/common/upload-helpers';
import { AppError } from '@/core/errors';
import { ServiceCategoriesService } from './service-categories.service';

const service = new ServiceCategoriesService();

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const data = await service.listActive();
  return c.json(
    successResponse(data, 'Service categories retrieved successfully'),
    HttpStatusCodes.OK,
  );
};

export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const body = c.req.valid('json');
  const data = await service.create(body);
  return c.json(successResponse(data, 'Service category created successfully'), HttpStatusCodes.OK);
};

export const patch: AppRouteHandler<PatchRoute> = async (c) => {
  const { id } = c.req.valid('param');
  const body = c.req.valid('json');
  const data = await service.update(id, body);
  return c.json(successResponse(data, 'Service category updated successfully'), HttpStatusCodes.OK);
};

export const removeSelected: AppRouteHandler<RemoveSelectedRoute> = async (c) => {
  const { ids } = c.req.valid('json');
  await service.deleteMany(ids);
  return c.body(null, HttpStatusCodes.NO_CONTENT);
};

export const uploadImage: AppRouteHandler<UploadImageRoute> = async (c) => {
  const { id } = c.req.valid('param');

  const body = await c.req.parseBody();
  const file = body['image'];
  if (!(file instanceof File)) {
    throw new AppError('Missing required field: image', HttpStatusCodes.BAD_REQUEST);
  }

  validateImageFile(file);
  validateFileSize(file, 5);

  const category = await service.uploadImage(id, file);
  return c.json(
    successResponse(category, 'Category image uploaded successfully'),
    HttpStatusCodes.OK,
  );
};
