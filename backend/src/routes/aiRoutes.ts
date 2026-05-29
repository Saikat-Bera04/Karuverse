import { Router } from "express";
import {
  generateDescription,
  priceSuggestion,
  storyGenerator,
  translate
} from "../controllers/aiController";
import { protect } from "../middleware/auth";

const router = Router();

router.post("/generate-description", protect, generateDescription);
router.post("/story-generator", protect, storyGenerator);
router.post("/translate", protect, translate);
router.post("/price-suggestion", protect, priceSuggestion);

export default router;
