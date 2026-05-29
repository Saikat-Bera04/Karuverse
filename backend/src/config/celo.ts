import { ethers } from "ethers";

export const provider = new ethers.JsonRpcProvider(
  process.env.CELO_RPC_URL || "https://forno.celo-sepolia.celo-testnet.org",
  Number(process.env.CELO_CHAIN_ID || 11142220)
);

export const getWallet = () => {
  if (!process.env.PRIVATE_KEY) {
    throw new Error("PRIVATE_KEY is not configured");
  }

  return new ethers.Wallet(process.env.PRIVATE_KEY, provider);
};
