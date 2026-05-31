import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SignUpProps {
  onLoginSuccess: (token: string, user: any) => void;
  setCurrentPage: (page: string) => void;
}

function SignUp({ onLoginSuccess, setCurrentPage }: SignUpProps) {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [role, setRole] = useState<"artisan" | "buyer">("buyer");
  
  // Artisan-specific optional fields
  const [bio, setBio] = useState<string>("");
  const [village, setVillage] = useState<string>("");
  const [district, setDistrict] = useState<string>("Nadia");

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showMockOption, setShowMockOption] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setShowMockOption(false);

    const payload = {
      name,
      email,
      password,
      role,
      bio: role === "artisan" ? bio : undefined,
      village: role === "artisan" ? village : undefined,
      district: role === "artisan" ? district : undefined,
    };

    try {
      const response = await fetch("http://localhost:5001/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Registration failed");
      }

      onLoginSuccess(data.token, data.user);
      setCurrentPage("landing");
    } catch (err: any) {
      console.error("Registration connection failed: ", err);
      if (err.message.includes("Failed to fetch") || err.message.includes("fetch")) {
        setError("Local MongoDB backend (port 5001) is offline.");
        setShowMockOption(true);
      } else {
        setError(err.message || "An error occurred during registration.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleMockSignup = () => {
    const mockUser = {
      id: "mock-new-id",
      name: name || "Creative Soul",
      email: email || "soul@karuverse.com",
      role: role,
      bio: role === "artisan" ? bio || "Handmade traditional craft artisan." : "Supporter of regional craft traditions",
      village: role === "artisan" ? village || "Bankura Folk Hub" : undefined,
      district: role === "artisan" ? district : undefined,
    };
    onLoginSuccess("mock-jwt-token-xyz", mockUser);
    setCurrentPage(role === "artisan" ? "dashboard" : "landing");
  };

  return (
    <section className="relative w-screen min-h-screen overflow-hidden bg-black py-24 px-6 md:px-16 lg:px-20 flex items-center justify-center select-none">
      {/* Background glow points */}
      <div className="absolute top-[10%] right-[20%] w-[40vw] h-[40vh] rounded-full glow-clay pointer-events-none z-1"></div>
      <div className="absolute bottom-[15%] left-[10%] w-[35vw] h-[35vh] rounded-full glow-gold pointer-events-none z-1"></div>

      <motion.div
        initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-lg"
      >
        <div className="liquid-glass-strong border border-white/5 p-8 rounded-[2rem] relative overflow-hidden alpana-texture">
          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-full liquid-glass flex items-center justify-center mb-3">
              <img src="/logo.png" alt="KaruVerse Logo" className="w-10 h-10 object-contain rounded-full" />
            </div>
            <h3 className="font-heading italic text-4xl text-white tracking-wide">
              Sign Up
            </h3>
            <p className="text-xs text-[#F4EDE4]/60 font-body uppercase tracking-widest mt-1">
              Join the Direct Heritage Alliance
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-[#A91D3A]/20 border border-[#A91D3A]/40 rounded-2xl text-xs text-[#F4EDE4] text-left">
              <p className="font-semibold text-[#A91D3A] mb-1">Registration Error</p>
              <p className="text-white/80">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-[11px] font-semibold text-[#F4EDE4]/60 font-body uppercase tracking-wider mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Swarna Chitrakar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C76B29] transition-colors"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="text-[11px] font-semibold text-[#F4EDE4]/60 font-body uppercase tracking-wider mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  placeholder="e.g. swarna@karuverse.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C76B29] transition-colors"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-[11px] font-semibold text-[#F4EDE4]/60 font-body uppercase tracking-wider mb-2">
                  Password *
                </label>
                <input
                  type="password"
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C76B29] transition-colors"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="text-[11px] font-semibold text-[#F4EDE4]/60 font-body uppercase tracking-wider mb-2">
                  I am a...
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole("buyer")}
                    className={`py-2.5 text-xs font-semibold rounded-xl uppercase tracking-wider border transition-all ${
                      role === "buyer"
                        ? "bg-[#A91D3A]/20 border-[#A91D3A] text-white"
                        : "bg-black/40 border-white/10 text-white/60 hover:border-white/20"
                    }`}
                  >
                    Buyer
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("artisan")}
                    className={`py-2.5 text-xs font-semibold rounded-xl uppercase tracking-wider border transition-all ${
                      role === "artisan"
                        ? "bg-[#C76B29]/20 border-[#C76B29] text-white"
                        : "bg-black/40 border-white/10 text-white/60 hover:border-white/20"
                    }`}
                  >
                    Artisan
                  </button>
                </div>
              </div>
            </div>

            {/* Artisan specific details with smooth Framer Motion height transition */}
            <AnimatePresence>
              {role === "artisan" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden flex flex-col gap-4 border-t border-white/5 pt-4 mt-1"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <label className="text-[11px] font-semibold text-[#F4EDE4]/60 font-body uppercase tracking-wider mb-2">
                        My Village Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Panchmura"
                        value={village}
                        onChange={(e) => setVillage(e.target.value)}
                        className="bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C76B29]"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-[11px] font-semibold text-[#F4EDE4]/60 font-body uppercase tracking-wider mb-2">
                        Bengal Origin District
                      </label>
                      <select
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-[#F4EDE4]/80 focus:outline-none focus:border-[#C76B29]"
                      >
                        <option value="Nadia">Nadia District</option>
                        <option value="Bankura">Bankura District</option>
                        <option value="Burdwan">Burdwan District</option>
                        <option value="Shantiniketan">Shantiniketan District</option>
                        <option value="Birbhum">Birbhum District</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-[11px] font-semibold text-[#F4EDE4]/60 font-body uppercase tracking-wider mb-2">
                      Artisan Biography / Craft Heritage Notes
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Swarna is a master clay terracotta artist representing rural Panchmura, specializing in clay hollow patterns..."
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C76B29] resize-none"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

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
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {showMockOption && (
            <div className="mt-6 pt-5 border-t border-white/5 text-center">
              <p className="text-[10px] text-[#F4EDE4]/50 mb-3 uppercase tracking-wider">
                Bypass connection with simulated signup:
              </p>
              <button
                onClick={handleMockSignup}
                className="w-full py-2.5 rounded-full border border-white/10 hover:border-[#C76B29] hover:bg-[#C76B29]/15 text-[10px] font-semibold text-[#C76B29] uppercase tracking-wider transition-all duration-300"
              >
                ✓ Complete Offline Signup
              </button>
            </div>
          )}

          <div className="mt-8 pt-5 border-t border-white/5 text-center">
            <p className="text-xs text-[#F4EDE4]/60 font-body">
              Already have an account?{" "}
              <button
                onClick={() => setCurrentPage("signin")}
                className="text-[#C76B29] hover:text-[#F6C453] font-semibold transition-colors focus:outline-none"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export default SignUp;
