import type { ZodSchema } from '@/lib/types';

import { STANDARD_MESSAGES } from '@/constants';
import * as HttpStatusCodes from '@/lib/http-status-codes';
import {
  createErrorResponseSchema,
  createValidationErrorSchema,
} from '@/lib/openapi/schemas/create-api-response';

import { jsonContent } from '.';

export const errorResponse = (statusCode: number, schema: ZodSchema, details?: unknown) => {
  switch (statusCode) {
    case HttpStatusCodes.UNAUTHORIZED:
      return jsonContent(
        createErrorResponseSchema(
          HttpStatusCodes.UNAUTHORIZED,
          STANDARD_MESSAGES.ERROR.UNAUTHORIZED,
        ),
      );
    case HttpStatusCodes.FORBIDDEN:
      return jsonContent(
        createErrorResponseSchema(
          HttpStatusCodes.FORBIDDEN,
          STANDARD_MESSAGES.ERROR.FORBIDDEN,
          details,
        ),
      );
    case HttpStatusCodes.UNPROCESSABLE_ENTITY:
      return jsonContent(
        createValidationErrorSchema(schema, STANDARD_MESSAGES.ERROR.VALIDATION_ERROR),
      );
    case HttpStatusCodes.NOT_FOUND:
      return jsonContent(
        createErrorResponseSchema(
          HttpStatusCodes.NOT_FOUND,
          STANDARD_MESSAGES.ERROR.NOT_FOUND,
          details,
        ),
      );
    case HttpStatusCodes.BAD_REQUEST:
      return jsonContent(
        createErrorResponseSchema(
          HttpStatusCodes.BAD_REQUEST,
          STANDARD_MESSAGES.ERROR.BAD_REQUEST,
          details,
        ),
      );
    case HttpStatusCodes.CONFLICT:
      return jsonContent(
        createErrorResponseSchema(
          HttpStatusCodes.CONFLICT,
          STANDARD_MESSAGES.ERROR.CONFLICT,
          details,
        ),
      );
    case HttpStatusCodes.TOO_MANY_REQUESTS:
      return jsonContent(
        createErrorResponseSchema(
          HttpStatusCodes.TOO_MANY_REQUESTS,
          STANDARD_MESSAGES.ERROR.TOO_MANY_REQUESTS,
          details,
        ),
      );
    case HttpStatusCodes.INTERNAL_SERVER_ERROR:
      return jsonContent(
        createErrorResponseSchema(
          HttpStatusCodes.INTERNAL_SERVER_ERROR,
          STANDARD_MESSAGES.ERROR.INTERNAL_SERVER_ERROR,
          details,
        ),
      );
    default:
      return jsonContent(createErrorResponseSchema());
  }
};

export const commonErrorResponses = (statusCodes: number[], schema: ZodSchema) => {
  const responses: Record<number, ReturnType<typeof errorResponse>> = {};

  statusCodes.forEach((statusCode) => {
    responses[statusCode] = errorResponse(statusCode, schema);
  });

  return responses;
};
