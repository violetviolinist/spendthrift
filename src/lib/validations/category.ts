import { z } from "zod";

export const createCategorySchema = z.object({
  name: z
    .string()
    .min(1, "Category name is required")
    .max(50, "Category name must be at most 50 characters"),
  color: z.string().optional(),
  icon: z.string().optional(),
});

export const updateCategorySchema = z.object({
  name: z
    .string()
    .min(1, "Category name is required")
    .max(50, "Category name must be at most 50 characters")
    .optional(),
  color: z.string().optional(),
  icon: z.string().optional(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
