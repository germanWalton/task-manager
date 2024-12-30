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
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../models/user.model");
const error_handler_1 = require("../utils/error.handler");
const logger_1 = __importDefault(require("../utils/logger"));
class AuthService {
    constructor() {
        this.JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
        this.SALT_ROUNDS = 10;
    }
    register(registerDTO) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logger_1.default.info("Starting user registration process", { email: registerDTO.email });
                const existingUser = yield user_model_1.User.findOne({ email: registerDTO.email });
                if (existingUser) {
                    logger_1.default.warn("Registration attempt with existing email", { email: registerDTO.email });
                    throw new error_handler_1.AppError("Email already registered", 400);
                }
                const hashedPassword = yield this.hashPassword(registerDTO.password);
                const user = yield user_model_1.User.create({
                    email: registerDTO.email,
                    password: hashedPassword,
                });
                const token = this.generateToken(user._id);
                logger_1.default.info("User registered successfully", { userId: user._id });
                return {
                    token,
                    user: {
                        id: user._id,
                        email: user.email,
                    },
                };
            }
            catch (error) {
                logger_1.default.error("Error in user registration", {
                    email: registerDTO.email,
                    error: error instanceof Error ? error.message : "Unknown error",
                });
                if (error instanceof error_handler_1.AppError) {
                    throw error;
                }
                throw new error_handler_1.AppError("Failed to register user", 500);
            }
        });
    }
    login(loginDTO) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logger_1.default.info("Attempting user login", { email: loginDTO.email });
                const user = yield user_model_1.User.findOne({ email: loginDTO.email });
                if (!user) {
                    logger_1.default.warn("Login attempt with non-existent email", { email: loginDTO.email });
                    throw new error_handler_1.AppError("Invalid credentials", 401);
                }
                const isPasswordValid = yield this.comparePasswords(loginDTO.password, user.password);
                if (!isPasswordValid) {
                    logger_1.default.warn("Invalid password attempt", { email: loginDTO.email });
                    throw new error_handler_1.AppError("Invalid credentials", 401);
                }
                const token = this.generateToken(user._id);
                logger_1.default.info("User logged in successfully", { userId: user._id });
                return {
                    token,
                    user: {
                        id: user._id,
                        email: user.email,
                    },
                };
            }
            catch (error) {
                logger_1.default.error("Error in user login", {
                    email: loginDTO.email,
                    error: error instanceof Error ? error.message : "Unknown error",
                });
                if (error instanceof error_handler_1.AppError) {
                    throw error;
                }
                throw new error_handler_1.AppError("Failed to login", 500);
            }
        });
    }
    hashPassword(password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield bcrypt_1.default.hash(password, this.SALT_ROUNDS);
            }
            catch (error) {
                logger_1.default.error("Error hashing password", {
                    error: error instanceof Error ? error.message : "Unknown error",
                });
                throw new error_handler_1.AppError("Error processing password", 500);
            }
        });
    }
    comparePasswords(candidatePassword, hashedPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield bcrypt_1.default.compare(candidatePassword, hashedPassword);
            }
            catch (error) {
                logger_1.default.error("Error comparing passwords", {
                    error: error instanceof Error ? error.message : "Unknown error",
                });
                throw new error_handler_1.AppError("Error validating password", 500);
            }
        });
    }
    generateToken(userId) {
        try {
            return jsonwebtoken_1.default.sign({ userId }, this.JWT_SECRET, { expiresIn: "60m" });
        }
        catch (error) {
            logger_1.default.error("Error generating JWT token", {
                userId,
                error: error instanceof Error ? error.message : "Unknown error",
            });
            throw new error_handler_1.AppError("Error generating authentication token", 500);
        }
    }
}
exports.AuthService = AuthService;
