import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { registerValidation, loginValidation } from "../middleware/validation.middleware";
import { authenticateToken } from "../middleware/auth.middleware";
import { asyncWrapper } from "../utils/async.wrapper";

const router = Router();
const authController = new AuthController();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterUserDto'
 *     responses:
 *       201:
 *         description: User registered successfully
 */
router.post(
  "/register",
  registerValidation,
  asyncWrapper(authController.register.bind(authController))
);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginUserDto'
 *     responses:
 *       200:
 *         description: User logged in successfully
 */
router.post("/login", loginValidation, asyncWrapper(authController.login.bind(authController)));

/**
 * @swagger
 * /api/auth/validate:
 *   get:
 *     summary: Validate JWT token
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token is valid
 *       401:
 *         description: Invalid or expired token
 */
router.get(
  "/validate",
  authenticateToken,
  asyncWrapper(authController.validateToken.bind(authController))
);

export default router;
