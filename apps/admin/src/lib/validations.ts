import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(8, "Must be at least 8 characters.")
  .max(32, "Must be at most 32 characters.")
  .regex(/[A-Z]/, "Must contain an uppercase letter.")
  .regex(/[a-z]/, "Must contain a lowercase letter.")
  .regex(/[0-9]/, "Must contain a number.")
  .regex(/[!@#$%^&*(),.?":{}|<>]/, "Must contain a special character.");
