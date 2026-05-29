import { Router } from "express";
import {
  createWorkshop,
  getLiveWorkshops,
  joinWorkshop
} from "../controllers/workshopController";
import { authorize, protect } from "../middleware/auth";

const router = Router();

router.post("/", protect, authorize("artisan", "admin"), createWorkshop);
router.post("/join", protect, joinWorkshop);
router.get("/live", getLiveWorkshops);

export default router;
