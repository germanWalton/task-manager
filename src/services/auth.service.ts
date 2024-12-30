import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AuthResponseDTO, LoginUserDTO, RegisterUserDTO } from "../dto/auth.dto";
import { User } from "../models/user.model";
import { AppError } from "../utils/error.handler";
import logger from "../utils/logger";

export class AuthService {
  private readonly JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
  private readonly SALT_ROUNDS = 10;

  async register(registerDTO: RegisterUserDTO): Promise<AuthResponseDTO> {
    try {
      logger.info("Starting user registration process", { email: registerDTO.email });
      const existingUser = await User.findOne({ email: registerDTO.email });
      if (existingUser) {
        logger.warn("Registration attempt with existing email", { email: registerDTO.email });
        throw new AppError("Email already registered", 400);
      }

      const hashedPassword = await this.hashPassword(registerDTO.password);

      const user = await User.create({
        email: registerDTO.email,
        password: hashedPassword,
      });

      const token = this.generateToken(user._id);

      logger.info("User registered successfully", { userId: user._id });

      return {
        token,
        user: {
          id: user._id,
          email: user.email,
        },
      };
    } catch (error) {
      logger.error("Error in user registration", {
        email: registerDTO.email,
        error: error instanceof Error ? error.message : "Unknown error",
      });

      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError("Failed to register user", 500);
    }
  }

  async login(loginDTO: LoginUserDTO): Promise<AuthResponseDTO> {
    try {
      logger.info("Attempting user login", { email: loginDTO.email });
      const user = await User.findOne({ email: loginDTO.email });
      if (!user) {
        logger.warn("Login attempt with non-existent email", { email: loginDTO.email });
        throw new AppError("Invalid credentials", 401);
      }

      const isPasswordValid = await this.comparePasswords(loginDTO.password, user.password);

      if (!isPasswordValid) {
        logger.warn("Invalid password attempt", { email: loginDTO.email });
        throw new AppError("Invalid credentials", 401);
      }

      const token = this.generateToken(user._id);

      logger.info("User logged in successfully", { userId: user._id });

      return {
        token,
        user: {
          id: user._id,
          email: user.email,
        },
      };
    } catch (error) {
      logger.error("Error in user login", {
        email: loginDTO.email,
        error: error instanceof Error ? error.message : "Unknown error",
      });

      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError("Failed to login", 500);
    }
  }

  private async hashPassword(password: string): Promise<string> {
    try {
      return await bcrypt.hash(password, this.SALT_ROUNDS);
    } catch (error) {
      logger.error("Error hashing password", {
        error: error instanceof Error ? error.message : "Unknown error",
      });
      throw new AppError("Error processing password", 500);
    }
  }

  private async comparePasswords(
    candidatePassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    try {
      return await bcrypt.compare(candidatePassword, hashedPassword);
    } catch (error) {
      logger.error("Error comparing passwords", {
        error: error instanceof Error ? error.message : "Unknown error",
      });
      throw new AppError("Error validating password", 500);
    }
  }

  private generateToken(userId: string): string {
    try {
      return jwt.sign({ userId }, this.JWT_SECRET, { expiresIn: "60m" });
    } catch (error) {
      logger.error("Error generating JWT token", {
        userId,
        error: error instanceof Error ? error.message : "Unknown error",
      });
      throw new AppError("Error generating authentication token", 500);
    }
  }
}
