import { useState, useMemo } from "react";
import { motion } from "framer-motion";

import { Product } from "@/types/product";

interface MarketplaceProps {
  products: Product[];
  setSelectedProduct: (product: Product | null) => void;
  setCurrentPage: (page: string) => void;
}

function Marketplace({ products, setSelectedProduct, setCurrentPage }: MarketplaceProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCraft, setSelectedCraft] = useState<string>("all");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [onlyVerified, setOnlyVerified] = useState<boolean>(false);

  const craftCategories = [
    { id: "all", label: "All Crafts" },
    { id: "handloom", label: "Handloom Weaving" },
    { id: "terracotta", label: "Terracotta Clay" },
    { id: "dokra", label: "Dokra Brass Art" },
    { id: "alpana", label: "Alpana & Wood" },
    { id: "instruments", label: "Folk Instruments" }
  ];

  const regions = [
    { id: "all", label: "All Regions" },
    { id: "Nadia", label: "Nadia" },
    { id: "Bankura", label: "Bankura" },
    { id: "Burdwan", label: "Burdwan" },
    { id: "Shantiniketan", label: "Shantiniketan" },
    { id: "Birbhum", label: "Birbhum" }
  ];

  // Filtered Products Memo
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      const matchesSearch = 
        prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.artisan.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.desc.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCraft = selectedCraft === "all" || prod.craftType === selectedCraft;
      const matchesRegion = selectedRegion === "all" || prod.region === selectedRegion;
      const matchesVerified = !onlyVerified || prod.nftVerified;

      return matchesSearch && matchesCraft && matchesRegion && matchesVerified;
    });
  }, [products, searchQuery, selectedCraft, selectedRegion, onlyVerified]);

  return (
    <section className="relative w-screen min-h-screen overflow-hidden bg-black py-24 px-6 md:px-16 lg:px-20 select-none">
      
      {/* Background glow points */}
      <div className="absolute top-[20%] left-[10%] w-[45vw] h-[45vh] rounded-full glow-clay pointer-events-none z-1"></div>
      <div className="absolute bottom-[20%] right-[10%] w-[35vw] h-[35vh] rounded-full glow-gold pointer-events-none z-1"></div>

      <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col">
        
        {/* Marketplace Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="text-left max-w-xl">
            <div className="text-xs font-body text-[#C76B29] uppercase tracking-widest mb-3">
              // Peer-To-Peer Cultural Trade
            </div>
            <h2 className="font-heading italic text-5xl md:text-6xl text-white tracking-tight leading-none">
              Artisan Marketplace
            </h2>
            <p className="text-[#F4EDE4]/60 font-body font-light text-xs md:text-sm mt-3">
              Buy direct from national-award winning master artisans. Every purchase routes 95% of capital directly into their local bank accounts, logged on the ledger.
            </p>
          </div>

          {/* Quick Dashboard link */}
          <button 
            onClick={() => setCurrentPage("dashboard")}
            className="liquid-glass border border-white/10 text-white rounded-full px-5 py-2.5 text-xs font-semibold uppercase tracking-wider hover:bg-white/5 hover:border-[#C76B29]/30 transition-all self-start md:self-auto"
          >
            Artisan Portal Console
          </button>
        </div>

        {/* Search, Tag Filters & Toggle row */}
        <div className="flex flex-col gap-6 mb-10 p-5 liquid-glass border border-white/5 rounded-[1.5rem] font-body">
          
          {/* Top row: Search input & region drop */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            
            {/* Search input */}
            <div className="md:col-span-8 relative">
              <input 
                type="text" 
                placeholder="Search by product name, craftsman, or village folklore..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0F0F0F]/60 border border-white/10 rounded-full px-5 py-3 text-sm text-white focus:outline-none focus:border-[#C76B29] pl-11"
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
                <svg className="w-4 h-4 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
            </div>

            {/* Region dropdown */}
            <div className="md:col-span-4">
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full bg-[#0F0F0F]/60 border border-white/10 rounded-full px-5 py-3 text-sm text-[#F4EDE4]/80 focus:outline-none focus:border-[#C76B29]"
              >
                {regions.map((reg) => (
                  <option key={reg.id} value={reg.id} className="bg-black">
                    {reg.label}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* Bottom row: Category capsule list & checkbox */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-t border-white/5 pt-4">
            
            {/* Category capsules */}
            <div className="flex flex-wrap items-center gap-2">
              {craftCategories.map((craft) => {
                const isActive = selectedCraft === craft.id;
                return (
                  <button
                    key={craft.id}
                    onClick={() => setSelectedCraft(craft.id)}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                      isActive 
                        ? "bg-[#C76B29] text-white shadow-sm shadow-[#C76B29]/20" 
                        : "bg-white/5 text-white/70 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {craft.label}
                  </button>
                );
              })}
            </div>

            {/* Verify toggle */}
            <label className="flex items-center gap-2.5 cursor-pointer text-xs text-[#F4EDE4]/80 select-none">
              <input 
                type="checkbox"
                checked={onlyVerified}
                onChange={(e) => setOnlyVerified(e.target.checked)}
                className="w-4 h-4 accent-[#A91D3A] rounded border-white/10"
              />
              <span className="flex items-center gap-1">
                🛡️ Only Blockchain Verified (NFTs)
              </span>
            </label>

          </div>

        </div>

        {/* Dynamic Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((prod, idx) => (
              <motion.div
                key={prod.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className="liquid-glass border border-white/5 p-4 rounded-[2rem] flex flex-col justify-between h-[420px] clay-glow-card cursor-pointer group"
                onClick={() => setSelectedProduct(prod)}
              >
                
                {/* Visual Image container */}
                <div className="h-52 bg-gradient-to-b from-white/2 to-white/5 rounded-[1.5rem] border border-white/5 flex items-center justify-center relative overflow-hidden shrink-0 select-none">
                  {prod.images?.[0] ? (
                    <img src={prod.images[0]} alt={prod.name} className="absolute inset-0 h-full w-full object-cover" />
                  ) : (
                    <span className="text-[10px] uppercase tracking-widest text-white/35">No image</span>
                  )}
                  
                  {/* Web3 verified tag */}
                  {prod.nftVerified && (
                    <span className="absolute top-3 right-3 bg-green-500/10 text-green-400 border border-green-500/25 px-2 py-0.5 rounded text-[8px] font-mono font-semibold uppercase tracking-wider">
                      NFT SECURED
                    </span>
                  )}

                  {/* Subtle pattern background */}
                  <div className="absolute inset-0 opacity-5 bg-repeat" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cpath fill='%23FFF' fill-opacity='1' d='M20 0 L40 20 L20 40 L0 20 Z'/%3E%3C/svg%3E")` }}></div>
                </div>

                {/* Info details */}
                <div className="flex-1 mt-4 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-[#F6C453] uppercase font-mono font-semibold tracking-wider">
                        {prod.craftType}
                      </span>
                      <span className="text-[10px] text-[#F4EDE4]/50 font-body">
                        {prod.region} District
                      </span>
                    </div>

                    <h3 className="font-heading italic text-2xl text-white mt-1 group-hover:text-[#C76B29] transition-colors truncate">
                      {prod.name}
                    </h3>
                    <p className="text-[11px] text-[#F4EDE4]/60 font-body font-light mt-1.5 leading-snug line-clamp-2 italic">
                      &ldquo;{prod.storySnippet || prod.desc}&rdquo;
                    </p>
                  </div>

                  {/* Pricing row */}
                  <div className="flex justify-between items-center border-t border-white/5 pt-3.5 mt-2">
                    <div className="flex flex-col text-left">
                      <span className="text-[9px] text-[#F4EDE4]/40 uppercase font-body">Price</span>
                      <span className="text-sm font-semibold text-white font-mono">
                        {prod.currency === "CELO" ? `${prod.price} CELO` : `₹${prod.price}`}
                      </span>
                    </div>
                    <span className="bg-[#F4EDE4] text-black text-[11px] font-semibold px-4 py-1.5 rounded-full uppercase tracking-wider group-hover:bg-[#C76B29] group-hover:text-white transition-colors duration-300">
                      View Story
                    </span>
                  </div>
                </div>

              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white/2 border border-white/5 rounded-[2rem] p-8">
            <h3 className="font-heading italic text-2xl text-white mt-4">No Crafts Match Filters</h3>
            <p className="text-xs text-[#F4EDE4]/50 font-body mt-2">
              Try adjusting your query or selecting "All Crafts" to view full catalog.
            </p>
          </div>
        )}

      </div>

    </section>
  );
}

export default Marketplace;
