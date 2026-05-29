import User from "../models/User";
import { ApiError } from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler";
import { signToken } from "../utils/jwt";

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, "Name, email, and password are required");
  }

  const user = await User.create({ name, email, password, role });
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
  const user = await User.findOneAndUpdate(
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

  const token = signToken(user);
  res.json({ success: true, token, user });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user });
});
