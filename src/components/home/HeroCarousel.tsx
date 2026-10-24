"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from "lucide-react";

export interface BannerType {
  id: string;
  title: string;
  subtitle?: string | null;
  image: string;
  link: string;
  ctaText: string;
  badgeText?: string | null;
}

export default function HeroCarousel({ banners }: { banners: BannerType[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  const activeBanners = banners && banners.length > 0 ? banners : [
    {
      id: "fallback-1",
      title: "INDIA'S PUREST DARK CHOCOLATE PEANUT BUTTER",
      subtitle: "32g High Protein per 100g | 100% Roasted Peanuts | Zero Palm Oil & No Preservatives",
      image: "/images/products/organichy-tub-front.png",
      link: "/shop?flavor=Dark+Chocolate",
      ctaText: "SHOP DARK CHOCOLATE",
      badgeText: "⭐ 4.9/5 RATED BY 25,000+ ATHLETES",
    },
  ];

  const goToSlide = (nextIdx: number) => {
    if (nextIdx === currentIndex) return;
    setIsFading(true);
    setTimeout(() => {
      setCurrentIndex(nextIdx);
      setIsFading(false);
    }, 180);
  };

  const prevSlide = () => {
    goToSlide(currentIndex === 0 ? activeBanners.length - 1 : currentIndex - 1);
  };

  const nextSlide = () => {
    goToSlide((currentIndex + 1) % activeBanners.length);
  };

  // Auto advance every 6 seconds
  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [activeBanners.length]);

  const current = activeBanners[currentIndex];

  return (
    <section className="w-full max-w-full relative bg-gradient-to-br from-stone-950 via-stone-900 to-amber-950 text-white overflow-hidden py-10 sm:py-16 md:py-20 border-b border-stone-800/80">
      {/* Background ambient lighting - strictly contained */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-amber-500/15 rounded-full blur-3xl pointer-events-none overflow-hidden" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-amber-600/15 rounded-full blur-3xl pointer-events-none overflow-hidden" />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-12 gap-8 lg:gap-8 items-center w-full min-w-0">
            {/* Text Content */}
            <div
              className={`lg:col-span-5 min-w-0 w-full space-y-5 sm:space-y-6 text-center lg:text-left flex flex-col justify-center transition-all duration-200 ${
                isFading ? "opacity-0 translate-y-1" : "opacity-100 translate-y-0"
              }`}
            >
              {current.badgeText && (
                <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs sm:text-sm font-extrabold px-3.5 py-1.5 rounded-full shadow-inner self-center lg:self-start">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="truncate">{current.badgeText}</span>
                </div>
              )}

              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black tracking-tight leading-[1.08] text-white break-words w-full">
                  {current.title}
                </h1>
              </div>

              <div>
                {current.subtitle && (
                  <p className="text-sm sm:text-base lg:text-lg text-stone-300 max-w-xl font-normal leading-relaxed mx-auto lg:mx-0 break-words">
                    {current.subtitle}
                  </p>
                )}
              </div>

              {/* Quick feature pill tags */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 pt-1 text-xs font-bold text-stone-300">
                <span className="flex items-center gap-1.5 bg-stone-800/90 px-3.5 py-1.5 rounded-full border border-stone-700 whitespace-nowrap">
                  🥜 100% Saurashtra Peanuts
                </span>
                <span className="flex items-center gap-1.5 bg-stone-800/90 px-3.5 py-1.5 rounded-full border border-stone-700 whitespace-nowrap">
                  🚫 0% Palm Oil
                </span>
                <span className="flex items-center gap-1.5 bg-stone-800/90 px-3.5 py-1.5 rounded-full border border-stone-700 whitespace-nowrap">
                  ⚡ 32g Protein / 100g
                </span>
              </div>

              <div className="pt-3 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 w-full">
                <Link
                  href={current.link}
                  className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-sm uppercase px-9 py-4 rounded-xl transition-all shadow-xl hover:shadow-amber-500/30 flex items-center justify-center gap-2 group tracking-wide"
                >
                  <span>{current.ctaText}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 shrink-0" />
                </Link>
                <Link
                  href="/shop"
                  className="w-full sm:w-auto bg-stone-800/90 hover:bg-stone-700 text-white font-bold text-sm uppercase px-7 py-4 rounded-xl transition-colors border border-stone-700 text-center tracking-wide"
                >
                  EXPLORE ALL
                </Link>
              </div>
            </div>

            {/* Hero Visual Image - Balanced size (30% reduced from previous jumbo) */}
            <div className="lg:col-span-7 min-w-0 w-full flex justify-center items-center relative py-2">
              <div className="relative w-full max-w-[340px] sm:max-w-[460px] md:max-w-[540px] lg:max-w-[620px] aspect-[4/3] sm:aspect-square flex items-center justify-center shrink-0">
                {/* Outer glowing ring strictly enclosed inside clipped container */}
                <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
                  <div className="w-full h-full rounded-full border-2 border-amber-500/25 animate-spin-slow scale-95" />
                </div>

                {/* Product Visual - Scaled cleanly to fit perfectly */}
                <div
                  className={`relative w-full h-full drop-shadow-2xl transition-all duration-300 flex items-center justify-center ${
                    isFading ? "opacity-0 scale-95" : "opacity-100 scale-100"
                  }`}
                >
                  <Image
                    src={current.image}
                    alt={current.title}
                    fill
                    sizes="(max-width: 640px) 340px, (max-width: 768px) 460px, (max-width: 1024px) 540px, 620px"
                    className="object-contain filter drop-shadow-[0_25px_60px_rgba(0,0,0,0.9)] scale-110"
                    priority
                    unoptimized={true}
                  />
                </div>

                {/* Float badge */}
                <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 bg-stone-950/95 border border-amber-500/50 rounded-2xl px-3.5 py-2 sm:px-4 sm:py-2 shadow-2xl backdrop-blur-md pointer-events-none z-20">
                  <p className="text-[9px] sm:text-[10px] font-bold text-amber-400 uppercase tracking-wider">Per 100g serving</p>
                  <p className="text-lg sm:text-2xl font-black text-white">32g Protein</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
  );
}
