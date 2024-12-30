import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/error.handler";
import { IUser } from "../interfaces/user.interface";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return next(new AppError("No token provided", 401));
  }

  try {
    if (!process.env.JWT_SECRET) {
      throw new AppError("JWT_SECRET is not defined", 500);
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as IUser;
    req.user = decoded;
    next();
  } catch (error) {
    return next(new AppError("Invalid token", 401));
  }
};
