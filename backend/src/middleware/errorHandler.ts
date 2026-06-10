import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/apiError";

export const notFound = (req: Request, _res: Response, next: NextFunction) => {
  next(new ApiError(404, `Route not found: ${req.originalUrl}`));
};

export const errorHandler = (
  error: Error & { statusCode?: number; code?: number },
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const isDuplicateKeyError = error.code === 11000;
  const statusCode = isDuplicateKeyError
    ? 409
    : error.statusCode || (error instanceof ApiError ? error.statusCode : 500);

  res.status(statusCode).json({
    success: false,
    message: isDuplicateKeyError
      ? "A record with this unique value already exists"
      : error.message || "Internal server error",
    stack: process.env.NODE_ENV === "production" ? undefined : error.stack
  });
};
