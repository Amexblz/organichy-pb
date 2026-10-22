"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Boxes,
  Users,
  Tag,
  Image as ImageIcon,
  Video,
  Star,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldAlert,
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (pathname === "/admin/login") {
      setLoading(false);
      return;
    }

    fetch("/api/auth/me?role=admin")
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => {
        if (data.authenticated && data.user.role === "ADMIN") {
          setAdminUser(data.user);
        } else {
          router.push("/admin/login");
        }
      })
      .catch(() => {
        router.push("/admin/login");
      })
      .finally(() => setLoading(false));
  }, [pathname, router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout?type=admin", { method: "POST" });
    router.push("/admin/login");
  };

  // If on admin login page, don't show the dashboard shell
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center text-white">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto" />
          <p className="text-xs text-stone-400 font-bold uppercase tracking-wider">Verifying Admin Privileges...</p>
        </div>
      </div>
    );
  }

  const menuItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Products", href: "/admin/products", icon: Package },
    { label: "Categories", href: "/admin/categories", icon: Layers },
    { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
    { label: "Inventory", href: "/admin/inventory", icon: Boxes },
    { label: "Customers", href: "/admin/customers", icon: Users },
    { label: "Coupons & Offers", href: "/admin/coupons", icon: Tag },
    { label: "Homepage Banners", href: "/admin/banners", icon: ImageIcon },
    { label: "Product Videos", href: "/admin/videos", icon: Video },
    { label: "Reviews Moderation", href: "/admin/reviews", icon: Star },
    { label: "Store Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-stone-100 flex font-sans">
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-stone-950 text-stone-300 border-r border-stone-800 shrink-0 select-none">
        {/* Brand header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-2">
            <span className="font-black text-xl text-white tracking-tighter">
              ORGANICHY<span className="text-amber-500">.</span>
            </span>
            <span className="bg-amber-500 text-stone-950 text-[10px] font-black px-1.5 py-0.5 rounded">
              ADMIN
            </span>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-colors ${
                  isActive
                    ? "bg-amber-500 text-stone-950 font-black shadow-md"
                    : "text-stone-400 hover:text-white hover:bg-stone-900"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User bar */}
        <div className="p-4 border-t border-stone-800 flex items-center justify-between">
          <div className="min-w-0">
            <p className="text-xs font-bold text-white truncate">{adminUser?.name}</p>
            <p className="text-[10px] text-amber-400">Master Operations</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 text-stone-400 hover:text-red-400 hover:bg-stone-900 rounded-lg transition-colors"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-stone-200 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 text-stone-700 hover:bg-stone-100 rounded-lg"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <span className="font-extrabold text-sm text-stone-800 hidden sm:inline">
              Management Portal
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-1.5 text-xs font-bold text-stone-700 hover:text-amber-700 bg-stone-100 hover:bg-amber-50 px-3 py-1.5 rounded-full transition-colors border border-stone-200"
            >
              <span>View Storefront</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={handleLogout}
              className="text-xs font-bold text-red-600 hover:underline flex items-center gap-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {sidebarOpen && (
          <div className="lg:hidden bg-stone-950 text-white p-4 space-y-1 border-b border-stone-800">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs hover:bg-stone-900 text-stone-300"
              >
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
