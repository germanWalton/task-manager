"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const express_validator_1 = require("express-validator");
const auth_service_1 = require("../services/auth.service");
const error_handler_1 = require("../utils/error.handler");
const error_util_1 = require("../utils/error.util");
const logger_1 = __importDefault(require("../utils/logger"));
class AuthController {
    constructor() {
        this.authService = new auth_service_1.AuthService();
    }
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                throw new error_handler_1.AppError("Validation failed: " + (0, error_util_1.formatValidationErrors)(errors), 400);
            }
            const registerDTO = {
                email: req.body.email,
                password: req.body.password,
            };
            const result = yield this.authService.register(registerDTO);
            logger_1.default.info("Registration successful", {
                userId: result.user.id,
            });
            return res.status(201).json({
                status: "success",
                data: result,
            });
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                throw new error_handler_1.AppError("Validation failed: " + (0, error_util_1.formatValidationErrors)(errors), 400);
            }
            const loginDTO = {
                email: req.body.email,
                password: req.body.password,
            };
            const result = yield this.authService.login(loginDTO);
            logger_1.default.info("Login successful", {
                userId: result.user.id,
            });
            return res.status(200).json({
                status: "success",
                data: result,
            });
        });
    }
    validateToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            console.log("req", req);
            return res.status(200).json({
                status: "success",
                data: {
                    valid: true,
                    user: {
                        id: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id
                    },
                },
            });
        });
    }
}
exports.AuthController = AuthController;
