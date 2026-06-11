export const artisanNftAbi = [
  // ── Functions ──
  "function mintNFT(address to, string metadataURI, string artisanName, string craftType) public returns (uint256)",
  "function tokenURI(uint256 tokenId) public view returns (string)",
  "function ownerOf(uint256 tokenId) public view returns (address)",
  "function artworks(uint256 tokenId) public view returns (string artisanName, string craftType, string metadataURI, uint256 createdAt)",

  // ── Events (required so ethers can parse tx receipts) ──
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
  "event ArtisanNFTMinted(uint256 indexed tokenId, address indexed owner, string metadataURI, string artisanName, string craftType)"
] as const;
