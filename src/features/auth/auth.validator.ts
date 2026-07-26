import { z } from 'zod';

// Zod validation
// RegisterDto
// LoginDto

export const currencySchema = z.enum(['USD', 'CAD', 'EUR', 'GBP']);
export type Currency = z.infer<typeof currencySchema>;

export const registerSchema = z
   .object({
      name: z
         .string()
         .trim()
         .min(2, 'Name must be at least 2 characters')
         .max(100, 'Name cannot exceed 100 characters'),

      email: z.string().trim().email('Invalid email address').toLowerCase(),

      password: z
         .string()
         .trim()
         .min(6, 'Password must be at least 6 characters'),
      // .max(8, "Password cannot exceed 100 characters")
      // .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      // .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      // .regex(/[0-9]/, "Password must contain at least one number")
      // .regex(
      //   /[!@#$%^&*(),.?":{}|<>]/,
      //   "Password must contain at least one special character",
      // ),
      currency: currencySchema.nullable().optional(),
   })
   .strict();

export type RegisterDto = z.infer<typeof registerSchema>;

export const loginSchema = z
   .object({
      email: z.string().trim().email('Invalid email address').toLowerCase(),

      password: z
         .string()
         .trim()
         .min(6, 'Password must be at least 6 characters'),
      // .max(8, "Password cannot exceed 100 characters")
      // .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      // .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      // .regex(/[0-9]/, "Password must contain at least one number")
      // .regex(
      //   /[!@#$%^&*(),.?":{}|<>]/,
      //   "Password must contain at least one special character",
      // ),
   })
   .strict();

export type LoginDto = z.infer<typeof loginSchema>;
