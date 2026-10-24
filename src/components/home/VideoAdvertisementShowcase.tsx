"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Volume2, VolumeX, Play, ShoppingBag, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

interface AdvertisementVideo {
  id: string;
  title: string;
  description?: string | null;
  videoUrl: string;
  thumbnailUrl?: string | null;
  productLink: string;
  tagText?: string | null;
  displayOrder?: number;
  active?: boolean;
}

export default function VideoAdvertisementShowcase({
  initialVideos,
}: {
  initialVideos?: AdvertisementVideo[];
}) {
  const [videos, setVideos] = useState<AdvertisementVideo[]>(initialVideos || []);
  const [unmutedCardId, setUnmutedCardId] = useState<string | null>(null);
  const [pausedCardId, setPausedCardId] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

  useEffect(() => {
    if (!initialVideos || initialVideos.length === 0) {
      fetch("/api/videos")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.videos && data.videos.length > 0) {
            setVideos(data.videos);
          }
        })
        .catch(() => {});
    }
  }, [initialVideos]);

  const toggleSound = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const vidEl = videoRefs.current[id];
    if (!vidEl) return;

    if (unmutedCardId === id) {
      vidEl.muted = true;
      setUnmutedCardId(null);
    } else {
      // Mute all other videos first
      Object.keys(videoRefs.current).forEach((k) => {
        if (videoRefs.current[k]) {
          videoRefs.current[k]!.muted = true;
        }
      });
      vidEl.muted = false;
      vidEl.play().catch(() => {});
      setUnmutedCardId(id);
    }
  };

  const togglePlay = (id: string) => {
    const vidEl = videoRefs.current[id];
    if (!vidEl) return;

    if (vidEl.paused) {
      vidEl.play();
      setPausedCardId((prev) => (prev === id ? null : prev));
    } else {
      vidEl.pause();
      setPausedCardId(id);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -320 : 320;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // If no videos yet, return null
  if (!videos || videos.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-white text-stone-900 py-16 sm:py-20 mb-16 sm:mb-24 border-y border-stone-200/80 relative overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center">
        {/* Section Header - Centered */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-black uppercase tracking-wider shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>CRAFT IN MOTION • REEL SHOWCASE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-stone-950">
            Watch The Purity &amp; Crunch
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm font-medium max-w-xl mx-auto">
            Slow stoneground roasting, velvety drizzle, and athlete-grade nutrition. Click any reel to explore and shop.
          </p>
        </div>

        {/* Carousel Container with Centered Alignment */}
        <div className="relative w-full flex items-center justify-center">
          {/* Left Arrow Button (shown if scrollable) */}
          {videos.length > 3 && (
            <button
              onClick={() => scroll("left")}
              aria-label="Scroll left"
              className="hidden lg:flex p-3 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 hover:text-stone-900 border border-stone-300 transition-all shadow-md active:scale-95 shrink-0 mr-4 z-20"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {/* Cards Flex Row - Centered on screen */}
          <div
            ref={scrollContainerRef}
            className="flex justify-start md:justify-center items-center gap-4 sm:gap-6 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scrollbar-none scroll-smooth w-full max-w-full px-2 sm:px-0"
          >
            {videos.map((vid) => {
              const isUnmuted = unmutedCardId === vid.id;
              const isPaused = pausedCardId === vid.id;

              return (
                <div
                  key={vid.id}
                  className="w-[72vw] max-w-[280px] sm:w-72 md:w-80 shrink-0 snap-center sm:snap-start group relative rounded-3xl overflow-hidden bg-stone-950 border border-stone-200/90 shadow-xl transition-all duration-300 hover:shadow-2xl hover:border-amber-500 hover:-translate-y-1"
                >
                  {/* 9:16 Vertical Video Container */}
                  <div
                    onClick={() => togglePlay(vid.id)}
                    className="relative aspect-[9/16] w-full cursor-pointer bg-black overflow-hidden"
                  >
                    <video
                      ref={(el) => {
                        videoRefs.current[vid.id] = el;
                      }}
                      src={vid.videoUrl}
                      poster={vid.thumbnailUrl || undefined}
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="metadata"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Gradient overlays for readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-black/40 pointer-events-none" />

                    {/* Top Bar: Badge Tag and Sound Toggle */}
                    <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-20">
                      <span className="bg-amber-500/95 backdrop-blur-md text-stone-950 text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-md tracking-wider">
                        {vid.tagText || "ORGANICHY"}
                      </span>

                      <button
                        type="button"
                        onClick={(e) => toggleSound(e, vid.id)}
                        className="p-2 rounded-full bg-stone-900/80 backdrop-blur-md hover:bg-amber-500 hover:text-stone-950 text-white transition-all shadow-md active:scale-95"
                        aria-label={isUnmuted ? "Mute video" : "Unmute video"}
                      >
                        {isUnmuted ? (
                          <Volume2 className="w-4 h-4 text-amber-400 group-hover:text-stone-950" />
                        ) : (
                          <VolumeX className="w-4 h-4 text-stone-300" />
                        )}
                      </button>
                    </div>

                    {/* Center Paused Indicator */}
                    {isPaused && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-10 pointer-events-none">
                        <div className="w-14 h-14 rounded-full bg-stone-900/90 border border-stone-700 flex items-center justify-center text-amber-400 shadow-xl">
                          <Play className="w-7 h-7 fill-amber-400 ml-1" />
                        </div>
                      </div>
                    )}

                    {/* Bottom Content & CTA */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 z-20 space-y-2 pointer-events-auto">
                      <h3 className="font-black text-sm sm:text-base text-white leading-tight drop-shadow-md line-clamp-2">
                        {vid.title}
                      </h3>

                      {vid.description && (
                        <p className="text-[11px] sm:text-xs text-stone-300 line-clamp-2 drop-shadow leading-relaxed">
                          {vid.description}
                        </p>
                      )}

                      <div className="pt-2">
                        <Link
                          href={vid.productLink || "/shop"}
                          onClick={(e) => e.stopPropagation()}
                          className="w-full inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs uppercase py-2.5 px-4 rounded-xl transition-all shadow-lg hover:shadow-amber-500/25 active:scale-98"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Shop This Peanut Butter</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Arrow Button (shown if scrollable) */}
          {videos.length > 3 && (
            <button
              onClick={() => scroll("right")}
              aria-label="Scroll right"
              className="hidden lg:flex p-3 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 hover:text-stone-900 border border-stone-300 transition-all shadow-md active:scale-95 shrink-0 ml-4 z-20"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
