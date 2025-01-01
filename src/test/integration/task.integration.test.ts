import request from "supertest";
import mongoose from "mongoose";
import { app } from "../../app";
import Task from "../../models/task.model";
import { User } from "../../models/user.model";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { AppError } from "../../utils/error.handler";

describe("Task Integration Tests", () => {
  let authToken: string;
  let userId: string;

  beforeAll(async () => {
    const mongoUri = process.env.MONGODB_TEST_URI;
    if (!mongoUri) {
      throw new AppError(
        "MONGODB_TEST_URI is not defined. Please set it in your environment variables.",
        500
      );
    }
    await mongoose.connect(mongoUri);

    const hashedPassword = await bcrypt.hash("password123", 10);
    const user = await User.create({
      email: "test@example.com",
      password: hashedPassword,
    });
    userId = user.id.toString();
    authToken = jwt.sign({ userId }, process.env.JWT_SECRET || "your-secret-key");
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Task.deleteMany({});
  });

  describe("POST /api/tasks", () => {
    const validTask = {
      title: "Test Task",
      description: "Test Description",
    };

    it("should create a task successfully with valid token", async () => {
      const response = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${authToken}`)
        .send(validTask);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("_id");
      expect(response.body.title).toBe(validTask.title);
      expect(response.body.description).toBe(validTask.description);
      expect(response.body.completed).toBe(false);

      const task = await Task.findById(response.body._id);
      expect(task).toBeTruthy();
      expect(task!.title).toBe(validTask.title);
    });

    it("should not create task without auth token", async () => {
      const response = await request(app).post("/api/tasks").send(validTask);

      expect(response.status).toBe(401);
      expect(response.body.message).toContain("No token provided");
    });

    it("should validate required fields", async () => {
      const response = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          description: "Missing title",
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain("Title is required");
    });
  });

  describe("GET /api/tasks", () => {
    beforeEach(async () => {
      await Task.create([
        { title: "Task 1", completed: false },
        { title: "Task 2", completed: true },
        { title: "Task 3", completed: false },
      ]);
    });

    it("should get all tasks with valid token", async () => {
      const response = await request(app)
        .get("/api/tasks")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(3);
    });

    it("should filter tasks by completion status", async () => {
      const response = await request(app)
        .get("/api/tasks?completed=true")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].completed).toBe(true);
    });

    it("should not get tasks without auth token", async () => {
      const response = await request(app).get("/api/tasks");

      expect(response.status).toBe(401);
      expect(response.body.message).toContain("No token provided");
    });
  });

  describe("GET /api/tasks/:id", () => {
    let testTaskId: string;

    beforeEach(async () => {
      const task = await Task.create({
        title: "Test Task",
        description: "Test Description",
      });
      testTaskId = task._id.toString();
    });

    it("should get task by id successfully", async () => {
      const response = await request(app)
        .get(`/api/tasks/${testTaskId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body._id).toBe(testTaskId);
      expect(response.body.title).toBe("Test Task");
    });

    it("should return 404 for non-existent task", async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      const response = await request(app)
        .get(`/api/tasks/${nonExistentId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toContain("Task not found");
    });
  });

  describe("PUT /api/tasks/:id", () => {
    let testTaskId: string;

    beforeEach(async () => {
      const task = await Task.create({
        title: "Original Task",
        description: "Original Description",
        completed: false,
      });
      testTaskId = task._id.toString();
    });

    it("should update task successfully", async () => {
      const updateData = {
        title: "Updated Task",
        completed: true,
      };

      const response = await request(app)
        .put(`/api/tasks/${testTaskId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.title).toBe(updateData.title);
      expect(response.body.completed).toBe(updateData.completed);

      const task = await Task.findById(testTaskId);
      expect(task!.title).toBe(updateData.title);
      expect(task!.completed).toBe(updateData.completed);
    });

    it("should return 404 for non-existent task", async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      const response = await request(app)
        .put(`/api/tasks/${nonExistentId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({ title: "Updated Task" });

      expect(response.status).toBe(404);
      expect(response.body.message).toContain("Task not found");
    });
  });

  describe("DELETE /api/tasks/:id", () => {
    let testTaskId: string;

    beforeEach(async () => {
      const task = await Task.create({
        title: "Task to Delete",
      });
      testTaskId = task._id.toString();
    });

    it("should delete task successfully", async () => {
      const response = await request(app)
        .delete(`/api/tasks/${testTaskId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(204);

      const task = await Task.findById(testTaskId);
      expect(task).toBeNull();
    });

    it("should return 404 for non-existent task", async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      const response = await request(app)
        .delete(`/api/tasks/${nonExistentId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toContain("Task not found");
    });
  });
});
