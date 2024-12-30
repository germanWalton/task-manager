import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/error.handler";
import { Error as MongooseError } from "mongoose";
import logger from "../utils/logger";

export const errorHandler = (
  err: Error | AppError | MongooseError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  logger.error("Error occurred:", err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  if (err instanceof MongooseError.CastError) {
    return res.status(400).json({
      status: "fail",
      message: "Invalid ID format",
    });
  }

  if (err instanceof MongooseError.ValidationError) {
    return res.status(400).json({
      status: "fail",
      message: "Validation error",
      errors: Object.values(err.errors).map((error) => error.message),
    });
  }

  return res.status(500).json({
    status: "error",
    message: "Internal server error",
  });
};
