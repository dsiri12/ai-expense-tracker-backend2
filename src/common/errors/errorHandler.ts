import type { Request, Response, NextFunction } from "express";
import { ERROR_CODES, ERROR_MESSAGES } from "../constants/error.constants"
import { AppError } from "./AppError"

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Caught error111111:', err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
      code: err.code,
    });
  }

  return res.status(500).json({
    message: ERROR_MESSAGES.SERVER_ERROR,
    code: ERROR_CODES.SERVER_ERROR,
  });
}