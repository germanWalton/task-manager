import request from "supertest";
import mongoose from "mongoose";
import { app } from "../../app";
import { User } from "../../models/user.model";
import { AppError } from "../../utils/error.handler";
import bcrypt from "bcrypt";

describe("Auth Integration Tests", () => {
  beforeAll(async () => {
    const mongoUri = process.env.MONGODB_TEST_URI;
    if (!mongoUri) {
      throw new AppError(
        "MONGODB_TEST_URI is not defined. Please set it in your environment variables.",
        500
      );
    }
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe("POST /api/auth/register", () => {
    const validUser = {
      email: "test@example.com",
      password: "password123",
    };

    it("should register a new user successfully", async () => {
      const response = await request(app).post("/api/auth/register").send(validUser);

      expect(response.status).toBe(201);
      expect(response.body.data).toHaveProperty("token");
      expect(response.body.data.user).toHaveProperty("id");
      expect(response.body.data.user.email).toBe(validUser.email);

      const user = await User.findOne({ email: validUser.email });
      expect(user).toBeTruthy();
      expect(user!.email).toBe(validUser.email);

      const passwordMatch = await bcrypt.compare(validUser.password, user!.password);
      expect(passwordMatch).toBe(true);
    });

    it("should not register user with existing email", async () => {
      await User.create({
        email: validUser.email,
        password: await bcrypt.hash(validUser.password, 10),
      });

      const response = await request(app).post("/api/auth/register").send(validUser);

      expect(response.status).toBe(400);
      expect(response.body.message).toContain("Email already registered");
    });

    it("should validate email format", async () => {
      const response = await request(app).post("/api/auth/register").send({
        email: "invalid-email",
        password: "password123",
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain("Invalid email format");
    });

    it("should validate password length", async () => {
      const response = await request(app).post("/api/auth/register").send({
        email: "test@example.com",
        password: "12345",
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain("Password must be at least 6 characters long");
    });

    it("should require email field", async () => {
      const response = await request(app).post("/api/auth/register").send({
        password: "password123",
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain("Email is required");
    });

    it("should require password field", async () => {
      const response = await request(app).post("/api/auth/register").send({
        email: "test@example.com",
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain("Password is required");
    });
  });

  describe("POST /api/auth/login", () => {
    const testUser = {
      email: "test@example.com",
      password: "password123",
    };

    beforeEach(async () => {
      const hashedPassword = await bcrypt.hash(testUser.password, 10);
      await User.create({
        email: testUser.email,
        password: hashedPassword,
      });
    });

    it("should login successfully with valid credentials", async () => {
      const response = await request(app).post("/api/auth/login").send(testUser);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty("token");
      expect(response.body.data.user).toHaveProperty("id");
      expect(response.body.data.user.email).toBe(testUser.email);

      const token = response.body.data.token;
      const protectedResponse = await request(app)
        .get("/api/tasks")
        .set("Authorization", `Bearer ${token}`);
      expect(protectedResponse.status).toBe(200);
    });

    it("should not login with incorrect password", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: testUser.email,
        password: "wrongpassword",
      });

      expect(response.status).toBe(401);
      expect(response.body.message).toContain("Invalid credentials");
    });

    it("should not login with non-existent email", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: "nonexistent@example.com",
        password: testUser.password,
      });

      expect(response.status).toBe(401);
      expect(response.body.message).toContain("Invalid credentials");
    });

    it("should validate required fields", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: testUser.email,
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain("Password is required");
    });

    it("should validate email format", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: "invalid-email",
        password: testUser.password,
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain("Invalid email format");
    });

    it("should handle multiple login attempts", async () => {
      const firstResponse = await request(app).post("/api/auth/login").send(testUser);
      expect(firstResponse.status).toBe(200);

      const secondResponse = await request(app).post("/api/auth/login").send(testUser);
      expect(secondResponse.status).toBe(200);

      expect(firstResponse.body.data.token).not.toBe(secondResponse.body.data.token);
    });
  });

  describe("Auth Middleware", () => {
    it("should reject requests without token", async () => {
      const response = await request(app).get("/api/tasks");

      expect(response.status).toBe(401);
      expect(response.body.message).toContain("No token provided");
    });

    it("should reject requests with invalid token", async () => {
      const response = await request(app)
        .get("/api/tasks")
        .set("Authorization", "Bearer invalid-token");

      expect(response.status).toBe(401);
      expect(response.body.message).toContain("Invalid token");
    });

    it("should reject requests with malformed authorization header", async () => {
      const response = await request(app)
        .get("/api/tasks")
        .set("Authorization", "InvalidFormat token123");

      expect(response.status).toBe(401);
      expect(response.body.message).toContain("No token provided");
    });
  });
});
