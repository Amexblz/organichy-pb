"use client";

import React, { useState, useEffect, useRef } from "react";
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

  // Touch and mouse drag states for swipeable gesture
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const isDragging = useRef(false);

  const activeBanners =
    banners && banners.length > 0
      ? banners
      : [
          {
            id: "fallback-1",
            title: "INDIA'S PUREST DARK CHOCOLATE PEANUT BUTTER",
            subtitle: "High Protein | 100% Roasted Peanuts | Zero Palm Oil & No Preservatives",
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

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 45) {
      nextSlide();
    } else if (distance < -45) {
      prevSlide();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    touchStartX.current = e.clientX;
    touchEndX.current = null;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    touchEndX.current = e.clientX;
  };

  const handleMouseUp = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const distance = touchStartX.current - touchEndX.current;
      if (distance > 45) {
        nextSlide();
      } else if (distance < -45) {
        prevSlide();
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const handleMouseLeave = () => {
    if (isDragging.current) {
      handleMouseUp();
    }
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
    <section
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      className="w-full max-w-full relative bg-gradient-to-br from-amber-50/85 via-white to-stone-50 text-stone-900 overflow-hidden border-b border-amber-200/70 min-h-[520px] sm:min-h-[580px] lg:min-h-[620px] flex items-center select-none cursor-grab active:cursor-grabbing"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-amber-300/20 rounded-full blur-3xl pointer-events-none overflow-hidden" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-orange-200/25 rounded-full blur-3xl pointer-events-none overflow-hidden" />

      {/* Swipe Nav Buttons (Desktop) */}
      {activeBanners.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prevSlide();
            }}
            aria-label="Previous Slide"
            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 items-center justify-center rounded-full bg-white/90 hover:bg-white text-stone-800 hover:text-stone-950 border border-stone-200 shadow-lg transition-transform hover:scale-105 active:scale-95"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              nextSlide();
            }}
            aria-label="Next Slide"
            className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 items-center justify-center rounded-full bg-white/90 hover:bg-white text-stone-800 hover:text-stone-950 border border-stone-200 shadow-lg transition-transform hover:scale-105 active:scale-95"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12 relative z-10">
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-12 gap-8 lg:gap-8 items-center w-full min-w-0">
          {/* Text Content (6 cols) - fixed locked min height so banner never shifts */}
          <div className="lg:col-span-6 min-w-0 w-full flex flex-col justify-center text-center lg:text-left min-h-[300px] sm:min-h-[340px] lg:min-h-[380px]">
            {/* Badge line - fixed height */}
            <div className="h-8 flex items-center justify-center lg:justify-start mb-3">
              {current.badgeText && (
                <div
                  className={`inline-flex items-center gap-2 bg-amber-100/90 border border-amber-300 text-amber-950 text-xs sm:text-sm font-extrabold px-3.5 py-1.5 rounded-full shadow-sm transition-opacity duration-200 ${
                    isFading ? "opacity-0" : "opacity-100"
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="truncate">{current.badgeText}</span>
                </div>
              )}
            </div>

            {/* Title line - fixed locked height */}
            <div className="min-h-[76px] sm:min-h-[96px] lg:min-h-[120px] flex items-center justify-center lg:justify-start mb-3">
              <h1
                className={`text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.12] text-stone-950 break-words w-full transition-opacity duration-200 ${
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
                  className={`text-xs sm:text-base text-stone-600 max-w-lg font-medium leading-relaxed mx-auto lg:mx-0 break-words transition-opacity duration-200 ${
                    isFading ? "opacity-0" : "opacity-100"
                  }`}
                >
                  {current.subtitle}
                </p>
              )}
            </div>

            {/* Quick feature pill tags */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 text-xs font-bold text-stone-700 mb-6">
              <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-stone-200/90 shadow-sm whitespace-nowrap">
                🥜 100% Saurashtra Peanuts
              </span>
              <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-stone-200/90 shadow-sm whitespace-nowrap">
                🚫 0% Palm Oil
              </span>
              <span className="flex items-center gap-1.5 bg-amber-100/80 text-amber-950 px-3 py-1.5 rounded-full border border-amber-300 shadow-sm whitespace-nowrap">
                ⚡ High Plant Protein
              </span>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 w-full">
              <Link
                href={current.link}
                className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs sm:text-sm uppercase px-8 py-3.5 rounded-xl transition-all shadow-xl hover:shadow-amber-500/30 flex items-center justify-center gap-2 group tracking-wide active:scale-98"
              >
                <span>{current.ctaText}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 shrink-0" />
              </Link>
              <Link
                href="/shop"
                className="w-full sm:w-auto bg-white hover:bg-stone-100 text-stone-900 font-bold text-xs sm:text-sm uppercase px-6 py-3.5 rounded-xl transition-colors border border-stone-300 text-center tracking-wide shadow-sm"
              >
                EXPLORE ALL
              </Link>
            </div>
          </div>

          {/* Hero Visual Image (6 cols) */}
          <div className="lg:col-span-6 min-w-0 w-full flex justify-center items-center relative">
            <div className="relative w-[280px] h-[360px] sm:w-[360px] sm:h-[460px] lg:w-[420px] lg:h-[500px] flex items-center justify-center shrink-0">
              {/* Outer decorative ring */}
              <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none flex items-center justify-center">
                <div className="w-[85%] h-[85%] rounded-full border border-amber-300/50 animate-spin-slow" />
              </div>

              {/* Product Visual */}
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
                  className="object-contain filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.18)]"
                  priority
                />
              </div>

              {/* Float badge */}
              <div className="absolute bottom-4 sm:bottom-6 right-2 sm:right-4 bg-white/95 border border-amber-300/80 rounded-xl px-3.5 py-2 sm:px-4 sm:py-2.5 shadow-2xl backdrop-blur-md pointer-events-none z-20">
                <p className="text-[9px] sm:text-[10px] font-black text-amber-700 uppercase tracking-wider">Zero Palm Oil</p>
                <p className="text-base sm:text-xl font-black text-stone-950">100% Roasted</p>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Pagination Dots & Swipe Hint */}
        {activeBanners.length > 1 && (
          <div className="mt-6 flex flex-col items-center justify-center gap-2">
            <div className="flex items-center gap-2">
              {activeBanners.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => goToSlide(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    idx === currentIndex
                      ? "w-8 bg-amber-500 shadow-sm"
                      : "w-2.5 bg-stone-300 hover:bg-stone-400"
                  }`}
                />
              ))}
            </div>
            <p className="text-[11px] text-stone-500 font-medium md:hidden">
              ← Swipe left or right to explore flavors →
            </p>
          </div>
        )}
      </div>
    </section>
  );
}