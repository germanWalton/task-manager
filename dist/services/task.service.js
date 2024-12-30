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
exports.TaskService = void 0;
const task_model_1 = __importDefault(require("../models/task.model"));
const error_handler_1 = require("../utils/error.handler");
const logger_1 = __importDefault(require("../utils/logger"));
class TaskService {
    createTask(taskDto) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.info('Creating new task', { taskDto });
            const task = new task_model_1.default(taskDto);
            return yield task.save();
        });
    }
    getTasks() {
        return __awaiter(this, arguments, void 0, function* (filter = {}) {
            logger_1.default.info('Getting tasks with filter', { filter });
            return yield task_model_1.default.find(filter);
        });
    }
    getTaskById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.info('Getting task by id', { id });
            const task = yield task_model_1.default.findById(id);
            if (!task) {
                throw new error_handler_1.AppError('Task not found', 404);
            }
            return task;
        });
    }
    updateTask(id, taskDto) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.info('Updating task', { id, taskDto });
            const task = yield task_model_1.default.findByIdAndUpdate(id, taskDto, { new: true });
            if (!task) {
                throw new error_handler_1.AppError('Task not found', 404);
            }
            return task;
        });
    }
    deleteTask(id) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.info('Deleting task', { id });
            const task = yield task_model_1.default.findByIdAndDelete(id);
            if (!task) {
                throw new error_handler_1.AppError('Task not found', 404);
            }
        });
    }
}
exports.TaskService = TaskService;
