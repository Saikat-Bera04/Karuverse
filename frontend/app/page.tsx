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

interface Product {
  id: string;
  name: string;
  craftType: string;
  region: string;
  artisan: string;
  price: number;
  desc: string;
  emoji: string;
  nftVerified: boolean;
  storySnippet?: string;
}

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

  // Global products state initialized with premium seed items
  const [products, setProducts] = useState<Product[]>([
    {
      id: "48201",
      name: "Phulia Jamdani Cotton Saree",
      craftType: "handloom",
      region: "Nadia",
      artisan: "Biren Basak",
      price: 240,
      desc: "Handwoven in Nadia using pure fine counts of organic cotton. Each motif is meticulously inserted by hand under supplementary weft counting, a legacy passed down five generations of the Basak weavers family.",
      emoji: "🧵",
      nftVerified: true,
      storySnippet: "Meticulously supplementary hand-woven saree representing heritage loom patterns."
    },
    {
      id: "11283",
      name: "Long-Neck Terracotta Horse",
      craftType: "terracotta",
      region: "Bankura",
      artisan: "Madan Karmakar",
      price: 150,
      desc: "Thrown in Panchmura village from Bankura's red terracotta clay. Renowned for its distinctive long hollow neck and high ears, it is a traditional symbol of West Bengal folk clay craftsmanship.",
      emoji: "🏺",
      nftVerified: true,
      storySnippet: "Shaped in Bankura's red terracotta clay, carrying ancient regional signatures."
    },
    {
      id: "99042",
      name: "Dokra Brass Nataraja Collectible",
      craftType: "dokra",
      region: "Burdwan",
      artisan: "Haripada Dhibar",
      price: 380,
      desc: "Crafted using the non-reusable lost-wax brass casting process in Burdwan district. Due to the destruction of the wax model, every single brass collectible is an absolute one-of-a-kind unique masterpiece.",
      emoji: "🏺",
      nftVerified: true,
      storySnippet: "Unique lost-wax metal sculpture carrying ancient regional metalcraft signatures."
    },
    {
      id: "33891",
      name: "Alpana Hand-Painted Wooden Plates",
      craftType: "alpana",
      region: "Shantiniketan",
      artisan: "Swarna Chitrakar",
      price: 45,
      desc: "A set of premium wood plates decorated in Shantiniketan using sacred traditional Alpana white slip motifs. Designed to protect tables while introducing auspicious folk geometry to modern spaces.",
      emoji: "🎨",
      nftVerified: false,
      storySnippet: "Decorated in Shantiniketan using sacred folk Alpana geometry motifs."
    },
    {
      id: "54201",
      name: "Birbhum Bamboo Folk Ektara",
      craftType: "instruments",
      region: "Birbhum",
      artisan: "Sanatan Das Baul",
      price: 95,
      desc: "A single-string folk lute crafted from local dry gourds, leather skin, and split bamboo in Birbhum. Delivers the authentic resonant frequency of wandering spiritual Baul folk singers.",
      emoji: "🎸",
      nftVerified: true,
      storySnippet: "Resonant single-string folk lute hand-tuned for spiritual Baul melodies."
    }
  ]);

  // Load user added products from LocalStorage if available
  useEffect(() => {
    const saved = localStorage.getItem("karuverse_user_products");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Product[];
        setProducts((prev) => {
          // Prevent duplicates by checking ids
          const existingIds = prev.map((p) => p.id);
          const uniqueNew = parsed.filter((p) => !existingIds.includes(p.id));
          return [...prev, ...uniqueNew];
        });
      } catch (e) {
        console.error("Failed to parse local crafts products:", e);
      }
    }
  }, []);

  // Save new products helper
  const addProduct = (newProduct: Product) => {
    setProducts((prev) => {
      const updated = [...prev, newProduct];
      localStorage.setItem("karuverse_user_products", JSON.stringify(updated.filter(p => !["48201", "11283", "99042", "33891", "54201"].includes(p.id))));
      return updated;
    });
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
      </div>

      {/* 3. Global Details Slide-out Drawer */}
      <ProductDetail 
        product={selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
      />

    </div>
  );
}
