import { TaskService } from "../../services/task.service";
import Task from "../../models/task.model";
import { AppError } from "../../utils/error.handler";
import { CreateTaskDto, UpdateTaskDto } from "../../dto/task.dto";

jest.mock("../../models/task.model");
jest.mock("../../utils/logger");

describe("TaskService", () => {
  let taskService: TaskService;
  const mockTaskId = "mockTaskId123";

  beforeEach(() => {
    taskService = new TaskService();
    jest.clearAllMocks();
  });

  describe("createTask", () => {
    const createTaskDto: CreateTaskDto = {
      title: "Test Task",
      description: "Test Description",
    };

    it("should create a task successfully", async () => {
      const mockTask = {
        _id: mockTaskId,
        ...createTaskDto,
        completed: false,
        save: jest.fn().mockResolvedValue({
          _id: mockTaskId,
          ...createTaskDto,
          completed: false,
        }),
      };

      (Task as unknown as jest.Mock).mockImplementation(() => mockTask);

      const result = await taskService.createTask(createTaskDto);

      expect(result).toEqual({
        _id: mockTaskId,
        ...createTaskDto,
        completed: false,
      });
      expect(mockTask.save).toHaveBeenCalled();
    });
  });

  describe("getTasks", () => {
    it("should get all tasks when no filter is provided", async () => {
      const mockTasks = [
        { _id: "1", title: "Task 1", completed: false },
        { _id: "2", title: "Task 2", completed: true },
      ];

      (Task.find as jest.Mock).mockResolvedValue(mockTasks);

      const result = await taskService.getTasks();

      expect(result).toEqual(mockTasks);
      expect(Task.find).toHaveBeenCalledWith({});
    });

    it("should get tasks with completed filter", async () => {
      const mockTasks = [{ _id: "1", title: "Task 1", completed: true }];

      (Task.find as jest.Mock).mockResolvedValue(mockTasks);

      const result = await taskService.getTasks({ completed: true });

      expect(result).toEqual(mockTasks);
      expect(Task.find).toHaveBeenCalledWith({ completed: true });
    });
  });

  describe("getTaskById", () => {
    it("should get task by id successfully", async () => {
      const mockTask = {
        _id: mockTaskId,
        title: "Test Task",
        completed: false,
      };

      (Task.findById as jest.Mock).mockResolvedValue(mockTask);

      const result = await taskService.getTaskById(mockTaskId);

      expect(result).toEqual(mockTask);
      expect(Task.findById).toHaveBeenCalledWith(mockTaskId);
    });

    it("should throw error if task not found", async () => {
      (Task.findById as jest.Mock).mockResolvedValue(null);

      await expect(taskService.getTaskById(mockTaskId)).rejects.toThrow(
        new AppError("Task not found", 404)
      );
    });
  });

  describe("updateTask", () => {
    const updateTaskDto: UpdateTaskDto = {
      title: "Updated Task",
      completed: true,
    };

    it("should update task successfully", async () => {
      const mockUpdatedTask = {
        _id: mockTaskId,
        ...updateTaskDto,
      };

      (Task.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockUpdatedTask);

      const result = await taskService.updateTask(mockTaskId, updateTaskDto);

      expect(result).toEqual(mockUpdatedTask);
      expect(Task.findByIdAndUpdate).toHaveBeenCalledWith(mockTaskId, updateTaskDto, { new: true });
    });

    it("should throw error if task not found", async () => {
      (Task.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

      await expect(taskService.updateTask(mockTaskId, updateTaskDto)).rejects.toThrow(
        new AppError("Task not found", 404)
      );
    });
  });

  describe("deleteTask", () => {
    it("should delete task successfully", async () => {
      const mockTask = {
        _id: mockTaskId,
        title: "Test Task",
      };

      (Task.findByIdAndDelete as jest.Mock).mockResolvedValue(mockTask);

      await taskService.deleteTask(mockTaskId);

      expect(Task.findByIdAndDelete).toHaveBeenCalledWith(mockTaskId);
    });

    it("should throw error if task not found", async () => {
      (Task.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

      await expect(taskService.deleteTask(mockTaskId)).rejects.toThrow(
        new AppError("Task not found", 404)
      );
    });
  });
});
