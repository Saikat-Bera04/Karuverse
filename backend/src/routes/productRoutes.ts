import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct
} from "../controllers/productController";
import { authorize, protect } from "../middleware/auth";

const router = Router();

router.route("/").get(getProducts).post(protect, authorize("artisan", "admin"), createProduct);
router
  .route("/:id")
  .get(getProduct)
  .put(protect, authorize("artisan", "admin"), updateProduct)
  .delete(protect, authorize("artisan", "admin"), deleteProduct);

export default router;
