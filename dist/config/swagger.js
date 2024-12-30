"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.specs = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Task Manager API",
            version: "1.0.0",
            description: "A simple task manager API",
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
            schemas: {
                CreateTaskDto: {
                    type: "object",
                    properties: {
                        title: {
                            type: "string",
                            description: "The title of the task",
                            example: "My new task",
                        },
                        description: {
                            type: "string",
                            description: "A brief description of the task",
                            example: "This task is about...",
                        },
                    },
                    required: ["title"],
                },
                UpdateTaskDto: {
                    type: "object",
                    properties: {
                        title: {
                            type: "string",
                            description: "The title of the task",
                            example: "My new task",
                        },
                        description: {
                            type: "string",
                            description: "A brief description of the task",
                            example: "This task is about...",
                        },
                        completed: {
                            type: "boolean",
                            description: "Mark a task as completed",
                            example: "true or false",
                        },
                    },
                    required: [],
                },
                RegisterUserDto: {
                    type: "object",
                    properties: {
                        email: {
                            type: "string",
                            description: "The email of the user",
                            example: "example@example.com",
                        },
                        password: {
                            type: "string",
                            description: "The password of the user",
                            example: "example123",
                        },
                    },
                    required: ["email", "password"],
                },
                LoginUserDto: {
                    type: "object",
                    properties: {
                        email: {
                            type: "string",
                            description: "The email of the user",
                            example: "example@example.com",
                        },
                        password: {
                            type: "string",
                            description: "The password of the user",
                            example: "example123",
                        },
                    },
                    required: ["email", "password"],
                },
            },
        },
    },
    apis: ["./src/routes/*.ts"],
};
exports.specs = (0, swagger_jsdoc_1.default)(options);