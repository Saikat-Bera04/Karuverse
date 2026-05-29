import AILog from "../models/AILog";
import Translation from "../models/Translation";
import {
  generateProductDescription,
  generateStory,
  suggestPrice,
  translateText
} from "../services/aiService";
import { asyncHandler } from "../utils/asyncHandler";

export const generateDescription = asyncHandler(async (req, res) => {
  const response = await generateProductDescription(req.body);
  await AILog.create({
    artisan: req.user?._id,
    prompt: JSON.stringify(req.body),
    response,
    type: "description"
  });

  res.json({ success: true, description: response });
});

export const storyGenerator = asyncHandler(async (req, res) => {
  const response = await generateStory(req.body);
  await AILog.create({
    artisan: req.user?._id,
    prompt: JSON.stringify(req.body),
    response,
    type: "story"
  });

  res.json({ success: true, story: response });
});

export const translate = asyncHandler(async (req, res) => {
  const { text, language } = req.body;
  const translatedText = await translateText(text, language);
  const translation = await Translation.create({ originalText: text, translatedText, language });

  await AILog.create({
    artisan: req.user?._id,
    prompt: JSON.stringify(req.body),
    response: translatedText,
    type: "translation"
  });

  res.json({ success: true, translation });
});

export const priceSuggestion = asyncHandler(async (req, res) => {
  const response = await suggestPrice(req.body);
  await AILog.create({
    artisan: req.user?._id,
    prompt: JSON.stringify(req.body),
    response,
    type: "price"
  });

  res.json({ success: true, suggestion: JSON.parse(response) });
});
