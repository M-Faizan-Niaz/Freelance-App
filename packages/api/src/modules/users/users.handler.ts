import type { GetMeRoute, UpdateMeRoute, UploadProfilePhotoRoute } from './users.route';
import type { AppRouteHandler } from '@/lib/types';

import { UnauthorizedError } from '@/core/errors';
import { successResponse } from '@/lib/api-response';
import { auth } from '@/lib/auth';
import * as HttpStatusCodes from '@/lib/http-status-codes';
import {
  generateUniqueFileName,
  validateFileSize,
  validateImageFile,
} from '@/common/upload-helpers';
import { AppError } from '@/core/errors';
import { storageService } from '@/common/services/storage.service';

import { UsersService } from './users.service';

const usersService = new UsersService();

async function requireUserId(headers: Headers): Promise<string> {
  const session = await auth.api.getSession({ headers });
  if (!session?.user?.id) {
    throw new UnauthorizedError('Authentication required');
  }
  return session.user.id;
}

export const getMe: AppRouteHandler<GetMeRoute> = async (c) => {
  const userId = await requireUserId(c.req.raw.headers);
  const profile = await usersService.getMyProfile(userId);
  return c.json(successResponse(profile, 'Profile retrieved successfully'), HttpStatusCodes.OK);
};

export const updateMe: AppRouteHandler<UpdateMeRoute> = async (c) => {
  const userId = await requireUserId(c.req.raw.headers);
  const body = c.req.valid('json');
  const profile = await usersService.updateMyProfile(userId, body);
  return c.json(successResponse(profile, 'Profile updated successfully'), HttpStatusCodes.OK);
};

export const uploadProfilePhoto: AppRouteHandler<UploadProfilePhotoRoute> = async (c) => {
  const userId = await requireUserId(c.req.raw.headers);

  const body = await c.req.parseBody();
  const file = body['photo'];
  if (!(file instanceof File)) {
    throw new AppError('Missing required file field: photo', HttpStatusCodes.BAD_REQUEST);
  }
  validateImageFile(file);
  validateFileSize(file, 5);

  const currentProfile = await usersService.getMyProfile(userId);
  if (currentProfile.profilePhotoUrl) {
    const oldFileName = storageService.extractFileNameFromUrl(currentProfile.profilePhotoUrl);
    if (oldFileName) {
      try {
        await storageService.deleteFile(oldFileName);
      } catch {
        // continue even if old file deletion fails
      }
    }
  }

  const fileName = generateUniqueFileName(file, 'profile-photos');
  const url = await storageService.uploadFile(file, fileName);

  const profile = await usersService.updateMyProfile(userId, { profilePhotoUrl: url });
  return c.json(
    successResponse(profile, 'Profile photo uploaded successfully'),
    HttpStatusCodes.OK,
  );
};
