"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { User, Package, MapPin, Heart, LogOut, ChevronRight, ShieldCheck } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data?.authenticated || !data.user) {
          router.push("/login?redirect=/account");
        } else {
          setUser(data.user);
        }
      })
      .catch(() => {
        router.push("/login?redirect=/account");
      })
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col font-sans">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-900" />
        </div>
        <Footer />
      </div>
    );
  }

  const navItems = [
    { label: "Overview", href: "/account", icon: User },
    { label: "My Orders", href: "/account/orders", icon: Package },
    { label: "My Profile", href: "/account/profile", icon: User },
    { label: "Saved Addresses", href: "/account/addresses", icon: MapPin },
    { label: "My Wishlist", href: "/account/wishlist", icon: Heart },
  ];

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Welcome Banner */}
        <div className="bg-stone-900 text-white p-6 sm:p-8 rounded-3xl mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-amber-500 text-stone-950 font-black text-xl flex items-center justify-center shadow-md">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div>
              <p className="text-xs text-amber-400 font-bold uppercase tracking-wider">Welcome back</p>
              <h1 className="text-xl sm:text-2xl font-black text-white">{user?.name}</h1>
              <p className="text-xs text-stone-400">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-stone-300 bg-stone-800 px-3 py-1.5 rounded-full border border-stone-700">
              Verified Athlete Member
            </span>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sidebar */}
          <aside className="lg:col-span-3 bg-white rounded-2xl border border-stone-200 p-4 space-y-1 shadow-sm">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between p-3 rounded-xl font-bold text-xs transition-colors ${
                    isActive
                      ? "bg-amber-500 text-stone-950 font-black shadow-sm"
                      : "text-stone-700 hover:bg-stone-50 hover:text-stone-900"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </Link>
              );
            })}

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 p-3 rounded-xl font-bold text-xs text-red-600 hover:bg-red-50 transition-colors pt-3 border-t border-stone-100 mt-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </aside>

          {/* Main Area */}
          <div className="lg:col-span-9 bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-sm">
            {children}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
