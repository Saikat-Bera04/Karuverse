import { useState, useEffect, FormEvent } from "react";

interface Workshop {
  id: string;
  title: string;
  artisan: string;
  village: string;
  type: string;
  status: string;
  badgeColor: string;
  image: string;
  desc: string;
  time: string;
  participants: string;
}

interface WorkshopRoomProps {
  workshop: Workshop;
  onClose: () => void;
}

interface ChatMessage {
  user: string;
  text: string;
}

function WorkshopRoom({ workshop, onClose }: WorkshopRoomProps) {
  // Donation tipping states
  const [tipAmount, setTipAmount] = useState<number>(5);
  const [isTipping, setIsTipping] = useState<boolean>(false);
  const [tippedSuccess, setTippedSuccess] = useState<boolean>(false);

  // Chat message simulator state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { user: "Joy01", text: "This supplementary weaving requires so much patience!" },
    { user: "SarahCollector", text: "The detail on the ektara looks beautiful." },
    { user: "Web3Heritage", text: "Direct P2P tip incoming! Keep preserving culture." }
  ]);
  const [newMsg, setNewMsg] = useState<string>("");

  // Auto add comments periodically for realism
  useEffect(() => {
    const mockComments = [
      { user: "SureshB", text: "Amazing craftsmanship!" },
      { user: "EmmaCrafts", text: "Where can I buy this exact model on the marketplace?" },
      { user: "PriyaNadia", text: "So proud to see Nadia weavers showcasing globally!" },
      { user: "AliceTravels", text: "Is there an NFT certificate for this piece?" }
    ];

    const timer = setInterval(() => {
      const randomComment = mockComments[Math.floor(Math.random() * mockComments.length)];
      setChatMessages((prev) => [...prev, randomComment]);
    }, 4500);

    return () => clearInterval(timer);
  }, []);

  const handleSendChat = (e: FormEvent) => {
    e.preventDefault();
    if (!newMsg.trim()) return;
    setChatMessages((prev) => [...prev, { user: "You", text: newMsg }]);
    setNewMsg("");
  };

  const handleTip = () => {
    setIsTipping(true);
    setTippedSuccess(false);
    setTimeout(() => {
      setTippedSuccess(true);
      setIsTipping(false);
      setTimeout(() => setTippedSuccess(false), 2500);
    }, 1200);
  };

  return (
    <section className="relative w-screen min-h-screen overflow-hidden bg-black py-24 px-6 md:px-16 lg:px-20 select-none">
      
      {/* Glow points */}
      <div className="absolute top-[20%] left-[10%] w-[45vw] h-[45vh] rounded-full glow-crimson pointer-events-none z-1"></div>
      <div className="absolute bottom-[20%] right-[10%] w-[35vw] h-[35vh] rounded-full glow-gold pointer-events-none z-1"></div>

      <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col gap-6">
        
        {/* Top Header Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div className="flex items-center gap-4 text-left">
            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-full liquid-glass flex items-center justify-center text-white/80 hover:text-white border border-white/10 hover:border-white/20 transition-all shrink-0"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-red-500 text-white px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider">
                  Live Broadcast
                </span>
                <span className="text-[10px] font-mono text-[#F4EDE4]/50">Studio Room coords // Nadia PHL</span>
              </div>
              <h2 className="font-heading italic text-3xl md:text-4xl text-white mt-1">
                {workshop.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs text-white/60 font-body">Artisan Master: <span className="text-white font-medium">{workshop.artisan}</span></span>
            <span className="text-xs font-mono bg-white/5 border border-white/10 text-white px-3 py-1 rounded-full uppercase tracking-wider font-semibold">
              93 Active Viewers
            </span>
          </div>
        </div>

        {/* Workspace Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Simulated Stream Player */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            
            {/* Live stream player container */}
            <div className="h-[360px] md:h-[480px] bg-gradient-to-b from-[#A91D3A]/10 to-[#0F0F0F] rounded-[2rem] border border-white/10 flex flex-col justify-between p-6 relative overflow-hidden select-none alpana-texture">
              
              {/* Dynamic decorative canvas/visualizer */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-64 h-64 rounded-full bg-gradient-to-tr from-[#C76B29]/20 to-[#A91D3A]/20 flex items-center justify-center border border-white/5 animate-pulse relative">
                  <span className="text-8xl filter drop-shadow-2xl">🏺</span>
                  
                  {/* Rippling circles */}
                  <div className="absolute -inset-8 border border-[#F6C453]/10 rounded-full animate-ping"></div>
                </div>
              </div>

              {/* Status Row */}
              <div className="flex justify-between items-start z-10">
                <span className="bg-black/60 border border-white/10 text-white rounded px-2.5 py-1 text-[10px] font-mono flex items-center gap-1.5 uppercase tracking-wider">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping"></span>
                  1080p stream active
                </span>
                <span className="text-[10px] font-mono text-white/50">Audio: Dialect Translate Active (EN)</span>
              </div>

              {/* Controls overlay */}
              <div className="z-10 bg-black/60 border border-white/5 p-4 rounded-xl flex items-center justify-between font-body text-xs text-white">
                <div className="flex items-center gap-3">
                  <button className="text-white hover:text-[#C76B29] transition-colors">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                    </svg>
                  </button>
                  <span>Volume 85%</span>
                </div>
                <span>Sync Lag: 0.2s</span>
              </div>

            </div>

            {/* Narrative Context below stream */}
            <div className="p-5 liquid-glass-strong border border-white/5 rounded-[1.5rem] text-left">
              <h3 className="text-sm font-semibold text-white mb-2 uppercase tracking-wide">Studio Storyboard</h3>
              <p className="text-xs md:text-sm text-[#F4EDE4]/80 font-body font-light leading-relaxed">
                {workshop.desc} We are currently using a supplementary weft thread weaving loom. The patterns are designed to reflect the local folklore, mapping directly onto regional NFT certificates once registered.
              </p>
            </div>

          </div>

          {/* Right Column: Tips & Chat Panel */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* 1. TIP & DONATION WIDGET */}
            <div className="liquid-glass-strong border border-[#C76B29]/15 p-5 rounded-[1.5rem] text-left flex flex-col justify-between font-body clay-weathered">
              <div>
                <h4 className="text-xs font-semibold text-[#F6C453] uppercase tracking-widest mb-3.5 flex items-center gap-1.5">
                  🪙 Tip Direct via Blockchain
                </h4>
                <p className="text-[11px] text-[#F4EDE4]/60 font-light leading-snug mb-4">
                  Supporting this live workshop keeps this regional legacy alive. Tipping routes 100% direct capital to creator's synced wallet.
                </p>

                {/* Pricing slider for tips */}
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-white/60">Tip Amount (MATIC)</span>
                    <span className="font-semibold text-white font-mono">{tipAmount} MATIC</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="100" 
                    value={tipAmount} 
                    onChange={(e) => setTipAmount(parseInt(e.target.value))}
                    className="w-full accent-[#C76B29] cursor-pointer"
                  />
                </div>
              </div>

              {/* Tipping actions */}
              <div className="mt-5">
                {tippedSuccess ? (
                  <div className="bg-green-500/10 border border-green-500/30 text-green-400 py-3 rounded-full text-center text-xs font-semibold animate-fade-in font-mono">
                    ✓ Tip Routed direct to Biren basak!
                  </div>
                ) : (
                  <button
                    onClick={handleTip}
                    disabled={isTipping}
                    className="w-full bg-[#F4EDE4] text-black py-3 text-xs font-semibold rounded-full hover:bg-[#A91D3A] hover:text-white transition-all duration-300 uppercase tracking-wider flex items-center justify-center gap-1.5"
                  >
                    {isTipping ? "Securing Gas..." : "Confirm P2P Tip"}
                    <svg className="w-3.5 h-3.5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2">
                      <line x1="7" y1="17" x2="17" y2="7"></line>
                      <polyline points="7 7 17 7 17 17"></polyline>
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* 2. CHAT BOARD */}
            <div className="liquid-glass border border-white/5 p-4 rounded-[1.5rem] flex-1 flex flex-col justify-between min-h-[300px] h-[340px]">
              
              {/* Chat Feed */}
              <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-3.5 text-left mb-4">
                {chatMessages.map((msg, i) => (
                  <div key={i} className="text-xs leading-snug">
                    <span className="font-semibold text-[#F6C453] font-mono mr-1.5">{msg.user}:</span>
                    <span className="text-[#F4EDE4]/95 font-body font-light">{msg.text}</span>
                  </div>
                ))}
              </div>

              {/* Chat Send Form */}
              <form onSubmit={handleSendChat} className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Ask a question..."
                  value={newMsg}
                  onChange={(e) => setNewMsg(e.target.value)}
                  className="bg-black/40 border border-white/10 rounded-full px-4 py-2.5 text-xs text-white flex-1 focus:outline-none focus:border-[#C76B29]"
                />
                <button 
                  type="submit"
                  className="w-9 h-9 rounded-full bg-[#C76B29] text-white flex items-center justify-center hover:bg-[#C76B29]/80 transition-colors"
                >
                  <svg className="w-4 h-4 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </button>
              </form>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

export default WorkshopRoom;
