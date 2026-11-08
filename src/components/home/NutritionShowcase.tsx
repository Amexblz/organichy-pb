import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, X, ShieldAlert, Zap, Flame, Award } from "lucide-react";

export default function NutritionShowcase() {
  return (
    <section className="py-16 bg-gradient-to-b from-stone-50 via-amber-50/20 to-white text-stone-900 overflow-hidden relative border-y border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block bg-amber-500 text-stone-950 font-black text-xs px-3.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
            THE ORGANICHY STANDARD
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-stone-950 mt-3 mb-4">
            WHY INDIA&apos;S ELITE ATHLETES CHOOSE ORGANICHY
          </h2>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            Most market spreads compromise with hydrogenated palm oil and high refined sugars. We refuse to cut corners. Compare the clean nutritional truth below:
          </p>
        </div>

        {/* 2 Column Comparison: Organichy vs Market Peanut Butter */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Comparison Cards */}
          <div className="space-y-4">
            <div className="bg-white border-2 border-amber-500 rounded-2xl p-6 sm:p-7 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-amber-500 text-stone-950 font-black text-[11px] px-3.5 py-1 rounded-bl-xl uppercase tracking-wider shadow-sm">
                OUR COMMITMENT
              </div>
              <h3 className="text-xl font-black text-stone-950 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-600" />
                ORGANICHY PEANUT BUTTER
              </h3>
              <ul className="space-y-3.5 text-sm">
                <li className="flex items-center gap-3 text-stone-800">
                  <div className="w-5 h-5 rounded-full bg-green-100 text-green-700 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span><strong className="text-stone-950 font-extrabold">32g Pure Protein</strong> per 100g serving with rich natural BCAAs</span>
                </li>
                <li className="flex items-center gap-3 text-stone-800">
                  <div className="w-5 h-5 rounded-full bg-green-100 text-green-700 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span><strong className="text-stone-950 font-extrabold">Zero Palm Oil</strong> & Zero Hydrogenated Fats</span>
                </li>
                <li className="flex items-center gap-3 text-stone-800">
                  <div className="w-5 h-5 rounded-full bg-green-100 text-green-700 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span><strong className="text-stone-950 font-extrabold">100% Saurashtra Runner Peanuts</strong> slow-roasted in small batches</span>
                </li>
                <li className="flex items-center gap-3 text-stone-800">
                  <div className="w-5 h-5 rounded-full bg-green-100 text-green-700 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span><strong className="text-stone-950 font-extrabold">Pure Belgian Dark Cocoa</strong> & organic unrefined brown sugar</span>
                </li>
              </ul>
            </div>

            <div className="bg-stone-100/90 border border-stone-300 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-stone-600 mb-4 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-red-500" />
                ORDINARY COMMERCIAL BRANDS
              </h3>
              <ul className="space-y-3.5 text-sm text-stone-600">
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                    <X className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>Only 24g - 26g protein, diluted with cheap emulsifiers</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                    <X className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>Loaded with hydrogenated palm oil to prevent natural oil separation</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                    <X className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>Excess refined white sugar and synthetic additives</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Genuine Pack Back & Nutrition Images */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <div className="relative w-64 h-80 bg-white rounded-2xl p-4 border border-stone-200 shadow-lg flex items-center justify-center">
              <Image
                src="/images/products/organichy-nutrition.png"
                alt="Organichy Nutrition Facts Label"
                fill
                sizes="256px"
                className="object-contain p-2"
              />
            </div>
            <div className="relative w-64 h-80 bg-white rounded-2xl p-4 border border-stone-200 shadow-lg flex items-center justify-center">
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
            className="inline-block bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-sm uppercase px-8 py-3.5 rounded-xl transition-all shadow-lg hover:shadow-amber-500/25 active:scale-98"
          >
            ORDER THE CLEANEST PEANUT BUTTER TODAY →
          </Link>
        </div>
      </div>
    </section>
  );
}