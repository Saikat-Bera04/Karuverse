import axios from "axios";
import FormData from "form-data";

/**
 * Build Pinata auth headers.
 * Prefers API Key + Secret (always has full pinning scope),
 * falls back to JWT Bearer token if keys aren't set.
 */
const getPinataHeaders = (): Record<string, string> => {
  if (process.env.PINATA_API_KEY && process.env.PINATA_API_SECRET) {
    return {
      pinata_api_key: process.env.PINATA_API_KEY,
      pinata_secret_api_key: process.env.PINATA_API_SECRET
    };
  }

  if (process.env.PINATA_JWT) {
    return { Authorization: `Bearer ${process.env.PINATA_JWT}` };
  }

  throw new Error("Pinata credentials not configured — set PINATA_API_KEY + PINATA_API_SECRET (or PINATA_JWT) in .env");
};

export const uploadJsonToPinata = async (metadata: Record<string, unknown>) => {
  const response = await axios.post(
    "https://api.pinata.cloud/pinning/pinJSONToIPFS",
    metadata,
    {
      headers: {
        ...getPinataHeaders(),
        "Content-Type": "application/json"
      }
    }
  );

  return `ipfs://${response.data.IpfsHash}`;
};

export const uploadFileToPinata = async (fileBuffer: Buffer, originalName: string) => {
  const formData = new FormData();
  formData.append("file", fileBuffer, {
    filename: originalName,
    contentType: "application/octet-stream"
  });

  const response = await axios.post(
    "https://api.pinata.cloud/pinning/pinFileToIPFS",
    formData,
    {
      headers: {
        ...getPinataHeaders(),
        ...formData.getHeaders()
      },
      maxBodyLength: Infinity,
      maxContentLength: Infinity
    }
  );

  // Returning both the raw CID and a gateway URL
  const cid = response.data.IpfsHash;
  return {
    cid,
    ipfsUri: `ipfs://${cid}`,
    gatewayUrl: `https://gateway.pinata.cloud/ipfs/${cid}`
  };
};
