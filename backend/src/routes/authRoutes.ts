import { Router } from "express";
import { login, me, register, walletConnect, getProfile, updateProfile } from "../controllers/authController";
import { protect } from "../middleware/auth";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/wallet-connect", walletConnect);
router.get("/me", protect, me);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

export default router;
