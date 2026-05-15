import { z } from "zod";

export const formTestSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(20, "First name must be at most 20 characters")
    .regex(/^[A-Za-z]+$/, "First name must contain only letters"),

  middleName: z.string().optional(),

  lastName: z
    .string()
    .min(1, "Last name is required")
    .regex(/^[A-Za-z]+$/, "Last name must contain only letters"),

  agreeToTerms: z.literal(true, {
    errorMap: () => ({ message: "You must agree to the terms" }),
  }),
});

export type FormTestValues = z.infer<typeof formTestSchema>;
