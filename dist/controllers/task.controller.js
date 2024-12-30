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
exports.TaskController = void 0;
const express_validator_1 = require("express-validator");
const task_service_1 = require("../services/task.service");
const error_handler_1 = require("../utils/error.handler");
const error_util_1 = require("../utils/error.util");
const logger_1 = __importDefault(require("../utils/logger"));
class TaskController {
    constructor() {
        this.taskService = new task_service_1.TaskService();
    }
    createTask(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                throw new error_handler_1.AppError("Validation failed: " + (0, error_util_1.formatValidationErrors)(errors), 400);
            }
            const task = yield this.taskService.createTask(req.body);
            logger_1.default.info("Task created successfully", { taskId: task._id });
            return res.status(201).json(task);
        });
    }
    getTasks(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                throw new error_handler_1.AppError("Validation failed: " + (0, error_util_1.formatValidationErrors)(errors), 400);
            }
            const { completed } = req.query;
            const filter = completed !== undefined ? { completed: completed === "true" } : {};
            const tasks = yield this.taskService.getTasks(filter);
            return res.json(tasks);
        });
    }
    getTaskById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                throw new error_handler_1.AppError("Validation failed: " + (0, error_util_1.formatValidationErrors)(errors), 400);
            }
            const task = yield this.taskService.getTaskById(req.params.id);
            return res.json(task);
        });
    }
    updateTask(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                throw new error_handler_1.AppError("Validation failed: " + (0, error_util_1.formatValidationErrors)(errors), 400);
            }
            const task = yield this.taskService.updateTask(req.params.id, req.body);
            logger_1.default.info("Task updated successfully", { taskId: task._id });
            return res.json(task);
        });
    }
    deleteTask(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                throw new error_handler_1.AppError("Validation failed: " + (0, error_util_1.formatValidationErrors)(errors), 400);
            }
            yield this.taskService.deleteTask(req.params.id);
            logger_1.default.info("Task deleted successfully", { taskId: req.params.id });
            return res.status(204).send();
        });
    }
}
exports.TaskController = TaskController;
