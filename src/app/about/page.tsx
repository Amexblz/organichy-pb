import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Award, ShieldCheck, Heart, Sparkles, CheckCircle2 } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="bg-amber-500 text-stone-950 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider">
            OUR STORY & MISSION
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-stone-900 tracking-tight">
            Crafting India&apos;s Purest 32g High Protein Peanut Butter
          </h1>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            At Organichy (Dr Health Xpert Pvt Ltd), we refuse to compromise your health with cheap industrial palm oil or inflated protein claims.
          </p>
        </div>

        {/* Visual Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white p-6 sm:p-10 rounded-3xl border border-stone-200 shadow-sm">
          <div className="space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed">
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 uppercase">
              From Saurashtra Farms to Your Shaker Bottle
            </h2>
            <p>
              Founded by fitness professionals and certified clinical nutritionists, Organichy was born out of frustration. Mainstream shelf spreads add hydrogenated palm oil and chemical emulsifiers to halt oil separation, trading long-term cardiovascular health for artificial convenience.
            </p>
            <p>
              We source strictly Grade-A runner peanuts directly from organic farms in Saurashtra, Gujarat. They are slow-roasted in small batches to preserve vital monounsaturated fats, polyphenols, and complete micronutrient profiles.
            </p>
            <div className="pt-2 grid grid-cols-2 gap-3 text-stone-900 font-bold">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                <span>Zero Palm Oil</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                <span>True 32g Protein</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                <span>FSSAI Certified</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                <span>100% Recyclable Tubs</span>
              </div>
            </div>
          </div>

          <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-stone-50 border border-stone-200 flex items-center justify-center p-6">
            <Image
              src="/images/products/organichy-tub-front.png"
              alt="Organichy Tub"
              fill
              sizes="400px"
              className="object-contain p-4"
            />
          </div>
        </div>

        {/* The 4 Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mx-auto mb-3 font-black text-lg">
              1
            </div>
            <h3 className="font-extrabold text-sm text-stone-900 uppercase">Zero Palm Oil Ever</h3>
            <p className="text-xs text-stone-500">Natural oil separation is our proof of pure, unadulterated ingredients.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-stone-200 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mx-auto mb-3 font-black text-lg">
              2
            </div>
            <h3 className="font-extrabold text-sm text-stone-900 uppercase">32g High Protein</h3>
            <p className="text-xs text-stone-500">The highest natural biological value protein per 100g in Indian D2C.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-stone-200 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mx-auto mb-3 font-black text-lg">
              3
            </div>
            <h3 className="font-extrabold text-sm text-stone-900 uppercase">Pure Dark Cocoa</h3>
            <p className="text-xs text-stone-500">Authentic roasted dark cocoa without high refined sugars or cheap fats.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-stone-200 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mx-auto mb-3 font-black text-lg">
              4
            </div>
            <h3 className="font-extrabold text-sm text-stone-900 uppercase">Fresh Dispatch</h3>
            <p className="text-xs text-stone-500">Small batch manufacturing ensures every tub reaches you at peak freshness.</p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-4">
          <Link
            href="/shop"
            className="inline-block bg-stone-900 hover:bg-amber-600 text-white font-black text-xs uppercase px-8 py-4 rounded-xl transition-all shadow-md"
          >
            EXPERIENCE ORGANICHY PURITY TODAY →
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
