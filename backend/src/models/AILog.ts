import mongoose from "mongoose";

const AILogSchema = new mongoose.Schema(
  {
    artisan: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    prompt: { type: String, required: true },
    response: { type: String, required: true },
    type: {
      type: String,
      enum: ["description", "story", "translation", "price", "seo"],
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("AILog", AILogSchema);
