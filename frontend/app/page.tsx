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
import { apiFetch, API_URL } from "@/lib/api";
import { mapProduct } from "@/lib/productMapper";

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
  desc?: string;
  description?: string;
  time?: string;
  participants?: string;
  livekitRoomName?: string;
  meetingLink?: string;
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
        fetch(`${API_URL}/api/auth/me`, {
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
  
  const [activeWorkshop, setActiveWorkshop] = useState<Workshop | null>(null);

  // Global products state
  const [products, setProducts] = useState<Product[]>([]);

  // Fetch products from backend
  useEffect(() => {
    apiFetch<{ success: boolean; products: any[] }>("/api/products")
      .then(data => {
        if (data.success && data.products) {
          setProducts(data.products.map(mapProduct));
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
            user={user}
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
