import { z } from "zod";

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name cannot exceed 100 characters"),

    email: z.string().trim().email("Invalid email address").toLowerCase(),

    password: z.string().trim().min(6, "Password must be at least 6 characters"),
    // .max(8, "Password cannot exceed 100 characters")
    // .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    // .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    // .regex(/[0-9]/, "Password must contain at least one number")
    // .regex(
    //   /[!@#$%^&*(),.?":{}|<>]/,
    //   "Password must contain at least one special character",
    // ),
    currency: z.enum(["USD", "CAD", "EUR", "GBP"]).nullable().optional(),
  })
  .strict();

export const loginSchema = z
  .object({
    email: z.string().trim().email("Invalid email address").toLowerCase(),

    password: z.string().trim().min(6, "Password must be at least 6 characters"),
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
