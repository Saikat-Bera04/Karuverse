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
  const tx = await contract.mintNFT(input.to, input.metadataUri, input.artisanName, input.craftType);
  const receipt = await tx.wait();

  const transferLog = receipt?.logs
    ?.map((log: unknown) => {
      try {
        return contract.interface.parseLog(log as { topics: string[]; data: string });
      } catch {
        return null;
      }
    })
    .find((log: { name?: string } | null) => log?.name === "Transfer");

  const tokenId = transferLog?.args?.tokenId?.toString() || transferLog?.args?.[2]?.toString();

  return {
    tokenId,
    transactionHash: tx.hash
  };
};
