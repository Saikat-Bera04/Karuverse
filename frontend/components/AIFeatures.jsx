const { useState } = React;

function AIFeatures() {
  const { motion } = window.Motion;
  const [activeFeature, setActiveFeature] = useState(0);

  // Translation Simulation State
  const [transInput, setTransInput] = useState("এই জামদানি শাড়িটি আমাদের গ্রামে তাঁত বোনা হয়েছে।");
  const [isTranslating, setIsTranslating] = useState(false);
  const [transOutput, setTransOutput] = useState("");

  const simulateTranslation = () => {
    setIsTranslating(true);
    setTransOutput("");
    setTimeout(() => {
      setTransOutput("This Jamdani saree was meticulously hand-woven in our village, carrying generations of loom heritage and rural patterns.");
      setIsTranslating(false);
    }, 1500);
  };

  // Pricing Assistant Simulation State
  const [hoursSpent, setHoursSpent] = useState(18);
  const [materialCost, setMaterialCost] = useState(120); // in MATIC

  const baseArtisanWage = 8; // MATIC per hour
  const platformFee = 0.05; // 5%
  const recommendedPrice = Math.round((hoursSpent * baseArtisanWage + materialCost) * (1 + platformFee));

  const features = [
    {
      title: "AI Storytelling",
      kicker: "Connecting Hearts to Loom",
      description: "Rural artisans narrate their personal struggles and inspiration in local dialects. Our AI models analyze and transform these raw voice recordings into rich, poetic, and market-ready product narratives that speak to global collectors.",
      demoLabel: "Creative Storytelling Demonstration",
      icon: (
        <svg className="w-5 h-5 text-[#C76B29]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    {
      title: "Smart Dialect Translation",
      kicker: "Breaking Language Barriers",
      description: "Direct-to-consumer commerce fails when creators cannot speak global languages. Our AI translates regional Bengali dialects (from Shantiniketan, Bankura, and Nadia) into flawless English, French, and Japanese instantly.",
      demoLabel: "Dialect Translation Engine",
      icon: (
        <svg className="w-5 h-5 text-[#A91D3A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 11.37 7.31 16.5 3 17" />
        </svg>
      )
    },
    {
      title: "AI Pricing Assistant",
      kicker: "Guaranteeing Fair Wages",
      description: "Artisans are often exploited by middlemen due to lack of market data. KaruVerse's pricing model uses raw inputs (weaving hours, materials, logistics, and traditional complexity scores) to recommend fair-trade prices.",
      demoLabel: "Algorithmic Pricing Matrix",
      icon: (
        <svg className="w-5 h-5 text-[#F6C453]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      title: "Personalized Storefronts",
      kicker: "Autonomous Digital Spaces",
      description: "Setting up e-commerce stores is a technical hurdle. KaruVerse automatically creates personalized, zero-maintenance web storefronts for every registered artisan, complete with integrated Web3 wallet connections and localized chat.",
      demoLabel: "Automated Storefront Preview",
      icon: (
        <svg className="w-5 h-5 text-[#F4EDE4]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    }
  ];

  return (
    <section className="relative w-screen min-h-screen overflow-hidden bg-[#0F0F0F] py-24 px-6 md:px-16 lg:px-20 select-none">
      
      {/* Background patterns */}
      <div className="absolute top-[10%] left-[45%] w-[35vw] h-[35vh] rounded-full glow-clay pointer-events-none z-1"></div>
      <div className="absolute bottom-[10%] right-[35%] w-[40vw] h-[40vh] rounded-full glow-crimson pointer-events-none z-1"></div>

      <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col items-center">
        
        {/* Section Header */}
        <div className="text-center mb-16 max-w-2xl">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.8 }}
            viewport={{ once: true }}
            className="text-xs font-body text-[#C76B29] uppercase tracking-widest mb-3"
          >
            // Deep Tech Meets Traditional Hands
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-heading italic text-5xl md:text-6xl text-white tracking-tight"
          >
            AI Suite for Artisans
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 0.7, y: 0 }}
            viewport={{ once: true }}
            className="text-[#F4EDE4]/70 font-body font-light text-sm md:text-base mt-4"
          >
            Our specialized machine learning pipeline automates localization, authentic pricing, and gorgeous copywriting, allowing artisans to focus purely on their craft.
          </motion.p>
        </div>

        {/* Split Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full items-stretch">
          
          {/* Left Column: Menu Toggles (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-3 justify-center">
            {features.map((feat, idx) => {
              const isActive = activeFeature === idx;
              return (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setActiveFeature(idx)}
                  className={`p-5 rounded-[1.25rem] border transition-all duration-500 cursor-pointer flex items-center gap-4 ${
                    isActive 
                      ? "liquid-glass-strong border-[#C76B29]/30 bg-white/5" 
                      : "liquid-glass border-white/5 hover:border-white/10"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${
                    isActive ? "bg-white/10 border-white/20" : "bg-white/5 border-white/5"
                  }`}>
                    {feat.icon}
                  </div>
                  <div>
                    <h3 className={`font-heading italic text-xl md:text-2xl tracking-wide transition-colors ${
                      isActive ? "text-white" : "text-[#F4EDE4]/60"
                    }`}>
                      {feat.title}
                    </h3>
                    <p className="text-[11px] text-[#F4EDE4]/50 font-body font-light uppercase tracking-wider mt-0.5">
                      {feat.kicker}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Right Column: Dynamic Preview Screen (7 cols) */}
          <div className="lg:col-span-7 flex flex-col">
            <motion.div
              key={activeFeature}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="liquid-glass-strong border border-white/5 rounded-[1.5rem] p-6 md:p-8 flex flex-col justify-between flex-1 min-h-[440px] alpana-texture"
            >
              
              {/* Card Top */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="h-2 w-2 rounded-full bg-[#C76B29] animate-pulse"></span>
                  <span className="text-[11px] font-semibold text-[#F6C453] uppercase tracking-wider font-body">
                    {features[activeFeature].kicker}
                  </span>
                </div>
                <h4 className="font-heading italic text-4xl text-white tracking-wide leading-none mb-4">
                  {features[activeFeature].title}
                </h4>
                <p className="text-sm text-[#F4EDE4]/80 font-body font-light leading-relaxed">
                  {features[activeFeature].description}
                </p>
              </div>

              {/* Card Middle: Interactive Simulation Panel */}
              <div className="my-6 p-4 rounded-xl bg-black/40 border border-white/5 flex flex-col gap-3 font-body">
                <div className="text-xs text-[#F4EDE4]/40 uppercase tracking-widest font-semibold">
                  {features[activeFeature].demoLabel}
                </div>

                {/* 1. Storytelling Demo */}
                {activeFeature === 0 && (
                  <div className="flex flex-col gap-2 text-xs text-[#F4EDE4]/80 italic">
                    <p className="border-l border-[#C76B29] pl-3 py-1 bg-white/2">
                      &ldquo;My name is Biren. For three weeks I sat at my loom, feeding red silks from Nadia. My hands were tired, but my grandmother's patterns kept my mind alive...&rdquo;
                    </p>
                    <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-[#F6C453] font-normal not-italic font-sans">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping"></span>
                      AI-generated copy successfully minted on Polygon certificate ledger.
                    </div>
                  </div>
                )}

                {/* 2. Translation Demo */}
                {activeFeature === 1 && (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-[#F4EDE4]/50 uppercase">Bengali Dialect:</span>
                      <input 
                        type="text" 
                        value={transInput} 
                        onChange={(e) => setTransInput(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-[#F4EDE4] flex-1 focus:outline-none focus:border-[#A91D3A]"
                      />
                    </div>
                    <button
                      onClick={simulateTranslation}
                      disabled={isTranslating}
                      className="bg-[#A91D3A] text-white px-3 py-1.5 text-xs font-semibold rounded hover:bg-[#A91D3A]/80 transition-colors self-start flex items-center gap-1.5"
                    >
                      {isTranslating ? (
                        <>
                          <svg className="animate-spin h-3.5 w-3.5 text-current" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Translating...
                        </>
                      ) : "Trigger Translation"}
                    </button>
                    {transOutput && (
                      <div className="text-xs text-white/95 bg-white/2 border-l-2 border-[#A91D3A] pl-3 py-1.5 font-light leading-relaxed animate-fade-in">
                        {transOutput}
                      </div>
                    )}
                  </div>
                )}

                {/* 3. Pricing Assistant Demo */}
                {activeFeature === 2 && (
                  <div className="flex flex-col gap-3.5 text-xs">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between items-center text-[11px] text-[#F4EDE4]/60">
                        <span>Weaving / Crafting Time:</span>
                        <span className="font-semibold text-white">{hoursSpent} Hours</span>
                      </div>
                      <input 
                        type="range" 
                        min="2" 
                        max="80" 
                        value={hoursSpent} 
                        onChange={(e) => setHoursSpent(parseInt(e.target.value))}
                        className="w-full accent-[#C76B29] cursor-pointer"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between items-center text-[11px] text-[#F4EDE4]/60">
                        <span>Raw Material Cost:</span>
                        <span className="font-semibold text-white">{materialCost} MATIC</span>
                      </div>
                      <input 
                        type="range" 
                        min="10" 
                        max="500" 
                        value={materialCost} 
                        onChange={(e) => setMaterialCost(parseInt(e.target.value))}
                        className="w-full accent-[#C76B29] cursor-pointer"
                      />
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-white/10 mt-1">
                      <span className="font-medium text-[#F4EDE4]/80">Recommended Retail (100% direct):</span>
                      <span className="text-lg font-heading italic text-[#F6C453]">{recommendedPrice} MATIC</span>
                    </div>
                  </div>
                )}

                {/* 4. Storefront Demo */}
                {activeFeature === 3 && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-[#0F0F0F]/60 border border-white/5">
                    <div className="w-10 h-10 rounded-full bg-[#C76B29] flex items-center justify-center text-white shrink-0 text-lg font-heading italic font-bold border border-white/15">
                      B
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] font-semibold text-white">Biren Weavers.store</span>
                        <span className="text-[9px] bg-green-500/10 text-green-400 border border-green-500/20 px-1.5 py-0.5 rounded font-mono uppercase tracking-wider">online</span>
                      </div>
                      <p className="text-[10px] text-[#F4EDE4]/50 font-light mt-0.5">
                        23 Items · 18 Blockchain Certificates Verified
                      </p>
                    </div>
                  </div>
                )}

              </div>

              {/* Card Bottom CTA */}
              <div className="flex justify-between items-center pt-4 border-t border-white/5">
                <span className="text-[10px] text-[#F4EDE4]/40 font-body uppercase tracking-wider">
                  Status: Platform Integration Active
                </span>
                <span className="text-xs text-white hover:text-[#C76B29] cursor-pointer font-semibold transition-colors flex items-center gap-1">
                  Learn Details
                  <svg className="w-3.5 h-3.5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>

            </motion.div>
          </div>

        </div>

      </div>

    </section>
  );
}

window.AIFeatures = AIFeatures;
