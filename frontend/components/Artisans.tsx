import { motion } from "framer-motion";
import FadingVideo from "./FadingVideo";

interface ArtisansProps {
  setCurrentPage: (page: string) => void;
}

function Artisans({ setCurrentPage }: ArtisansProps) {
  const cardData = [
    {
      title: "AI Storytelling",
      glowClass: "clay-glow-card",
      iconPath: "M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h14q.825 0 1.413.588T21 5v14q0 .825-.587 1.413T19 21H5Zm1-4h12l-3.75-5-3 4L9 13l-3 4Z",
      tags: ["AI Narration", "Folk Lore", "Digital Identity", "Multi-Lingual"],
      body: "AI analyzes traditional craft histories to create beautiful, multi-lingual narratives, translating ancient folklore into global sales."
    },
    {
      title: "Blockchain Soul",
      glowClass: "red-glow-card",
      iconPath: "M4 6.47 5.76 10H20v8H4V6.47M22 4h-4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.89-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4Z",
      tags: ["NFT Certificates", "Ownership Ledger", "Anti-Counterfeit", "Digital Soul"],
      body: "Every physical piece receives a tamper-proof NFT certificate of authenticity, validating regional heritage and tracking ownership history."
    },
    {
      title: "Smart Pricing",
      glowClass: "gold-glow-card",
      iconPath: "M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1Zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7Z",
      tags: ["Fair Trade", "Supply Chain", "Smart Guidelines", "Artisan Direct"],
      body: "Interactive pricing algorithms analyze supply costs and market value to recommend fair, highly sustainable pricing for rural creators."
    }
  ];

  return (
    <section className="relative w-screen min-h-screen overflow-hidden bg-black flex flex-col justify-between">
      
      {/* Background Cinematic Video with custom crossfade */}
      <FadingVideo 
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_094631_d30ab262-45ee-4b7d-99f3-5d5848c8ef13.mp4"
        className="absolute inset-0 w-full h-full object-cover z-0"
        style={{ opacity: 0 }}
      />

      {/* Ambient background glows */}
      <div className="absolute top-[20%] right-[10%] w-[50vw] h-[50vh] rounded-full glow-gold pointer-events-none z-1"></div>
      <div className="absolute bottom-[10%] left-[5%] w-[45vw] h-[45vh] rounded-full glow-clay pointer-events-none z-1"></div>

      {/* Content layout - relative z-10 */}
      <div className="relative z-10 px-6 md:px-16 lg:px-20 pt-24 pb-12 flex flex-col min-h-screen max-w-7xl mx-auto w-full">
        
        {/* Header (mb-auto) */}
        <div className="mb-auto text-left">
          {/* Kicker */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 0.8, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-sm font-body text-[#F4EDE4]/85 mb-4 uppercase tracking-widest flex items-center gap-2"
          >
            <span>//</span> Craftsmanship Evolved
          </motion.div>
          
          {/* Heading */}
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-heading italic text-[#F4EDE4] text-6xl md:text-7xl lg:text-[6rem] leading-[0.9] tracking-[-3px] max-w-xl"
          >
            Heritage
            <br />
            empowered
          </motion.h2>
        </div>

        {/* Three Cards (grid) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          {cardData.map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: idx * 0.15 }}
              className={`liquid-glass ${card.glowClass} p-6 min-h-[380px] flex flex-col border border-white/5 cursor-pointer rounded-[1.25rem] clay-weathered`}
              onClick={() => {
                if (idx === 0) setCurrentPage("dashboard");
                else if (idx === 1) setCurrentPage("marketplace");
                else setCurrentPage("about");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              
              {/* Top row of card (justify-between items-start) */}
              <div className="flex items-start justify-between gap-4">
                
                {/* Left: 44x44 nested liquid glass square with SVG */}
                <div className="w-11 h-11 rounded-[0.75rem] bg-white/5 flex items-center justify-center text-white border border-white/10 shrink-0">
                  <svg className="w-6 h-6 fill-current text-white" viewBox="0 0 24 24">
                    <path d={card.iconPath} />
                  </svg>
                </div>

                {/* Right: small tag chips */}
                <div className="flex flex-wrap justify-end gap-1.5 max-w-[70%]">
                  {card.tags.map((tag, tIdx) => (
                    <span 
                      key={tIdx} 
                      className="liquid-glass rounded-full px-2.5 py-1 text-[9px] text-[#F4EDE4]/80 border border-white/10 font-body uppercase tracking-wider whitespace-nowrap"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

              </div>

              {/* Spacer */}
              <div className="flex-1"></div>

              {/* Bottom of card */}
              <div className="mt-6">
                <h3 className="font-heading italic text-white text-3xl md:text-4xl tracking-[-1px] leading-none">
                  {card.title}
                </h3>
                <p className="mt-3 text-xs md:text-sm text-[#F4EDE4]/80 font-body font-light leading-relaxed max-w-[32ch]">
                  {card.body}
                </p>
                <div className="mt-4 flex items-center gap-1 text-[11px] font-semibold text-[#F6C453] uppercase tracking-wider group cursor-pointer">
                  Launch Console
                  <svg className="w-3 h-3 stroke-current transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 5"></polyline>
                  </svg>
                </div>
              </div>

            </motion.div>
          ))}
        </div>

      </div>

    </section>
  );
}

export default Artisans;
