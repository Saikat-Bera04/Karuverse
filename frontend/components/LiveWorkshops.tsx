import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { apiFetch } from "@/lib/api";

interface Workshop {
  _id?: string;
  id?: string;
  title: string;
  artisan?: any;
  village?: string;
  type?: string;
  craftType?: string;
  status?: string;
  badgeColor?: string;
  image?: string;
  thumbnail?: string;
  desc?: string;
  description?: string;
  time?: string;
  participants?: string;
  startTime?: string;
  ticketPrice?: number;
  attendees?: any[];
  livekitRoomName?: string;
}

interface LiveWorkshopsProps {
  setCurrentPage: (page: string) => void;
  setActiveWorkshop?: (workshop: Workshop) => void;
}

function LiveWorkshops({ setCurrentPage, setActiveWorkshop }: LiveWorkshopsProps) {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiFetch<{ success: boolean; workshops: Workshop[] }>("/api/workshops/live")
      .then((data) => setWorkshops(data.workshops || []))
      .catch((error) => console.error("Failed to load workshops", error))
      .finally(() => setIsLoading(false));
  }, []);

  const handleJoin = (work: Workshop) => {
    if (!work._id && !work.id) {
      alert("Workshop must be created in the backend before joining.");
      return;
    }
    if (setActiveWorkshop) {
      setActiveWorkshop(work);
    }
    setCurrentPage("workshop_room");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="relative w-screen min-h-screen overflow-hidden bg-[#0F0F0F] py-24 px-6 md:px-16 lg:px-20 select-none">
      
      {/* Glow layers */}
      <div className="absolute top-[20%] left-[20%] w-[40vw] h-[40vh] rounded-full glow-clay pointer-events-none z-1"></div>
      <div className="absolute bottom-[20%] right-[20%] w-[35vw] h-[35vh] rounded-full glow-gold pointer-events-none z-1"></div>

      <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col items-center">
        
        {/* Section Header */}
        <div className="text-center mb-16 max-w-2xl">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.8 }}
            viewport={{ once: true }}
            className="text-xs font-body text-[#F6C453] uppercase tracking-widest mb-3"
          >
            // Masterclass Broadcasts
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-heading italic text-5xl md:text-6xl text-white tracking-tight"
          >
            Live Workshops
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 0.7, y: 0 }}
            viewport={{ once: true }}
            className="text-[#F4EDE4]/70 font-body font-light text-sm md:text-base mt-4"
          >
            Bridge the geographical distance. Enter virtual loom studios and pottery sheds, learn straight from award-winning masters, and tip creators in real-time.
          </motion.p>
        </div>

        {/* Grid cards */}
        {isLoading && (
          <div className="w-full text-center py-16 text-sm text-white/50 font-mono">
            Loading live workshops...
          </div>
        )}

        {!isLoading && workshops.length === 0 && (
          <div className="w-full text-center py-16 border border-white/5 rounded-[1.5rem] text-sm text-white/55">
            No live workshops are scheduled in MongoDB yet.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          {workshops.map((work, idx) => {
            const startTime = work.startTime ? new Date(work.startTime) : null;
            const isActive = startTime ? startTime.getTime() <= Date.now() : work.status === "ACTIVE";
            const artisan = typeof work.artisan === "object" ? work.artisan?.name : work.artisan;
            const village =
              typeof work.artisan === "object"
                ? [work.artisan?.village, work.artisan?.district].filter(Boolean).join(", ")
                : work.village;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: idx * 0.1 }}
                className="liquid-glass border border-white/5 p-6 rounded-[2rem] flex flex-col justify-between min-h-[280px] clay-weathered clay-glow-card relative hover:border-[#C76B29]/30"
              >
                {/* Holographic glowing borders on active */}
                {isActive && (
                  <div className="absolute inset-0 border border-red-500/20 rounded-[2rem] pointer-events-none animate-pulse"></div>
                )}

                {/* Top Row: Details & Tags */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] text-[#F6C453] font-body font-semibold uppercase tracking-wider">
                      {work.craftType || work.type || "Workshop"}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider ${
                      isActive ? "bg-red-500 text-white" : "bg-[#F6C453] text-black"
                    }`}>
                      {isActive ? "LIVE" : "UPCOMING"}
                    </span>
                  </div>
                  
                  {/* Title details */}
                  <div className="flex gap-4 items-start">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                      {work.thumbnail ? (
                        <img src={work.thumbnail} alt={work.title} className="h-full w-full object-cover" />
                      ) : (
                        <span className="text-[9px] text-white/35 uppercase">Live</span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-heading italic text-2xl md:text-3xl text-white tracking-wide leading-none">
                        {work.title}
                      </h3>
                      <p className="text-[10px] text-[#F4EDE4]/50 font-body mt-1">
                        By Master: <span className="text-[#F4EDE4] font-medium">{artisan || "Artisan"}</span>
                        {village ? ` · ${village}` : ""}
                      </p>
                    </div>
                  </div>

                  {/* Body description */}
                  <p className="text-xs md:text-sm text-[#F4EDE4]/70 font-body font-light leading-relaxed mt-4">
                    {work.description || work.desc}
                  </p>
                </div>

                {/* Bottom Row: Info and CTA */}
                <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-6">
                  <div className="flex flex-col text-left">
                    <span className="text-[9px] text-[#F4EDE4]/40 uppercase font-body">Timing / Status</span>
                    <span className="text-xs text-white font-medium">
                      {startTime ? startTime.toLocaleString() : work.time || "Scheduled"}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] text-[#F4EDE4]/50 font-mono">
                      {work.attendees?.length || 0} registered
                    </span>
                    <button
                      onClick={() => handleJoin(work)}
                      className={`px-5 py-2 text-xs font-semibold rounded-full flex items-center gap-1 transition-all duration-300 ${
                        isActive 
                          ? "bg-[#A91D3A] text-white hover:bg-white hover:text-black" 
                          : "bg-white/5 border border-white/10 text-white hover:bg-[#C76B29]"
                      }`}
                    >
                      {isActive ? "Join Live Stream" : "Book Spot"}
                      <svg className="w-3.5 h-3.5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2">
                        <line x1="7" y1="17" x2="17" y2="7"></line>
                        <polyline points="7 7 17 7 17 17"></polyline>
                      </svg>
                    </button>
                  </div>
                </div>

              </motion.div>
            );
          })}
        </div>

      </div>

    </section>
  );
}

export default LiveWorkshops;
