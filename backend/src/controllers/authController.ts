import User from "../models/User";
import { ApiError } from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler";
import { signToken } from "../utils/jwt";

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, bio, village, district } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, "Name, email, and password are required");
  }

  const user = await User.create({ name, email, password, role, bio, village, district });
  const token = signToken(user);

  res.status(201).json({ success: true, token, user });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, "Invalid credentials");
  }

  const token = signToken(user);
  res.json({ success: true, token, user });
});

export const walletConnect = asyncHandler(async (req, res) => {
  const { walletAddress, name, role } = req.body;

  if (!walletAddress) {
    throw new ApiError(400, "walletAddress is required");
  }

  const normalizedWallet = walletAddress.toLowerCase();
  const header = req.headers.authorization;
  const bearerToken = header?.startsWith("Bearer ") ? header.split(" ")[1] : undefined;
  let authenticatedUserId: string | undefined;

  if (bearerToken && process.env.JWT_SECRET) {
    try {
      const decoded = (await import("jsonwebtoken")).default.verify(bearerToken, process.env.JWT_SECRET) as { id: string };
      authenticatedUserId = decoded.id;
    } catch {
      authenticatedUserId = undefined;
    }
  }

  const user = authenticatedUserId
    ? await User.findByIdAndUpdate(authenticatedUserId, { walletAddress: normalizedWallet }, { new: true })
    : await User.findOneAndUpdate(
        { walletAddress: normalizedWallet },
        {
          $setOnInsert: {
            name: name || `Creator ${normalizedWallet.slice(0, 6)}`,
            role: role || "buyer"
          },
          walletAddress: normalizedWallet
        },
        { new: true, upsert: true }
      );

  if (!user) throw new ApiError(404, "User not found");

  const newToken = signToken(user);
  res.json({ success: true, token: newToken, user });
});
export const me = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user });
});
