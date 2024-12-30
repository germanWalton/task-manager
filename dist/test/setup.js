"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: ".env.test" });
process.env.JWT_SECRET = process.env.JWT_SECRET || "test-jwt-secret";
process.env.MONGODB_TEST_URI =
    process.env.MONGODB_TEST_URI || "mongodb://localhost:3000/task-manager-test";
beforeAll(() => { });
afterAll(() => { });
beforeEach(() => {
    jest.clearAllMocks();
});
