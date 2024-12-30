import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { TaskService } from "../services/task.service";
import { AppError } from "../utils/error.handler";
import { formatValidationErrors } from "../utils/error.util";
import logger from "../utils/logger";

export class TaskController {
  private taskService: TaskService;

  constructor() {
    this.taskService = new TaskService();
  }

  async createTask(req: Request, res: Response): Promise<Response> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError("Validation failed: " + formatValidationErrors(errors), 400);
    }

    const task = await this.taskService.createTask(req.body);
    logger.info("Task created successfully", { taskId: task._id });
    return res.status(201).json(task);
  }

  async getTasks(req: Request, res: Response): Promise<Response> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError("Validation failed: " + formatValidationErrors(errors), 400);
    }
    const { completed } = req.query;
    const filter = completed !== undefined ? { completed: completed === "true" } : {};
    const tasks = await this.taskService.getTasks(filter);
    return res.json(tasks);
  }

  async getTaskById(req: Request, res: Response): Promise<Response> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError("Validation failed: " + formatValidationErrors(errors), 400);
    }
    const task = await this.taskService.getTaskById(req.params.id);
    return res.json(task);
  }

  async updateTask(req: Request, res: Response): Promise<Response> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError("Validation failed: " + formatValidationErrors(errors), 400);
    }

    const task = await this.taskService.updateTask(req.params.id, req.body);
    logger.info("Task updated successfully", { taskId: task._id });
    return res.json(task);
  }

  async deleteTask(req: Request, res: Response): Promise<Response> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError("Validation failed: " + formatValidationErrors(errors), 400);
    }
    await this.taskService.deleteTask(req.params.id);
    logger.info("Task deleted successfully", { taskId: req.params.id });
    return res.status(204).send();
  }
}
