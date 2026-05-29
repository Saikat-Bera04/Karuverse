import Workshop from "../models/Workshop";
import { ApiError } from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler";

export const createWorkshop = asyncHandler(async (req, res) => {
  if (!req.user) throw new ApiError(401, "Authentication required");

  const workshop = await Workshop.create({
    ...req.body,
    artisan: req.body.artisan || req.user._id
  });

  res.status(201).json({ success: true, workshop });
});

export const joinWorkshop = asyncHandler(async (req, res) => {
  if (!req.user) throw new ApiError(401, "Authentication required");
  const { workshopId } = req.body;

  const workshop = await Workshop.findByIdAndUpdate(
    workshopId,
    { $addToSet: { attendees: req.user._id } },
    { new: true }
  );

  if (!workshop) throw new ApiError(404, "Workshop not found");

  res.json({ success: true, workshop });
});

export const getLiveWorkshops = asyncHandler(async (_req, res) => {
  const now = new Date();
  const soon = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const workshops = await Workshop.find({ startTime: { $gte: now, $lte: soon } })
    .populate("artisan", "name district village profileImage")
    .sort({ startTime: 1 });

  res.json({ success: true, count: workshops.length, workshops });
});
