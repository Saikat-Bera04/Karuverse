import { useEffect, useState, FormEvent } from "react";
import { parseEther } from "viem";
import { useAccount } from "wagmi";
import { apiFetch } from "@/lib/api";
import {
  LiveKitRoom,
  VideoConference,
  RoomAudioRenderer,
} from "@livekit/components-react";
import "@livekit/components-styles";

interface Workshop {
  _id?: string;
  id?: string;
  title: string;
  artisan?: any;
  village?: string;
  type?: string;
  status?: string;
  badgeColor?: string;
  image?: string;
  desc?: string;
  description?: string;
  attendees?: any[];
}

interface WorkshopRoomProps {
  workshop: Workshop;
  onClose: () => void;
}

interface ChatMessage {
  user: string;
  text: string;
}

function WorkshopRoom({ workshop: initialWorkshop, onClose }: WorkshopRoomProps) {
  const { address } = useAccount();
  const [livekitUrl, setLivekitUrl] = useState<string>("");
  const [livekitToken, setLivekitToken] = useState<string>("");
  const [connectError, setConnectError] = useState<string>("");
  const [workshop, setWorkshop] = useState<Workshop>(initialWorkshop);
  
  // Custom states
  const [tipAmount, setTipAmount] = useState<number>(0.1);
  const [isTipping, setIsTipping] = useState<boolean>(false);
  const [tippedSuccess, setTippedSuccess] = useState<boolean>(false);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMsg, setNewMsg] = useState<string>("");

  useEffect(() => {
    const workshopId = initialWorkshop._id || initialWorkshop.id;
    if (!workshopId) {
      setConnectError("Workshop has no backend room id.");
      return;
    }

    apiFetch<{ success: boolean; workshop: Workshop; livekit: { url: string; token: string } }>(`/api/workshops/${workshopId}/join`, {
      method: "POST"
    })
      .then((data) => {
        // Store the full workshop data from backend (has populated artisan with walletAddress)
        if (data.workshop) {
          setWorkshop(data.workshop);
        }
        if (!data.livekit?.url || !data.livekit?.token) throw new Error("LiveKit URL/token missing from server response");
        setLivekitUrl(data.livekit.url);
        setLivekitToken(data.livekit.token);
      })
      .catch((error) => {
        console.error("Workshop join error:", error);
        setConnectError(error.message || "Could not connect to LiveKit");
      });
  }, [initialWorkshop._id, initialWorkshop.id]);

  const handleSendChat = (e: FormEvent) => {
    e.preventDefault();
    if (!newMsg.trim()) return;
    setChatMessages((prev) => [...prev, { user: "You", text: newMsg }]);
    setNewMsg("");
  };

  const handleTip = async () => {
    const artisanWallet =
      typeof workshop.artisan === "object" ? workshop.artisan?.walletAddress : undefined;
    
    if (!address) {
      alert("Please connect your Celo wallet first using the wallet button in the navigation bar.");
      return;
    }
    if (!artisanWallet) {
      alert("This artisan has not linked a wallet address yet. Tips will be available once they connect their wallet.");
      return;
    }

    setIsTipping(true);
    setTippedSuccess(false);
    try {
      const ethereum = (window as any).ethereum;
      if (!ethereum) {
        alert("No wallet extension found. Please install MetaMask or a compatible wallet.");
        return;
      }
      const txHash = await ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: address,
            to: artisanWallet,
            value: `0x${parseEther(String(tipAmount)).toString(16)}`
          }
        ]
      });
      setChatMessages((prev) => [...prev, { user: "You", text: `Sent ${tipAmount} CELO tip: ${txHash}` }]);
      setTippedSuccess(true);
    } catch (error: any) {
      alert(error.message || "Tip failed");
    } finally {
      setIsTipping(false);
    }
  };

  const artisan = typeof workshop.artisan === "object" ? workshop.artisan?.name : workshop.artisan;
  const village =
    typeof workshop.artisan === "object"
      ? [workshop.artisan?.village, workshop.artisan?.district].filter(Boolean).join(", ")
      : workshop.village;
      
  const canPublish = true;

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
                <span className="text-[10px] font-mono text-[#F4EDE4]/50">{village || "KaruVerse Studio"}</span>
              </div>
              <h2 className="font-heading italic text-3xl md:text-4xl text-white mt-1">
                {workshop.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs text-white/60 font-body">Artisan Master: <span className="text-white font-medium">{artisan || "Artisan"}</span></span>
            <span className="text-xs font-mono bg-white/5 border border-white/10 text-white px-3 py-1 rounded-full uppercase tracking-wider font-semibold">
              {workshop.attendees?.length || 0} Registered
            </span>
          </div>
        </div>

        {/* Workspace Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: LiveKit Player */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            
            {/* Live stream player container */}
            <div className="h-[480px] md:h-[600px] bg-gradient-to-b from-[#A91D3A]/10 to-[#0F0F0F] rounded-[2rem] border border-white/10 relative overflow-hidden select-none">
              {connectError ? (
                <div className="flex items-center justify-center h-full text-red-400 text-sm font-mono p-6 text-center">
                  {connectError}
                </div>
              ) : livekitUrl && livekitToken ? (
                <LiveKitRoom
                  video={canPublish}
                  audio={canPublish}
                  token={livekitToken}
                  serverUrl={livekitUrl}
                  data-lk-theme="default"
                  style={{ height: '100%', width: '100%' }}
                  connect={true}
                >
                  <VideoConference />
                  <RoomAudioRenderer />
                </LiveKitRoom>
              ) : (
                <div className="flex items-center justify-center h-full text-white/50 text-sm font-mono">
                  Connecting to LiveKit...
                </div>
              )}
            </div>

            {/* Narrative Context below stream */}
            <div className="p-5 liquid-glass-strong border border-white/5 rounded-[1.5rem] text-left">
              <h3 className="text-sm font-semibold text-white mb-2 uppercase tracking-wide">Studio Storyboard</h3>
              <p className="text-xs md:text-sm text-[#F4EDE4]/80 font-body font-light leading-relaxed">
                {workshop.description || workshop.desc}
              </p>
            </div>

          </div>

          {/* Right Column: Tips & Chat Panel */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* 1. TIP & DONATION WIDGET */}
            <div className="liquid-glass-strong border border-[#C76B29]/15 p-5 rounded-[1.5rem] text-left flex flex-col justify-between font-body clay-weathered">
              <div>
                <h4 className="text-xs font-semibold text-[#F6C453] uppercase tracking-widest mb-3.5 flex items-center gap-1.5">
                  Tip Direct via CELO
                </h4>
                <p className="text-[11px] text-[#F4EDE4]/60 font-light leading-snug mb-4">
                  Supporting this live workshop keeps this regional legacy alive. Tipping routes 100% direct capital to creator's synced wallet.
                </p>

                {/* Pricing slider for tips */}
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-white/60">Tip Amount (CELO)</span>
                    <span className="font-semibold text-white font-mono">{tipAmount} CELO</span>
                  </div>
                  <input 
                    type="range" 
                    min="0.01"
                    max="5"
                    step="0.01"
                    value={tipAmount} 
                    onChange={(e) => setTipAmount(Number(e.target.value))}
                    className="w-full accent-[#C76B29] cursor-pointer"
                  />
                </div>
              </div>

              {/* Tipping actions */}
              <div className="mt-5">
                {tippedSuccess ? (
                  <div className="bg-green-500/10 border border-green-500/30 text-green-400 py-3 rounded-full text-center text-xs font-semibold animate-fade-in font-mono">
                    Tip sent to artisan wallet.
                  </div>
                ) : (
                  <button
                    onClick={handleTip}
                    disabled={isTipping}
                    className="w-full bg-[#F4EDE4] text-black py-3 text-xs font-semibold rounded-full hover:bg-[#A91D3A] hover:text-white transition-all duration-300 uppercase tracking-wider flex items-center justify-center gap-1.5"
                  >
                    {isTipping ? "Waiting for wallet..." : "Confirm CELO Tip"}
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
