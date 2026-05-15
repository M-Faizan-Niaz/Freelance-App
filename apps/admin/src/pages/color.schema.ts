import { z } from "zod";

export const colorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
});

export type ColorFormValues = z.infer<typeof colorSchema>;
