"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Search,
  ShoppingCart,
  User,
  Heart,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  LogOut,
} from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function Header({
  announcementText: propAnnouncementText,
}: {
  announcementText?: string;
}) {
  const { items, setIsCartOpen, wishlist, siteSettings } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  const totalCartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Active announcement configuration
  const announcementText = propAnnouncementText || siteSettings.announcementText;
  const isAnnouncementActive = siteSettings.announcementActive !== false;

  useEffect(() => {
    // Check if user is logged in
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.authenticated) {
          setCurrentUser(data.user);
        }
      })
      .catch(() => {});

    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setCurrentUser(null);
    setUserMenuOpen(false);
    router.push("/");
    router.refresh();
  };

  return (
    <header className="w-full sticky top-0 z-40 bg-white border-b border-stone-200 transition-all duration-200">
      {/* 1. Global Announcement Bar (dynamically controlled via Admin settings) */}
      {isAnnouncementActive && announcementText && (
        <div className="bg-stone-950 text-amber-400 text-xs sm:text-sm font-semibold tracking-wide py-2 px-4 text-center overflow-hidden">
          <div className="flex items-center justify-center gap-2 animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate">{announcementText}</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          </div>
        </div>
      )}

      {/* 2. Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-stone-800 hover:bg-stone-100 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>

          {/* Brand Logo */}
          <Link href="/" className="flex items-center shrink-0 group py-1" aria-label="Organichy Home">
            <div className="relative h-10 sm:h-14 md:h-16 w-32 sm:w-48 md:w-56 transition-transform duration-300 group-hover:scale-105">
              <Image
                src={siteSettings.logoUrl || "/images/branding/logo.png"}
                alt={siteSettings.siteName || "Organichy Peanut Butter"}
                fill
                sizes="(max-width: 640px) 130px, (max-width: 768px) 192px, 224px"
                className="object-contain object-left"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-bold text-stone-800">
            <Link href="/shop" className="hover:text-amber-600 transition-colors">
              ALL PRODUCTS
            </Link>
            <Link href="/collections/chocolate-collection" className="hover:text-amber-600 transition-colors flex items-center gap-1">
              DARK CHOCOLATE
              <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full">
                HOT
              </span>
            </Link>
            <Link href="/collections/high-protein" className="hover:text-amber-600 transition-colors">
              HIGH PROTEIN
            </Link>
            <Link href="/collections/natural-organic" className="hover:text-amber-600 transition-colors">
              100% NATURAL
            </Link>
            <Link href="/collections/combos" className="hover:text-amber-600 transition-colors">
              COMBOS & SAVER
            </Link>
            <Link href="/about" className="hover:text-amber-600 transition-colors text-stone-500 font-medium">
              OUR STORY
            </Link>
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-xs lg:max-w-sm relative">
            <form onSubmit={handleSearchSubmit} className="w-full">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search peanut butter, chocolate, combos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-stone-100 hover:bg-stone-50 focus:bg-white border border-stone-200 focus:border-amber-500 rounded-full text-xs sm:text-sm text-stone-800 focus:outline-none transition-all shadow-inner"
                />
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </form>
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-1.5 sm:gap-4">
            {/* Wishlist */}
            <Link
              href="/account/wishlist"
              className="relative p-2 sm:p-2.5 rounded-full text-stone-700 hover:text-amber-600 hover:bg-amber-50 transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 bg-amber-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* User Account / Profile */}
            <div className="relative">
              {currentUser ? (
                <div>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-1.5 p-1.5 sm:p-2 rounded-full hover:bg-stone-100 text-stone-800 transition-colors"
                    aria-label="Customer Profile"
                  >
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-amber-600 text-white font-bold text-xs flex items-center justify-center">
                      {currentUser.name.charAt(0).toUpperCase()}
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-stone-500 hidden sm:block" />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-stone-100 py-2 z-50">
                      <div className="px-4 py-2 border-b border-stone-100">
                        <p className="text-xs text-stone-400">Signed in as</p>
                        <p className="text-sm font-bold text-stone-900 truncate">{currentUser.name}</p>
                      </div>
                      <Link
                        href="/account"
                        onClick={() => setUserMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-stone-700 hover:bg-amber-50 hover:text-amber-800"
                      >
                        Account Dashboard
                      </Link>
                      <Link
                        href="/account/orders"
                        onClick={() => setUserMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-stone-700 hover:bg-amber-50 hover:text-amber-800"
                      >
                        My Orders
                      </Link>
                      <Link
                        href="/account/addresses"
                        onClick={() => setUserMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-stone-700 hover:bg-amber-50 hover:text-amber-800"
                      >
                        Saved Addresses
                      </Link>
                      {currentUser.role === "ADMIN" && (
                        <Link
                          href="/admin/dashboard"
                          onClick={() => setUserMenuOpen(false)}
                          className="block px-4 py-2 text-sm font-bold text-amber-700 bg-amber-50/70 hover:bg-amber-100"
                        >
                          Admin Portal ⚡
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 border-t border-stone-100 mt-1"
                      >
                        <LogOut className="w-3.5 h-3.5" /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 p-1.5 sm:p-2 rounded-full hover:bg-stone-100 text-stone-700 hover:text-amber-600 transition-colors"
                  aria-label="Login or Sign Up"
                >
                  <User className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline text-xs font-bold">LOGIN</span>
                </Link>
              )}
            </div>

            {/* Cart Drawer Trigger Button */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-1.5 sm:gap-2 bg-stone-900 hover:bg-amber-600 text-white px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-full transition-all shadow-md group shrink-0"
              aria-label="View Shopping Cart"
            >
              <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:scale-110" />
              <span className="font-extrabold text-xs sm:text-sm hidden xs:inline">
                CART
              </span>
              <span className="bg-amber-500 text-stone-950 font-black text-xs px-1.5 sm:px-2 py-0.5 rounded-full shadow-inner">
                {totalCartCount}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3">
          <form onSubmit={handleSearchSubmit} className="w-full">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products, protein oats, chocolate..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-stone-100 border border-stone-200 rounded-full text-xs text-stone-800 focus:outline-none focus:border-amber-500"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </form>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-stone-900 text-white px-6 py-6 border-t border-stone-800 space-y-4">
          <div className="pb-3 border-b border-stone-800">
            <div className="relative h-12 w-44">
              <Image
                src={siteSettings.logoUrl || "/images/branding/logo.png"}
                alt={siteSettings.siteName || "Organichy"}
                fill
                sizes="176px"
                className="object-contain object-left filter brightness-110"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 font-bold text-sm tracking-wide">
            <Link
              href="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-stone-800 hover:text-amber-400 flex items-center justify-between"
            >
              <span>ALL PRODUCTS</span>
              <span>→</span>
            </Link>
            <Link
              href="/collections/chocolate-collection"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-stone-800 hover:text-amber-400 flex items-center justify-between"
            >
              <span>DARK CHOCOLATE COLLECTION</span>
              <span className="bg-amber-500 text-stone-950 text-[10px] px-2 py-0.5 rounded-full font-bold">HOT</span>
            </Link>
            <Link
              href="/collections/high-protein"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-stone-800 hover:text-amber-400 flex items-center justify-between"
            >
              <span>HIGH PROTEIN (32G)</span>
              <span>→</span>
            </Link>
            <Link
              href="/collections/natural-organic"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-stone-800 hover:text-amber-400 flex items-center justify-between"
            >
              <span>100% NATURAL & KETO</span>
              <span>→</span>
            </Link>
            <Link
              href="/collections/combos"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-stone-800 hover:text-amber-400 flex items-center justify-between"
            >
              <span>COMBO PACKS</span>
              <span>→</span>
            </Link>
            <Link
              href="/track-order"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-stone-800 hover:text-amber-400 flex items-center justify-between text-stone-300"
            >
              <span>TRACK ORDER</span>
              <span>📦</span>
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:text-amber-400 text-stone-300"
            >
              OUR STORY
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
