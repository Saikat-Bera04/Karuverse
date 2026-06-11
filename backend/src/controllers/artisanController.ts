import ArtisanProfile from "../models/ArtisanProfile";
import User from "../models/User";
import { ApiError } from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler";

export const createProfile = asyncHandler(async (req, res) => {
  if (!req.user) throw new ApiError(401, "Authentication required");

  // Upgrade user role to artisan when creating profile
  await User.updateOne({ _id: req.user._id }, { role: "artisan" });
  req.user.role = "artisan";

  const profile = await ArtisanProfile.findOneAndUpdate(
    { user: req.user._id },
    { ...req.body, user: req.user._id },
    { new: true, upsert: true, runValidators: true }
  ).populate("user", "name profileImage village district bio walletAddress");

  res.status(201).json({ success: true, profile });
});

export const getArtisan = asyncHandler(async (req, res) => {
  const profile = await ArtisanProfile.findOne({ user: req.params.id }).populate(
    "user",
    "name profileImage village district bio walletAddress"
  );

  if (!profile) {
    throw new ApiError(404, "Artisan profile not found");
  }

  res.json({ success: true, profile });
});

export const getArtisans = asyncHandler(async (req, res) => {
  const { craftType, district, rating } = req.query;
  const profileQuery: Record<string, unknown> = {};
  const userQuery: Record<string, unknown> = { role: "artisan" };

  if (craftType) profileQuery.craftType = craftType;
  if (rating) profileQuery.rating = { $gte: Number(rating) };
  if (district) userQuery.district = district;

  const artisanUsers = await User.find(userQuery).select("_id");
  profileQuery.user = { $in: artisanUsers.map((user) => user._id) };

  const artisans = await ArtisanProfile.find(profileQuery)
    .populate("user", "name profileImage village district bio walletAddress")
    .sort({ rating: -1, totalSales: -1 });

  res.json({ success: true, count: artisans.length, artisans });
});
