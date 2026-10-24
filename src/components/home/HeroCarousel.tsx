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

      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-12 gap-8 lg:gap-8 items-center w-full min-w-0">
            {/* Text Content */}
            <div
              className={`lg:col-span-7 min-w-0 w-full space-y-4 sm:space-y-5 text-center lg:text-left flex flex-col justify-center transition-all duration-200 ${
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
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.12] text-white break-words w-full">
                  {current.title}
                </h1>
              </div>

              <div>
                {current.subtitle && (
                  <p className="text-xs sm:text-base text-stone-300 max-w-lg font-normal leading-relaxed mx-auto lg:mx-0 break-words">
                    {current.subtitle}
                  </p>
                )}
              </div>

              {/* Quick feature pill tags */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1 text-xs font-bold text-stone-300">
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

              <div className="pt-2 sm:pt-3 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 w-full">
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

            {/* Hero Visual Image - 50% reduced to look compact, neat, and proportionate */}
            <div className="lg:col-span-5 min-w-0 w-full flex justify-center items-center relative py-2">
              <div className="relative w-52 h-52 sm:w-72 sm:h-72 md:w-80 md:h-80 flex items-center justify-center shrink-0">
                {/* Outer glowing ring strictly enclosed inside clipped container */}
                <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
                  <div className="w-full h-full rounded-full border-2 border-amber-500/25 animate-spin-slow scale-95" />
                </div>

                {/* Product Visual - Clean compact fit */}
                <div
                  className={`relative w-4/5 h-4/5 drop-shadow-2xl transition-all duration-300 flex items-center justify-center ${
                    isFading ? "opacity-0 scale-95" : "opacity-100 scale-100"
                  }`}
                >
                  <Image
                    src={current.image}
                    alt={current.title}
                    fill
                    sizes="(max-width: 640px) 208px, (max-width: 768px) 288px, 320px"
                    className="object-contain filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.85)]"
                    priority
                    unoptimized={true}
                  />
                </div>

                {/* Float badge */}
                <div className="absolute bottom-1 sm:bottom-2 right-1 sm:right-2 bg-stone-950/95 border border-amber-500/50 rounded-xl px-2.5 py-1.5 sm:px-3 sm:py-2 shadow-2xl backdrop-blur-md pointer-events-none z-20">
                  <p className="text-[8px] sm:text-[9px] font-bold text-amber-400 uppercase tracking-wider">Per 100g serving</p>
                  <p className="text-sm sm:text-base font-black text-white">32g Protein</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
  );
}
