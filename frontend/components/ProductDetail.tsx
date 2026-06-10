import { useState } from "react";
import { motion } from "framer-motion";
import Script from "next/script";
import { parseEther } from "viem";
import { useAccount } from "wagmi";

import { apiFetch } from "@/lib/api";
import { Product } from "@/types/product";

interface ProductDetailProps {
  product: Product | null;
  onClose: () => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

function ProductDetail({ product, onClose }: ProductDetailProps) {
  const [purchaseStep, setPurchaseStep] = useState<number>(0); // 0: Idle, 1: Loading, 2: Transacting, 3: Completed
  const [txHash, setTxHash] = useState<string>("");
  const [paymentRail, setPaymentRail] = useState<"razorpay" | "celo">("razorpay");
  const { address } = useAccount();

  if (!product) return null;

  const celoInrRate = Number(process.env.NEXT_PUBLIC_CELO_PRICE_INR || 75);
  const celoAmount = product.celoPrice || Number((product.price / celoInrRate).toFixed(4));
  const receiverWallet =
    product.artisanWallet || process.env.NEXT_PUBLIC_CELO_TREASURY_WALLET || "";
  const explorerBase =
    process.env.NEXT_PUBLIC_CELO_EXPLORER_URL || "https://celo-sepolia.celoscan.io";

  const handleRazorpayPurchase = async () => {
    setPaymentRail("razorpay");
    setPurchaseStep(1); // Connecting/Loading
    
    const token = localStorage.getItem("karuverse_jwt");
    if (!token) {
      alert("Please login to purchase");
      setPurchaseStep(0);
      return;
    }

    try {
      // 1. Create order on backend
      const data = await apiFetch<{ success: boolean; order: any; keyId?: string }>("/api/payments/create-order", {
        method: "POST",
        body: JSON.stringify({ amount: product.price, productId: product.id })
      });
      
      if (!data.success) {
        alert("Failed to create order");
        setPurchaseStep(0);
        return;
      }

      const order = data.order;

      // 2. Open Razorpay modal
      const options = {
        key: data.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "KaruVerse Marketplace",
        description: `Purchase of ${product.name}`,
        order_id: order.id,
        handler: async function (response: any) {
          setPurchaseStep(2); // Transacting / Verifying
          
          // 3. Verify payment on backend
          const verifyData = await apiFetch<{ success: boolean; verified: boolean }>("/api/payments/verify", {
            method: "POST",
            body: JSON.stringify(response)
          });
          
          if (verifyData.success && verifyData.verified) {
            setTxHash(response.razorpay_payment_id);
            setPurchaseStep(3); // Success
          } else {
            alert("Payment verification failed!");
            setPurchaseStep(0);
          }
        },
        prefill: {
          name: "KaruVerse User",
          email: "user@karuverse.com",
          contact: "9999999999"
        },
        theme: {
          color: "#C76B29"
        }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.on("payment.failed", function (response: any) {
        alert(`Payment failed: ${response.error.description}`);
        setPurchaseStep(0);
      });
      rzp1.open();

    } catch (error) {
      console.error(error);
      alert("Error initiating purchase");
      setPurchaseStep(0);
    }
  };

  const switchToCelo = async () => {
    const ethereum = (window as any).ethereum;
    if (!ethereum) throw new Error("No wallet provider found");

    const chainId = process.env.NEXT_PUBLIC_CELO_CHAIN_ID_HEX || "0xaa044c";
    try {
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId }]
      });
    } catch (error: any) {
      if (error.code !== 4902) throw error;
      await ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId,
            chainName: "Celo Sepolia",
            nativeCurrency: { name: "CELO", symbol: "CELO", decimals: 18 },
            rpcUrls: [process.env.NEXT_PUBLIC_CELO_RPC_URL || "https://forno.celo-sepolia.celo-testnet.org"],
            blockExplorerUrls: [explorerBase]
          }
        ]
      });
    }
  };

  const handleCeloPurchase = async () => {
    setPaymentRail("celo");
    setPurchaseStep(1);

    if (!address) {
      alert("Connect your Celo wallet first.");
      setPurchaseStep(0);
      return;
    }
    if (!receiverWallet) {
      alert("No artisan or treasury wallet configured for CELO payments.");
      setPurchaseStep(0);
      return;
    }

    try {
      await switchToCelo();
      setPurchaseStep(2);

      const ethereum = (window as any).ethereum;
      const hash = await ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: address,
            to: receiverWallet,
            value: `0x${parseEther(String(celoAmount)).toString(16)}`
          }
        ]
      });

      const result = await apiFetch<{ success: boolean; verified: boolean }>("/api/payments/celo/verify", {
        method: "POST",
        body: JSON.stringify({
          productId: product.id,
          txHash: hash,
          amountCelo: celoAmount,
          payerWallet: address,
          receiverWallet
        })
      });

      if (result.success && result.verified) {
        setTxHash(hash);
        setPurchaseStep(3);
      }
    } catch (error: any) {
      console.error(error);
      alert(error.message || "CELO payment failed");
      setPurchaseStep(0);
    }
  };

  const downloadNftCard = () => {
    const escape = (value?: string) =>
      String(value || "").replace(/[&<>"']/g, (char) => {
        const map: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" };
        return map[char];
      });

    const verifyUrl = `${window.location.origin}/?verify=${product.nftTokenId || product.id}`;
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="720" viewBox="0 0 1200 720">
        <rect width="1200" height="720" fill="#0f0f0f"/>
        <rect x="40" y="40" width="1120" height="640" rx="28" fill="#17120f" stroke="#c76b29" stroke-width="3"/>
        <text x="84" y="112" fill="#f6c453" font-family="Arial" font-size="28" font-weight="700">KaruVerse Celo NFT Certificate</text>
        <text x="84" y="190" fill="#ffffff" font-family="Georgia" font-size="58" font-style="italic">${escape(product.name)}</text>
        <text x="84" y="252" fill="#f4ede4" font-family="Arial" font-size="26">Artisan: ${escape(product.artisan)}</text>
        <text x="84" y="296" fill="#f4ede4" font-family="Arial" font-size="24">Craft: ${escape(product.craftType)} | Region: ${escape(product.region)}</text>
        <text x="84" y="380" fill="#9ee6a7" font-family="Arial" font-size="28" font-weight="700">Verified on Celo</text>
        <text x="84" y="430" fill="#f4ede4" font-family="Arial" font-size="24">Token ID: ${escape(product.nftTokenId || product.id)}</text>
        <text x="84" y="474" fill="#f4ede4" font-family="Arial" font-size="20">Metadata: ${escape(product.nftMetadataUrl || "Minted from KaruVerse")}</text>
        <text x="84" y="548" fill="#f4ede4" font-family="Arial" font-size="18">Verify: ${escape(verifyUrl)}</text>
        <rect x="872" y="146" width="220" height="220" rx="18" fill="#f4ede4"/>
        <text x="930" y="275" fill="#0f0f0f" font-family="Arial" font-size="24" font-weight="700">KARU</text>
        <text x="872" y="430" fill="#f6c453" font-family="Arial" font-size="20">Authentic Bengali Craft</text>
      </svg>
    `;

    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `karuverse-nft-card-${product.nftTokenId || product.id}.svg`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <div className="fixed inset-0 z-[100] flex justify-end bg-black/60 backdrop-blur-md select-none font-body">
        
        {/* Backdrop tap to close */}
        <div className="absolute inset-0 cursor-pointer" onClick={onClose}></div>

        {/* Drawer Container (Slide in from right) */}
        <motion.div 
          initial={{ x: "100%", opacity: 0.8 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "100%", opacity: 0.8 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="relative z-10 w-full max-w-2xl bg-[#0F0F0F] border-l border-white/10 shadow-2xl h-full flex flex-col justify-between overflow-y-auto"
        >
          
          {/* Top bar (close & status) */}
          <div className="p-6 border-b border-white/5 flex items-center justify-between sticky top-0 bg-[#0F0F0F]/90 backdrop-blur-md z-20">
            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-full liquid-glass flex items-center justify-center text-white/80 hover:text-white border border-white/10 hover:border-white/20 transition-all"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-widest text-[#F4EDE4]/50 uppercase">KaruVerse Console // Detail</span>
              {product.nftVerified && (
                <span className="bg-green-500/10 text-green-400 border border-green-500/25 px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider">
                  Verifiable NFT
                </span>
              )}
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 p-6 md:p-8 flex flex-col gap-8">
            
            {/* Main Visual Header (Emoji & Graphic) */}
            <div className="h-72 bg-gradient-to-b from-[#C76B29]/5 to-black/30 rounded-[2rem] border border-white/5 flex items-center justify-center text-8xl relative overflow-hidden select-none alpana-texture group">
              {product.images && product.images.length > 0 ? (
                <img src={product.images[0]} alt={product.name} className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <span className="text-white/35 text-sm uppercase tracking-widest">No image uploaded</span>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/80 to-transparent opacity-90 group-hover:opacity-70 transition-opacity"></div>
              
              {/* Absolute bottom tags */}
              <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between z-10">
                <div className="text-left">
                  <span className="text-[10px] text-[#F6C453] uppercase font-mono font-semibold tracking-wider">
                    {product.craftType}
                  </span>
                  <h1 className="font-heading italic text-3xl text-white leading-tight mt-1">
                    {product.name}
                  </h1>
                </div>
                <span className="text-xl font-semibold text-white font-mono shrink-0">₹{product.price}</span>
              </div>
            </div>

            {/* AI Creative Storytelling Panel */}
            <div className="p-5 liquid-glass-strong border border-[#C76B29]/15 rounded-[1.5rem] relative clay-weathered">
              <div className="flex items-center gap-1.5 mb-3">
                <span className="h-2 w-2 rounded-full bg-[#C76B29] animate-pulse"></span>
                <span className="text-[10px] font-semibold text-[#F6C453] uppercase tracking-wider">AI Storyteller Copy</span>
              </div>
              
              <h3 className="text-sm font-semibold text-white mb-2 uppercase tracking-wide">The Legacy of the Hands</h3>
              <p className="text-sm text-[#F4EDE4]/95 font-body font-light leading-relaxed italic">
                &ldquo;{product.desc}&rdquo;
              </p>
            </div>

            {/* Artisan Profile Block */}
            <div className="p-4 rounded-2xl bg-white/2 border border-white/5 flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#A91D3A]/20 to-[#C76B29]/20 border border-white/10 flex items-center justify-center text-2xl font-heading italic text-white shrink-0">
                {product.artisan.substring(0, 1)}
              </div>
              <div className="text-left flex-1">
                <h4 className="text-sm font-semibold text-white uppercase tracking-wider">{product.artisan}</h4>
                <p className="text-xs text-[#F4EDE4]/60 font-light mt-0.5">
                  Master Craftsman · {product.region} District, West Bengal
                </p>
                <div className="flex items-center gap-1.5 text-[10px] text-[#F6C453] mt-2 font-mono">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                  Workshop verified direct supplier
                </div>
              </div>
            </div>

            {/* Blockchain & NFT Certificate Info */}
            {product.nftVerified && (
              <div className="p-5 liquid-glass border border-white/5 rounded-[1.5rem] flex flex-col gap-4 text-xs font-mono text-[#F4EDE4]/90">
                <div className="flex justify-between items-center border-b border-white/5 pb-2.5">
                  <span className="text-[#A91D3A] font-semibold flex items-center gap-1.5">
                    🧬 DIGITAL PROVENANCE LEDGER
                  </span>
                  <span className="text-[9px] bg-white/5 text-[#F4EDE4]/60 px-2 py-0.5 rounded border border-white/10">
                    Celo Sepolia
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 leading-snug">
                  <div className="flex flex-col text-left">
                    <span className="text-[#F4EDE4]/40 text-[9px] uppercase">Token Standard // Type</span>
                    <span className="text-white mt-0.5">ERC-721 // Traditional Collectible</span>
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[#F4EDE4]/40 text-[9px] uppercase">Unique Token ID</span>
                    <span className="text-white mt-0.5">#{product.nftTokenId || product.id}</span>
                  </div>
                  <div className="flex flex-col text-left md:col-span-2">
                    <span className="text-[#F4EDE4]/40 text-[9px] uppercase">Secondary Creator Royalty</span>
                    <span className="text-[#F6C453] mt-0.5 font-bold">10% Direct Royalty Routing</span>
                  </div>
                  <button
                    type="button"
                    onClick={downloadNftCard}
                    className="mt-2 w-full bg-white/5 border border-white/10 text-white py-2.5 rounded-full hover:bg-[#C76B29] transition-colors uppercase tracking-wider text-[10px]"
                  >
                    Download NFT Card
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Footer Checkout CTA Section */}
          <div className="p-6 border-t border-white/5 sticky bottom-0 bg-[#0F0F0F]/95 backdrop-blur-md z-20 flex flex-col gap-4">
            
            {/* Purchase Progress */}
            {purchaseStep === 0 && (
              <button
                onClick={handleRazorpayPurchase}
                className="w-full bg-[#F4EDE4] text-black py-4 text-sm font-semibold rounded-full hover:bg-[#C76B29] hover:text-white transition-all duration-500 uppercase tracking-widest flex items-center justify-center gap-2"
              >
                Pay ₹{product.price} with Razorpay
                <svg className="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2">
                  <line x1="7" y1="17" x2="17" y2="7"></line>
                  <polyline points="7 7 17 7 17 17"></polyline>
                </svg>
              </button>
            )}

            {purchaseStep === 0 && (
              <button
                onClick={handleCeloPurchase}
                className="w-full bg-[#C76B29]/15 border border-[#C76B29]/30 text-[#F6C453] py-4 text-sm font-semibold rounded-full hover:bg-[#C76B29] hover:text-white transition-all duration-500 uppercase tracking-widest flex items-center justify-center gap-2"
              >
                Pay {celoAmount} CELO
              </button>
            )}

            {purchaseStep === 1 && (
              <div className="w-full bg-white/5 border border-white/10 text-white py-4 rounded-full flex items-center justify-center gap-3 text-sm font-semibold animate-pulse font-mono">
                <svg className="animate-spin h-5 w-5 text-current" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                INITIALIZING SECURE GATEWAY...
              </div>
            )}

            {purchaseStep === 2 && (
              <div className="w-full bg-[#C76B29]/10 border border-[#C76B29]/30 text-[#F6C453] py-4 rounded-full flex items-center justify-center gap-3 text-sm font-semibold animate-pulse font-mono">
                <svg className="animate-spin h-5 w-5 text-current" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                VERIFYING TRANSACTION SIGNATURE...
              </div>
            )}

            {purchaseStep === 3 && (
              <div className="w-full bg-green-500/10 border border-green-500/30 text-green-400 py-4 rounded-full flex flex-col items-center justify-center gap-1.5 text-sm font-semibold animate-fade-in font-mono">
                <div className="flex items-center gap-2 text-base">
                  🎉 PAYMENT VERIFIED!
                </div>
                <div className="text-[10px] text-green-300/80 font-normal normal-case">
                  {paymentRail === "celo" ? "Tx" : "Receipt"} ID: <span className="underline">{txHash}</span>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center text-[10px] text-[#F4EDE4]/40 font-mono">
              <span>Direct P2P Routing: 95% Artisan / 5% Platform</span>
              <span>Razorpay INR or Celo coin</span>
            </div>

          </div>

        </motion.div>
        
      </div>
    </>
  );
}

export default ProductDetail;
