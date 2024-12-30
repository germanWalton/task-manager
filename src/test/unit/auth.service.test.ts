import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AuthService } from "../../services/auth.service";
import { User } from "../../models/user.model";
import { AppError } from "../../utils/error.handler";
import { RegisterUserDTO, LoginUserDTO } from "../../dto/auth.dto";

jest.mock("../../models/user.model");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");
jest.mock("../../utils/logger");

describe("AuthService", () => {
  let authService: AuthService;
  const mockUserId = "mockUserId123";
  const mockEmail = "test@example.com";
  const mockPassword = "password123";
  const mockHashedPassword = "hashedPassword123";
  const mockToken = "mockToken123";

  beforeEach(() => {
    authService = new AuthService();
    jest.clearAllMocks();
  });

  describe("register", () => {
    const registerDTO: RegisterUserDTO = {
      email: mockEmail,
      password: mockPassword,
    };

    it("should successfully register a new user", async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue(mockHashedPassword);
      (User.create as jest.Mock).mockResolvedValue({
        _id: mockUserId,
        email: mockEmail,
        password: mockHashedPassword,
      });
      (jwt.sign as jest.Mock).mockReturnValue(mockToken);

      const result = await authService.register(registerDTO);

      expect(result).toEqual({
        token: mockToken,
        user: {
          id: mockUserId,
          email: mockEmail,
        },
      });
      expect(User.findOne).toHaveBeenCalledWith({ email: mockEmail });
      expect(bcrypt.hash).toHaveBeenCalledWith(mockPassword, 10);
      expect(User.create).toHaveBeenCalledWith({
        email: mockEmail,
        password: mockHashedPassword,
      });
    });

    it("should throw error if email already exists", async () => {
      (User.findOne as jest.Mock).mockResolvedValue({ email: mockEmail });

      await expect(authService.register(registerDTO)).rejects.toThrow(
        new AppError("Email already registered", 400)
      );
    });
  });

  describe("login", () => {
    const loginDTO: LoginUserDTO = {
      email: mockEmail,
      password: mockPassword,
    };

    it("should successfully login a user", async () => {
      (User.findOne as jest.Mock).mockResolvedValue({
        _id: mockUserId,
        email: mockEmail,
        password: mockHashedPassword,
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue(mockToken);

      const result = await authService.login(loginDTO);

      expect(result).toEqual({
        token: mockToken,
        user: {
          id: mockUserId,
          email: mockEmail,
        },
      });
    });

    it("should throw error if user not found", async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);

      await expect(authService.login(loginDTO)).rejects.toThrow(
        new AppError("Invalid credentials", 401)
      );
    });

    it("should throw error if password is invalid", async () => {
      (User.findOne as jest.Mock).mockResolvedValue({
        _id: mockUserId,
        email: mockEmail,
        password: mockHashedPassword,
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(authService.login(loginDTO)).rejects.toThrow(
        new AppError("Invalid credentials", 401)
      );
    });
  });
});
