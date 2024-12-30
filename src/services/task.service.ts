import { CreateTaskDto, UpdateTaskDto } from '../dto/task.dto';
import { ITask } from '../interfaces/task.interface';
import Task from '../models/task.model';
import { AppError } from '../utils/error.handler';
import logger from '../utils/logger';

export class TaskService {
  async createTask(taskDto: CreateTaskDto): Promise<ITask> {
    logger.info('Creating new task', { taskDto });
    const task = new Task(taskDto);
    return await task.save();
  }

  async getTasks(filter: { completed?: boolean } = {}): Promise<ITask[]> {
    logger.info('Getting tasks with filter', { filter });
    return await Task.find(filter);
  }

  async getTaskById(id: string): Promise<ITask> {
    logger.info('Getting task by id', { id });
    const task = await Task.findById(id);
    if (!task) {
      throw new AppError('Task not found', 404);
    }
    return task;
  }

  async updateTask(id: string, taskDto: UpdateTaskDto): Promise<ITask> {
    logger.info('Updating task', { id, taskDto });
    const task = await Task.findByIdAndUpdate(id, taskDto, { new: true });
    if (!task) {
      throw new AppError('Task not found', 404);
    }
    return task;
  }

  async deleteTask(id: string): Promise<void> {
    logger.info('Deleting task', { id });
    const task = await Task.findByIdAndDelete(id);
    if (!task) {
      throw new AppError('Task not found', 404);
    }
  }
}