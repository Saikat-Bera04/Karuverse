import { Router } from "express";
import { getMetadata, mintNft, verifyNft } from "../controllers/nftController";
import { protect } from "../middleware/auth";

const router = Router();

router.post("/mint", protect, mintNft);
router.get("/verify/:tokenId", verifyNft);
router.get("/metadata/:tokenId", getMetadata);

export default router;
