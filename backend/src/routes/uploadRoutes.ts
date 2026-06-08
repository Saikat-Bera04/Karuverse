import { Router } from "express";
import multer from "multer";
import { protect } from "../middleware/auth";
import { uploadFileToPinata } from "../services/ipfsService";
import { ApiError } from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

// Memory storage for multer
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed"));
    }
  }
});

router.post(
  "/",
  protect,
  upload.single("image"),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      throw new ApiError(400, "No image provided");
    }

    const result = await uploadFileToPinata(req.file.buffer, req.file.originalname);

    res.json({
      success: true,
      secure_url: result.gatewayUrl,
      public_id: result.cid
    });
  })
);

export default router;
