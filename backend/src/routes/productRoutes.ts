import { Router } from "express";
import multer from "multer";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct
} from "../controllers/productController";
import { authorize, protect } from "../middleware/auth";

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024, files: 6 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only images are allowed"));
  }
});

router
  .route("/")
  .get(getProducts)
  .post(protect, authorize("artisan", "admin"), upload.array("images", 6), createProduct);
router
  .route("/:id")
  .get(getProduct)
  .put(protect, authorize("artisan", "admin"), updateProduct)
  .delete(protect, authorize("artisan", "admin"), deleteProduct);

export default router;
