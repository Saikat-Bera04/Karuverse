import NFTCertificate from "../models/NFTCertificate";
import Product from "../models/Product";
import { getNftContract, mintCertificate } from "../services/nftService";
import { uploadJsonToPinata } from "../services/ipfsService";
import { ApiError } from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler";

export const mintNft = asyncHandler(async (req, res) => {
  const { productId, walletAddress } = req.body;
  const product = await Product.findById(productId).populate("artisan", "name district village");

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const artisan = product.artisan as unknown as {
    name?: string;
    district?: string;
    village?: string;
  };

  const metadataUrl = await uploadJsonToPinata({
    name: product.title,
    description: product.description,
    image: product.images?.[0],
    artisan: artisan.name,
    district: product.district || artisan.district,
    village: artisan.village,
    craftType: product.craftType || product.category
  });

  const mint = await mintCertificate({
    to: walletAddress,
    metadataUri: metadataUrl,
    artisanName: artisan.name || "KaruVerse Artisan",
    craftType: product.craftType || product.category
  });

  const certificate = await NFTCertificate.create({
    product: product._id,
    tokenId: mint.tokenId,
    contractAddress: process.env.NFT_CONTRACT_ADDRESS,
    metadataUrl,
    ownerWallet: walletAddress,
    transactionHash: mint.transactionHash
  });

  product.nftTokenId = mint.tokenId;
  product.nftTransactionHash = mint.transactionHash;
  product.nftMetadataUrl = metadataUrl;
  product.isVerified = true;
  await product.save();

  res.status(201).json({ success: true, certificate, tokenId: mint.tokenId, txHash: mint.transactionHash });
});

export const verifyNft = asyncHandler(async (req, res) => {
  const certificate = await NFTCertificate.findOne({ tokenId: req.params.tokenId }).populate({
    path: "product",
    populate: { path: "artisan", select: "name district village walletAddress" }
  });
  if (!certificate) throw new ApiError(404, "Certificate not found");

  const contract = getNftContract();
  const owner = await contract.ownerOf(req.params.tokenId);

  res.json({
    success: true,
    verified: owner.toLowerCase() === certificate.ownerWallet.toLowerCase(),
    owner,
    artisan: (certificate.product as unknown as { artisan?: { name?: string } })?.artisan?.name,
    mintedAt: certificate.mintedAt,
    certificate
  });
});

export const getMetadata = asyncHandler(async (req, res) => {
  const certificate = await NFTCertificate.findOne({ tokenId: req.params.tokenId });
  if (!certificate) throw new ApiError(404, "Certificate not found");

  res.json({ success: true, metadataUrl: certificate.metadataUrl, certificate });
});
