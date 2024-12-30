"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const error_handler_1 = require("../utils/error.handler");
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        return next(new error_handler_1.AppError("No token provided", 401));
    }
    try {
        if (!process.env.JWT_SECRET) {
            throw new error_handler_1.AppError("JWT_SECRET is not defined", 500);
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        return next(new error_handler_1.AppError("Invalid token", 401));
    }
};
exports.authenticateToken = authenticateToken;
