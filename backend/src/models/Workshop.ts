import mongoose from "mongoose";

const WorkshopSchema = new mongoose.Schema(
  {
    artisan: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    meetingLink: String,
    thumbnail: String,
    startTime: { type: Date, required: true, index: true },
    ticketPrice: { type: Number, default: 0 },
    attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
  },
  { timestamps: true }
);

export default mongoose.model("Workshop", WorkshopSchema);
