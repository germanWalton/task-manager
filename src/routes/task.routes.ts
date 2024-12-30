import { Router } from "express";
import { TaskController } from "../controllers/task.controller";
import { authenticateToken } from "../middleware/auth.middleware";
import {
  createTaskValidation,
  deleteTaskValidation,
  getTaskValidation,
  getTasksValidation,
  updateTaskValidation,
} from "../middleware/validation.middleware";
import { asyncWrapper } from "../utils/async.wrapper";

const router = Router();
const taskController = new TaskController();

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTaskDto'
 *     responses:
 *       201:
 *         description: Task created successfully
 */
router.post(
  "/",
  authenticateToken,
  createTaskValidation,
  asyncWrapper(taskController.createTask.bind(taskController))
);

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Get all tasks
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: completed
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: List of tasks
 */
router.get(
  "/",
  authenticateToken,
  getTasksValidation,
  asyncWrapper(taskController.getTasks.bind(taskController))
);

/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     summary: Get a task by ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the task to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task retrieved successfully
 *       404:
 *         description: Task not found
 */
router.get(
  "/:id",
  authenticateToken,
  getTaskValidation,
  asyncWrapper(taskController.getTaskById.bind(taskController))
);
/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     summary: Update a task by ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the task to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTaskDto'
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       404:
 *         description: Task not found
 */
router.put(
  "/:id",
  authenticateToken,
  updateTaskValidation,
  asyncWrapper(taskController.updateTask.bind(taskController))
);
/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Delete a task by ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the task to delete
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Task deleted successfully
 *       404:
 *         description: Task not found
 */
router.delete(
  "/:id",
  authenticateToken,
  deleteTaskValidation,
  asyncWrapper(taskController.deleteTask.bind(taskController))
);

export default router;
