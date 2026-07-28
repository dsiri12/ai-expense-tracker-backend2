export const CATEGORY_ERRORS_CODES = {
  NAME_EXISTS: "CATEGORY_NAME_EXISTS",
  NOT_FOUND: "CATEGORY_NOT_FOUND",
} as const;

export const CATEGORY_ERRORS_MESSAGES = {
  NAME_EXISTS: "Category with this name already exists",
  NOT_FOUND: "Category not found",
  DELETED: "Category deleted",
} as const;