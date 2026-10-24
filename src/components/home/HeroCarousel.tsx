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
    <section className="w-full max-w-full relative bg-gradient-to-br from-stone-950 via-stone-900 to-amber-950 text-white overflow-hidden border-b border-stone-800/80 min-h-[520px] sm:min-h-[580px] lg:min-h-[620px] flex items-center">
      {/* Background ambient lighting - strictly contained */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-amber-500/15 rounded-full blur-3xl pointer-events-none overflow-hidden" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-amber-600/15 rounded-full blur-3xl pointer-events-none overflow-hidden" />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12 relative z-10">
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-12 gap-8 lg:gap-8 items-center w-full min-w-0">
            {/* Text Content (6 cols) - fixed locked min height so banner never shifts */}
            <div className="lg:col-span-6 min-w-0 w-full flex flex-col justify-center text-center lg:text-left min-h-[300px] sm:min-h-[340px] lg:min-h-[380px]">
              {/* Badge line - fixed height */}
              <div className="h-8 flex items-center justify-center lg:justify-start mb-3">
                {current.badgeText && (
                  <div
                    className={`inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs sm:text-sm font-extrabold px-3.5 py-1.5 rounded-full shadow-inner transition-opacity duration-200 ${
                      isFading ? "opacity-0" : "opacity-100"
                    }`}
                  >
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="truncate">{current.badgeText}</span>
                  </div>
                )}
              </div>

              {/* Title line - fixed locked height */}
              <div className="min-h-[76px] sm:min-h-[96px] lg:min-h-[120px] flex items-center justify-center lg:justify-start mb-3">
                <h1
                  className={`text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.12] text-white break-words w-full transition-opacity duration-200 ${
                    isFading ? "opacity-0" : "opacity-100"
                  }`}
                >
                  {current.title}
                </h1>
              </div>

              {/* Subtitle line - fixed locked height */}
              <div className="min-h-[44px] sm:min-h-[48px] flex items-center justify-center lg:justify-start mb-4">
                {current.subtitle && (
                  <p
                    className={`text-xs sm:text-base text-stone-300 max-w-lg font-normal leading-relaxed mx-auto lg:mx-0 break-words transition-opacity duration-200 ${
                      isFading ? "opacity-0" : "opacity-100"
                    }`}
                  >
                    {current.subtitle}
                  </p>
                )}
              </div>

              {/* Quick feature pill tags - static layout */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 text-xs font-bold text-stone-300 mb-6">
                <span className="flex items-center gap-1.5 bg-stone-800/90 px-3 py-1 rounded-full border border-stone-700 whitespace-nowrap">
                  🥜 100% Saurashtra Peanuts
                </span>
                <span className="flex items-center gap-1.5 bg-stone-800/90 px-3 py-1 rounded-full border border-stone-700 whitespace-nowrap">
                  🚫 0% Palm Oil
                </span>
                <span className="flex items-center gap-1.5 bg-stone-800/90 px-3 py-1 rounded-full border border-stone-700 whitespace-nowrap">
                  ⚡ 32g Protein / 100g
                </span>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 w-full">
                <Link
                  href={current.link}
                  className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs sm:text-sm uppercase px-8 py-3.5 rounded-xl transition-all shadow-xl hover:shadow-amber-500/30 flex items-center justify-center gap-2 group tracking-wide"
                >
                  <span>{current.ctaText}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 shrink-0" />
                </Link>
                <Link
                  href="/shop"
                  className="w-full sm:w-auto bg-stone-800/90 hover:bg-stone-700 text-white font-bold text-xs sm:text-sm uppercase px-6 py-3.5 rounded-xl transition-colors border border-stone-700 text-center tracking-wide"
                >
                  EXPLORE ALL
                </Link>
              </div>
            </div>

            {/* Hero Visual Image (6 cols) - EXACT fixed pixel height & width across every slide */}
            <div className="lg:col-span-6 min-w-0 w-full flex justify-center items-center relative">
              <div className="relative w-[280px] h-[360px] sm:w-[360px] sm:h-[460px] lg:w-[420px] lg:h-[500px] flex items-center justify-center shrink-0">
                {/* Outer glowing ring strictly enclosed inside clipped container */}
                <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none flex items-center justify-center">
                  <div className="w-[85%] h-[85%] rounded-full border border-amber-500/30 animate-spin-slow" />
                </div>

                {/* Product Visual - Locked fixed dimensions */}
                <div
                  className={`relative w-full h-full drop-shadow-2xl transition-all duration-300 flex items-center justify-center ${
                    isFading ? "opacity-0 scale-98" : "opacity-100 scale-100"
                  }`}
                >
                  <Image
                    src={current.image}
                    alt={current.title}
                    fill
                    sizes="(max-width: 640px) 280px, (max-width: 768px) 360px, 420px"
                    className="object-contain filter drop-shadow-[0_25px_50px_rgba(0,0,0,0.9)]"
                    priority
                    unoptimized={true}
                  />
                </div>

                {/* Float badge */}
                <div className="absolute bottom-4 sm:bottom-6 right-2 sm:right-4 bg-stone-950/95 border border-amber-500/50 rounded-xl px-3 py-1.5 sm:px-4 sm:py-2 shadow-2xl backdrop-blur-md pointer-events-none z-20">
                  <p className="text-[8px] sm:text-[9px] font-bold text-amber-400 uppercase tracking-wider">Per 100g serving</p>
                  <p className="text-base sm:text-xl font-black text-white">32g Protein</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
  );
}
