import { Router } from "express";
import multer from "multer";
import { protect } from "../middleware/auth";
import cloudinary from "../config/cloudinary";
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

    // Upload to Cloudinary using upload_stream
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const dataURI = "data:" + req.file.mimetype + ";base64," + b64;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "karuverse",
      resource_type: "auto"
    });

    res.json({
      success: true,
      secure_url: result.secure_url,
      public_id: result.public_id
    });
  })
);

export default router;
