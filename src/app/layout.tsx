import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0c0a09",
};

export const metadata: Metadata = {
  title: "Organichy Peanut Butter | India's #1 32g High Protein Peanut Butter",
  description: "Official online store for Organichy Peanut Butter. 32g pure protein, zero palm oil, 100% slow-roasted runner peanuts with decadent dark chocolate and natural options. Cash on delivery & free shipping across India.",
  keywords: "peanut butter, high protein, dark chocolate peanut butter, organic peanut butter, gym supplements, sports nutrition, MyFitness",
  icons: {
    icon: "/images/branding/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body className="antialiased min-h-screen bg-stone-50 text-stone-900 selection:bg-amber-500 selection:text-stone-950">
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
