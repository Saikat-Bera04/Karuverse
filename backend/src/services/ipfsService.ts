import axios from "axios";
import FormData from "form-data";

export const uploadJsonToPinata = async (metadata: Record<string, unknown>) => {
  if (!process.env.PINATA_JWT) {
    throw new Error("PINATA_JWT is not configured in .env");
  }

  const response = await axios.post("https://api.pinata.cloud/pinning/pinJSONToIPFS", metadata, {
    headers: {
      Authorization: `Bearer ${process.env.PINATA_JWT}`,
      "Content-Type": "application/json"
    }
  });

  return `ipfs://${response.data.IpfsHash}`;
};

export const uploadFileToPinata = async (fileBuffer: Buffer, originalName: string) => {
  if (!process.env.PINATA_JWT) {
    throw new Error("PINATA_JWT is not configured in .env");
  }

  const formData = new FormData();
  formData.append("file", fileBuffer, originalName);

  const response = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
    headers: {
      Authorization: `Bearer ${process.env.PINATA_JWT}`,
      ...formData.getHeaders()
    }
  });

  // Returning both the raw CID and a gateway URL
  const cid = response.data.IpfsHash;
  return {
    cid,
    ipfsUri: `ipfs://${cid}`,
    gatewayUrl: `https://gateway.pinata.cloud/ipfs/${cid}`
  };
};
