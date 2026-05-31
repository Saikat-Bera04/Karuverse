import { useState, FormEvent } from "react";
import { motion } from "framer-motion";

interface SignInProps {
  onLoginSuccess: (token: string, user: any) => void;
  setCurrentPage: (page: string) => void;
}

function SignIn({ onLoginSuccess, setCurrentPage }: SignInProps) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showMockOption, setShowMockOption] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setShowMockOption(false);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Invalid credentials");
      }

      onLoginSuccess(data.token, data.user);
      setCurrentPage("landing");
    } catch (err: any) {
      console.error("Login connection failed: ", err);
      if (err.message.includes("Failed to fetch") || err.message.includes("fetch")) {
        setError("Local MongoDB backend (port 5000) is offline.");
        setShowMockOption(true);
      } else {
        setError(err.message || "Incorrect email or password.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleMockLogin = (role: "artisan" | "buyer") => {
    const mockUser = {
      id: role === "artisan" ? "mock-artisan-id" : "mock-buyer-id",
      name: role === "artisan" ? "Biren Basak" : "Saikat Bera",
      email: `${role}@karuverse.com`,
      role: role,
      bio: role === "artisan" ? "Master handloom weaver from Nadia district." : "Heritage craft admirer",
      village: role === "artisan" ? "Phulia" : undefined,
      district: role === "artisan" ? "Nadia" : undefined,
    };
    onLoginSuccess("mock-jwt-token-xyz", mockUser);
    setCurrentPage(role === "artisan" ? "dashboard" : "landing");
  };

  return (
    <section className="relative w-screen min-h-screen overflow-hidden bg-black py-24 px-6 md:px-16 lg:px-20 flex items-center justify-center select-none">
      {/* Background glow points */}
      <div className="absolute top-[20%] left-[20%] w-[40vw] h-[40vh] rounded-full glow-clay pointer-events-none z-1"></div>
      <div className="absolute bottom-[20%] right-[10%] w-[35vw] h-[35vh] rounded-full glow-crimson pointer-events-none z-1"></div>

      <motion.div
        initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="liquid-glass-strong border border-white/5 p-8 rounded-[2rem] relative overflow-hidden alpana-texture">
          {/* Logo container */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-full liquid-glass flex items-center justify-center mb-3">
              <img src="/logo.png" alt="KaruVerse Logo" className="w-10 h-10 object-contain rounded-full" />
            </div>
            <h3 className="font-heading italic text-4xl text-white tracking-wide">
              Sign In
            </h3>
            <p className="text-xs text-[#F4EDE4]/60 font-body uppercase tracking-widest mt-1">
              Welcome back to KaruVerse
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-[#A91D3A]/20 border border-[#A91D3A]/40 rounded-2xl text-xs text-[#F4EDE4] text-left">
              <p className="font-semibold text-[#A91D3A] mb-1">Authentication Error</p>
              <p className="text-white/80">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-left">
            <div className="flex flex-col">
              <label className="text-[11px] font-semibold text-[#F4EDE4]/60 font-body uppercase tracking-wider mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="e.g. artisan@karuverse.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#C76B29] transition-colors"
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="text-[11px] font-semibold text-[#F4EDE4]/60 font-body uppercase tracking-wider mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#C76B29] transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-4 w-full bg-[#F4EDE4] hover:bg-[#C76B29] hover:text-white text-black py-3.5 text-xs font-semibold rounded-full uppercase tracking-widest transition-all duration-300 active:scale-95 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-3.5 w-3.5 text-current" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Syncing session...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {showMockOption && (
            <div className="mt-6 pt-5 border-t border-white/5 text-center">
              <p className="text-[10px] text-[#F4EDE4]/50 mb-3 uppercase tracking-wider">
                Bypass connection with simulated roles:
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => handleMockLogin("artisan")}
                  className="px-4 py-2 rounded-full border border-white/10 hover:border-[#C76B29] hover:bg-[#C76B29]/15 text-[10px] font-semibold text-[#C76B29] uppercase tracking-wider transition-all duration-300"
                >
                  🧵 Artisan Mode
                </button>
                <button
                  onClick={() => handleMockLogin("buyer")}
                  className="px-4 py-2 rounded-full border border-white/10 hover:border-[#A91D3A] hover:bg-[#A91D3A]/15 text-[10px] font-semibold text-[#A91D3A] uppercase tracking-wider transition-all duration-300"
                >
                  🏺 Buyer Mode
                </button>
              </div>
            </div>
          )}

          <div className="mt-8 pt-5 border-t border-white/5 text-center">
            <p className="text-xs text-[#F4EDE4]/60 font-body">
              Don't have an account?{" "}
              <button
                onClick={() => setCurrentPage("signup")}
                className="text-[#C76B29] hover:text-[#F6C453] font-semibold transition-colors focus:outline-none"
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export default SignIn;
