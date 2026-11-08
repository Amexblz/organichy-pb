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

let cachedAuthUser: any = null;
let hasCheckedAuth = false;

export default function Header({
  announcementText: propAnnouncementText,
}: {
  announcementText?: string;
}) {
  const { items, setIsCartOpen, wishlist, siteSettings } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(cachedAuthUser);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  const totalCartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Active announcement configuration
  const announcementText = propAnnouncementText || siteSettings.announcementText;
  const isAnnouncementActive = siteSettings.announcementActive !== false;

  useEffect(() => {
    // Only check auth once unless invalidated
    if (!hasCheckedAuth) {
      fetch("/api/auth/me")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          hasCheckedAuth = true;
          if (data?.authenticated) {
            cachedAuthUser = data.user;
            setCurrentUser(data.user);
          } else {
            cachedAuthUser = null;
          }
        })
        .catch(() => {
          hasCheckedAuth = true;
        });
    }

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
    cachedAuthUser = null;
    hasCheckedAuth = false;
    setCurrentUser(null);
    setUserMenuOpen(false);
    router.push("/");
    router.refresh();
  };

  return (
    <header className="w-full sticky top-0 z-40 bg-white border-b border-stone-200 transition-all duration-200">
      {/* 1. Global Announcement Bar (Light & Warm Amber Accent) */}
      {isAnnouncementActive && announcementText && (
        <div className="bg-amber-500 text-stone-950 text-xs sm:text-sm font-bold tracking-wide py-2 px-4 text-center overflow-hidden border-b border-amber-600/20 shadow-sm">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-stone-950 shrink-0" />
            <span className="truncate font-extrabold">{announcementText}</span>
            <Sparkles className="w-3.5 h-3.5 text-stone-950 shrink-0" />
          </div>
        </div>
      )}

      {/* 2. Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          {/* Mobile hamburger menu button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 rounded-xl text-stone-900 bg-stone-100 hover:bg-amber-50 hover:border-amber-400 border border-stone-200 transition-all shadow-sm active:scale-95"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-stone-900" />
            ) : (
              <Menu className="w-5 h-5 text-stone-900" />
            )}
            <span className="text-[11px] font-black uppercase tracking-wider hidden xs:inline">
              MENU
            </span>
          </button>

          {/* Brand Logo */}
          <Link href="/" prefetch={true} className="flex items-center shrink-0 group py-1" aria-label="Organichy Home">
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

          {/* Big Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md lg:max-w-xl mx-2 lg:mx-4 relative">
            <form onSubmit={handleSearchSubmit} className="w-full">
              <div className="relative flex items-center">
                <Search className="w-5 h-5 text-stone-400 absolute left-4 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search 32g peanut butter, dark chocolate, combos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-24 py-2.5 sm:py-3 bg-stone-50 hover:bg-white focus:bg-white border-2 border-stone-200 focus:border-amber-500 rounded-full text-xs sm:text-sm font-medium text-stone-900 focus:outline-none transition-all shadow-sm focus:shadow-md focus:ring-2 focus:ring-amber-500/20"
                />
                <button
                  type="submit"
                  className="absolute right-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs uppercase px-3 py-1.5 sm:py-2 rounded-full transition-all shadow-sm"
                >
                  SEARCH
                </button>
              </div>
            </form>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-6 text-xs sm:text-sm font-bold text-stone-800">
            <Link href="/shop" prefetch={true} className="hover:text-amber-600 transition-colors">
              ALL PRODUCTS
            </Link>
            <Link href="/collections/chocolate-collection" prefetch={true} className="hover:text-amber-600 transition-colors flex items-center gap-1">
              DARK CHOCOLATE
              <span className="bg-amber-100 text-amber-900 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full">
                HOT
              </span>
            </Link>
            <Link href="/collections/high-protein" prefetch={true} className="hover:text-amber-600 transition-colors">
              HIGH PROTEIN
            </Link>
            <Link href="/about" prefetch={true} className="hover:text-amber-600 transition-colors text-stone-600 font-medium">
              OUR STORY
            </Link>
          </nav>

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

        {/* Big Mobile Search Bar */}
        <div className="md:hidden pb-3 pt-1">
          <form onSubmit={handleSearchSubmit} className="w-full">
            <div className="relative flex items-center">
              <Search className="w-5 h-5 text-stone-400 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Search peanut butter, dark chocolate, 32g protein..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-20 py-3 bg-stone-50 border-2 border-stone-200 focus:border-amber-500 focus:bg-white rounded-2xl text-xs sm:text-sm font-medium text-stone-900 focus:outline-none transition-all shadow-sm"
              />
              <button
                type="submit"
                className="absolute right-2 bg-amber-500 text-stone-950 font-black text-[11px] uppercase px-3 py-1.5 rounded-xl transition-all shadow-sm active:scale-95"
              >
                FIND
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Mobile Drawer Menu - Clean, Light Aesthetic */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white text-stone-900 px-5 py-6 border-t border-stone-200 shadow-2xl space-y-4 animate-in slide-in-from-top-2 duration-200">
          <div className="pb-3 border-b border-stone-100 flex items-center justify-between">
            <div className="relative h-11 w-40">
              <Image
                src={siteSettings.logoUrl || "/images/branding/logo.png"}
                alt={siteSettings.siteName || "Organichy"}
                fill
                sizes="160px"
                className="object-contain object-left"
              />
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-1.5 font-bold text-sm tracking-wide">
            <Link
              href="/"
              prefetch={true}
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 px-3 rounded-xl hover:bg-amber-50 hover:text-amber-700 flex items-center justify-between text-stone-900"
            >
              <span>Home</span>
              <span>🏠</span>
            </Link>
            <Link
              href="/shop"
              prefetch={true}
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 px-3 rounded-xl hover:bg-amber-50 hover:text-amber-700 flex items-center justify-between text-stone-900"
            >
              <span>All Products</span>
              <span className="text-stone-400">→</span>
            </Link>
            <Link
              href="/collections/chocolate-collection"
              prefetch={true}
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 px-3 rounded-xl bg-amber-50/70 border border-amber-200/60 hover:bg-amber-100 text-stone-900 flex items-center justify-between"
            >
              <span>Dark Chocolate Collection</span>
              <span className="bg-amber-500 text-stone-950 text-[10px] px-2 py-0.5 rounded-full font-black">HOT</span>
            </Link>
            <Link
              href="/collections/high-protein"
              prefetch={true}
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 px-3 rounded-xl hover:bg-amber-50 hover:text-amber-700 flex items-center justify-between text-stone-900"
            >
              <span>High Protein (32g)</span>
              <span className="bg-stone-100 text-stone-800 text-[10px] px-2 py-0.5 rounded-full font-bold">⚡ PURE</span>
            </Link>
            <Link
              href="/collections/natural-organic"
              prefetch={true}
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 px-3 rounded-xl hover:bg-amber-50 hover:text-amber-700 flex items-center justify-between text-stone-900"
            >
              <span>100% Natural &amp; Keto</span>
              <span className="text-stone-400">→</span>
            </Link>
            <Link
              href="/collections/combos"
              prefetch={true}
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 px-3 rounded-xl hover:bg-amber-50 hover:text-amber-700 flex items-center justify-between text-stone-900"
            >
              <span>Combo Packs &amp; Savers</span>
              <span className="text-stone-400">→</span>
            </Link>
            <Link
              href="/track-order"
              prefetch={true}
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 px-3 rounded-xl hover:bg-stone-100 flex items-center justify-between text-stone-700"
            >
              <span>Track Order</span>
              <span>📦</span>
            </Link>
            <Link
              href="/about"
              prefetch={true}
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 px-3 rounded-xl hover:bg-stone-100 flex items-center justify-between text-stone-700"
            >
              <span>Our Story &amp; Founder</span>
              <span>🌿</span>
            </Link>
            <Link
              href="/contact"
              prefetch={true}
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 px-3 rounded-xl hover:bg-stone-100 flex items-center justify-between text-stone-700"
            >
              <span>Contact Support</span>
              <span>💬</span>
            </Link>
          </div>

          <div className="pt-3 border-t border-stone-100 flex items-center gap-3">
            <Link
              href="/account/wishlist"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-center font-bold text-xs"
            >
              Wishlist ({wishlist.length})
            </Link>
            <Link
              href={currentUser ? "/account" : "/login"}
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl text-center font-black text-xs uppercase"
            >
              {currentUser ? "My Account" : "Sign In"}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
