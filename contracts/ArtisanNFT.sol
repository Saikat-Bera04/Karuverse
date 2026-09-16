// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ArtisanNFT is ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;

    struct Artwork {
        string artisanName;
        string craftType;
        string metadataURI;
        uint256 createdAt;
    }

    mapping(uint256 => Artwork) public artworks;

    event ArtisanNFTMinted(
        uint256 indexed tokenId,
        address indexed owner,
        string metadataURI,
        string artisanName,
        string craftType
    );

    constructor() ERC721("KaruVerse Artisan Certificate", "KARU") Ownable(msg.sender) {}

    function mintNFT(
        address to,
        string memory metadataURI,
        string memory artisanName,
        string memory craftType
    ) public onlyOwner returns (uint256) {
        uint256 tokenId = ++_nextTokenId;

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, metadataURI);

        artworks[tokenId] = Artwork({
            artisanName: artisanName,
            craftType: craftType,
            metadataURI: metadataURI,
            createdAt: block.timestamp
        });

        emit ArtisanNFTMinted(tokenId, to, metadataURI, artisanName, craftType);

        return tokenId;
    }
}
