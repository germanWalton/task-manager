import { Result } from "express-validator";

export function formatValidationErrors(errors: Result): string {
  return errors.array().map(error => error.msg).join(", ");
}