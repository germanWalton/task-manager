import { body, param, query } from "express-validator";

export const createTaskValidation = [
  body("title").notEmpty().withMessage("Title is required"),
  body("description").optional().isString(),
];

export const updateTaskValidation = [
  param("id").isMongoId().withMessage("Invalid task ID"),
  body("title").optional().isString(),
  body("description").optional().isString(),
  body("completed").optional().isBoolean(),
];

export const getTaskValidation = [param("id").isMongoId().withMessage("Invalid task ID")];

export const getTasksValidation = [
  query("completed").optional().isBoolean().withMessage("Completed must be a boolean value"),
];

export const deleteTaskValidation = [param("id").isMongoId().withMessage("Invalid task ID")];

export const registerValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

export const loginValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),
  body("password").trim().notEmpty().withMessage("Password is required"),
];
