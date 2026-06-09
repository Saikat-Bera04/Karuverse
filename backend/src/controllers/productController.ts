import NFTCertificate from "../models/NFTCertificate";
import Product from "../models/Product";
import { generateStory, suggestPrice } from "../services/aiService";
import { uploadFileToPinata, uploadJsonToPinata } from "../services/ipfsService";
import { mintCertificate } from "../services/nftService";
import { ApiError } from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler";

const toBoolean = (value: unknown, defaultValue = false) => {
  if (value === undefined || value === null || value === "") return defaultValue;
  if (typeof value === "boolean") return value;
  return String(value).toLowerCase() === "true";
};

const toStringArray = (value: unknown) => {
  if (Array.isArray(value)) return value.map(String);
  if (!value) return [];
  try {
    const parsed = JSON.parse(String(value));
    return Array.isArray(parsed) ? parsed.map(String) : [String(value)];
  } catch {
    return String(value)
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
};

export const createProduct = asyncHandler(async (req, res) => {
  if (!req.user) throw new ApiError(401, "Authentication required");

  const files = (req.files as Express.Multer.File[] | undefined) || [];
  const uploadedImages = await Promise.all(
    files.map((file) => uploadFileToPinata(file.buffer, file.originalname))
  );
  const uploadedGatewayUrls = uploadedImages.map((image) => image.gatewayUrl);
  const uploadedIpfsUris = uploadedImages.map((image) => image.ipfsUri);

  const materials = toStringArray(req.body.materials);
  const craftType = req.body.craftType || req.body.category;
  let description = req.body.description;
  let aiGeneratedStory = req.body.aiGeneratedStory || req.body.story;
  let price = Number(req.body.price || 0);
  let priceSuggestion: unknown;

  if (!description || toBoolean(req.body.generateStory, !description)) {
    aiGeneratedStory = await generateStory({
      title: req.body.title,
      artisanName: req.user.name,
      craftType,
      district: req.body.district || req.user.district,
      village: req.body.village || req.user.village || req.body.notes
    });
    description = aiGeneratedStory;
  }

  if ((!price || price <= 0) && req.body.hoursWorked && materials.length) {
    const suggestionText = await suggestPrice({
      materials,
      hoursWorked: Number(req.body.hoursWorked),
      category: craftType,
      baseCurrency: req.body.currency || "INR"
    });
    priceSuggestion = JSON.parse(suggestionText);
    price = Number((priceSuggestion as { recommendedPrice?: number }).recommendedPrice || 0);
  }

  if (!req.body.title || !craftType || !description || !price) {
    throw new ApiError(400, "title, craftType/category, description/story, and price are required");
  }

  const product = await Product.create({
    title: req.body.title,
    description,
    aiGeneratedStory,
    category: req.body.category || craftType,
    craftType,
    materials,
    hoursWorked: req.body.hoursWorked ? Number(req.body.hoursWorked) : undefined,
    district: req.body.district || req.user.district,
    price,
    currency: req.body.currency || "INR",
    celoPrice: req.body.celoPrice ? Number(req.body.celoPrice) : undefined,
    stock: req.body.stock ? Number(req.body.stock) : 1,
    images: [...toStringArray(req.body.images), ...uploadedGatewayUrls],
    artisan: req.body.artisan || req.user._id
  });

  let certificate;
  const mintOnCreate = toBoolean(req.body.mintOnCreate, false);
  const mintTo = req.body.walletAddress || req.user.walletAddress;

  if (mintOnCreate && mintTo) {
    const metadataUrl = await uploadJsonToPinata({
      name: product.title,
      description: product.description,
      image: uploadedIpfsUris[0] || product.images?.[0],
      artisan: req.user.name,
      district: product.district || req.user.district,
      craftType: product.craftType || product.category
    });

    const mint = await mintCertificate({
      to: mintTo,
      metadataUri: metadataUrl,
      artisanName: req.user.name,
      craftType: product.craftType || product.category
    });

    certificate = await NFTCertificate.create({
      product: product._id,
      tokenId: mint.tokenId,
      contractAddress: process.env.NFT_CONTRACT_ADDRESS,
      metadataUrl,
      ownerWallet: mintTo,
      transactionHash: mint.transactionHash
    });

    product.nftTokenId = mint.tokenId;
    product.nftTransactionHash = mint.transactionHash;
    product.nftMetadataUrl = metadataUrl;
    product.isVerified = true;
    await product.save();
  }

  res.status(201).json({ success: true, product, certificate, priceSuggestion });
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
