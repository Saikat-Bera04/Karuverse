import { Poppins, Instrument_Serif, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import React from "react";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-cormorant-garamond",
  display: "swap",
});

export const metadata = {
  title: "KaruVerse - Preserving Bengali Heritage through AI & Web3 Provenance",
  description: "Discover authentic Bengali craftsmanship direct from master rural creators. Secured by Polygon smart contract NFT certificates and empowered by AI storytelling and real-time dialect translation.",
  keywords: "Bengali craftsmanship, handloom, terracotta, dokra, Shantiniketan, AI storytelling, Web3, Polygon, NFT provenance, fair trade",
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='45' fill='%23C76B29'/%3E%3Ctext x='50' y='65' font-size='40' font-family='serif' font-style='italic' fill='%23F4EDE4' text-anchor='middle'%3Ek%3C/text%3E%3C/svg%3E",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${poppins.variable} ${instrumentSerif.variable} ${cormorantGaramond.variable}`}>
      <body className="bg-[#0F0F0F] text-[#F4EDE4] antialiased">
        {children}
      </body>
    </html>
  );
}
