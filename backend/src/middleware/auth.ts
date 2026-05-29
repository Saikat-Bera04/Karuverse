import type { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { ApiError } from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler";

type JwtPayload = {
  id: string;
};

export const protect = asyncHandler(async (req, _res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.split(" ")[1] : undefined;

  if (!token) {
    throw new ApiError(401, "Authentication token is required");
  }

  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
  const user = await User.findById(decoded.id);

  if (!user) {
    throw new ApiError(401, "User no longer exists");
  }

  req.user = user;
  next();
});

export const authorize =
  (...roles: string[]) =>
  (req: Express.Request, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new ApiError(403, "You do not have permission to access this resource");
    }

    next();
  };
