import { ethers } from "ethers";
import { getWallet } from "../config/celo";
import { artisanNftAbi } from "../blockchain/ArtisanNFT.abi";

export const getNftContract = () => {
  if (!process.env.NFT_CONTRACT_ADDRESS) {
    throw new Error("NFT_CONTRACT_ADDRESS is not configured");
  }

  return new ethers.Contract(process.env.NFT_CONTRACT_ADDRESS, artisanNftAbi, getWallet());
};

export const mintCertificate = async (input: {
  to: string;
  metadataUri: string;
  artisanName: string;
  craftType: string;
}) => {
  const contract = getNftContract();

  console.log("[NFT] Sending mintNFT tx →", {
    to: input.to,
    metadataUri: input.metadataUri.slice(0, 40) + "…",
    artisanName: input.artisanName,
    craftType: input.craftType
  });

  const tx = await contract.mintNFT(input.to, input.metadataUri, input.artisanName, input.craftType);
  console.log("[NFT] Tx sent, hash:", tx.hash, "— waiting for confirmation…");

  const receipt = await tx.wait();

  if (!receipt || receipt.status !== 1) {
    throw new Error(`Mint transaction reverted (hash: ${tx.hash})`);
  }

  console.log("[NFT] Tx confirmed in block", receipt.blockNumber, "— parsing logs…");

  // ── Try our custom ArtisanNFTMinted event first (has named tokenId) ──
  let tokenId: string | undefined;

  for (const log of receipt.logs) {
    try {
      const parsed = contract.interface.parseLog({
        topics: log.topics as string[],
        data: log.data
      });
      if (!parsed) continue;

      if (parsed.name === "ArtisanNFTMinted") {
        tokenId = parsed.args.tokenId.toString();
        console.log("[NFT] Parsed ArtisanNFTMinted → tokenId:", tokenId);
        break;
      }

      if (parsed.name === "Transfer" && !tokenId) {
        // Transfer(from, to, tokenId) — tokenId is args[2]
        tokenId = parsed.args[2].toString();
        console.log("[NFT] Parsed Transfer → tokenId:", tokenId);
        // Don't break — prefer ArtisanNFTMinted if it comes later
      }
    } catch {
      // Log from a different contract / interface — skip silently
    }
  }

  if (!tokenId) {
    throw new Error(
      `Mint tx succeeded (hash: ${tx.hash}) but could not extract tokenId from ${receipt.logs.length} logs. ` +
      `Check that the ABI events match the deployed contract.`
    );
  }

  return {
    tokenId,
    transactionHash: tx.hash
  };
};
