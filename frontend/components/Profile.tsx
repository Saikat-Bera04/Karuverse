"use client";

import { useEffect, useState } from "react";
import { apiFetch, ipfsToGateway } from "@/lib/api";
import { Product } from "@/types/product";

interface UserProfile {
  _id: string;
  name: string;
  email?: string;
  walletAddress?: string;
  role: "artisan" | "buyer" | "admin";
  bio?: string;
  village?: string;
  district?: string;
  profileImage?: string;
  products?: Product[];
  createdAt?: string;
}

interface ProfileProps {
  setCurrentPage: (page: string) => void;
}

export default function Profile({ setCurrentPage }: ProfileProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    village: "",
    district: "",
    role: "buyer" as "artisan" | "buyer" | "admin"
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await apiFetch<{ success: boolean; profile: UserProfile }>("/api/auth/profile");
      if (data.success) {
        setProfile(data.profile);
        setFormData({
          name: data.profile.name,
          bio: data.profile.bio || "",
          village: data.profile.village || "",
          district: data.profile.district || "",
          role: data.profile.role
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      setError("");
      const data = await apiFetch<{ success: boolean; user: UserProfile }>("/api/auth/profile", {
        method: "PUT",
        body: JSON.stringify(formData)
      });
      if (data.success) {
        setProfile(data.user);
        setIsEditing(false);
        // Also update localStorage so Navbar etc. reflect the changes
        const savedUser = localStorage.getItem("karuverse_user");
        if (savedUser) {
          try {
            const current = JSON.parse(savedUser);
            localStorage.setItem("karuverse_user", JSON.stringify({ ...current, ...data.user }));
          } catch { /* ignore */ }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Computed stats
  const totalProducts = profile?.products?.length || 0;
  const verifiedProducts = profile?.products?.filter(p => p.isVerified || p.nftVerified)?.length || 0;
  const memberSince = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "short" })
    : "—";

  // Loading state
  if (loading) {
    return (
      <section className="relative w-screen min-h-screen overflow-hidden bg-black flex items-center justify-center select-none">
        <div className="absolute top-[30%] left-[30%] w-[35vw] h-[35vh] rounded-full glow-clay pointer-events-none" />
        <div className="text-center">
          <div className="w-14 h-14 mx-auto mb-5 rounded-full border-2 border-[#C76B29]/60 border-t-transparent animate-spin" />
          <span className="text-[11px] font-mono tracking-widest text-[#F4EDE4]/50 uppercase">
            Loading Artisan Profile…
          </span>
        </div>
      </section>
    );
  }

  // Error state
  if (!profile) {
    return (
      <section className="relative w-screen min-h-screen overflow-hidden bg-black flex items-center justify-center select-none">
        <div className="absolute top-[20%] right-[20%] w-[30vw] h-[30vh] rounded-full glow-crimson pointer-events-none" />
        <div className="liquid-glass-strong border border-white/5 p-10 rounded-[2rem] text-center max-w-md">
          <div className="text-3xl mb-3">⚠</div>
          <p className="text-[#F4EDE4]/70 font-body text-sm mb-6">{error || "Failed to load profile"}</p>
          <button
            onClick={() => setCurrentPage("marketplace")}
            className="px-6 py-2.5 bg-[#C76B29] text-white text-xs font-semibold rounded-full uppercase tracking-wider hover:bg-[#C76B29]/80 transition-colors"
          >
            Back to Marketplace
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-screen min-h-screen overflow-hidden bg-black py-24 px-6 md:px-16 lg:px-20 select-none">

      {/* Ambient Glow Orbs */}
      <div className="absolute top-[15%] left-[15%] w-[40vw] h-[40vh] rounded-full glow-clay pointer-events-none z-[1]" />
      <div className="absolute bottom-[10%] right-[15%] w-[35vw] h-[35vh] rounded-full glow-gold pointer-events-none z-[1]" />
      <div className="absolute top-[60%] left-[50%] w-[25vw] h-[25vh] rounded-full glow-crimson pointer-events-none z-[1]" />

      <div className="relative z-10 max-w-7xl mx-auto w-full">

        {/* Header Bar */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-[#C76B29] animate-ping" />
            <span className="text-[10px] font-mono tracking-widest text-[#F4EDE4]/50 uppercase">
              Artisan Profile Console
            </span>
          </div>
          <button
            onClick={() => setCurrentPage("marketplace")}
            className="liquid-glass border border-white/5 px-5 py-2 rounded-full text-[11px] font-mono text-[#F4EDE4]/60 hover:text-white hover:border-[#C76B29]/40 transition-all tracking-wider uppercase"
          >
            ← Back
          </button>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-8 liquid-glass border border-[#A91D3A]/30 rounded-2xl p-4 text-[#F4EDE4]/80 text-xs font-mono">
            <span className="text-[#A91D3A] mr-2">✗</span>{error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* ═══════════════════════════════════════════
              LEFT COLUMN: Profile Card (5 cols)
             ═══════════════════════════════════════════ */}
          <div className="lg:col-span-5 flex flex-col gap-6">

            {/* Identity Card */}
            <div className="liquid-glass-strong border border-white/5 rounded-[2rem] p-8 alpana-texture relative overflow-hidden">

              {/* Avatar */}
              <div className="flex flex-col items-center mb-8">
                <div className="relative mb-5">
                  {/* Gradient ring */}
                  <div className="w-28 h-28 rounded-full p-[3px] bg-gradient-to-br from-[#C76B29] via-[#F6C453] to-[#A91D3A]">
                    <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                      {profile.profileImage ? (
                        <img src={profile.profileImage} alt={profile.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="font-heading italic text-4xl text-[#F4EDE4]">
                          {profile.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>
                  {/* Role badge floating */}
                  <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[9px] font-mono font-bold uppercase tracking-widest border ${
                    profile.role === "artisan"
                      ? "bg-[#C76B29]/20 text-[#F6C453] border-[#C76B29]/40"
                      : profile.role === "admin"
                      ? "bg-purple-600/20 text-purple-300 border-purple-500/40"
                      : "bg-blue-600/20 text-blue-300 border-blue-500/40"
                  }`}>
                    {profile.role}
                  </div>
                </div>

                <h2 className="font-heading italic text-3xl text-white tracking-wide leading-none text-center">
                  {profile.name}
                </h2>
                {profile.bio && (
                  <p className="text-[11px] text-[#F4EDE4]/50 font-body mt-3 text-center leading-relaxed max-w-xs italic">
                    &ldquo;{profile.bio}&rdquo;
                  </p>
                )}
              </div>

              {/* Info Grid */}
              <div className="space-y-4 border-t border-white/5 pt-6">
                {profile.email && (
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] font-mono text-[#F4EDE4]/35 uppercase tracking-widest">Email</span>
                    <span className="text-[11px] text-[#F4EDE4]/80 font-body text-right break-all max-w-[60%]">{profile.email}</span>
                  </div>
                )}
                {profile.walletAddress && (
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-mono text-[#F4EDE4]/35 uppercase tracking-widest">Wallet</span>
                    <span className="text-[11px] text-[#F6C453] font-mono">
                      {profile.walletAddress.slice(0, 6)}…{profile.walletAddress.slice(-4)}
                    </span>
                  </div>
                )}
                {profile.village && (
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-mono text-[#F4EDE4]/35 uppercase tracking-widest">Village</span>
                    <span className="text-[11px] text-[#F4EDE4]/80 font-body">{profile.village}</span>
                  </div>
                )}
                {profile.district && (
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-mono text-[#F4EDE4]/35 uppercase tracking-widest">District</span>
                    <span className="text-[11px] text-[#F4EDE4]/80 font-body">{profile.district}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-mono text-[#F4EDE4]/35 uppercase tracking-widest">Member Since</span>
                  <span className="text-[11px] text-[#F4EDE4]/80 font-body">{memberSince}</span>
                </div>
              </div>

              {/* Edit Button */}
              <div className="mt-8">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`w-full py-3 text-xs font-semibold rounded-full uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                    isEditing
                      ? "bg-white/5 border border-white/10 text-[#F4EDE4]/60 hover:text-white hover:border-[#A91D3A]/40"
                      : "bg-[#C76B29] text-white hover:bg-[#C76B29]/80"
                  }`}
                >
                  {isEditing ? (
                    <>
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Cancel Edit
                    </>
                  ) : (
                    <>
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      Edit Profile
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Stats Widget Row */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Products", value: totalProducts, color: "text-[#C76B29]" },
                { label: "Verified", value: verifiedProducts, color: "text-green-400" },
                { label: "Role", value: profile.role, color: profile.role === "artisan" ? "text-[#F6C453]" : "text-blue-400" }
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="liquid-glass border border-white/5 p-4 rounded-[1.25rem] text-center flex flex-col justify-between h-[90px]"
                >
                  <span className="text-[9px] text-[#F4EDE4]/35 font-mono uppercase font-medium tracking-widest leading-none">
                    {stat.label}
                  </span>
                  <span className={`font-heading italic text-2xl tracking-wide capitalize ${stat.color}`}>
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ═══════════════════════════════════════════
              RIGHT COLUMN: Edit Form / Products (7 cols)
             ═══════════════════════════════════════════ */}
          <div className="lg:col-span-7 flex flex-col gap-6">

            {isEditing ? (
              /* ── Edit Form ── */
              <div className="liquid-glass-strong border border-white/5 rounded-[2rem] p-8 alpana-texture">

                <div className="flex items-center gap-2 mb-6">
                  <span className="h-2 w-2 rounded-full bg-[#F6C453] animate-pulse" />
                  <span className="text-[10px] font-mono tracking-widest text-[#F4EDE4]/50 uppercase">
                    Edit Mode Active
                  </span>
                </div>

                <h3 className="font-heading italic text-3xl text-white tracking-wide leading-none mb-8">
                  Update Your Profile
                </h3>

                <div className="space-y-5">
                  {/* Name */}
                  <div className="flex flex-col text-left">
                    <label className="text-[11px] font-semibold text-[#F4EDE4]/50 font-body uppercase tracking-wider mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C76B29] transition-colors"
                    />
                  </div>

                  {/* Bio */}
                  <div className="flex flex-col text-left">
                    <label className="text-[11px] font-semibold text-[#F4EDE4]/50 font-body uppercase tracking-wider mb-2">
                      Bio / About You
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows={3}
                      className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C76B29] transition-colors resize-none"
                      placeholder="Share your craft heritage, your story…"
                    />
                  </div>

                  {/* Village & District */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col text-left">
                      <label className="text-[11px] font-semibold text-[#F4EDE4]/50 font-body uppercase tracking-wider mb-2">
                        Village
                      </label>
                      <input
                        type="text"
                        name="village"
                        value={formData.village}
                        onChange={handleInputChange}
                        className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C76B29] transition-colors"
                        placeholder="e.g. Shantipur"
                      />
                    </div>
                    <div className="flex flex-col text-left">
                      <label className="text-[11px] font-semibold text-[#F4EDE4]/50 font-body uppercase tracking-wider mb-2">
                        District
                      </label>
                      <input
                        type="text"
                        name="district"
                        value={formData.district}
                        onChange={handleInputChange}
                        className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C76B29] transition-colors"
                        placeholder="e.g. Nadia"
                      />
                    </div>
                  </div>

                  {/* Role Selection */}
                  <div className="flex flex-col text-left">
                    <label className="text-[11px] font-semibold text-[#F4EDE4]/50 font-body uppercase tracking-wider mb-2">
                      Account Role
                    </label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-[#F4EDE4]/80 focus:outline-none focus:border-[#C76B29] transition-colors"
                    >
                      <option value="buyer">Buyer</option>
                      <option value="artisan">Artisan (Can mint NFTs)</option>
                      {profile.role === "admin" && <option value="admin">Admin</option>}
                    </select>
                    <p className="text-[10px] text-[#F4EDE4]/35 font-mono mt-2 italic">
                      {formData.role === "artisan"
                        ? "✓ Artisan: Unlocks NFT minting, product creation, and workshop hosting"
                        : "Switch to Artisan to unlock full creator capabilities"}
                    </p>
                  </div>

                  {/* Save / Cancel Buttons */}
                  <div className="flex gap-4 pt-4 border-t border-white/5">
                    <button
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="flex-1 py-3.5 bg-[#C76B29] text-white text-xs font-semibold rounded-full uppercase tracking-widest hover:bg-[#C76B29]/80 disabled:bg-white/5 disabled:text-white/30 transition-all flex items-center justify-center gap-2"
                    >
                      {saving ? (
                        <>
                          <div className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                          Saving…
                        </>
                      ) : (
                        <>
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* ── Products Section ── */
              <>
                {/* Section Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                      <span className="text-[10px] font-mono tracking-widest text-[#F4EDE4]/50 uppercase">
                        Product Catalog
                      </span>
                    </div>
                    <h3 className="font-heading italic text-3xl text-white tracking-wide leading-none">
                      My Craft Pieces
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-[#F4EDE4]/35 uppercase tracking-wider">
                    {totalProducts} {totalProducts === 1 ? "piece" : "pieces"}
                  </span>
                </div>

                {/* Product Grid */}
                {profile.products && profile.products.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {profile.products.map((product) => (
                      <div
                        key={product._id}
                        onClick={() => setCurrentPage(`product-${product._id}`)}
                        className="liquid-glass border border-white/5 rounded-[1.5rem] overflow-hidden clay-glow-card cursor-pointer group"
                      >
                        {/* Product Image */}
                        {product.images && product.images[0] && (
                          <div className="relative h-48 overflow-hidden">
                            <img
                              src={ipfsToGateway(product.images[0])}
                              alt={product.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                            />
                            {/* Gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                            {/* Badges */}
                            <div className="absolute top-3 left-3 flex gap-2">
                              {product.nftTokenId && (
                                <span className="bg-[#C76B29]/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider flex items-center gap-1">
                                  🔗 NFT #{product.nftTokenId}
                                </span>
                              )}
                            </div>

                            {product.isVerified && (
                              <div className="absolute top-3 right-3 bg-green-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider">
                                ✓ Verified
                              </div>
                            )}

                            {/* Bottom info overlay */}
                            <div className="absolute bottom-3 left-3 right-3">
                              <h4 className="font-heading italic text-xl text-white leading-tight line-clamp-1">
                                {product.title}
                              </h4>
                            </div>
                          </div>
                        )}

                        {/* Product Info */}
                        <div className="p-5">
                          {/* If no image, show title here */}
                          {(!product.images || !product.images[0]) && (
                            <h4 className="font-heading italic text-xl text-white leading-tight line-clamp-1 mb-3">
                              {product.title}
                            </h4>
                          )}

                          <p className="text-[11px] text-[#F4EDE4]/50 font-body line-clamp-2 mb-4 leading-relaxed">
                            {product.description}
                          </p>

                          {/* Meta row */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {product.category && (
                              <span className="px-2.5 py-1 bg-white/5 border border-white/5 rounded-full text-[9px] font-mono text-[#F4EDE4]/50 uppercase tracking-wider">
                                {product.category}
                              </span>
                            )}
                            {product.craftType && product.craftType !== product.category && (
                              <span className="px-2.5 py-1 bg-white/5 border border-white/5 rounded-full text-[9px] font-mono text-[#F4EDE4]/50 uppercase tracking-wider">
                                {product.craftType}
                              </span>
                            )}
                          </div>

                          {/* Price & Date */}
                          <div className="flex items-center justify-between border-t border-white/5 pt-3">
                            <span className="font-heading italic text-xl text-[#F6C453]">
                              {product.currency || "INR"} {product.price?.toLocaleString("en-IN")}
                            </span>
                            <span className="text-[9px] font-mono text-[#F4EDE4]/30 uppercase tracking-wider">
                              {product.createdAt
                                ? new Date(product.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "2-digit" })
                                : "—"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* Empty State */
                  <div className="liquid-glass-strong border border-white/5 rounded-[2rem] p-16 text-center alpana-texture">
                    <div className="text-5xl mb-5 opacity-30">🏺</div>
                    <p className="text-[#F4EDE4]/40 font-body text-sm mb-6">
                      No craft pieces registered yet
                    </p>
                    <button
                      onClick={() => setCurrentPage("dashboard")}
                      className="px-8 py-3 bg-[#C76B29] text-white text-xs font-semibold rounded-full uppercase tracking-widest hover:bg-[#C76B29]/80 transition-colors inline-flex items-center gap-2"
                    >
                      Register Your First Craft
                      <svg className="w-3.5 h-3.5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2">
                        <line x1="7" y1="17" x2="17" y2="7" />
                        <polyline points="7 7 17 7 17 17" />
                      </svg>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
