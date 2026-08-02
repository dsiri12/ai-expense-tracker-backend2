import { z } from "zod";

export const transactionFiltersSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  categoryId: z.coerce.number().int().positive().optional(),
  type: z.enum(["income", "expense"]).optional(),
  search: z.string().optional(),
  limit: z.coerce.number().int().positive().default(50),
  offset: z.coerce.number().int().nonnegative().default(0),
});

export type TransactionFiltersDto = z.infer<typeof transactionFiltersSchema>

export const createTransactionSchema = z
  .object({
    categoryId: z.coerce
      .number()
      .int("Category ID must be an integer")
      .positive("Category ID must be greater than 0"),

    amount: z.coerce
      .number()
      .positive("Amount must be greater than 0")
      .multipleOf(0.01, "Amount can have at most 2 decimal places"),

    type: z.enum(["income", "expense"], {
      error: "Type must be either 'income' or 'expense'",
    }),

    description: z
      .string()
      .trim()
      .max(255, "Description cannot exceed 255 characters")
      .nullable()
      .optional(),

    notes: z.string().trim().nullable().optional(),

    transactionDate: z.iso.date({
      error: "Transaction date must be in YYYY-MM-DD format",
    }),
  })
  .strict();

export type CreateTransactionDto = z.infer<typeof createTransactionSchema>

export const updateTransactionSchema = z
  .object({
    categoryId: z.coerce
      .number()
      .int("Category ID must be an integer")
      .positive("Category ID must be greater than 0")
      .nullable()
      .optional(),

    amount: z.coerce
      .number()
      .positive("Amount must be greater than 0")
      .multipleOf(0.01, "Amount can have at most 2 decimal places")
      .optional(),

    type: z
      .enum(["income", "expense"], {
        error: "Type must be either 'income' or 'expense'",
      })
      .optional(),

    description: z
      .string()
      .trim()
      .max(255, "Description cannot exceed 255 characters")
      .nullable()
      .optional(),

    notes: z.string().trim().nullable().optional(),

    transactionDate: z.iso
      .date({
        error: "Transaction date must be in YYYY-MM-DD format",
      })
      .optional(),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (Object.keys(data).length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "At least one field (categoryId, amount, type, description, notes, transactionDate) must be provided",
      });
    }
  });

  export type UpdateTransactionDto = z.infer<typeof updateTransactionSchema>


