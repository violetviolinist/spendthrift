import { z } from "zod";

export const createExpenseSchema = z.object({
  amount: z.number().positive("Amount must be a positive number"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(200, "Description must be at most 200 characters"),
  categoryId: z.string().optional().nullable(),
  date: z.date(),
});

export const updateExpenseSchema = z.object({
  amount: z.number().positive("Amount must be a positive number").optional(),
  description: z
    .string()
    .min(1, "Description is required")
    .max(200, "Description must be at most 200 characters")
    .optional(),
  categoryId: z.string().optional().nullable(),
  date: z.date().optional(),
});

export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
export type UpdateExpenseInput = z.infer<typeof updateExpenseSchema>;
