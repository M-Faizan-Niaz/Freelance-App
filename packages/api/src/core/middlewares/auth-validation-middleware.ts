import type { MiddlewareHandler } from 'hono';
import type { z } from 'zod';

import { errorResponse } from '@/lib/api-response';
import * as HttpStatusCodes from '@/lib/http-status-codes';
import {
  changeEmailSchema,
  changePasswordSchema,
  registerCustomerSchema,
  registerProviderSchema,
  requestChangeEmailSchema,
  requestPasswordResetSchema,
  resetPasswordSchema,
  signinRequestSchema,
  signupRequestSchema,
  verifyEmailSchema,
} from '@/modules/users/auth/auth.schema';

const schemaByPath: Record<string, z.ZodSchema> = {
  '/v1/api/auth/sign-up/email': signupRequestSchema,
  '/v1/api/auth/sign-in/email': signinRequestSchema,
  '/v1/api/auth/request-password-reset': requestPasswordResetSchema,
  '/v1/api/auth/reset-password': resetPasswordSchema,
  '/v1/api/auth/change-password': changePasswordSchema,
  '/v1/api/auth/email-otp/request-email-change': requestChangeEmailSchema,
  '/v1/api/auth/email-otp/change-email': changeEmailSchema,
  '/v1/api/auth/verify-email': verifyEmailSchema,
  '/v1/api/auth/register/customer': registerCustomerSchema,
  '/v1/api/auth/register/provider': registerProviderSchema,
};

export const authValidationMiddleware: MiddlewareHandler = async (c, next) => {
  const schema = schemaByPath[c.req.path];
  if (!schema) return next();

  const body =
    c.req.method === 'GET'
      ? Object.fromEntries(new URL(c.req.url).searchParams)
      : await c.req.raw
          .clone()
          .json()
          .catch(() => null);
  const result = schema.safeParse(body);

  if (!result.success) {
    return c.json(
      errorResponse(HttpStatusCodes.BAD_REQUEST, 'Zod validation failed', {
        name: 'ZodError',
        issues: result.error.issues,
      }),
      HttpStatusCodes.BAD_REQUEST,
    );
  }

  await next();
};
