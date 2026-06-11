import { ethers } from "ethers";

let _provider: ethers.JsonRpcProvider | null = null;
let _wallet: ethers.Wallet | null = null;

/**
 * Lazy-initialised provider – only reads env vars on first call,
 * so it is safe regardless of import order vs dotenv.config().
 */
export const getProvider = (): ethers.JsonRpcProvider => {
  if (!_provider) {
    const rpcUrl =
      process.env.CELO_RPC_URL || "https://forno.celo-sepolia.celo-testnet.org";
    const chainId = Number(process.env.CELO_CHAIN_ID || 11142220);

    _provider = new ethers.JsonRpcProvider(rpcUrl, chainId, {
      staticNetwork: true          // avoids an extra eth_chainId call on every request
    });
  }
  return _provider;
};

/** @deprecated – kept for any file that still references `provider` directly */
export const provider = new Proxy({} as ethers.JsonRpcProvider, {
  get(_target, prop, receiver) {
    return Reflect.get(getProvider(), prop, receiver);
  }
});

export const getWallet = (): ethers.Wallet => {
  if (!_wallet) {
    if (!process.env.PRIVATE_KEY) {
      throw new Error("PRIVATE_KEY is not configured");
    }
    _wallet = new ethers.Wallet(process.env.PRIVATE_KEY, getProvider());
  }
  return _wallet;
};
