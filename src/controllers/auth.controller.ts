import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { LoginUserDTO, RegisterUserDTO } from "../dto/auth.dto";
import { AuthService } from "../services/auth.service";
import { AppError } from "../utils/error.handler";
import { formatValidationErrors } from "../utils/error.util";
import logger from "../utils/logger";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  async register(req: Request, res: Response): Promise<Response> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError("Validation failed: " + formatValidationErrors(errors), 400);
    }

    const registerDTO: RegisterUserDTO = {
      email: req.body.email,
      password: req.body.password,
    };

    const result = await this.authService.register(registerDTO);

    logger.info("Registration successful", {
      userId: result.user.id,
    });

    return res.status(201).json({
      status: "success",
      data: result,
    });
  }

  async login(req: Request, res: Response): Promise<Response> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError("Validation failed: " + formatValidationErrors(errors), 400);
    }

    const loginDTO: LoginUserDTO = {
      email: req.body.email,
      password: req.body.password,
    };

    const result = await this.authService.login(loginDTO);

    logger.info("Login successful", {
      userId: result.user.id,
    });

    return res.status(200).json({
      status: "success",
      data: result,
    });
  }

  async validateToken(req: Request, res: Response): Promise<Response> {
    console.log("req", req);
    return res.status(200).json({
      status: "success",
      data: {
        valid: true,
        user: {
          id: req.user?._id
        },
      },
    });
  }
}
