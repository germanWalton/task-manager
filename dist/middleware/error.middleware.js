"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const error_handler_1 = require("../utils/error.handler");
const mongoose_1 = require("mongoose");
const logger_1 = __importDefault(require("../utils/logger"));
const errorHandler = (err, _req, res, _next) => {
    logger_1.default.error("Error occurred:", err);
    if (err instanceof error_handler_1.AppError) {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    }
    if (err instanceof mongoose_1.Error.CastError) {
        return res.status(400).json({
            status: "fail",
            message: "Invalid ID format",
        });
    }
    if (err instanceof mongoose_1.Error.ValidationError) {
        return res.status(400).json({
            status: "fail",
            message: "Validation error",
            errors: Object.values(err.errors).map((error) => error.message),
        });
    }
    return res.status(500).json({
        status: "error",
        message: "Internal server error",
    });
};
exports.errorHandler = errorHandler;
