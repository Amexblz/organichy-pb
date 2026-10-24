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
    <section className="w-full max-w-full relative bg-gradient-to-br from-stone-950 via-stone-900 to-amber-950 text-white overflow-hidden py-8 sm:py-12 md:py-16 border-b border-stone-800/80">
      {/* Background ambient lighting - strictly contained */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none overflow-hidden" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-amber-600/15 rounded-full blur-3xl pointer-events-none overflow-hidden" />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-12 gap-8 lg:gap-10 items-center w-full min-w-0">
            {/* Text Content */}
            <div
              className={`lg:col-span-6 min-w-0 w-full space-y-4 sm:space-y-6 text-center lg:text-left flex flex-col justify-center min-h-[260px] sm:min-h-[320px] transition-all duration-200 ${
                isFading ? "opacity-0 translate-y-1" : "opacity-100 translate-y-0"
              }`}
            >
              {current.badgeText && (
                <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[11px] sm:text-sm font-extrabold px-3 py-1.5 rounded-full shadow-inner self-center lg:self-start">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="truncate">{current.badgeText}</span>
                </div>
              )}

              <div className="min-h-[56px] sm:min-h-[90px] lg:min-h-[120px] flex items-center">
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.12] text-white break-words w-full">
                  {current.title}
                </h1>
              </div>

              <div className="min-h-[40px] sm:min-h-[48px] flex items-center">
                {current.subtitle && (
                  <p className="text-xs sm:text-base text-stone-300 max-w-lg font-normal leading-relaxed mx-auto lg:mx-0 break-words">
                    {current.subtitle}
                  </p>
                )}
              </div>

              {/* Quick feature pill tags */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1 text-[11px] sm:text-xs font-bold text-stone-300">
                <span className="flex items-center gap-1 bg-stone-800/80 px-3 py-1.5 rounded-full border border-stone-700 whitespace-nowrap">
                  🥜 100% Saurashtra Peanuts
                </span>
                <span className="flex items-center gap-1 bg-stone-800/80 px-3 py-1.5 rounded-full border border-stone-700 whitespace-nowrap">
                  🚫 0% Palm Oil
                </span>
                <span className="flex items-center gap-1 bg-stone-800/80 px-3 py-1.5 rounded-full border border-stone-700 whitespace-nowrap">
                  ⚡ 32g Protein / 100g
                </span>
              </div>

              <div className="pt-2 sm:pt-3 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 w-full">
                <Link
                  href={current.link}
                  className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs sm:text-sm uppercase px-8 py-3.5 rounded-xl transition-all shadow-xl hover:shadow-amber-500/30 flex items-center justify-center gap-2 group"
                >
                  <span>{current.ctaText}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 shrink-0" />
                </Link>
                <Link
                  href="/shop"
                  className="w-full sm:w-auto bg-stone-800/80 hover:bg-stone-700 text-white font-bold text-xs sm:text-sm uppercase px-6 py-3.5 rounded-xl transition-colors border border-stone-700 text-center"
                >
                  EXPLORE ALL
                </Link>
              </div>
            </div>

            {/* Hero Visual Image - Enlarge container and image to fit prominently */}
            <div className="lg:col-span-6 min-w-0 w-full flex justify-center items-center relative">
              <div className="relative w-72 h-72 sm:w-[420px] sm:h-[420px] md:w-[480px] md:h-[480px] lg:w-[520px] lg:h-[520px] flex items-center justify-center shrink-0">
                {/* Outer glowing ring strictly enclosed inside clipped container */}
                <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
                  <div className="w-full h-full rounded-full border-2 border-amber-500/30 animate-spin-slow scale-90" />
                </div>

                {/* Product Visual - Fills container 100% */}
                <div
                  className={`relative w-full h-full p-2 sm:p-4 drop-shadow-2xl transition-all duration-300 flex items-center justify-center ${
                    isFading ? "opacity-0 scale-95" : "opacity-100 scale-100"
                  }`}
                >
                  <Image
                    src={current.image}
                    alt={current.title}
                    fill
                    sizes="(max-width: 640px) 288px, (max-width: 768px) 420px, (max-width: 1024px) 480px, 520px"
                    className="object-contain filter drop-shadow-[0_25px_50px_rgba(0,0,0,0.85)] scale-105"
                    priority
                    unoptimized={true}
                  />
                </div>

                {/* Float badge */}
                <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-6 bg-stone-950/95 border border-amber-500/50 rounded-2xl px-3.5 py-2 sm:px-4 sm:py-2.5 shadow-2xl backdrop-blur-md pointer-events-none">
                  <p className="text-[9px] sm:text-[10px] font-bold text-amber-400 uppercase tracking-wider">Per 100g serving</p>
                  <p className="text-lg sm:text-2xl font-black text-white">32g Protein</p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Dots & Arrows */}
          {activeBanners.length > 1 && (
            <div className="flex items-center justify-between pt-6 border-t border-stone-800/80 mt-6 w-full">
              <div className="flex items-center gap-2">
                {activeBanners.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      currentIndex === index ? "w-8 bg-amber-500" : "w-2 bg-stone-700 hover:bg-stone-500"
                    }`}
                    aria-label={`Slide ${index + 1}`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={prevSlide}
                  className="p-1.5 rounded-full bg-stone-800/80 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={nextSlide}
                  className="p-1.5 rounded-full bg-stone-800/80 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors"
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
  );
}
