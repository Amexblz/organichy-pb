"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, Star, ShieldCheck, Zap, ArrowRight, ShoppingBag, Check } from "lucide-react";

export default function NewProductHighlight() {
  const [selectedPack, setSelectedPack] = useState<"1kg" | "duo">("1kg");

  return (
    <section className="w-full py-12 sm:py-16 bg-gradient-to-br from-amber-50/90 via-orange-50/30 to-stone-50 border-y border-amber-200/80 relative overflow-hidden">
      {/* Soft decorative background glows */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-orange-300/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-white rounded-3xl border-2 border-amber-400/90 shadow-2xl p-6 sm:p-10 lg:p-12 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Visual Image Side (5 cols) */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
              <div className="relative w-full max-w-[340px] sm:max-w-[400px] aspect-square flex items-center justify-center">
                {/* Rotating accent circle */}
                <div className="absolute inset-2 rounded-full border-2 border-dashed border-amber-300/60 animate-spin-slow pointer-events-none" />

                {/* Main Product Visual */}
                <div className="relative w-4/5 h-4/5 flex items-center justify-center drop-shadow-2xl">
                  <Image
                    src={
                      selectedPack === "1kg"
                        ? "/images/products/Organic Chocolate Crunchy Peanut Butter Duo Transparent.png"
                        : "/images/products/Chocolate Crunchy Peanut Butter 1 kgCombo Pack.png"
                    }
                    alt="Organichy Dark Chocolate Crunchy Peanut Butter - New Product Launch"
                    fill
                    sizes="(max-width: 640px) 300px, 400px"
                    className="object-contain filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.18)] transition-all duration-300 hover:scale-105"
                    priority
                  />
                </div>

                {/* Floating Protein Badge */}
                <div className="absolute -top-2 -right-2 sm:top-2 sm:right-2 bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-2xl shadow-xl flex items-center gap-1.5 font-black text-xs sm:text-sm uppercase tracking-wide">
                  <Zap className="w-4 h-4 fill-stone-950" />
                  <span>32g Protein / 100g</span>
                </div>

                {/* Purity Badge */}
                <div className="absolute bottom-0 left-0 bg-stone-950 text-white px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl shadow-lg flex items-center gap-1.5 text-[10px] sm:text-xs font-extrabold tracking-wide">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Zero Palm Oil Guaranteed</span>
                </div>
              </div>

              {/* Pack switcher buttons */}
              <div className="mt-6 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedPack("1kg")}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                    selectedPack === "1kg"
                      ? "bg-amber-500 text-stone-950 shadow-md ring-2 ring-amber-500/30"
                      : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                  }`}
                >
                  1kg Single Tub
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPack("duo")}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                    selectedPack === "duo"
                      ? "bg-amber-500 text-stone-950 shadow-md ring-2 ring-amber-500/30"
                      : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                  }`}
                >
                  🔥 Duo Super Saver Pack
                </button>
              </div>
            </div>

            {/* Product Details & Purchase Action (7 cols) */}
            <div className="lg:col-span-7 space-y-5">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 bg-amber-500 text-stone-950 font-black text-[10px] sm:text-xs px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    <Sparkles className="w-3.5 h-3.5" />
                    NEW PRODUCT SPOTLIGHT 2026
                  </span>
                  <div className="flex items-center gap-1 text-amber-500 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 text-xs font-black">
                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                    <span>4.9 / 5 (1,240+ Reviews)</span>
                  </div>
                </div>

                <h2 className="text-2xl sm:text-4xl font-black text-stone-950 tracking-tight leading-tight uppercase">
                  ORGANICHY DARK CHOCOLATE CRUNCHY DUO
                </h2>
                <p className="text-stone-600 text-xs sm:text-sm font-medium leading-relaxed">
                  Crafted with 100% Saurashtra slow-roasted peanuts, authentic Belgian dark cocoa, and crunchy roasted peanut chunks. Formulated specifically to deliver 32g muscle-building protein without a drop of hydrogenated palm oil or cheap emulsifiers.
                </p>
              </div>

              {/* Nutritional Highlights Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 text-center">
                  <span className="block text-xl sm:text-2xl font-black text-stone-950">32g</span>
                  <span className="text-[10px] sm:text-xs font-bold text-stone-500 uppercase">Protein / 100g</span>
                </div>
                <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 text-center">
                  <span className="block text-xl sm:text-2xl font-black text-green-600">0%</span>
                  <span className="text-[10px] sm:text-xs font-bold text-stone-500 uppercase">Palm Oil</span>
                </div>
                <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 text-center">
                  <span className="block text-xl sm:text-2xl font-black text-stone-950">100%</span>
                  <span className="text-[10px] sm:text-xs font-bold text-stone-500 uppercase">Saurashtra Nuts</span>
                </div>
                <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 text-center">
                  <span className="block text-xl sm:text-2xl font-black text-amber-600">Pure</span>
                  <span className="text-[10px] sm:text-xs font-bold text-stone-500 uppercase">Dark Cocoa</span>
                </div>
              </div>

              {/* Key Features Bullet List */}
              <ul className="space-y-2 text-xs sm:text-sm text-stone-700 pt-1">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600 stroke-[3] shrink-0" />
                  <span><strong>Zero added hydrogenated oil</strong> — natural oils might separate naturally (just stir &amp; enjoy)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600 stroke-[3] shrink-0" />
                  <span><strong>Rich in BCAAs &amp; Healthy Fats</strong> to support active gym workouts, athletics &amp; daily vitality</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600 stroke-[3] shrink-0" />
                  <span><strong>Certified Manufacturing Facility</strong> (FSSAI Lic: 22725719000592 &amp; 10721999000720)</span>
                </li>
              </ul>

              {/* Pricing & CTA Action */}
              <div className="pt-3 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <span className="text-[10px] uppercase font-bold text-stone-500 block">Launch Special Price</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-black text-stone-950">
                      ₹{selectedPack === "1kg" ? "499" : "899"}
                    </span>
                    <span className="text-sm font-semibold text-stone-400 line-through">
                      ₹{selectedPack === "1kg" ? "649" : "1,299"}
                    </span>
                    <span className="text-xs font-extrabold text-green-700 bg-green-100 px-2 py-0.5 rounded-md">
                      SAVE {selectedPack === "1kg" ? "23%" : "31%"}
                    </span>
                  </div>
                  <span className="text-[11px] text-stone-500 font-medium">Free Delivery Across India Included</span>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <Link
                    href={`/product/organichy-dark-chocolate-crunchy-peanut-butter`}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs sm:text-sm uppercase px-7 py-3.5 rounded-xl shadow-lg hover:shadow-amber-500/30 transition-all active:scale-98"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>BUY NOW - NEW LAUNCH</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}