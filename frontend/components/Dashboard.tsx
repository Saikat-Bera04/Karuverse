import { useState, FormEvent, useRef } from "react";
import { useAccount } from "wagmi";

import { apiFetch } from "@/lib/api";
import { mapProduct } from "@/lib/productMapper";
import { Product } from "@/types/product";

interface DashboardProps {
  addProduct: (product: Product) => void;
  setCurrentPage: (page: string) => void;
  user?: any;
}

interface MintedResult {
  status: string;
  tokenId: string;
  txHash: string;
}

function Dashboard({ addProduct, setCurrentPage, user }: DashboardProps) {
  const { address } = useAccount();
  // Form states
  const [name, setName] = useState<string>("");
  const [craftType, setCraftType] = useState<string>("handloom");
  const [region, setRegion] = useState<string>("Nadia");
  const [artisan, setArtisan] = useState<string>(user?.name || "");
  const [rawNotes, setRawNotes] = useState<string>("");
  const [materials, setMaterials] = useState<string>("");
  const [hoursWorked, setHoursWorked] = useState<number>(8);
  const [price, setPrice] = useState<number>(1000);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isSuggestingPrice, setIsSuggestingPrice] = useState<boolean>(false);
  const [priceReasoning, setPriceReasoning] = useState<string>("");
  
  // Real DB product state
  const [createdProductId, setCreatedProductId] = useState<string | null>(null);

  // AI and blockchain states
  const [isGeneratingStory, setIsGeneratingStory] = useState<boolean>(false);
  const [aiStory, setAiStory] = useState<string>("");
  const [isMinting, setIsMinting] = useState<boolean>(false);
  const [mintedResult, setMintedResult] = useState<MintedResult | null>(null);

  // File input ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Stats / Metrics
  const metrics = [
    { label: "Wallet", val: address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Not linked" },
    { label: "Network", val: "Celo" },
    { label: "Image Storage", val: "IPFS" },
    { label: "Payment Rails", val: "INR + CELO" }
  ];

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const data = await apiFetch<{ success: boolean; secure_url: string }>("/api/upload", {
        method: "POST",
        body: formData
      });
      if (data.success) {
        setImageUrl(data.secure_url);
      } else {
        alert("Upload failed");
      }
    } catch (error) {
      console.error(error);
      alert("Error uploading image");
    } finally {
      setIsUploading(false);
    }
  };

  // Helper AI generator
  const triggerAiGenerator = async () => {
    if (!name || !artisan) {
      alert("Please fill in Craft Name and Artisan Name first!");
      return;
    }
    
    setIsGeneratingStory(true);
    setAiStory("");

    const token = localStorage.getItem("karuverse_jwt");
    if (!token) {
      alert("You must be logged in to generate an AI story.");
      setIsGeneratingStory(false);
      return;
    }

    try {
      const data = await apiFetch<{ success: boolean; story: string }>("/api/ai/story-generator", {
        method: "POST",
        body: JSON.stringify({
          title: name,
          artisanName: artisan,
          craftType,
          district: region,
          village: rawNotes
        })
      });
      if (data.success) {
        setAiStory(data.story);
      } else {
        alert("AI Generation failed");
      }
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Error generating AI story");
    } finally {
      setIsGeneratingStory(false);
    }
  };

  const triggerPriceSuggestion = async () => {
    if (!materials || !hoursWorked || !craftType) {
      alert("Please enter materials, hours worked, and craft category first.");
      return;
    }

    setIsSuggestingPrice(true);
    setPriceReasoning("");

    try {
      const data = await apiFetch<{
        success: boolean;
        suggestion: { recommendedPrice?: number; reasoning?: string };
      }>("/api/ai/price-suggestion", {
        method: "POST",
        body: JSON.stringify({
          materials: materials.split(",").map((item) => item.trim()).filter(Boolean),
          hoursWorked,
          category: craftType,
          baseCurrency: "INR"
        })
      });

      if (data.suggestion.recommendedPrice) setPrice(data.suggestion.recommendedPrice);
      setPriceReasoning(data.suggestion.reasoning || "Fair artisan price suggested.");
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Error generating price suggestion");
    } finally {
      setIsSuggestingPrice(false);
    }
  };

  // Create Product in DB first
  const handleCreateProduct = async () => {
    const productDescription = aiStory || rawNotes;
    if (!name || !artisan || !productDescription || !price) {
      alert("Please add product notes or generate the AI Story description, then set price.");
      return;
    }
    const token = localStorage.getItem("karuverse_jwt");
    if (!token) {
      alert("You must be logged in to create a product.");
      return;
    }

    try {
      const data = await apiFetch<{ success: boolean; product: any }>("/api/products", {
        method: "POST",
        body: JSON.stringify({
          title: name,
          description: productDescription,
          category: craftType,
          craftType,
          district: region,
          price,
          currency: "INR",
          materials: materials.split(",").map((item) => item.trim()).filter(Boolean),
          hoursWorked,
          images: imageUrl ? [imageUrl] : []
        })
      });
      if (data.success) {
        setCreatedProductId(data.product._id);
        alert("Product registered in DB! You can now Mint the NFT Certificate.");
      } else {
        alert("Failed to create product");
      }
    } catch (error) {
      console.error(error);
      alert("Error creating product");
    }
  };

  // Helper Blockchain Minter (Real Celo Minting)
  const triggerBlockchainMinter = async () => {
    if (!createdProductId) {
      alert("Please Register Product in DB first!");
      return;
    }
    
    const token = localStorage.getItem("karuverse_jwt");
    const userStr = localStorage.getItem("karuverse_user");
    let walletAddress = address || "";
    if (userStr) {
      const user = JSON.parse(userStr);
      walletAddress = address || user.walletAddress || "";
    }
    if (!walletAddress) {
      alert("Connect a Celo wallet before minting the NFT certificate.");
      return;
    }

    setIsMinting(true);
    setMintedResult(null);

    try {
      const data = await apiFetch<{ success: boolean; certificate: any; message?: string }>("/api/nft/mint", {
        method: "POST",
        body: JSON.stringify({
          productId: createdProductId,
          walletAddress
        })
      });
      if (data.success) {
        setMintedResult({
          status: "SECURED ON CELO",
          tokenId: data.certificate.tokenId,
          txHash: data.certificate.transactionHash
        });
      } else {
        alert("Minting failed: " + data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Error minting NFT");
    } finally {
      setIsMinting(false);
    }
  };

  // Handle final submission to Marketplace catalog (frontend state update)
  const handleRegisterProduct = async (e: FormEvent) => {
    e.preventDefault();
    if (!createdProductId) {
      alert("Please register the product in the database first.");
      return;
    }

    try {
      const latest = await apiFetch<{ success: boolean; product: any }>(`/api/products/${createdProductId}`);

      if (latest.success && latest.product) {
        addProduct(mapProduct(latest.product));
      } else {
        throw new Error("Could not fetch the published product.");
      }
    } catch (error) {
      console.error(error);

      const newCraftProduct: Product = {
        _id: createdProductId,
        id: createdProductId,
        title: name,
        name: name,
        category: craftType,
        craftType: craftType,
        district: region,
        region: region,
        artisan: artisan,
        price: price,
        description: aiStory || rawNotes,
        desc: aiStory || rawNotes,
        isVerified: Boolean(mintedResult),
        nftVerified: Boolean(mintedResult),
        nftTokenId: mintedResult?.tokenId,
        nftTransactionHash: mintedResult?.txHash,
        images: imageUrl ? [imageUrl] : []
      };

      addProduct(mapProduct(newCraftProduct));
    }

    setCurrentPage("marketplace");
    
    // Clear forms
    setName("");
    setArtisan("");
    setRawNotes("");
    setMaterials("");
    setAiStory("");
    setHoursWorked(8);
    setPrice(1000);
    setImageUrl("");
    setCreatedProductId(null);
    setMintedResult(null);
    
    alert(
      mintedResult
        ? "Success! Craft secured and published to direct global marketplace catalog."
        : "Success! Craft published to the marketplace. You can mint the NFT certificate later."
    );
  };

  return (
    <section className="relative w-screen min-h-screen overflow-hidden bg-black py-24 px-6 md:px-16 lg:px-20 select-none">
      
      {/* Glow Points */}
      <div className="absolute top-[20%] left-[20%] w-[40vw] h-[40vh] rounded-full glow-clay pointer-events-none z-1"></div>
      <div className="absolute bottom-[20%] right-[20%] w-[35vw] h-[35vh] rounded-full glow-gold pointer-events-none z-1"></div>

      <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Side: Artisan Registration Pipeline Console (7 cols) */}
        <div className="lg:col-span-7 flex flex-col">
          <form 
            onSubmit={handleRegisterProduct}
            className="liquid-glass-strong border border-white/5 p-6 md:p-8 rounded-[2rem] flex flex-col justify-between flex-1 relative overflow-hidden alpana-texture"
          >
            
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="h-2 w-2 rounded-full bg-[#C76B29] animate-ping"></span>
                <span className="text-[10px] font-mono tracking-widest text-[#F4EDE4]/60 uppercase">
                  Secure Onboarding Pipeline Console
                </span>
              </div>
              <h3 className="font-heading italic text-4xl text-white tracking-wide leading-none mb-6">
                Register New Craft Piece
              </h3>
            </div>

            {/* Step 1 Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              
              <div className="flex flex-col text-left">
                <label className="text-[11px] font-semibold text-[#F4EDE4]/60 font-body uppercase tracking-wider mb-2">
                  Craft Object Name
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. Terracotta Dancing Elephant"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C76B29]"
                  required
                />
              </div>

              <div className="flex flex-col text-left">
                <label className="text-[11px] font-semibold text-[#F4EDE4]/60 font-body uppercase tracking-wider mb-2">
                  Artisan Full Name
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. Madan Karmakar"
                  value={artisan}
                  onChange={(e) => setArtisan(e.target.value)}
                  className="bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C76B29]"
                  required
                />
              </div>

              <div className="flex flex-col text-left">
                <label className="text-[11px] font-semibold text-[#F4EDE4]/60 font-body uppercase tracking-wider mb-2">
                  Craft Category
                </label>
                <select
                  value={craftType}
                  onChange={(e) => setCraftType(e.target.value)}
                  className="bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-[#F4EDE4]/80 focus:outline-none focus:border-[#C76B29]"
                >
                  <option value="handloom">Handloom Weaving</option>
                  <option value="terracotta">Terracotta Clay</option>
                  <option value="dokra">Dokra Brass Art</option>
                  <option value="alpana">Alpana & Wood</option>
                  <option value="instruments">Folk Instruments</option>
                </select>
              </div>

              <div className="flex flex-col text-left">
                <label className="text-[11px] font-semibold text-[#F4EDE4]/60 font-body uppercase tracking-wider mb-2">
                  Bengal Origin District
                </label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-[#F4EDE4]/80 focus:outline-none focus:border-[#C76B29]"
                >
                  <option value="Nadia">Nadia District</option>
                  <option value="Bankura">Bankura District</option>
                  <option value="Burdwan">Burdwan District</option>
                  <option value="Shantiniketan">Shantiniketan District</option>
                  <option value="Birbhum">Birbhum District</option>
                  <option value="Purulia">Purulia District</option>
                </select>
              </div>

              <div className="flex flex-col text-left">
                <label className="text-[11px] font-semibold text-[#F4EDE4]/60 font-body uppercase tracking-wider mb-2">
                  Price (INR)
                </label>
                <input 
                  type="number" 
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C76B29]"
                  required
                />
              </div>

              <div className="flex flex-col text-left">
                <label className="text-[11px] font-semibold text-[#F4EDE4]/60 font-body uppercase tracking-wider mb-2">
                  Product Image (IPFS)
                </label>
                <div className="flex items-center gap-2">
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    className="hidden"
                    accept="image/*"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-[#F4EDE4]/80 hover:border-[#C76B29] transition-colors flex-1"
                  >
                    {isUploading ? "Uploading..." : imageUrl ? "Image Uploaded ✓" : "Choose Image"}
                  </button>
                  {imageUrl && (
                    <img src={imageUrl} alt="preview" className="h-9 w-9 object-cover rounded-md border border-white/10" />
                  )}
                </div>
              </div>

              <div className="flex flex-col text-left">
                <label className="text-[11px] font-semibold text-[#F4EDE4]/60 font-body uppercase tracking-wider mb-2">
                  Materials
                </label>
                <input
                  type="text"
                  placeholder="e.g. red clay, natural pigment"
                  value={materials}
                  onChange={(e) => setMaterials(e.target.value)}
                  className="bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C76B29]"
                />
              </div>

              <div className="flex flex-col text-left">
                <label className="text-[11px] font-semibold text-[#F4EDE4]/60 font-body uppercase tracking-wider mb-2">
                  Hours Worked
                </label>
                <input
                  type="number"
                  min="1"
                  value={hoursWorked}
                  onChange={(e) => setHoursWorked(Number(e.target.value))}
                  className="bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C76B29]"
                />
              </div>

            </div>

            {/* Notes input */}
            <div className="flex flex-col text-left mb-6">
              <label className="text-[11px] font-semibold text-[#F4EDE4]/60 font-body uppercase tracking-wider mb-2">
                Raw Folklore Notes / Story Ideas
              </label>
              <textarea 
                rows={2}
                placeholder="Talk about patterns, materials, or your village ancestors who taught you this wheel method..."
                value={rawNotes}
                onChange={(e) => setRawNotes(e.target.value)}
                className="bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C76B29] resize-none"
              />
            </div>

            {/* AI pipeline control row */}
            <div className="flex flex-col gap-4 border-t border-white/5 pt-5 mb-6">
              
              {/* Trigger 1: AI storytelling */}
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <button
                  type="button"
                  onClick={triggerPriceSuggestion}
                  disabled={isSuggestingPrice}
                  className="w-full sm:w-auto bg-white/10 border border-white/10 text-white px-5 py-2.5 text-xs font-semibold rounded-full hover:bg-white/15 transition-colors shrink-0 flex items-center justify-center gap-2 uppercase tracking-wider"
                >
                  {isSuggestingPrice ? "Calculating..." : "Suggest Fair INR Price"}
                </button>
                {priceReasoning && (
                  <p className="text-[10px] text-[#F6C453] font-mono italic leading-snug text-left">
                    {priceReasoning}
                  </p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <button
                  type="button"
                  onClick={triggerAiGenerator}
                  disabled={isGeneratingStory}
                  className="w-full sm:w-auto bg-[#C76B29] text-white px-5 py-2.5 text-xs font-semibold rounded-full hover:bg-[#C76B29]/80 transition-colors shrink-0 flex items-center justify-center gap-2 uppercase tracking-wider"
                >
                  {isGeneratingStory ? "Generating..." : "Generate AI Story description"}
                </button>
                {aiStory && (
                  <p className="text-[10px] text-green-400 font-mono italic leading-snug text-left">
                    ✓ Story generated dynamically. poetics matched.
                  </p>
                )}
              </div>

              {aiStory && (
                <div className="bg-black/40 border border-white/10 p-3.5 rounded-xl text-[11px] text-[#F4EDE4]/90 italic leading-relaxed text-left animate-fade-in font-body">
                  &ldquo;{aiStory}&rdquo;
                </div>
              )}

              {/* Trigger 1.5: Register in DB — visible when user has description (AI story OR raw notes) */}
              {(aiStory || rawNotes) && !createdProductId && (
                 <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <button
                      type="button"
                      onClick={handleCreateProduct}
                      className="w-full sm:w-auto bg-blue-600 text-white px-5 py-2.5 text-xs font-semibold rounded-full hover:bg-blue-500 transition-colors shrink-0 flex items-center justify-center gap-2 uppercase tracking-wider"
                    >
                      Save to Database
                    </button>
                    <p className="text-[10px] text-blue-300/60 font-mono italic text-left">
                      {aiStory ? "Using AI-generated story as description" : "Using your raw notes as description"}
                    </p>
                 </div>
              )}
              {createdProductId && (
                <p className="text-[10px] text-blue-400 font-mono text-left">✓ Product saved in Database.</p>
              )}

              {/* Trigger 2: Blockchain minting */}
              {createdProductId && (
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <button
                    type="button"
                    onClick={triggerBlockchainMinter}
                    disabled={isMinting || !!mintedResult}
                    className="w-full sm:w-auto bg-[#A91D3A] text-white px-5 py-2.5 text-xs font-semibold rounded-full hover:bg-[#A91D3A]/80 transition-colors shrink-0 flex items-center justify-center gap-2 uppercase tracking-wider"
                  >
                    {isMinting ? "Minting..." : "Mint Blockchain NFT Certificate"}
                  </button>
                  {mintedResult && (
                    <div className="text-[10px] text-green-400 font-mono flex flex-col text-left">
                      <span>✓ {mintedResult.status}! Token ID: #{mintedResult.tokenId}</span>
                      <span className="text-white/40">Hash: {mintedResult.txHash}</span>
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* Final publication submit */}
            <button
              type="submit"
              disabled={!createdProductId}
              className={`w-full py-4 text-xs font-semibold rounded-full uppercase tracking-widest flex items-center justify-center gap-1 transition-all ${
                createdProductId
                  ? "bg-[#F4EDE4] text-black hover:bg-[#C76B29] hover:text-white" 
                  : "bg-white/5 border border-white/10 text-white/40 cursor-not-allowed"
              }`}
            >
              Publish to Direct Marketplace UI
              <svg className="w-3.5 h-3.5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2">
                <line x1="7" y1="17" x2="17" y2="7"></line>
                <polyline points="7 7 17 7 17 17"></polyline>
              </svg>
            </button>

          </form>
        </div>

        {/* Right Side: Metrics summary widgets */}
        <div className="lg:col-span-5 flex flex-col gap-6 justify-between">
          
          <div className="grid grid-cols-2 gap-4">
            {metrics.map((met, idx) => (
              <div 
                key={idx} 
                className="liquid-glass border border-white/5 p-4 rounded-[1.5rem] text-left flex flex-col justify-between h-[100px]"
              >
                <span className="text-[10px] text-[#F4EDE4]/40 font-body uppercase font-medium tracking-wider leading-none">
                  {met.label}
                </span>
                <span className="font-heading italic text-2xl text-white tracking-wide">
                  {met.val}
                </span>
              </div>
            ))}
          </div>

          {/* Interactive Live Ledger Logs */}
          <div className="liquid-glass-strong border border-white/5 p-5 rounded-[1.5rem] flex-1 flex flex-col justify-between min-h-[300px]">
            <div>
              <div className="flex items-center gap-1.5 mb-3.5 text-[#F6C453]">
                <span className="text-[10px] font-mono font-bold tracking-widest uppercase">
                  Live Contract Ledger Activity (Celo)
                </span>
              </div>
              
              <div className="flex flex-col gap-3 font-mono text-[9px] text-[#F4EDE4]/70 leading-snug">
                
                <div className="flex items-start gap-2 border-b border-white/5 pb-2">
                  <span className="text-green-400 shrink-0">[BLOCK 89M]</span>
                  <div className="text-left flex-1">
                    <span className="text-white font-semibold">Ready:</span> Minted certificates from this dashboard will appear here.
                  </div>
                </div>

                <div className="flex items-start gap-2 border-b border-white/5 pb-2">
                  <span className="text-[#C76B29] shrink-0">[PAYMENTS]</span>
                  <div className="text-left flex-1">
                    <span className="text-white font-semibold">Enabled:</span> Buyers can pay with Razorpay INR or native CELO.
                  </div>
                </div>

                {mintedResult && (
                  <div className="flex items-start gap-2 border-b border-white/5 pb-2 text-green-300">
                    <span className="text-green-400 shrink-0">[NEW MINT]</span>
                    <div className="text-left flex-1">
                      <span className="font-semibold">Mint ERC-721:</span> Token #{mintedResult.tokenId}. Hash: {mintedResult.txHash}
                    </div>
                  </div>
                )}

              </div>
            </div>

            <div className="border-t border-white/5 pt-3.5 mt-4 text-left flex justify-between items-center">
              <span className="text-[9px] font-mono text-white/40 uppercase">Node synchronized</span>
              <span className="text-[9px] font-mono text-green-400 uppercase tracking-widest font-bold">online (Celo Sepolia)</span>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

export default Dashboard;
