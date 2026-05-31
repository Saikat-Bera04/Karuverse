import { Router } from "express";
import { login, me, register, walletConnect, googleLogin } from "../controllers/authController";
import { protect } from "../middleware/auth";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/wallet-connect", walletConnect);
router.post("/google-login", googleLogin);
router.get("/me", protect, me);

export default router;
