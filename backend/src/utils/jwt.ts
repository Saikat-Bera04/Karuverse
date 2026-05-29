import jwt from "jsonwebtoken";
import type { StringValue } from "ms";
import type { IUser } from "../models/User";

export const signToken = (user: IUser) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      walletAddress: user.walletAddress
    },
    process.env.JWT_SECRET,
    { expiresIn: (process.env.JWT_EXPIRE || "7d") as StringValue }
  );
};
