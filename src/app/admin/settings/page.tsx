"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Settings, Save, CheckCircle2, ExternalLink } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function AdminSettingsPage() {
  const { refreshSettings } = useCart();
  const [settings, setSettings] = useState<any>({
    siteName: "Organichy Peanut Butter",
    logoUrl: "/images/branding/logo.png",
    announcementText: "🔥 EXTRA 15% OFF ON ORDERS ABOVE ₹799! CODE: ORGANIC15 | FREE EXPRESS SHIPPING ABOVE ₹499",
    announcementActive: true,
    contactEmail: "care@organichy.com",
    contactPhone: "+91 98765 43210",
    contactAddress: "Dr Health Xpert Pvt Ltd, Industrial Area, Sector 62, Noida, Uttar Pradesh 201309",
    freeShippingThreshold: 499,
    standardShippingFee: 50,
    enableCod: true,
    enableRazorpay: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const loadSettings = () => {
    fetch("/api/admin/settings?t=" + Date.now(), { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.settings) setSettings(data.settings);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setSettings((prev: any) => ({ ...prev, [name]: checked }));
    } else {
      setSettings((prev: any) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("Store settings updated successfully and applied across the entire storefront!");
        if (data?.settings) {
          setSettings(data.settings);
        }
        // Notify CartContext & client listeners
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("organichy:settings-updated"));
        }
        if (refreshSettings) {
          await refreshSettings();
        }
      } else {
        setMessage(data.error || "Failed to save settings.");
      }
    } catch (err) {
      setMessage("Error updating settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-xs text-stone-400">Loading settings...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight uppercase">
            STOREFRONT & LOGISTICS SETTINGS
          </h1>
          <p className="text-xs text-stone-500">
            Configure global announcements, shipping rules, and contact information
          </p>
        </div>
        <Link
          href="/"
          target="_blank"
          className="bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 font-bold text-xs uppercase px-4 py-2 rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm"
        >
          <span>View Live Storefront</span>
          <ExternalLink className="w-3.5 h-3.5 text-stone-600" />
        </Link>
      </div>

      {message && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-2xl text-xs font-semibold text-green-800 flex items-center justify-between gap-2 shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
            <span>{message}</span>
          </div>
          <Link href="/" target="_blank" className="font-extrabold text-green-900 underline hover:text-green-700">
            Check Live Site →
          </Link>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* Brand & Identity */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
          <h3 className="font-black uppercase text-stone-900 tracking-wider">
            1. Brand Identity & Header
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Store / Brand Name</label>
              <input
                type="text"
                name="siteName"
                value={settings.siteName || ""}
                onChange={handleChange}
                placeholder="Organichy Peanut Butter"
                className="w-full px-3 py-2 border border-stone-300 rounded-xl font-bold"
              />
            </div>
            <div>
              <label className="block font-bold text-stone-700 mb-1">Logo URL / Image Path</label>
              <input
                type="text"
                name="logoUrl"
                value={settings.logoUrl || ""}
                onChange={handleChange}
                placeholder="/images/branding/logo.png"
                className="w-full px-3 py-2 border border-stone-300 rounded-xl font-mono"
              />
            </div>
          </div>
        </div>

        {/* Top Announcement Bar */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
          <h3 className="font-black uppercase text-stone-900 tracking-wider">
            2. Global Announcement Ticker
          </h3>
          <div>
            <label className="block font-bold text-stone-700 mb-1">Ticker Banner Message</label>
            <input
              type="text"
              name="announcementText"
              value={settings.announcementText || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-stone-300 rounded-xl font-medium"
            />
          </div>
          <label className="flex items-center gap-2 font-bold text-stone-700 cursor-pointer">
            <input
              type="checkbox"
              name="announcementActive"
              checked={Boolean(settings.announcementActive)}
              onChange={handleChange}
              className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
            />
            <span>Enable Announcement Ticker on Top of Every Page</span>
          </label>
        </div>

        {/* Shipping & Delivery Controls */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
          <h3 className="font-black uppercase text-stone-900 tracking-wider">
            3. Shipping & Free Delivery Threshold
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Free Shipping Threshold (₹)</label>
              <input
                type="number"
                name="freeShippingThreshold"
                value={settings.freeShippingThreshold}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-stone-300 rounded-xl font-bold"
              />
              <p className="text-[10px] text-stone-400 mt-1">Orders above this value get automatic free shipping.</p>
            </div>
            <div>
              <label className="block font-bold text-stone-700 mb-1">Standard Shipping Fee (₹)</label>
              <input
                type="number"
                name="standardShippingFee"
                value={settings.standardShippingFee}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-stone-300 rounded-xl font-bold"
              />
              <p className="text-[10px] text-stone-400 mt-1">Applied when cart total is below the free threshold.</p>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap gap-6">
            <label className="flex items-center gap-2 font-bold text-stone-700 cursor-pointer">
              <input
                type="checkbox"
                name="enableCod"
                checked={Boolean(settings.enableCod)}
                onChange={handleChange}
                className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
              />
              <span>Enable Cash on Delivery (COD)</span>
            </label>
            <label className="flex items-center gap-2 font-bold text-stone-700 cursor-pointer">
              <input
                type="checkbox"
                name="enableRazorpay"
                checked={Boolean(settings.enableRazorpay)}
                onChange={handleChange}
                className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
              />
              <span>Enable Razorpay / UPI Payments</span>
            </label>
          </div>
        </div>

        {/* Contact & Brand Info */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
          <h3 className="font-black uppercase text-stone-900 tracking-wider">
            4. Business Contact Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Customer Care Email</label>
              <input
                type="email"
                name="contactEmail"
                value={settings.contactEmail || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-stone-300 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-stone-700 mb-1">Support Phone / WhatsApp</label>
              <input
                type="text"
                name="contactPhone"
                value={settings.contactPhone || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-stone-300 rounded-xl"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-bold text-stone-700 mb-1">Registered Warehouse / Corporate Office Address</label>
              <input
                type="text"
                name="contactAddress"
                value={settings.contactAddress || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-stone-300 rounded-xl"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-stone-900 hover:bg-amber-600 text-white font-black text-xs uppercase px-8 py-4 rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? "Saving Changes..." : "Save Store Settings"}</span>
        </button>
      </form>
    </div>
  );
}
