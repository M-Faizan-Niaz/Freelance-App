import {
  callbackURLSchema,
  emailSchema,
  fullNameSchema,
  otpSchema,
  passwordSchema,
  phoneSchema,
} from '@/lib/zod-schemas/common-schemas';
import { z } from 'zod';

export const signupRequestSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const signinRequestSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  callbackURL: callbackURLSchema,
  rememberMe: z.boolean().optional().default(false),
});

export const requestPasswordResetSchema = z.object({
  email: emailSchema,
  redirectTo: z.string().optional().nullable(),
});

export const resetPasswordSchema = z.object({
  token: z.string().trim().min(1).describe('Password reset token'),
  newPassword: passwordSchema,
});

export const changePasswordSchema = z.object({
  newPassword: passwordSchema,
  currentPassword: z.string().min(1, 'Current password is required'),
  revokeOtherSessions: z.boolean().optional().default(false),
});

export const changeEmailSchema = z.object({
  newEmail: emailSchema,
  otp: otpSchema,
});

export const requestChangeEmailSchema = z.object({
  newEmail: emailSchema,
  otp: z.string().optional().nullable(),
});

export const verifyEmailSchema = z.object({
  token: z.string().trim().min(1, 'Verification token is required'),
});

export const registerCustomerSchema = z.object({
  name: fullNameSchema,
  email: emailSchema,
  password: passwordSchema,
  phoneNumber: phoneSchema,
});

export const registerProviderSchema = registerCustomerSchema.extend({
  cnicNumber: z
    .string()
    .trim()
    .regex(/^\d{5}-\d{7}-\d$/, 'CNIC must be in format XXXXX-XXXXXXX-X'),
  city: z.string().trim().min(2, 'City is required').max(100),
});

export type RegisterCustomerInput = z.infer<typeof registerCustomerSchema>;
export type RegisterProviderInput = z.infer<typeof registerProviderSchema>;
