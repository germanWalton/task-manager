"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const task_controller_1 = require("../controllers/task.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validation_middleware_1 = require("../middleware/validation.middleware");
const async_wrapper_1 = require("../utils/async.wrapper");
const router = (0, express_1.Router)();
const taskController = new task_controller_1.TaskController();
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
router.post("/", auth_middleware_1.authenticateToken, validation_middleware_1.createTaskValidation, (0, async_wrapper_1.asyncWrapper)(taskController.createTask.bind(taskController)));
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
router.get("/", auth_middleware_1.authenticateToken, validation_middleware_1.getTasksValidation, (0, async_wrapper_1.asyncWrapper)(taskController.getTasks.bind(taskController)));
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
router.get("/:id", auth_middleware_1.authenticateToken, validation_middleware_1.getTaskValidation, (0, async_wrapper_1.asyncWrapper)(taskController.getTaskById.bind(taskController)));
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
router.put("/:id", auth_middleware_1.authenticateToken, validation_middleware_1.updateTaskValidation, (0, async_wrapper_1.asyncWrapper)(taskController.updateTask.bind(taskController)));
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
router.delete("/:id", auth_middleware_1.authenticateToken, validation_middleware_1.deleteTaskValidation, (0, async_wrapper_1.asyncWrapper)(taskController.deleteTask.bind(taskController)));
exports.default = router;
