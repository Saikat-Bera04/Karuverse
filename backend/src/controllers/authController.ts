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
  const createWalletUser = async () => {
    try {
      return await User.findOneAndUpdate(
        { walletAddress: normalizedWallet },
        {
          $set: { walletAddress: normalizedWallet },
          $setOnInsert: {
            name: name || `Creator ${normalizedWallet.slice(0, 6)}`,
            role: role || "buyer"
          }
        },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );
    } catch (error: any) {
      if (error?.code !== 11000) throw error;
      return User.findOne({ walletAddress: normalizedWallet });
    }
  };
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

  let user;

  if (authenticatedUserId) {
    user = await User.findById(authenticatedUserId);
    if (!user) throw new ApiError(404, "User not found");

    const walletOwner = await User.findOne({ walletAddress: normalizedWallet });
    const walletBelongsToAnotherUser =
      walletOwner && String(walletOwner._id) !== String(user._id);

    if (walletBelongsToAnotherUser) {
      const isWalletOnlyAccount = !walletOwner.email && !walletOwner.password;

      if (!isWalletOnlyAccount) {
        throw new ApiError(409, "This wallet is already linked to another account");
      }

      await User.updateOne({ _id: walletOwner._id }, { $unset: { walletAddress: "" } });
    }

    user.walletAddress = normalizedWallet;
    await user.save();
  } else {
    user = await createWalletUser();
  }

  if (!user) throw new ApiError(404, "User not found");

  const newToken = signToken(user);
  res.json({ success: true, token: newToken, user });
});
export const me = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user });
});

export const getProfile = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "Authentication required");
  }

  const Product = (await import("../models/Product")).default;
  const products = await Product.find({ artisan: req.user._id }).select(
    "title description price currency category craftType images isVerified nftTokenId createdAt"
  );

  const userProfile = {
    ...req.user.toObject(),
    products: products || []
  };

  res.json({ success: true, profile: userProfile });
});

export const updateProfile = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "Authentication required");
  }

  const { name, bio, village, district, role, profileImage } = req.body;

  const allowedUpdates: any = { name, bio, village, district, profileImage };
  
  // Allow users to upgrade to "artisan" role, but only admin can assign other roles
  if (role) {
    if (role === "artisan" || req.user.role === "admin") {
      allowedUpdates.role = role;
    } else {
      throw new ApiError(403, "You can only upgrade to artisan role");
    }
  }

  const updateObj = Object.fromEntries(
    Object.entries(allowedUpdates).filter(([, v]) => v !== undefined)
  );

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: updateObj },
    { new: true, runValidators: true }
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res.json({ success: true, user });
});
