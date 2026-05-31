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
    icon: "/logo.png",
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
