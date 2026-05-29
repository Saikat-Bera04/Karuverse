import { motion } from "framer-motion";

function About() {
  const timelineItems = [
    {
      year: "Ancient Roots",
      title: "Bengal's Flourishing Heritage",
      desc: "Traditional handloom weaving (Jamdani, Baluchari) and terracotta pottery flourish in rural villages, establishing global renown for craftsmanship and cultural storytelling."
    },
    {
      year: "20th Century",
      title: "The Crisis of Middlemen",
      desc: "Rural creators face economic exploitation. Middlemen grab up to 80% of sales, while cheap industrial imitations and machine prints flood global markets, eroding heritage."
    },
    {
      year: "KaruVerse Launch",
      title: "Direct Digital Empowerment",
      desc: "KaruVerse is initialized, giving rural artisans direct access to international collectors by bypassing brokers and setting up self-running digital store nodes."
    },
    {
      year: "The Future Today",
      title: "AI + Web3 Symbiosis",
      desc: "By combining AI translation pipelines and Polygon smart contracts, Bengali artisans verify regional signatures, claim direct payments, and receive secondary market royalties autonomously."
    }
  ];

  const testimonials = [
    {
      name: "Biren Basak",
      role: "Weaver, Nadia District",
      quote: "Before KaruVerse, I had to sell my Jamdani sarees to local agents for small fractions. Now, I see my work verified on the blockchain, and collectors buy from me directly."
    },
    {
      name: "Sophia Martinez",
      role: "Heritage Collector, New York",
      quote: "The ability to scan a wood-tag QR and read the exact creative folklore behind my Terracotta horse, knowing the funds went directly to Madan's family, is a breakthrough in ethical purchase."
    },
    {
      name: "Ananya Sen",
      role: "Director, Rural Craft NGO",
      quote: "KaruVerse uses cutting-edge technology not to displace rural hands, but to celebrate and protect them. This is the model of sustainable cultural preservation."
    }
  ];

  return (
    <section className="relative w-screen min-h-screen overflow-hidden bg-black py-24 px-6 md:px-16 lg:px-20 select-none">
      
      {/* Glow points */}
      <div className="absolute top-[20%] right-[10%] w-[50vw] h-[50vh] rounded-full glow-gold pointer-events-none z-1"></div>
      <div className="absolute bottom-[10%] left-[5%] w-[45vw] h-[45vh] rounded-full glow-clay pointer-events-none z-1"></div>

      <div className="relative z-10 max-w-5xl mx-auto w-full flex flex-col items-center">
        
        {/* About Mission Header */}
        <div className="text-left w-full mb-20">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.8 }}
            viewport={{ once: true }}
            className="text-xs font-body text-[#A91D3A] uppercase tracking-widest mb-3"
          >
            // Deep Mission Focus
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-heading italic text-5xl md:text-6xl lg:text-7xl text-white tracking-tight leading-none mb-6"
          >
            Preserving Heritage.
            <br />
            Empowering Artisans.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 0.7, y: 0 }}
            viewport={{ once: true }}
            className="text-[#F4EDE4]/80 font-body font-light text-sm md:text-base leading-relaxed max-w-2xl"
          >
            Every physical art piece carries a soul, an ancient village narrative, and centuries of collective wisdom. KaruVerse exists to bridge deep technology and traditional craftsmanship, securing sustainable livelihoods for rural creators through Web3 proof and AI-powered storytelling.
          </motion.p>
        </div>

        {/* 1. CULTURAL STORYTELLING TIMELINE */}
        <div className="w-full flex flex-col items-start text-left mb-24 relative">
          <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-white/10"></div>
          
          <div className="text-xs text-[#F6C453] uppercase tracking-widest font-semibold mb-10 font-body">
            // Cultural Storytelling Timeline
          </div>

          <div className="flex flex-col gap-12 w-full">
            {timelineItems.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className="flex items-start gap-6 relative"
              >
                
                {/* Timeline dot */}
                <div className="w-8 h-8 rounded-full bg-[#0F0F0F] border-2 border-[#C76B29] flex items-center justify-center text-[10px] text-white shrink-0 z-10 font-mono font-bold">
                  {idx + 1}
                </div>

                <div>
                  <span className="text-xs font-mono font-bold text-[#F6C453] uppercase tracking-wider">
                    {item.year}
                  </span>
                  <h3 className="font-heading italic text-2xl text-white mt-1">
                    {item.title}
                  </h3>
                  <p className="text-xs md:text-sm text-[#F4EDE4]/70 font-body font-light leading-relaxed mt-2 max-w-2xl">
                    {item.desc}
                  </p>
                </div>

              </motion.div>
            ))}
          </div>
        </div>

        {/* 2. COMMUNITY TESTIMONIALS */}
        <div className="w-full flex flex-col items-start mb-24">
          <div className="text-xs text-[#C76B29] uppercase tracking-widest font-semibold mb-10 font-body">
            // Community Voices
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
            {testimonials.map((test, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.1 }}
                className="liquid-glass border border-white/5 p-6 rounded-[2rem] flex flex-col justify-between min-h-[220px] clay-weathered hover:border-white/10 transition-colors"
              >
                <p className="text-xs md:text-sm text-[#F4EDE4]/80 font-body font-light leading-relaxed italic">
                  &ldquo;{test.quote}&rdquo;
                </p>
                <div className="mt-6 border-t border-white/5 pt-4">
                  <h4 className="text-xs font-semibold text-white uppercase tracking-wider">{test.name}</h4>
                  <p className="text-[10px] text-[#F4EDE4]/50 font-body font-light mt-0.5">{test.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 3. IMPACT METRICS ROW */}
        <div className="w-full border-t border-b border-white/10 py-8 flex flex-wrap items-center justify-around gap-6 mb-20 text-center font-body">
          <div>
            <span className="text-2xl md:text-3xl font-heading italic text-white leading-none">340+</span>
            <p className="text-[10px] text-[#F4EDE4]/40 uppercase tracking-widest mt-1">Artisans Secured</p>
          </div>
          <div>
            <span className="text-2xl md:text-3xl font-heading italic text-white leading-none">14+</span>
            <p className="text-[10px] text-[#F4EDE4]/40 uppercase tracking-widest mt-1">Connected Villages</p>
          </div>
          <div>
            <span className="text-2xl md:text-3xl font-heading italic text-white leading-none">890.5k MATIC</span>
            <p className="text-[10px] text-[#F4EDE4]/40 uppercase tracking-widest mt-1">Volume Exchanged</p>
          </div>
          <div>
            <span className="text-2xl md:text-3xl font-heading italic text-white leading-none">1,840+</span>
            <p className="text-[10px] text-[#F4EDE4]/40 uppercase tracking-widest mt-1">NFT Certificates</p>
          </div>
        </div>

        {/* 4. FOOTER */}
        <footer className="w-full border-t border-white/5 pt-12 pb-6 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-[#F4EDE4]/50 font-body">
          <div className="text-left">
            <span className="font-heading italic text-lg text-white">KaruVerse</span>
            <p className="mt-1 text-[10px] font-light">
              An AI + Web3 cultural commerce platform preserving Bengal's craftsmanship.
            </p>
          </div>
          <div className="flex items-center gap-6 font-medium text-white/70">
            <span className="hover:text-[#C76B29] cursor-pointer">Mission</span>
            <span className="hover:text-[#A91D3A] cursor-pointer">Discord Community</span>
            <span className="hover:text-[#F6C453] cursor-pointer">GitHub Codebase</span>
          </div>
          <div>
            <span>&copy; 2026 KaruVerse Project. Made for preserving culture.</span>
          </div>
        </footer>

      </div>

    </section>
  );
}

export default About;
