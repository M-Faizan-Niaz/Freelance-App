import { createRoute, z } from '@hono/zod-openapi';

import * as HttpStatusCodes from '@/lib/http-status-codes';
import { commonErrorResponses, jsonContent, jsonContentRequired } from '@/lib/openapi/helpers';
import { createSuccessResponseSchema, idParams } from '@/lib/openapi/schemas';

import {
  bookingResponseSchema,
  cancelBookingRequestSchema,
  completionPhotoUploadResponseSchema,
  createBookingRequestSchema,
  listBookingsQuerySchema,
  rescheduleBookingRequestSchema,
  updateBookingStatusRequestSchema,
  uploadCompletionPhotoRequestSchema,
} from './bookings.schema';

const tags = ['Bookings'];

export const createBooking = createRoute({
  operationId: 'createBooking',
  path: '/bookings',
  method: 'post',
  tags,
  summary: 'Create a new booking',
  request: {
    body: jsonContentRequired(createBookingRequestSchema, 'Booking details'),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createSuccessResponseSchema(bookingResponseSchema, 'Booking created successfully'),
      'The created booking',
    ),
    ...commonErrorResponses(
      [
        HttpStatusCodes.UNAUTHORIZED,
        HttpStatusCodes.NOT_FOUND,
        HttpStatusCodes.UNPROCESSABLE_ENTITY,
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
      ],
      createBookingRequestSchema,
    ),
  },
});

export const listBookings = createRoute({
  operationId: 'listBookings',
  path: '/bookings',
  method: 'get',
  tags,
  summary: 'List bookings (customer sees own, provider sees own)',
  request: {
    query: listBookingsQuerySchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createSuccessResponseSchema(
        z.array(bookingResponseSchema),
        'Bookings retrieved successfully',
      ),
      'List of bookings',
    ),
    ...commonErrorResponses(
      [
        HttpStatusCodes.UNAUTHORIZED,
        HttpStatusCodes.NOT_FOUND,
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
      ],
      bookingResponseSchema,
    ),
  },
});

export const getBooking = createRoute({
  operationId: 'getBooking',
  path: '/bookings/{id}',
  method: 'get',
  tags,
  summary: 'Get booking detail',
  request: {
    params: idParams,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createSuccessResponseSchema(bookingResponseSchema, 'Booking retrieved successfully'),
      'Booking detail',
    ),
    ...commonErrorResponses(
      [
        HttpStatusCodes.UNAUTHORIZED,
        HttpStatusCodes.FORBIDDEN,
        HttpStatusCodes.NOT_FOUND,
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
      ],
      bookingResponseSchema,
    ),
  },
});

export const updateStatus = createRoute({
  operationId: 'updateBookingStatus',
  path: '/bookings/{id}/status',
  method: 'patch',
  tags,
  summary: 'Update booking status (provider only)',
  request: {
    params: idParams,
    body: jsonContentRequired(updateBookingStatusRequestSchema, 'New status'),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createSuccessResponseSchema(bookingResponseSchema, 'Booking status updated'),
      'Updated booking',
    ),
    ...commonErrorResponses(
      [
        HttpStatusCodes.UNAUTHORIZED,
        HttpStatusCodes.FORBIDDEN,
        HttpStatusCodes.NOT_FOUND,
        HttpStatusCodes.UNPROCESSABLE_ENTITY,
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
      ],
      updateBookingStatusRequestSchema,
    ),
  },
});

export const cancelBooking = createRoute({
  operationId: 'cancelBooking',
  path: '/bookings/{id}/cancel',
  method: 'post',
  tags,
  summary: 'Cancel a booking',
  request: {
    params: idParams,
    body: jsonContentRequired(cancelBookingRequestSchema, 'Cancellation reason'),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createSuccessResponseSchema(bookingResponseSchema, 'Booking cancelled'),
      'Cancelled booking',
    ),
    ...commonErrorResponses(
      [
        HttpStatusCodes.UNAUTHORIZED,
        HttpStatusCodes.FORBIDDEN,
        HttpStatusCodes.NOT_FOUND,
        HttpStatusCodes.UNPROCESSABLE_ENTITY,
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
      ],
      cancelBookingRequestSchema,
    ),
  },
});

export const rescheduleBooking = createRoute({
  operationId: 'rescheduleBooking',
  path: '/bookings/{id}/reschedule',
  method: 'patch',
  tags,
  summary: 'Reschedule a booking (customer only, pending status)',
  request: {
    params: idParams,
    body: jsonContentRequired(rescheduleBookingRequestSchema, 'New scheduled time'),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createSuccessResponseSchema(bookingResponseSchema, 'Booking rescheduled'),
      'Rescheduled booking',
    ),
    ...commonErrorResponses(
      [
        HttpStatusCodes.UNAUTHORIZED,
        HttpStatusCodes.FORBIDDEN,
        HttpStatusCodes.NOT_FOUND,
        HttpStatusCodes.UNPROCESSABLE_ENTITY,
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
      ],
      rescheduleBookingRequestSchema,
    ),
  },
});

export const uploadCompletionPhoto = createRoute({
  operationId: 'uploadCompletionPhoto',
  path: '/bookings/{id}/complete-photo',
  method: 'post',
  tags,
  summary: 'Upload after-job completion photos (provider only)',
  request: {
    params: idParams,
    body: {
      content: {
        'multipart/form-data': {
          schema: uploadCompletionPhotoRequestSchema,
        },
      },
      required: true,
    },
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createSuccessResponseSchema(completionPhotoUploadResponseSchema, 'Photos processed'),
      'Upload result with succeeded and failed files',
    ),
    ...commonErrorResponses(
      [
        HttpStatusCodes.UNAUTHORIZED,
        HttpStatusCodes.FORBIDDEN,
        HttpStatusCodes.NOT_FOUND,
        HttpStatusCodes.UNPROCESSABLE_ENTITY,
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
      ],
      completionPhotoUploadResponseSchema,
    ),
  },
});

export type CreateBookingRoute = typeof createBooking;
export type ListBookingsRoute = typeof listBookings;
export type GetBookingRoute = typeof getBooking;
export type UpdateStatusRoute = typeof updateStatus;
export type CancelBookingRoute = typeof cancelBooking;
export type RescheduleBookingRoute = typeof rescheduleBooking;
export type UploadCompletionPhotoRoute = typeof uploadCompletionPhoto;
