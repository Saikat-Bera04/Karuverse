import mongoose from "mongoose";

const ArtisanProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    craftType: { type: String, required: true },
    experience: Number,
    languages: [String],
    socialLinks: {
      instagram: String,
      youtube: String,
      website: String
    },
    verificationStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending"
    },
    totalSales: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    workshopCount: { type: Number, default: 0 },
    rating: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model("ArtisanProfile", ArtisanProfileSchema);
