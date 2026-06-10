import { motion } from "framer-motion";
import FadingVideo from "./FadingVideo";
import BlurText from "./BlurText";

interface HeroProps {
  setCurrentPage: (page: string) => void;
}

function Hero({ setCurrentPage }: HeroProps) {
  return (
    <section className="relative w-screen h-screen overflow-hidden bg-black flex flex-col justify-between select-none">
      
      {/* Background Cinematic Video with custom crossfade */}
      <FadingVideo 
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_080021_d598092b-c4c2-4e53-8e46-94cf9064cd50.mp4"
        className="absolute left-1/2 top-0 -translate-x-1/2 object-cover object-top z-0"
        style={{ width: "120%", height: "120%" }}
      />

      {/* Ambient background glow points (subtle, warm color) */}
      <div className="absolute top-[30%] left-[20%] w-[40vw] h-[40vh] rounded-full glow-clay pointer-events-none z-1"></div>
      <div className="absolute bottom-[20%] right-[10%] w-[35vw] h-[35vh] rounded-full glow-crimson pointer-events-none z-1"></div>

      {/* Main Container - z-10 for page overlay */}
      <div className="relative z-10 flex-1 flex flex-col justify-center items-center pt-24 px-4 text-center max-w-5xl mx-auto w-full">
        
        {/* 1. Badge (delay 0.4s) */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { filter: "blur(10px)", opacity: 0, y: 15 },
            visible: { filter: "blur(0px)", opacity: 1, y: 0, transition: { delay: 0.4, duration: 0.6 } }
          }}
          className="liquid-glass rounded-full p-1.5 flex items-center gap-2 max-w-full md:max-w-max select-none cursor-pointer hover:bg-white/10 hover:shadow-[0_0_15px_rgba(169,29,58,0.2)] transition-all duration-300 border border-white/10"
          onClick={() => setCurrentPage("workshop")}
        >
          <span className="bg-[#A91D3A] text-white px-3 py-1 text-xs font-semibold rounded-full uppercase tracking-wider relative overflow-hidden flex items-center gap-1">
            <span className="h-1.5 w-1.5 bg-white rounded-full animate-ping"></span>
            Live
          </span>
          <span className="text-xs md:text-sm text-[#F4EDE4]/95 font-body pr-3 flex items-center gap-1">
            Bengali Handloom Weaving Live in Shantiniketan
            <svg className="w-3.5 h-3.5 stroke-current inline" fill="none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="7" y1="17" x2="17" y2="7"></line>
              <polyline points="7 7 17 7 17 17"></polyline>
            </svg>
          </span>
        </motion.div>

        {/* 2. Headline - BlurText word-by-word animation (starts automatically) */}
        <div className="mt-6 max-w-3xl">
          <BlurText 
            text="Where Bengal's Heritage Meets the Future" 
            className="text-5xl md:text-7xl lg:text-[5.5rem] font-heading italic text-[#F4EDE4] leading-[0.8] max-w-3xl justify-center tracking-[-3px] alpana-texture drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
          />
        </div>

        {/* 3. Subheading (delay 0.8s) */}
        <motion.p 
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { filter: "blur(10px)", opacity: 0, y: 20 },
            visible: { filter: "blur(0px)", opacity: 0.9, y: 0, transition: { delay: 0.8, duration: 0.6 } }
          }}
          className="mt-6 text-sm md:text-base text-[#F4EDE4]/80 max-w-2xl font-body font-light leading-relaxed px-4"
        >
          Discover authentic Bengali craftsmanship directly from the creators — empowered by AI storytelling, smart translation, fair pricing recommendations, and blockchain-backed NFT certificates.
        </motion.p>

        {/* 4. CTAs (delay 1.1s) */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { filter: "blur(10px)", opacity: 0, y: 20 },
            visible: { filter: "blur(0px)", opacity: 1, y: 0, transition: { delay: 1.1, duration: 0.6 } }
          }}
          className="flex items-center gap-6 mt-8"
        >
          {/* Primary CTA */}
          <button 
            onClick={() => {
              setCurrentPage("marketplace");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="liquid-glass-strong rounded-full px-6 py-3 text-sm font-semibold text-[#F4EDE4] flex items-center gap-2 hover:bg-[#C76B29] hover:shadow-[0_0_20px_rgba(199,107,41,0.4)] transition-all duration-300 scale-105 active:scale-95 border border-white/10"
          >
            Start Exploring
            <svg className="h-4.5 w-4.5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="7" y1="17" x2="17" y2="7"></line>
              <polyline points="7 7 17 7 17 17"></polyline>
            </svg>
          </button>
          
          {/* Secondary CTA */}
          <button 
            onClick={() => {
              setCurrentPage("about");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex items-center gap-2 text-sm font-medium text-[#F4EDE4] hover:text-[#F6C453] transition-colors duration-300 group"
          >
            Our Mission
            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#A91D3A]/20 group-hover:border-[#A91D3A]/40 transition-all duration-300">
              <svg className="w-3.5 h-3.5 fill-current text-white" viewBox="0 0 24 24">
                <polygon points="6 4 20 12 6 20 6 4"></polygon>
              </svg>
            </div>
          </button>
        </motion.div>

        {/* 5. Stats Row (delay 1.3s) */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { filter: "blur(10px)", opacity: 0, y: 20 },
            visible: { filter: "blur(0px)", opacity: 1, y: 0, transition: { delay: 1.3, duration: 0.6 } }
          }}
          className="flex flex-col sm:flex-row items-stretch gap-4 mt-10 md:mt-12"
        >
          {/* Card 1 */}
          <div className="liquid-glass clay-glow-card p-5 w-[220px] rounded-[1.25rem] flex flex-col text-left justify-between h-[130px] border border-white/5 hover:scale-105 transition-all duration-300">
            <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-[#C76B29] border border-white/5">
              <svg className="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <div>
              <div className="font-heading italic text-3xl md:text-4xl text-white tracking-[-1px] leading-none">
                Live
              </div>
              <p className="text-[11px] text-[#F4EDE4]/60 font-body font-light mt-1.5">
                API Connected
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="liquid-glass red-glow-card p-5 w-[220px] rounded-[1.25rem] flex flex-col text-left justify-between h-[130px] border border-white/5 hover:scale-105 transition-all duration-300">
            <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-[#A91D3A] border border-white/5">
              <svg className="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
            </div>
            <div>
              <div className="font-heading italic text-3xl md:text-4xl text-white tracking-[-1px] leading-none">
                Celo
              </div>
              <p className="text-[11px] text-[#F4EDE4]/60 font-body font-light mt-1.5">
                Provenance Layer
              </p>
            </div>
          </div>
        </motion.div>

      </div>



    </section>
  );
}

export default Hero;
