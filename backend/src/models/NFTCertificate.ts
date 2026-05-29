import mongoose from "mongoose";

const NFTCertificateSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true, unique: true },
    tokenId: { type: String, required: true, unique: true },
    contractAddress: { type: String, required: true },
    metadataUrl: { type: String, required: true },
    ownerWallet: { type: String, required: true, lowercase: true },
    transactionHash: String,
    mintedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export default mongoose.model("NFTCertificate", NFTCertificateSchema);
