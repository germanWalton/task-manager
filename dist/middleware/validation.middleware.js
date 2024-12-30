"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginValidation = exports.registerValidation = exports.deleteTaskValidation = exports.getTasksValidation = exports.getTaskValidation = exports.updateTaskValidation = exports.createTaskValidation = void 0;
const express_validator_1 = require("express-validator");
exports.createTaskValidation = [
    (0, express_validator_1.body)("title").notEmpty().withMessage("Title is required"),
    (0, express_validator_1.body)("description").optional().isString(),
];
exports.updateTaskValidation = [
    (0, express_validator_1.param)("id").isMongoId().withMessage("Invalid task ID"),
    (0, express_validator_1.body)("title").optional().isString(),
    (0, express_validator_1.body)("description").optional().isString(),
    (0, express_validator_1.body)("completed").optional().isBoolean(),
];
exports.getTaskValidation = [(0, express_validator_1.param)("id").isMongoId().withMessage("Invalid task ID")];
exports.getTasksValidation = [
    (0, express_validator_1.query)("completed").optional().isBoolean().withMessage("Completed must be a boolean value"),
];
exports.deleteTaskValidation = [(0, express_validator_1.param)("id").isMongoId().withMessage("Invalid task ID")];
exports.registerValidation = [
    (0, express_validator_1.body)("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email format")
        .normalizeEmail(),
    (0, express_validator_1.body)("password")
        .trim()
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
];
exports.loginValidation = [
    (0, express_validator_1.body)("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email format")
        .normalizeEmail(),
    (0, express_validator_1.body)("password").trim().notEmpty().withMessage("Password is required"),
];
