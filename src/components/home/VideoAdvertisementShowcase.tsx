"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, ShoppingBag, ExternalLink, Sparkles, Heart, MessageCircle, Eye, Share2 } from "lucide-react";

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
  const [activeTab, setActiveTab] = useState<"instagram" | "youtube">("instagram");
  const [selectedYoutubeId, setSelectedYoutubeId] = useState<string>("8PZq-t8t7u4");

  const instagramReels = [
    {
      id: "reel-1",
      title: "The 32g Protein Drizzle & Crunch Test",
      description: "Zero palm oil, thick slow-roasted Saurashtra peanuts crushed to silky crunch.",
      image: "/images/products/organichy-jar.png",
      likes: "4.8K",
      views: "52.3K",
      comments: "142",
      tag: "🔥 VIRAL REEL",
      productLink: "/shop?flavor=Dark+Chocolate",
      instagramUrl: "https://www.instagram.com/organichy_pb/",
    },
    {
      id: "reel-2",
      title: "Post-Workout Banana & Organichy Muscle Shake",
      description: "32g clean protein + 0g trans fat. The ultimate anabolic recovery shake.",
      image: "/images/products/Chocolate Crunchy Peanut Butter 1 kgCombo Pack.png",
      likes: "6.2K",
      views: "68.9K",
      comments: "215",
      tag: "⚡ RECIPE REEL",
      productLink: "/shop?sort=bestseller",
      instagramUrl: "https://www.instagram.com/organichy_pb/",
    },
    {
      id: "reel-3",
      title: "Label Check: Organichy vs Market Peanut Butter",
      description: "Why elite bodybuilders refuse hydrogenated palm oil and cheap emulsifiers.",
      image: "/images/products/organichy-nutrition.png",
      likes: "9.1K",
      views: "94.5K",
      comments: "480",
      tag: "🧪 PURITY CHECK",
      productLink: "/shop",
      instagramUrl: "https://www.instagram.com/organichy_pb/",
    },
    {
      id: "reel-4",
      title: "Belgian Dark Chocolate Crunchy Duo Taste Test",
      description: "Rich dark cocoa notes with authentic roasted peanut crunch in every spoonful.",
      image: "/images/products/Organic Chocolate Crunchy Peanut Butter Duo Transparent.png",
      likes: "5.4K",
      views: "43.7K",
      comments: "167",
      tag: "🍫 TASTE TEST",
      productLink: "/collections/chocolate-collection",
      instagramUrl: "https://www.instagram.com/organichy_pb/",
    },
  ];

  const youtubeVideos = [
    {
      id: "8PZq-t8t7u4", // Educational nutrition & fitness review format
      title: "The Ultimate Peanut Butter Guide: Protein, Palm Oil & Nutrition Explained",
      subtitle: "Why 32g protein per 100g and zero palm oil matters for your health & physique",
      channel: "Organichy Nutrition Lab",
      duration: "08:45",
      views: "34,200 views",
      badge: "FEATURED EPISODE",
    },
    {
      id: "vA_5b0XvL3Q",
      title: "How Organichy Slow-Roasts 100% Saurashtra Peanuts",
      subtitle: "From farm to jar: inside the Gujarat production facility & FSSAI certified lines",
      channel: "Organichy Official",
      duration: "05:12",
      views: "21,800 views",
      badge: "FACILITY TOUR",
    },
    {
      id: "Mh8m5f5TqA8",
      title: "High Protein Peanut Butter Meal Prep: 4 Easy Athlete Recipes",
      subtitle: "Pre-workout oats, protein smoothie bowls, and crunch protein bars",
      channel: "Organichy Kitchen",
      duration: "06:30",
      views: "48,900 views",
      badge: "RECIPES",
    },
  ];

  return (
    <section className="w-full bg-stone-50 text-stone-900 py-16 sm:py-20 border-y border-stone-200 relative overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/80 border border-amber-300 text-amber-950 text-xs font-black uppercase tracking-wider shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>COMMUNITY &amp; MEDIA SHOWCASE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-stone-950">
            Watch Organichy In Action
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm font-medium max-w-xl mx-auto">
            Experience our slow stoneground roasting, authentic customer reels, and athlete workout nutrition on Instagram and YouTube.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 sm:gap-3 p-1.5 bg-white border border-stone-200 rounded-2xl shadow-sm mb-10">
          <button
            type="button"
            onClick={() => setActiveTab("instagram")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold uppercase tracking-wide transition-all ${
              activeTab === "instagram"
                ? "bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 shadow-md scale-102"
                : "text-stone-600 hover:text-stone-900 hover:bg-stone-50"
            }`}
          >
            <span className="text-base">📸</span>
            <span>Instagram Reels (@organichy_pb)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("youtube")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold uppercase tracking-wide transition-all ${
              activeTab === "youtube"
                ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md scale-102"
                : "text-stone-600 hover:text-stone-900 hover:bg-stone-50"
            }`}
          >
            <span className="text-base">🎬</span>
            <span>YouTube Videos &amp; Reviews</span>
          </button>
        </div>

        {/* TAB 1: INSTAGRAM REELS */}
        {activeTab === "instagram" && (
          <div className="w-full space-y-8">
            {/* Instagram Profile Strip */}
            <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl border border-stone-200 p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-full p-[2px] bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600">
                  <div className="w-full h-full rounded-full bg-white p-0.5 overflow-hidden flex items-center justify-center">
                    <Image
                      src="/images/branding/logo.png"
                      alt="Organichy Instagram"
                      width={44}
                      height={44}
                      className="object-contain"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-stone-950 text-sm sm:text-base">@organichy_pb</h3>
                    <span className="bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">✓</span>
                  </div>
                  <p className="text-stone-500 text-xs font-medium">Official Organichy Nutrition • 100% Pure Peanut Butter</p>
                </div>
              </div>
              <a
                href="https://www.instagram.com/organichy_pb/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:opacity-95 text-white font-black text-xs uppercase px-5 py-2.5 rounded-xl shadow-md transition-transform active:scale-98"
              >
                <span>Follow on Instagram</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Reels Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full">
              {instagramReels.map((reel) => (
                <div
                  key={reel.id}
                  className="bg-white rounded-3xl border border-stone-200/90 shadow-lg overflow-hidden group hover:shadow-xl hover:border-amber-400 transition-all duration-300 flex flex-col"
                >
                  {/* Top Reel Frame */}
                  <div className="relative aspect-[4/5] bg-stone-950 overflow-hidden">
                    <Image
                      src={reel.image}
                      alt={reel.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/30 to-black/20 pointer-events-none" />

                    {/* Tag badge */}
                    <div className="absolute top-3 left-3 z-10">
                      <span className="bg-amber-500 text-stone-950 text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-md tracking-wider">
                        {reel.tag}
                      </span>
                    </div>

                    {/* Play button overlay */}
                    <a
                      href={reel.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0 flex items-center justify-center z-10 group-hover:scale-110 transition-transform"
                      aria-label={`Watch ${reel.title} on Instagram`}
                    >
                      <div className="w-13 h-13 rounded-full bg-black/60 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-xl">
                        <Play className="w-6 h-6 fill-white ml-0.5 text-white" />
                      </div>
                    </a>

                    {/* Engagement stats */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-bold drop-shadow z-10">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5 text-stone-300" />
                          <span>{reel.views}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                          <span>{reel.likes}</span>
                        </span>
                      </div>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-3.5 h-3.5 text-stone-300" />
                        <span>{reel.comments}</span>
                      </span>
                    </div>
                  </div>

                  {/* Reel Info & Links */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h4 className="font-black text-sm text-stone-950 leading-snug line-clamp-2">
                        {reel.title}
                      </h4>
                      <p className="text-xs text-stone-600 mt-1 line-clamp-2 leading-relaxed">
                        {reel.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-stone-100 flex flex-col gap-2">
                      <a
                        href={reel.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 text-xs font-extrabold text-stone-700 hover:text-stone-950 hover:bg-stone-100 py-1.5 px-3 rounded-lg border border-stone-200 transition-colors"
                      >
                        <span>Watch on Instagram</span>
                        <ExternalLink className="w-3 h-3 text-stone-500" />
                      </a>
                      <Link
                        href={reel.productLink}
                        className="inline-flex items-center justify-center gap-1.5 text-xs font-black uppercase text-stone-950 bg-amber-500 hover:bg-amber-400 py-2 px-3 rounded-lg shadow-sm transition-all active:scale-98"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Shop This Flavor</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: YOUTUBE VIDEOS */}
        {activeTab === "youtube" && (
          <div className="w-full max-w-5xl mx-auto space-y-8">
            {/* Main Featured Video Player */}
            <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xl p-4 sm:p-6 space-y-4">
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-stone-950 shadow-inner">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${selectedYoutubeId}?rel=0&modestbranding=1`}
                  title="Organichy YouTube Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
                <div>
                  <span className="inline-block bg-red-100 text-red-700 text-[10px] font-black uppercase px-2.5 py-1 rounded-full mb-1.5">
                    YOUTUBE SPOTLIGHT
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-stone-950">
                    Why 32g Protein &amp; Zero Palm Oil Is Essential For Your Health
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 mt-1">
                    Watch our in-depth nutritional breakdown, athlete tests, and manufacturing standards.
                  </p>
                </div>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase px-5 py-3 rounded-xl shadow-md transition-transform active:scale-98 shrink-0"
                >
                  <span>Subscribe on YouTube</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Other YouTube Videos / Episodes List */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {youtubeVideos.map((video) => (
                <div
                  key={video.id}
                  onClick={() => setSelectedYoutubeId(video.id)}
                  className={`bg-white rounded-2xl border p-4 cursor-pointer transition-all hover:shadow-md ${
                    selectedYoutubeId === video.id
                      ? "border-red-500 shadow-md ring-2 ring-red-500/20"
                      : "border-stone-200 hover:border-stone-300"
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-bold text-stone-500 mb-2">
                    <span className="bg-stone-100 px-2 py-0.5 rounded text-stone-700 font-extrabold">{video.badge}</span>
                    <span>{video.duration}</span>
                  </div>
                  <h4 className="font-extrabold text-sm text-stone-950 line-clamp-2 leading-snug">
                    {video.title}
                  </h4>
                  <p className="text-xs text-stone-500 mt-1 line-clamp-2">
                    {video.subtitle}
                  </p>
                  <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-600 font-semibold">
                    <span>{video.channel}</span>
                    <span className="text-red-600 font-extrabold">▶ Play Video</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}