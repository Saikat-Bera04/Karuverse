import { Router } from "express";
import { createPaymentOrder, verifyPayment } from "../controllers/paymentController";
import { protect } from "../middleware/auth";

const router = Router();

router.post("/create-order", protect, createPaymentOrder);
router.post("/verify", protect, verifyPayment);

export default router;
