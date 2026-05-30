import type {
  CancelBookingRoute,
  CreateBookingRoute,
  GetBookingRoute,
  ListBookingsRoute,
  RescheduleBookingRoute,
  UpdateStatusRoute,
  UploadCompletionPhotoRoute,
} from './bookings.route';
import type { AppRouteHandler } from '@/lib/types';

import { AppError } from '@/core/errors';
import { storageService } from '@/common/services/storage.service';
import { generateUniqueFileName, validateFileSize, validateImageFile } from '@/common/upload-helpers';
import { successResponse, successResponseWithPagination } from '@/lib/api-response';
import { requireUserId } from '@/lib/require-auth';
import * as HttpStatusCodes from '@/lib/http-status-codes';

import { BookingsService } from './bookings.service';

const service = new BookingsService();

export const createBooking: AppRouteHandler<CreateBookingRoute> = async (c) => {
  const userId = await requireUserId(c.req.raw.headers);
  const body = c.req.valid('json');
  const booking = await service.createBooking(userId, body);
  return c.json(successResponse(booking, 'Booking created successfully'), HttpStatusCodes.OK);
};

export const listBookings: AppRouteHandler<ListBookingsRoute> = async (c) => {
  const userId = await requireUserId(c.req.raw.headers);
  const { role, page, limit, sortOrder } = c.req.valid('query');
  const { data, pagination } = await service.listBookings(userId, role, { page, limit, sortOrder });
  return c.json(
    successResponseWithPagination(data, pagination, [], 'Bookings retrieved successfully'),
    HttpStatusCodes.OK,
  );
};

export const getBooking: AppRouteHandler<GetBookingRoute> = async (c) => {
  const userId = await requireUserId(c.req.raw.headers);
  const { id } = c.req.valid('param');
  const booking = await service.getBooking(userId, id);
  return c.json(successResponse(booking, 'Booking retrieved successfully'), HttpStatusCodes.OK);
};

export const updateStatus: AppRouteHandler<UpdateStatusRoute> = async (c) => {
  const userId = await requireUserId(c.req.raw.headers);
  const { id } = c.req.valid('param');
  const { status } = c.req.valid('json');
  const booking = await service.updateStatus(userId, id, status);
  return c.json(successResponse(booking, 'Booking status updated'), HttpStatusCodes.OK);
};

export const cancelBooking: AppRouteHandler<CancelBookingRoute> = async (c) => {
  const userId = await requireUserId(c.req.raw.headers);
  const { id } = c.req.valid('param');
  const { reason } = c.req.valid('json');
  const booking = await service.cancelBooking(userId, id, reason);
  return c.json(successResponse(booking, 'Booking cancelled'), HttpStatusCodes.OK);
};

export const rescheduleBooking: AppRouteHandler<RescheduleBookingRoute> = async (c) => {
  const userId = await requireUserId(c.req.raw.headers);
  const { id } = c.req.valid('param');
  const { scheduledAt } = c.req.valid('json');
  const booking = await service.rescheduleBooking(userId, id, scheduledAt);
  return c.json(successResponse(booking, 'Booking rescheduled'), HttpStatusCodes.OK);
};

export const uploadCompletionPhoto: AppRouteHandler<UploadCompletionPhotoRoute> = async (c) => {
  const userId = await requireUserId(c.req.raw.headers);
  const { id } = c.req.valid('param');

  const formData = await c.req.formData();
  const rawImages = formData.getAll('images');
  const files = rawImages.filter((f): f is File => f instanceof File);

  if (files.length === 0) {
    throw new AppError('No image files provided', HttpStatusCodes.BAD_REQUEST);
  }

  const uploaded: { imageUrl: string; fileName: string }[] = [];
  const failed: { fileName: string; error: string }[] = [];

  for (const file of files) {
    try {
      validateImageFile(file);
      validateFileSize(file, 5);
      const fileName = generateUniqueFileName(file, 'booking-completion');
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
    return c.json(successResponse({ uploaded: [], failed }, 'No photos were uploaded'), HttpStatusCodes.OK);
  }

  const photos = await service.uploadCompletionPhotos(userId, id, uploaded);
  return c.json(successResponse({ uploaded: photos, failed }, 'Photos processed'), HttpStatusCodes.OK);
};
