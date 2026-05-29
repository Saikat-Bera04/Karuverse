import axios from "axios";

export const uploadJsonToPinata = async (metadata: Record<string, unknown>) => {
  if (!process.env.PINATA_API_KEY || !process.env.PINATA_SECRET_API_KEY) {
    throw new Error("Pinata credentials are not configured");
  }

  const response = await axios.post("https://api.pinata.cloud/pinning/pinJSONToIPFS", metadata, {
    headers: {
      pinata_api_key: process.env.PINATA_API_KEY,
      pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY
    }
  });

  return `ipfs://${response.data.IpfsHash}`;
};
