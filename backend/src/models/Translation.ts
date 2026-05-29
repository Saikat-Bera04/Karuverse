import mongoose from "mongoose";

const TranslationSchema = new mongoose.Schema(
  {
    originalText: { type: String, required: true },
    translatedText: { type: String, required: true },
    language: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.model("Translation", TranslationSchema);
