# Task Manager API

A robust RESTful API for managing tasks with user authentication built with Node.js, Express, TypeScript, and MongoDB.

## Live Demo

API URL: `https://task-manager-94m3.onrender.com`  
API Documentation: `https://task-manager-94m3.onrender.com/api-docs`

## Features

- User authentication (register/login) with JWT
- CRUD operations for tasks
- Task filtering by completion status
- Input validation
- Error handling
- Swagger documentation
- Logging system
- Testing suite (unit and integration tests)
- TypeScript for type safety
- MongoDB integration

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- TypeScript
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/germanWalton/task-manager.git
cd task-manager
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
PORT=8080
MONGODB_URI=your_mongodb_uri
MONGODB_TEST_URI=your_test_mongodb_uri
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

4. Build the project:
```bash
npm run build
```

5. Start the server:
```bash
npm start
```

For development with hot-reload:
```bash
npm run dev
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/validate` - Validate JWT token

### Tasks

- `POST /api/tasks` - Create a new task
- `GET /api/tasks` - Get all tasks (with optional completion filter)
- `GET /api/tasks/:id` - Get task by ID
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

## Request Examples

### Register User
```json
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Login User
```json
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Create Task
```json
POST /api/tasks
Authorization: Bearer <your_token>
{
  "title": "Complete project",
  "description": "Finish the task manager project"
}
```

## Testing

The project includes both unit and integration tests. To run the tests:

```bash
# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run integration tests only
npm run test:integration

# Run tests with coverage
npm run test:coverage
```

## Project Structure

```
src/
├── app.ts              # Express app configuration
├── config/            # Configuration files
├── controllers/       # Route controllers
├── dto/              # Data Transfer Objects
├── interfaces/       # TypeScript interfaces
├── middleware/       # Express middlewares
├── models/          # MongoDB models
├── routes/          # API routes
├── services/        # Business logic
└── utils/           # Utility functions
```

## Error Handling

The API implements a centralized error handling system with custom error classes and middleware. Errors are properly logged and formatted before being sent to the client.

## Validation

Input validation is implemented using express-validator with custom middleware for:
- User registration and login
- Task creation and updates
- MongoDB ID validation
- Request query parameters

## Logging

The application uses Winston for logging with different levels:
- Error logs are stored in `error.log`
- Combined logs are stored in `combined.log`
- Console logging in development environment

## Security Features

- Password hashing using bcrypt
- JWT authentication
- CORS enabled
- Input validation and sanitization
- Secure error messages
- TypeScript for type safety

## Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start development server with hot-reload
- `npm run build` - Build the TypeScript project
- `npm test` - Run all tests
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

ISC License - see the [LICENSE](LICENSE) file for details

## Author

German Walton

## Support

For support, email support@taskmanager.com or create an issue in the repository.
