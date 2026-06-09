import { Router } from "express";
import { getMyOrders, getOrder } from "../controllers/orderController";
import { protect } from "../middleware/auth";

const router = Router();

router.get("/", protect, getMyOrders);
router.get("/:id", protect, getOrder);

export default router;
