import Workshop from "../models/Workshop";
import { createLivekitRoomName, createLivekitToken } from "../services/livekitService";
import { ApiError } from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler";

export const createWorkshop = asyncHandler(async (req, res) => {
  if (!req.user) throw new ApiError(401, "Authentication required");

  const workshop = await Workshop.create({
    ...req.body,
    artisan: req.body.artisan || req.user._id,
    livekitRoomName: req.body.livekitRoomName || createLivekitRoomName(req.body.title)
  });

  res.status(201).json({ success: true, workshop });
});

export const joinWorkshop = asyncHandler(async (req, res) => {
  if (!req.user) throw new ApiError(401, "Authentication required");
  const workshopId = req.params.id || req.body.workshopId;

  const workshop = await Workshop.findByIdAndUpdate(
    workshopId,
    { $addToSet: { attendees: req.user._id } },
    { new: true }
  );

  if (!workshop) throw new ApiError(404, "Workshop not found");

  const roomName = workshop.livekitRoomName || createLivekitRoomName(workshop.title);
  if (!workshop.livekitRoomName) {
    workshop.livekitRoomName = roomName;
    await workshop.save();
  }

  const token = createLivekitToken({
    roomName,
    identity: req.user._id.toString(),
    name: req.user.name,
    canPublish: req.user.role === "artisan" || req.user.role === "admin"
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
  const soon = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const workshops = await Workshop.find({ startTime: { $gte: now, $lte: soon } })
    .populate("artisan", "name district village profileImage")
    .sort({ startTime: 1 });

  res.json({ success: true, count: workshops.length, workshops });
});
