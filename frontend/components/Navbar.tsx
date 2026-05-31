import { useState } from "react";

interface NavbarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

function Navbar({ currentPage, setCurrentPage }: NavbarProps) {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const simulateWalletConnect = () => {
    if (walletAddress) {
      // Disconnect
      setWalletAddress(null);
      return;
    }
    
    setIsConnecting(true);
    setTimeout(() => {
      // Generate a mock Ethereum/Polygon address
      const randomAddress = "0x" + Array.from({length: 40}, () => 
        Math.floor(Math.random() * 16).toString(16)
      ).join("");
      
      const formatted = `${randomAddress.substring(0, 6)}...${randomAddress.substring(38)}`;
      setWalletAddress(formatted);
      setIsConnecting(false);
    }, 1200);
  };

  const navLinks = [
    { id: "landing", label: "Home" },
    { id: "marketplace", label: "Marketplace" },
    { id: "workshop", label: "Workshops" },
    { id: "about", label: "About Mission" },
    { id: "dashboard", label: "Artisan Hub" }
  ];

  return (
    <nav className="fixed top-4 left-0 right-0 px-4 md:px-8 lg:px-16 z-50 max-w-7xl mx-auto">
      <div className="w-full flex items-center justify-between">
        
        {/* Left: 48x48 liquid-glass circle with logo */}
        <div 
          onClick={() => setCurrentPage("landing")}
          className="w-12 h-12 rounded-full liquid-glass flex items-center justify-center cursor-pointer select-none hover:scale-105 transition-transform duration-300 z-50"
        >
          <img 
            src="/logo.png" 
            alt="KaruVerse Logo" 
            className="w-8 h-8 object-contain rounded-full"
          />
        </div>

        {/* Center (desktop only): liquid-glass pill holding text links */}
        <div className="hidden md:flex items-center gap-1.5 liquid-glass rounded-full px-2 py-1.5 max-h-14">
          {navLinks.map((link) => {
            const isActive = currentPage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => {
                  setCurrentPage(link.id);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`px-4 py-2 text-sm font-medium transition-all duration-300 rounded-full font-body ${
                  isActive 
                    ? "bg-[#C76B29] text-white shadow-md shadow-[#C76B29]/20" 
                    : "text-white/80 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.label}
              </button>
            );
          })}
          
          {/* Claim a Spot / Connect Wallet CTA inside pill */}
          <button 
            onClick={simulateWalletConnect}
            className="ml-2 bg-[#F4EDE4] text-black px-4 py-2 text-sm font-semibold rounded-full flex items-center gap-1 hover:bg-[#C76B29] hover:text-white transition-all duration-300 whitespace-nowrap"
          >
            {isConnecting ? (
              <span className="flex items-center gap-1.5">
                <svg className="animate-spin h-3.5 w-3.5 text-current" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Syncing...
              </span>
            ) : walletAddress ? (
              <span className="flex items-center gap-1 text-[#A91D3A]">
                Connected: {walletAddress}
              </span>
            ) : (
              <span className="flex items-center gap-1">
                Connect Wallet
                <svg className="w-3.5 h-3.5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="7" y1="17" x2="17" y2="7"></line>
                  <polyline points="7 7 17 7 17 17"></polyline>
                </svg>
              </span>
            )}
          </button>
        </div>

        {/* Hamburger Menu Icon (Mobile Only) */}
        <div className="md:hidden z-50">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-12 h-12 rounded-full liquid-glass flex items-center justify-center cursor-pointer text-white"
          >
            {mobileMenuOpen ? (
              <svg className="h-6 w-6 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg className="h-6 w-6 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="12" x2="20" y2="12"></line>
                <line x1="4" y1="6" x2="20" y2="6"></line>
                <line x1="4" y1="18" x2="20" y2="18"></line>
              </svg>
            )}
          </button>
        </div>

        {/* Right: 48x48 invisible spacer to balance logo */}
        <div className="hidden md:block w-12 h-12"></div>

      </div>

      {/* Mobile Drawer (liquid glass capsule layout) */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 p-4 liquid-glass-strong rounded-[1.5rem] flex flex-col gap-3 animate-fade-in border border-white/5">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                setCurrentPage(link.id);
                setMobileMenuOpen(false);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`w-full py-2.5 text-center text-sm font-medium rounded-full ${
                currentPage === link.id
                  ? "bg-[#C76B29] text-white"
                  : "text-white/80 hover:bg-white/5"
              }`}
            >
              {link.label}
            </button>
          ))}
          <button 
            onClick={() => {
              simulateWalletConnect();
              setMobileMenuOpen(false);
            }}
            className="w-full bg-[#F4EDE4] text-black py-2.5 text-sm font-semibold rounded-full flex items-center justify-center gap-1"
          >
            {isConnecting ? (
              <span>Syncing Wallet...</span>
            ) : walletAddress ? (
              <span className="text-[#A91D3A]">Disconnect Wallet ({walletAddress})</span>
            ) : (
              <span className="flex items-center gap-1">
                Connect Wallet
                <svg className="w-3.5 h-3.5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="7" y1="17" x2="17" y2="7"></line>
                  <polyline points="7 7 17 7 17 17"></polyline>
                </svg>
              </span>
            )}
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
