import Product from "../models/Product";
import { ApiError } from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler";

export const createProduct = asyncHandler(async (req, res) => {
  if (!req.user) throw new ApiError(401, "Authentication required");

  const product = await Product.create({
    ...req.body,
    artisan: req.body.artisan || req.user._id
  });

  res.status(201).json({ success: true, product });
});

export const getProducts = asyncHandler(async (req, res) => {
  const { category, minPrice, maxPrice, verified, district } = req.query;
  const query: Record<string, unknown> = {};

  if (category) query.category = category;
  if (district) query.district = district;
  if (verified !== undefined) query.isVerified = verified === "true";
  if (minPrice || maxPrice) {
    query.price = {
      ...(minPrice ? { $gte: Number(minPrice) } : {}),
      ...(maxPrice ? { $lte: Number(maxPrice) } : {})
    };
  }

  const products = await Product.find(query).populate("artisan", "name district village walletAddress");
  res.json({ success: true, count: products.length, products });
});

export const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate(
    "artisan",
    "name district village walletAddress bio profileImage"
  );

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  res.json({ success: true, product });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  res.json({ success: true, product });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  res.json({ success: true, message: "Product deleted" });
});
