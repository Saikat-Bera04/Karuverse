import { useEffect, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { apiFetch } from "@/lib/api";
interface NavbarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  user: any;
  onLogout: () => void;
}

function Navbar({ currentPage, setCurrentPage, user, onLogout }: NavbarProps) {

  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const { address, isConnected } = useAccount();

  useEffect(() => {
    if (!isConnected || !address) return;

    apiFetch<{ success: boolean; token: string; user: any }>("/api/auth/wallet-connect", {
      method: "POST",
      body: JSON.stringify({
        walletAddress: address,
        name: user?.name,
        role: user?.role || "buyer"
      })
    })
      .then((data) => {
        if (data.success) {
          localStorage.setItem("karuverse_jwt", data.token);
          localStorage.setItem("karuverse_user", JSON.stringify(data.user));
        }
      })
      .catch((error) => console.error("Wallet sync failed", error));
  }, [address, isConnected, user?.name, user?.role]);

  const navLinks = [
    { id: "landing", label: "Home" },
    { id: "marketplace", label: "Marketplace" },
    { id: "workshop", label: "Workshops" },
    { id: "about", label: "About Mission" },
    ...(user && user.role === "artisan" ? [{ id: "dashboard", label: "Artisan Hub" }] : [])
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
            src="/karuverse-logo.png" 
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
          {/* RainbowKit Connect Button */}
          <div className="ml-2">
            <ConnectButton />
          </div>
        </div>

        {/* Right (desktop only): Authentication options */}
        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/70 font-body px-2 py-1">
                Hi, <span className="font-semibold text-white">{user.name.split(" ")[0]}</span>
              </span>
              <button
                onClick={() => {
                  onLogout();
                  setCurrentPage("landing");
                }}
                className="px-4 py-2 text-xs font-semibold rounded-full bg-[#A91D3A]/20 hover:bg-[#A91D3A]/40 text-white border border-[#A91D3A]/30 transition-all duration-300"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage("signin")}
                className="px-4 py-2 text-xs font-semibold rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-all duration-300"
              >
                Sign In
              </button>
              <button
                onClick={() => setCurrentPage("signup")}
                className="px-4 py-2 text-xs font-semibold rounded-full bg-[#C76B29] hover:bg-[#C76B29]/80 text-white transition-all duration-300"
              >
                Sign Up
              </button>
            </div>
          )}
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
          
          {/* Mobile Auth Drawer */}
          <div className="border-t border-white/10 pt-3 flex flex-col gap-2">
            {user ? (
              <div className="flex flex-col gap-2">
                <span className="text-xs text-center text-white/70 py-1">
                  Signed in as <span className="font-semibold text-[#F6C453]">{user.name}</span>
                </span>
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                    setCurrentPage("landing");
                  }}
                  className="w-full py-2.5 text-center text-xs font-semibold rounded-full bg-[#A91D3A]/20 border border-[#A91D3A]/30 text-white"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setCurrentPage("signin");
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 py-2.5 text-center text-xs font-semibold rounded-full bg-white/5 border border-white/10 text-white"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setCurrentPage("signup");
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 py-2.5 text-center text-xs font-semibold rounded-full bg-[#C76B29] text-white"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>

          <div className="w-full flex justify-center mt-2">
            <ConnectButton />
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
