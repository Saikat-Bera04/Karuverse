import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    artisan: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    aiGeneratedStory: String,
    category: { type: String, required: true, index: true },
    images: [String],
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, default: 1, min: 0 },
    nftTokenId: String,
    isVerified: { type: Boolean, default: false },
    district: String,
    craftType: String,
    seoTags: [String]
  },
  { timestamps: true }
);

export default mongoose.model("Product", ProductSchema);
