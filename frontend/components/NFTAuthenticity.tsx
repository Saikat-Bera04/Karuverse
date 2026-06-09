import { useState } from "react";
import { motion } from "framer-motion";
import { apiFetch } from "@/lib/api";

interface VerificationResult {
  tokenId: string;
  owner: string;
  artisan?: string;
  mintedAt?: string;
  status: string;
}

function NFTAuthenticity() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [tokenId, setTokenId] = useState<string>("");
  const [verifyError, setVerifyError] = useState<string>("");

  const steps = [
    {
      title: "Regional Sourcing Verification",
      icon: "📍",
      description: "Artisans record the raw material source (e.g. Bankura red clay or local cotton yarn) using their digital identity."
    },
    {
      title: "Smart Contract Minting",
      icon: "⛓️",
      description: "When the piece is finished, an ERC-721 smart contract mints a Celo certificate with all creative data."
    },
    {
      title: "QR Authenticity Card",
      icon: "📱",
      description: "A secure physical wood/metal tag with a laser-etched QR code is shipped, linking directly to the digital ledger."
    },
    {
      title: "Immutable Royalties",
      icon: "💎",
      description: "If secondary market collectors resell the piece, 10% royalties are directly auto-routed to the artisan's wallet."
    }
  ];

  const handleVerify = async () => {
    if (!tokenId.trim()) {
      setVerifyError("Enter a minted token id first.");
      return;
    }

    setIsVerifying(true);
    setVerificationResult(null);
    setVerifyError("");

    try {
      const data = await apiFetch<{
        verified: boolean;
        owner: string;
        artisan?: string;
        mintedAt?: string;
      }>(`/api/nft/verify/${tokenId.trim()}`);
      setVerificationResult({
        tokenId: tokenId.trim(),
        owner: data.owner,
        artisan: data.artisan,
        mintedAt: data.mintedAt,
        status: data.verified ? "AUTHENTIC & VERIFIED" : "OWNER MISMATCH"
      });
    } catch (error: any) {
      setVerifyError(error.message || "Verification failed");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <section className="relative w-screen min-h-screen overflow-hidden bg-black py-24 px-6 md:px-16 lg:px-20 select-none">
      
      {/* Background glow points */}
      <div className="absolute top-[35%] left-[10%] w-[45vw] h-[45vh] rounded-full glow-crimson pointer-events-none z-1"></div>
      <div className="absolute bottom-[20%] right-[10%] w-[35vw] h-[35vh] rounded-full glow-gold pointer-events-none z-1"></div>

      <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Left Column: Context, Steps & Holographic Explainer */}
        <div className="flex flex-col text-left">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.8 }}
            viewport={{ once: true }}
            className="text-xs font-body text-[#A91D3A] uppercase tracking-widest mb-3"
          >
            // Blockchain Provenance
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-heading italic text-5xl md:text-6xl lg:text-[4.5rem] text-white tracking-tight leading-none mb-6"
          >
            Every Handmade Piece Has a Digital Soul.
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 0.7, y: 0 }}
            viewport={{ once: true }}
            className="text-[#F4EDE4]/80 font-body font-light text-sm md:text-base leading-relaxed mb-8"
          >
            Traditional art suffers from copycats and fake mass productions. KaruVerse secures the artisan's legacy by anchoring their physical creations to secure digital ledger records. Scan and track the exact creator history, regional village signature, and secondary sales transparently.
          </motion.p>

          {/* Interactive Steps Nodes */}
          <div className="flex flex-col gap-4">
            {steps.map((step, idx) => {
              const isActive = activeStep === idx;
              return (
                <div 
                  key={idx}
                  onClick={() => setActiveStep(idx)}
                  className={`flex items-start gap-4 p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                    isActive 
                      ? "liquid-glass-strong border-[#A91D3A]/30 bg-white/5" 
                      : "liquid-glass border-white/5 hover:bg-white/2"
                  }`}
                >
                  <div className="text-2xl mt-1">{step.icon}</div>
                  <div>
                    <h4 className={`text-base font-semibold transition-colors ${isActive ? "text-[#F6C453]" : "text-white"}`}>
                      {step.title}
                    </h4>
                    {isActive && (
                      <motion.p 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 0.8, height: "auto" }}
                        className="text-xs text-[#F4EDE4]/80 font-body font-light mt-1.5 leading-relaxed"
                      >
                        {step.description}
                      </motion.p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Holographic Hologram Certificate Demo & QR Verification */}
        <div className="flex flex-col items-center justify-center">
          
          {/* Hologram Card (liquid glass strong, glow borders) */}
          <motion.div 
            whileHover={{ rotateY: 10, rotateX: -5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="w-[320px] sm:w-[380px] h-[480px] liquid-glass-strong rounded-[2rem] border border-[#A91D3A]/20 p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden alpana-texture"
            style={{ perspective: 1000 }}
          >
            
            {/* Holographic light strip overlay */}
            <div className="absolute -inset-2 bg-gradient-to-tr from-[#A91D3A]/5 via-white/5 to-[#F6C453]/5 opacity-30 pointer-events-none"></div>

            {/* Certificate Top (Branding) */}
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div className="flex items-center gap-1.5">
                <span className="font-heading italic text-[#F6C453] text-xl">k</span>
                <span className="text-[10px] font-mono tracking-widest text-[#F4EDE4]/60 uppercase">KaruVerse Ledger</span>
              </div>
              <span className="text-[9px] bg-[#A91D3A]/25 text-[#A91D3A] font-mono border border-[#A91D3A]/50 px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold">
                Celo ERC-721
              </span>
            </div>

            {/* Certificate Middle: Graphic Badge */}
            <div className="flex-1 flex flex-col items-center justify-center my-6 relative">
              
              {/* Spinning Web3 Hologram */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="w-40 h-40 rounded-full border border-dashed border-[#F6C453]/20 flex items-center justify-center relative"
              >
                <div className="w-32 h-32 rounded-full border border-dashed border-[#A91D3A]/30 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#C76B29]/10 to-[#A91D3A]/10 flex items-center justify-center border border-white/5">
                    <span className="text-4xl text-[#F6C453] drop-shadow-2xl">K</span>
                  </div>
                </div>
                
                {/* Rotating nodes on the ring */}
                <div className="absolute top-0 left-1/2 w-2 h-2 bg-[#F6C453] rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-[#A91D3A] rounded-full -translate-x-1/2 translate-y-1/2"></div>
              </motion.div>

              <div className="text-center mt-4">
                <h4 className="font-heading italic text-2xl text-white">Celo Craft Certificate</h4>
                <p className="text-[10px] text-[#F4EDE4]/50 font-body uppercase tracking-wider mt-0.5">
                  Enter a minted KaruVerse token id
                </p>
              </div>

            </div>

            {/* Certificate Bottom: Interactive Verification */}
            <div className="border-t border-white/10 pt-4 flex flex-col gap-3">
              {verificationResult ? (
                <div className="bg-black/50 border border-green-500/20 p-3 rounded-xl flex flex-col gap-1.5 animate-fade-in font-mono text-[10px] text-[#F4EDE4]">
                  <div className="flex justify-between">
                    <span className="text-white/40">STATUS:</span>
                    <span className="text-green-400 font-bold tracking-widest">{verificationResult.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">TOKEN ID:</span>
                    <span>#{verificationResult.tokenId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">OWNER:</span>
                    <span className="text-[#F6C453]">{verificationResult.owner.slice(0, 10)}...</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">ARTISAN:</span>
                    <span>{verificationResult.artisan || "Recorded"}</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <input
                    value={tokenId}
                    onChange={(event) => setTokenId(event.target.value)}
                    placeholder="Token ID"
                    className="bg-black/50 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#C76B29]"
                  />
                  {verifyError && <p className="text-[10px] text-[#A91D3A]">{verifyError}</p>}
                  <button
                    onClick={handleVerify}
                    disabled={isVerifying}
                    className="w-full bg-[#F4EDE4] text-black py-2.5 text-xs font-semibold rounded-full hover:bg-[#A91D3A] hover:text-white transition-all duration-300 flex items-center justify-center gap-1.5 uppercase tracking-wider"
                  >
                    {isVerifying ? "Verifying..." : "Verify Blockchain Certificate"}
                  </button>
                </div>
              )}
            </div>

          </motion.div>
          
        </div>

      </div>

    </section>
  );
}

export default NFTAuthenticity;
