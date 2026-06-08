"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Artisans from "@/components/Artisans";
import AIFeatures from "@/components/AIFeatures";
import NFTAuthenticity from "@/components/NFTAuthenticity";
import LiveWorkshops from "@/components/LiveWorkshops";
import About from "@/components/About";
import Marketplace from "@/components/Marketplace";
import Dashboard from "@/components/Dashboard";
import WorkshopRoom from "@/components/WorkshopRoom";
import ProductDetail from "@/components/ProductDetail";
import SignIn from "@/components/SignIn";
import SignUp from "@/components/SignUp";

import { Product } from "@/types/product";

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

export default function Home() {
  const [currentPage, setCurrentPage] = useState<string>("landing");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);

  // Load session from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem("karuverse_jwt");
    const savedUser = localStorage.getItem("karuverse_user");

    if (savedToken && savedUser) {
      setToken(savedToken);
      try {
        setUser(JSON.parse(savedUser));
        
        // Check active session validity on backend
        fetch("http://localhost:5001/api/auth/me", {
          headers: {
            "Authorization": `Bearer ${savedToken}`
          }
        })
        .then(res => res.json())
        .then(data => {
          if (data.success && data.user) {
            setUser(data.user);
            localStorage.setItem("karuverse_user", JSON.stringify(data.user));
          } else {
            handleLogout();
          }
        })
        .catch(() => {
          console.log("Backend offline, preserving local storage session");
        });
      } catch (e) {
        console.error("Failed to parse saved user", e);
      }
    }
  }, []);

  const handleLoginSuccess = (newToken: string, newUser: any) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem("karuverse_jwt", newToken);
    localStorage.setItem("karuverse_user", JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("karuverse_jwt");
    localStorage.removeItem("karuverse_user");
  };
  
  // Active workshop state (initialized with first active pottery workshop)
  const [activeWorkshop, setActiveWorkshop] = useState<Workshop>({
    id: "weaving",
    title: "Traditional Jamdani Weaving",
    artisan: "Biren Basak",
    village: "Phulia, Nadia District",
    type: "Handloom Weaving",
    status: "ACTIVE",
    badgeColor: "bg-red-500",
    image: "🧵",
    desc: "Observe the complex supplementary weft hand-weaving process. Ask questions about counting threads and matching structural patterns.",
    time: "Started 25 mins ago",
    participants: "89 Watching"
  });

  // Global products state
  const [products, setProducts] = useState<Product[]>([]);

  // Fetch products from backend
  useEffect(() => {
    fetch("http://localhost:5001/api/products")
      .then(res => res.json())
      .then(data => {
        if (data.success && data.products) {
          // Map backend fields to frontend fields for compatibility
          const mapped = data.products.map((p: any) => ({
            ...p,
            id: p._id,
            name: p.title || p.name,
            craftType: p.category || p.craftType,
            region: p.district || p.region,
            artisan: p.artisan?.name || p.artisan || "Unknown Artisan",
            desc: p.description || p.desc,
            nftVerified: p.isVerified || p.nftVerified,
            emoji: p.category === "handloom" ? "🧵" : p.category === "alpana" ? "🎨" : p.category === "instruments" ? "🎸" : "🏺"
          }));
          setProducts(mapped);
        }
      })
      .catch(e => console.error("Failed to fetch products:", e));
  }, []);

  // Save new products helper
  const addProduct = (newProduct: Product) => {
    setProducts((prev) => [...prev, newProduct]);
  };

  // Suppression wrapper for harmless framer motion warnings
  useEffect(() => {
    const originalError = console.error;
    console.error = (...args: any[]) => {
      if (args[0] && args[0].toString().includes("Framer Motion")) return;
      originalError.apply(console, args);
    };
    return () => {
      console.error = originalError;
    };
  }, []);

  return (
    <div className="w-full min-h-screen relative bg-[#0F0F0F] text-[#F4EDE4]">
      
      {/* 1. Shared Global Navbar */}
      <Navbar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
        user={user}
        onLogout={handleLogout}
      />

      {/* 2. Main SPA Route Swapping */}
      <div className="w-full">
        {currentPage === "landing" && (
          <>
            <Hero 
              setCurrentPage={setCurrentPage} 
            />
            <Artisans 
              setCurrentPage={setCurrentPage} 
            />
            <AIFeatures />
            <NFTAuthenticity />
            <LiveWorkshops 
              setCurrentPage={setCurrentPage} 
              setActiveWorkshop={setActiveWorkshop}
            />
            <About />
          </>
        )}

        {currentPage === "marketplace" && (
          <Marketplace 
            products={products} 
            setSelectedProduct={setSelectedProduct}
            setCurrentPage={setCurrentPage}
          />
        )}

        {currentPage === "workshop" && (
          <LiveWorkshops 
            setCurrentPage={setCurrentPage} 
            setActiveWorkshop={setActiveWorkshop}
          />
        )}

        {currentPage === "about" && (
          <About />
        )}

        {currentPage === "dashboard" && (
          <Dashboard 
            addProduct={addProduct}
          />
        )}

        {currentPage === "workshop_room" && activeWorkshop && (
          <WorkshopRoom 
            workshop={activeWorkshop} 
            onClose={() => setCurrentPage("landing")}
          />
        )}

        {currentPage === "signin" && (
          <SignIn 
            onLoginSuccess={handleLoginSuccess}
            setCurrentPage={setCurrentPage}
          />
        )}

        {currentPage === "signup" && (
          <SignUp 
            onLoginSuccess={handleLoginSuccess}
            setCurrentPage={setCurrentPage}
          />
        )}
      </div>

      {/* 3. Global Details Slide-out Drawer */}
      <ProductDetail 
        product={selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
      />

    </div>
  );
}
