import { Router } from "express";
import rateLimit from "express-rate-limit";
import {
  generateDescription,
  priceSuggestion,
  storyGenerator,
  translate
} from "../controllers/aiController";
import { protect } from "../middleware/auth";

const router = Router();
const aiRateLimitWindowMs = Number(process.env.AI_RATE_LIMIT_WINDOW_MS) || 60 * 1000;
const aiRateLimitMax = Number(process.env.AI_RATE_LIMIT_MAX) || 6;

router.use(protect);
router.use(
  rateLimit({
    windowMs: aiRateLimitWindowMs,
    max: aiRateLimitMax,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      message: "AI request rate limit reached. Please wait a moment and try again."
    }
  })
);

router.post("/generate-description", generateDescription);
router.post("/story-generator", storyGenerator);
router.post("/translate", translate);
router.post("/price-suggestion", priceSuggestion);

export default router;
