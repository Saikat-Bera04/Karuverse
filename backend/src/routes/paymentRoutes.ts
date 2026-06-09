import { Router } from "express";
import {
  createPaymentOrder,
  verifyCeloPayment,
  verifyPayment
} from "../controllers/paymentController";
import { protect } from "../middleware/auth";

const router = Router();

router.post("/create-order", protect, createPaymentOrder);
router.post("/verify", protect, verifyPayment);
router.post("/celo/verify", protect, verifyCeloPayment);

export default router;
