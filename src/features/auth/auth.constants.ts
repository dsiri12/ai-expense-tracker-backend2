export const AUTH_ERROR_CODES = {
  EMAIL_EXISTS: "EMAIL_EXISTS",
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  USER_NOT_FOUND: "USER_NOT_FOUND",
} as const;

export const AUTH_ERROR_MESSAGES = {
  EMAIL_EXISTS: "Email already registered",
  INVALID_CREDENTIALS: "Invalid credentials",
  USER_NOT_FOUND: "User not found",

  VALIDATION_ERROR:"Validation failed"
} as const;
