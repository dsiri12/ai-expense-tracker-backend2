import { AppError } from "./AppError";

export class ConflictError extends AppError {
  constructor(
    message = "Conflict",
    code = "CONFLICT"
  ) {
    super(409, message, code);
  }
}