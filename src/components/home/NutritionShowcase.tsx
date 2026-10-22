import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, X, ShieldAlert, Zap, Flame, Award } from "lucide-react";

export default function NutritionShowcase() {
  return (
    <section className="py-16 bg-stone-950 text-white overflow-hidden relative border-y border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="bg-amber-500 text-stone-950 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider">
            THE ORGANICHY STANDARD
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight mt-3 mb-4">
            WHY INDIA&apos;S ELITE ATHLETES CHOOSE ORGANICHY
          </h2>
          <p className="text-stone-400 text-sm sm:text-base leading-relaxed">
            Most market spreads compromise with hydrogenated palm oil and high refined sugars. We refuse to cut corners. Compare the truth below:
          </p>
        </div>

        {/* 2 Column Comparison: Organichy vs Market Peanut Butter */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Comparison Cards */}
          <div className="space-y-4">
            <div className="bg-stone-900 border-2 border-amber-500/80 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-amber-500 text-stone-950 font-black text-[11px] px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                OUR COMMITMENT
              </div>
              <h3 className="text-xl font-black text-amber-400 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                ORGANICHY PEANUT BUTTER
              </h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-3 text-stone-200">
                  <div className="w-5 h-5 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span><strong>32g Pure Protein</strong> per 100g serving with rich natural BCAAs</span>
                </li>
                <li className="flex items-center gap-3 text-stone-200">
                  <div className="w-5 h-5 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span><strong>Zero Palm Oil</strong> & Zero Hydrogenated Fats</span>
                </li>
                <li className="flex items-center gap-3 text-stone-200">
                  <div className="w-5 h-5 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span><strong>100% Saurashtra Runner Peanuts</strong> slow-roasted in small batches</span>
                </li>
                <li className="flex items-center gap-3 text-stone-200">
                  <div className="w-5 h-5 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span><strong>Pure Belgian Dark Cocoa</strong> & organic unrefined brown sugar</span>
                </li>
              </ul>
            </div>

            <div className="bg-stone-900/60 border border-stone-800 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-stone-400 mb-4 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-red-400" />
                ORDINARY COMMERCIAL BRANDS
              </h3>
              <ul className="space-y-3 text-sm text-stone-400">
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center shrink-0">
                    <X className="w-3.5 h-3.5" />
                  </div>
                  <span>Only 24g - 26g protein, diluted with cheap emulsifiers</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center shrink-0">
                    <X className="w-3.5 h-3.5" />
                  </div>
                  <span>Loaded with hydrogenated palm oil to prevent natural oil separation</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center shrink-0">
                    <X className="w-3.5 h-3.5" />
                  </div>
                  <span>Excess refined white sugar and artificial flavors</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Genuine Pack Back & Nutrition Images */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <div className="relative w-64 h-80 bg-stone-900/90 rounded-2xl p-4 border border-stone-800 flex items-center justify-center">
              <Image
                src="/images/products/organichy-nutrition.png"
                alt="Organichy Nutrition Facts Label"
                fill
                sizes="256px"
                className="object-contain p-2"
              />
            </div>
            <div className="relative w-64 h-80 bg-stone-900/90 rounded-2xl p-4 border border-stone-800 flex items-center justify-center">
              <Image
                src="/images/products/organichy-back.png"
                alt="Real Ingredients, Real Goodness"
                fill
                sizes="256px"
                className="object-contain p-2"
              />
            </div>
          </div>
        </div>

        <div className="text-center mt-10">
          <Link
            href="/shop"
            className="inline-block bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-sm uppercase px-8 py-3.5 rounded-xl transition-all shadow-lg"
          >
            ORDER THE CLEANEST PEANUT BUTTER TODAY →
          </Link>
        </div>
      </div>
    </section>
  );
}
