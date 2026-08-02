export const TRANSACTION_ERRORS_CODES = {
  NAME_EXISTS: "TRANSACTION_NAME_EXISTS",
  NOT_FOUND: "TRANSACTION_NOT_FOUND",
} as const;

export const TRANSACTION_ERRORS_MESSAGES = {
  NAME_EXISTS: "Transaction with this name already exists",
  NOT_FOUND: "Transaction not found",
  DELETED: "Transaction deleted",
} as const;