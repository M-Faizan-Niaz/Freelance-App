import { z } from 'zod';

export const passwordSchema = z
  .string()
  .min(8, 'Must be at least 8 characters.')
  .max(32, 'Must be at most 32 characters.')
  .regex(/[A-Z]/, 'Must contain an uppercase letter.')
  .regex(/[a-z]/, 'Must contain a lowercase letter.')
  .regex(/[0-9]/, 'Must contain a number.')
  .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Must contain a special character.');

export const registerProviderSchema = z
  .object({
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters.')
      .max(100, 'Name must be at most 100 characters.')
      .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces.'),
    email: z.string().email('Please enter a valid email address.'),
    phone: z
      .string()
      .length(10, 'Enter exactly 10 digits (without country code).')
      .regex(/^\d+$/, 'Digits only.'),
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password.'),
    city: z.string().min(2, 'Please select your city.'),
    cnicNumber: z
      .string()
      .regex(/^\d{5}-\d{7}-\d$/, 'Format: XXXXX-XXXXXXX-X'),
    termsAccepted: z.literal(true, {
      error: 'You must accept the terms to continue.',
    }),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

export type RegisterProviderValues = z.infer<typeof registerProviderSchema>;

export const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(1, 'Please enter your password.'),
});

export type SignInValues = z.infer<typeof signInSchema>;
