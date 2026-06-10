import { Product } from "@/types/product";
import { ipfsToGateway } from "./api";

export function mapProduct(product: any): Product {
  const artisan =
    typeof product.artisan === "object" && product.artisan
      ? product.artisan.name
      : product.artisan || "Unknown Artisan";

  return {
    ...product,
    _id: product._id,
    id: product._id || product.id,
    title: product.title || product.name,
    name: product.title || product.name,
    category: product.category || product.craftType,
    craftType: product.craftType || product.category || "craft",
    district: product.district,
    region: product.district || product.region || "West Bengal",
    artisan,
    artisanWallet:
      typeof product.artisan === "object" && product.artisan ? product.artisan.walletAddress : undefined,
    price: Number(product.price || 0),
    currency: product.currency || "INR",
    celoPrice: product.celoPrice,
    description: product.description,
    desc: product.aiGeneratedStory || product.description || product.desc || "",
    nftTokenId: product.nftTokenId,
    nftTransactionHash: product.nftTransactionHash,
    nftMetadataUrl: product.nftMetadataUrl,
    nftVerified: Boolean(product.isVerified || product.nftVerified),
    isVerified: Boolean(product.isVerified || product.nftVerified),
    images: (product.images || []).map(ipfsToGateway)
  };
}
