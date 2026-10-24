"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, ShieldCheck, Award, Heart, CheckCircle2 } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function Footer() {
  const { siteSettings } = useCart();

  const brandName = siteSettings?.siteName ? siteSettings.siteName.split(" ")[0].toUpperCase() : "ORGANICHY";
  const email = siteSettings?.contactEmail || "organichypb@gmail.com";
  const phone = siteSettings?.contactPhone || "+91 7427446941";
  const address = siteSettings?.contactAddress || "Organichy Food, A-11 Shakti Nagar, Prem Nagar, Linepar, Moradabad - 244001 (U.P.), India";
  const freeThreshold = siteSettings?.freeShippingThreshold || 499;

  return (
    <footer className="bg-stone-950 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Trust Pillars Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pb-8 sm:pb-12 border-b border-stone-800 text-center">
          <div className="flex flex-col items-center p-2">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-2 sm:mb-3">
              <Award className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h4 className="font-extrabold text-white text-xs sm:text-sm">32G HIGH PROTEIN</h4>
            <p className="text-[11px] sm:text-xs text-stone-400 mt-0.5 sm:mt-1">Highest protein per 100g in its class</p>
          </div>
          <div className="flex flex-col items-center p-2">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-2 sm:mb-3">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h4 className="font-extrabold text-white text-xs sm:text-sm">ZERO PALM OIL</h4>
            <p className="text-[11px] sm:text-xs text-stone-400 mt-0.5 sm:mt-1">No hydrogenated fats or cheap fillers</p>
          </div>
          <div className="flex flex-col items-center p-2">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-2 sm:mb-3">
              <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h4 className="font-extrabold text-white text-xs sm:text-sm">100% ROASTED PEANUTS</h4>
            <p className="text-[11px] sm:text-xs text-stone-400 mt-0.5 sm:mt-1">Grade-A runner peanuts from Saurashtra</p>
          </div>
          <div className="flex flex-col items-center p-2">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-2 sm:mb-3">
              <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h4 className="font-extrabold text-white text-xs sm:text-sm">FREE DELIVERY ₹{freeThreshold}+</h4>
            <p className="text-[11px] sm:text-xs text-stone-400 mt-0.5 sm:mt-1">Fast delivery across 19,000+ PIN codes</p>
          </div>
        </div>

        {/* 4 Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 py-12 border-b border-stone-800">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="space-y-2">
              <div className="relative h-12 sm:h-14 w-44 sm:w-52">
                <Image
                  src={siteSettings?.logoUrl || "/images/branding/logo.png"}
                  alt={siteSettings?.siteName || "Organichy Peanut Butter"}
                  fill
                  sizes="(max-width: 640px) 176px, 208px"
                  className="object-contain object-left filter brightness-110"
                />
              </div>
            </div>
            <p className="text-xs sm:text-sm text-stone-400 leading-relaxed max-w-sm">
              India&apos;s premium sports nutrition brand dedicated to pure, unadulterated high-protein peanut butter. Formulated for athletes, fitness enthusiasts, and health-conscious families.
            </p>
            <div className="pt-2 text-xs text-stone-400 space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                <span>{address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                <span>{email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <span>{phone} (Mon-Sat 9:30 AM - 6:30 PM)</span>
              </div>
            </div>
          </div>

          {/* Shop Categories */}
          <div>
            <h4 className="font-black text-sm text-white uppercase tracking-wider mb-4">
              COLLECTIONS
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm font-medium">
              <li>
                <Link href="/collections/peanut-butter" prefetch={true} className="hover:text-amber-400 transition-colors">
                  Peanut Butter
                </Link>
              </li>
              <li>
                <Link href="/collections/chocolate-collection" prefetch={true} className="hover:text-amber-400 transition-colors">
                  Dark Chocolate
                </Link>
              </li>
              <li>
                <Link href="/collections/high-protein" prefetch={true} className="hover:text-amber-400 transition-colors">
                  High Protein (32g)
                </Link>
              </li>
              <li>
                <Link href="/collections/natural-organic" prefetch={true} className="hover:text-amber-400 transition-colors">
                  100% Natural & Keto
                </Link>
              </li>
              <li>
                <Link href="/collections/combos" prefetch={true} className="hover:text-amber-400 transition-colors">
                  Combos & Super Savers
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Help & Support */}
          <div>
            <h4 className="font-black text-sm text-white uppercase tracking-wider mb-4">
              CUSTOMER SUPPORT
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm font-medium">
              <li>
                <Link href="/track-order" prefetch={true} className="hover:text-amber-400 transition-colors">
                  Track Order
                </Link>
              </li>
              <li>
                <Link href="/account" prefetch={true} className="hover:text-amber-400 transition-colors">
                  My Account
                </Link>
              </li>
              <li>
                <Link href="/account/orders" prefetch={true} className="hover:text-amber-400 transition-colors">
                  Order History
                </Link>
              </li>
              <li>
                <Link href="/faq" prefetch={true} className="hover:text-amber-400 transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/contact" prefetch={true} className="hover:text-amber-400 transition-colors">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies & Legal */}
          <div>
            <h4 className="font-black text-sm text-white uppercase tracking-wider mb-4">
              POLICIES & LEGAL
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm font-medium">
              <li>
                <Link href="/policies/shipping-policy" className="hover:text-amber-400 transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/policies/return-refund-policy" className="hover:text-amber-400 transition-colors">
                  Return & Refund
                </Link>
              </li>
              <li>
                <Link href="/policies/privacy-policy" className="hover:text-amber-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/policies/terms-conditions" className="hover:text-amber-400 transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-amber-400 transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Payment Badges */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} {siteSettings?.siteName || "Organichy Peanut Butter"}. All Rights Reserved.</p>
          <div className="flex items-center gap-3 font-semibold text-stone-400">
            <span className="px-2 py-1 bg-stone-900 border border-stone-800 rounded">UPI</span>
            <span className="px-2 py-1 bg-stone-900 border border-stone-800 rounded">RuPay</span>
            <span className="px-2 py-1 bg-stone-900 border border-stone-800 rounded">Visa / Master</span>
            {siteSettings?.enableCod !== false && (
              <span className="px-2 py-1 bg-stone-900 border border-stone-800 rounded">Cash on Delivery</span>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
