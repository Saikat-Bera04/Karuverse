# KaruVerse Contracts

`ArtisanNFT.sol` is the Celo Sepolia-compatible ERC-721 certificate contract for verified artisan products.

Install Hardhat and OpenZeppelin in whichever workspace you use for contract deployment:

```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npm install @openzeppelin/contracts
```

Deploy it to Celo Sepolia with:

- `CELO_RPC_URL=https://forno.celo-sepolia.celo-testnet.org`
- `CELO_CHAIN_ID=11142220`
- `PRIVATE_KEY=<celo-sepolia-funded-private-key>`

After deployment, set `NFT_CONTRACT_ADDRESS` in `backend/.env`