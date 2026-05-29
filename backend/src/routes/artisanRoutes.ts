import { Router } from "express";
import { createProfile, getArtisan, getArtisans } from "../controllers/artisanController";
import { authorize, protect } from "../middleware/auth";

const router = Router();

router.post("/profile", protect, authorize("artisan", "admin"), createProfile);
router.get("/", getArtisans);
router.get("/:id", getArtisan);

export default router;
