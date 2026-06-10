import Workshop from "../models/Workshop";
import { createLivekitRoomName, createLivekitToken } from "../services/livekitService";
import { ApiError } from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler";

export const createWorkshop = asyncHandler(async (req, res) => {
  if (!req.user) throw new ApiError(401, "Authentication required");

  let workshop = await Workshop.create({
    ...req.body,
    artisan: req.body.artisan || req.user._id,
    livekitRoomName: req.body.livekitRoomName || createLivekitRoomName(req.body.title)
  });

  workshop = await workshop.populate("artisan", "name district village profileImage walletAddress");

  res.status(201).json({ success: true, workshop });
});

export const joinWorkshop = asyncHandler(async (req, res) => {
  if (!req.user) throw new ApiError(401, "Authentication required");
  const workshopId = req.params.id || req.body.workshopId;

  const workshop = await Workshop.findByIdAndUpdate(
    workshopId,
    { $addToSet: { attendees: req.user._id } },
    { new: true }
  ).populate("artisan", "name district village profileImage walletAddress");

  if (!workshop) throw new ApiError(404, "Workshop not found");

  const roomName = workshop.livekitRoomName || createLivekitRoomName(workshop.title);
  if (!workshop.livekitRoomName) {
    workshop.livekitRoomName = roomName;
    await workshop.save();
  }

  const isCreator = workshop.artisan && (workshop.artisan._id?.toString() === req.user._id.toString() || workshop.artisan.toString() === req.user._id.toString());
  const token = await createLivekitToken({
    roomName,
    identity: req.user._id.toString(),
    name: req.user.name,
    canPublish: req.user.role === "artisan" || req.user.role === "admin" || isCreator
  });

  res.json({
    success: true,
    workshop,
    livekit: {
      url: process.env.LIVEKIT_URL,
      roomName,
      token
    }
  });
});

export const getLiveWorkshops = asyncHandler(async (_req, res) => {
  const now = new Date();

  // Find workshops that haven't ended yet
  const workshops = await Workshop.find({
    $or: [{ endTime: { $gt: now } }, { endTime: { $exists: false } }, { endTime: null }]
  })
    .populate("artisan", "name district village profileImage walletAddress")
    .sort({ startTime: 1 });

  res.json({ success: true, count: workshops.length, workshops });
});
