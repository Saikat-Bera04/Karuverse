import { useState, FormEvent } from "react";

interface Product {
  id: string;
  name: string;
  craftType: string;
  region: string;
  artisan: string;
  price: number;
  desc: string;
  emoji: string;
  nftVerified: boolean;
  storySnippet?: string;
}

interface DashboardProps {
  addProduct: (product: Product) => void;
}

interface MintedResult {
  status: string;
  tokenId: number;
  txHash: string;
}

function Dashboard({ addProduct }: DashboardProps) {
  // Form states
  const [name, setName] = useState<string>("");
  const [craftType, setCraftType] = useState<string>("handloom");
  const [region, setRegion] = useState<string>("Nadia");
  const [artisan, setArtisan] = useState<string>("");
  const [rawNotes, setRawNotes] = useState<string>("");
  
  // AI and blockchain states
  const [isGeneratingStory, setIsGeneratingStory] = useState<boolean>(false);
  const [aiStory, setAiStory] = useState<string>("玛雅");
  const [isMinting, setIsMinting] = useState<boolean>(false);
  const [mintedResult, setMintedResult] = useState<MintedResult | null>(null);

  // Initialize story to empty
  useState(() => {
    setAiStory("");
  });

  // Stats / Metrics
  const metrics = [
    { label: "My Craft Sales", val: "14,890 MATIC" },
    { label: "NFT Certificates Minted", val: "34" },
    { label: "Live Workshops Hosted", val: "12" },
    { label: "Global Rating", val: "4.95 / 5.0" }
  ];

  // Helper AI generator
  const triggerAiGenerator = () => {
    if (!name || !artisan) {
      alert("Please fill in Craft Name and Artisan Name first!");
      return;
    }
    
    setIsGeneratingStory(true);
    setAiStory("");
    setTimeout(() => {
      const generatedCopy = `Meticulously handcrafted in ${region} district, this exquisite ${name} represents a standard of heritage maintained across four generations of ${artisan}'s family. Using entirely sustainable organic methods, each design carries deep regional symbols representing Bengal's rich folklore and direct connection to rural wisdom.`;
      setAiStory(generatedCopy);
      setIsGeneratingStory(false);
    }, 1800);
  };

  // Helper Blockchain Minter
  const triggerBlockchainMinter = () => {
    if (!aiStory) {
      alert("Please generate the AI Story description first before securing on blockchain!");
      return;
    }
    
    setIsMinting(true);
    setMintedResult(null);
    setTimeout(() => {
      const mockHash = "0x" + Array.from({length: 32}, () => 
        Math.floor(Math.random() * 16).toString(16)
      ).join("");
      
      setMintedResult({
        status: "SECURED ON POLYGON",
        tokenId: Math.floor(Math.random() * 90000) + 10000,
        txHash: `${mockHash.substring(0, 10)}...${mockHash.substring(28)}`
      });
      setIsMinting(false);
    }, 2000);
  };

  // Handle final submission to Marketplace catalog
  const handleRegisterProduct = (e: FormEvent) => {
    e.preventDefault();
    if (!name || !artisan || !aiStory || !mintedResult) {
      alert("Please complete the entire pipeline: 1. Input names, 2. Generate AI Story, 3. Mint Blockchain Certificate!");
      return;
    }

    // Assign appropriate emoji based on category
    let emoji = "🏺";
    if (craftType === "handloom") emoji = "🧵";
    else if (craftType === "dokra") emoji = "🏺"; // dokra brass
    else if (craftType === "alpana") emoji = "🎨";
    else if (craftType === "instruments") emoji = "🎸";

    const newCraftProduct: Product = {
      id: mintedResult.tokenId.toString(),
      name: name,
      craftType: craftType,
      region: region,
      artisan: artisan,
      price: Math.floor(Math.random() * 200) + 40,
      desc: aiStory,
      emoji: emoji,
      nftVerified: true,
      storySnippet: aiStory.substring(0, 80) + "..."
    };

    addProduct(newCraftProduct);
    
    // Clear forms
    setName("");
    setArtisan("");
    setRawNotes("");
    setAiStory("");
    setMintedResult(null);
    
    alert("Success! Craft secured and published to direct global marketplace catalog.");
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
                  Bengal Origin Origin
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
                </select>
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

              {/* Trigger 2: Blockchain minting */}
              {aiStory && (
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <button
                    type="button"
                    onClick={triggerBlockchainMinter}
                    disabled={isMinting}
                    className="w-full sm:w-auto bg-[#A91D3A] text-white px-5 py-2.5 text-xs font-semibold rounded-full hover:bg-[#A91D3A]/80 transition-colors shrink-0 flex items-center justify-center gap-2 uppercase tracking-wider"
                  >
                    {isMinting ? "Minting..." : "Mint Blockchain NFT Certificate"}
                  </button>
                  {mintedResult && (
                    <div className="text-[10px] text-green-400 font-mono flex flex-col text-left">
                      <span>✓ MINTED SUCCESS! Token ID: #{mintedResult.tokenId}</span>
                      <span className="text-white/40">Hash: {mintedResult.txHash}</span>
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* Final publication submit */}
            <button
              type="submit"
              disabled={!mintedResult}
              className={`w-full py-4 text-xs font-semibold rounded-full uppercase tracking-widest flex items-center justify-center gap-1 transition-all ${
                mintedResult 
                  ? "bg-[#F4EDE4] text-black hover:bg-[#C76B29] hover:text-white" 
                  : "bg-white/5 border border-white/10 text-white/40 cursor-not-allowed"
              }`}
            >
              Publish to Direct Marketplace
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
                  Live Contract Ledger Activity
                </span>
              </div>
              
              <div className="flex flex-col gap-3 font-mono text-[9px] text-[#F4EDE4]/70 leading-snug">
                
                <div className="flex items-start gap-2 border-b border-white/5 pb-2">
                  <span className="text-green-400 shrink-0">[BLOCK 89M]</span>
                  <div className="text-left flex-1">
                    <span className="text-white font-semibold">Mint ERC-721:</span> Published Nadia Jamdani Saree (Token #48201). Gas: 0.04 MATIC.
                  </div>
                </div>

                <div className="flex items-start gap-2 border-b border-white/5 pb-2">
                  <span className="text-[#C76B29] shrink-0">[ROYALTY]</span>
                  <div className="text-left flex-1">
                    <span className="text-white font-semibold">Secondary Sale Route:</span> 12 MATIC directed to Swarna Chitrakar's wallet.
                  </div>
                </div>

                <div className="flex items-start gap-2 border-b border-white/5 pb-2">
                  <span className="text-green-400 shrink-0">[BLOCK 88M]</span>
                  <div className="text-left flex-1">
                    <span className="text-white font-semibold">Mint ERC-721:</span> Published Bankura Terracotta Horse (Token #11283). Gas: 0.04 MATIC.
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <span className="text-[#F6C453] shrink-0">[SYNC]</span>
                  <div className="text-left flex-1">
                    <span className="text-white font-semibold">Live Dialect Translation:</span> Audio file processed from Shantiniketan village coordinates.
                  </div>
                </div>

              </div>
            </div>

            <div className="border-t border-white/5 pt-3.5 mt-4 text-left flex justify-between items-center">
              <span className="text-[9px] font-mono text-white/40 uppercase">Node synchronized</span>
              <span className="text-[9px] font-mono text-green-400 uppercase tracking-widest font-bold">online</span>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

export default Dashboard;
