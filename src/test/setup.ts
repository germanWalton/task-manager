import dotenv from "dotenv";

dotenv.config({ path: ".env.test" });

process.env.JWT_SECRET = process.env.JWT_SECRET || "test-jwt-secret";
process.env.MONGODB_TEST_URI =
  process.env.MONGODB_TEST_URI || "mongodb://localhost:3000/task-manager-test";

beforeAll(() => {});

afterAll(() => {});

beforeEach(() => {
  jest.clearAllMocks();
});
