import { ZodObject } from "zod";
import { Request, Response, NextFunction } from "express";
import { AUTH_ERROR_MESSAGES } from "../features/auth/auth.constants";

export const validate = (schema: ZodObject) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: AUTH_ERROR_MESSAGES.VALIDATION_ERROR,
        errors: result.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    // Replace req.body with parsed/sanitized data
    req.body = result.data;

    next();
  };
};