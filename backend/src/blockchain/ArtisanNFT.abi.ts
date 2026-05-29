export const artisanNftAbi = [
  "function mintNFT(address to,string metadataURI,string artisanName,string craftType) public returns (uint256)",
  "function tokenURI(uint256 tokenId) public view returns (string)",
  "function ownerOf(uint256 tokenId) public view returns (address)",
  "function artworks(uint256 tokenId) public view returns (string artisanName,string craftType,string metadataURI,uint256 createdAt)"
] as const;
