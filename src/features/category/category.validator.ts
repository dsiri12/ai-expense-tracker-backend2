import { z } from 'zod';

export const createCategorySchema = z
   .object({
      name: z
         .string()
         .trim()
         .min(1, 'Name is required')
         .max(50, 'Name cannot exceed 50 characters'),

      type: z.enum(['income', 'expense'], {
         error: "Type must be either 'income' or 'expense'",
      }),

      icon: z
         .string()
         .trim()
         .max(50, 'Icon cannot exceed 50 characters')

         .optional(),

      color: z
         .string()
         .regex(
            /^#[0-9A-Fa-f]{6}$/,
            'Color must be a valid hex color (e.g. #3B82F6)'
         )

         .optional(),
   })
   .strict();

export type CreateCategoryDto = z.infer<typeof createCategorySchema>;

export const updateCategorySchema = z
   .object({
      name: z
         .string()
         .trim()
         .min(1, 'Name cannot be empty')
         .max(50, 'Name cannot exceed 50 characters')
         .optional(),

      icon: z
         .string()
         .trim()
         .max(50, 'Icon cannot exceed 50 characters')
         .optional(),

      color: z
         .string()
         .regex(
            /^#[0-9A-Fa-f]{6}$/,
            'Color must be a valid hex color (e.g. #3B82F6)'
         )
         .optional(),
   })
   .strict()
   .refine(
      (data) =>
         data.name !== undefined ||
         data.icon !== undefined ||
         data.color !== undefined,
      {
         message: 'At least one fields (name, icon, or color) must be provided',
      }
   );

export type UpdateCategoryDto = z.infer<typeof updateCategorySchema>;
