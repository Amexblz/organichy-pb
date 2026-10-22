"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, Package, Truck, CheckCircle2, Clock, AlertCircle, ArrowRight, ShieldCheck } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { formatDate } from "@/lib/utils";

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialOrderId = searchParams.get("orderId") || "";

  const [query, setQuery] = useState(initialOrderId);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrderIndex, setSelectedOrderIndex] = useState(0);
  const [error, setError] = useState("");

  const searchOrder = async (searchVal: string) => {
    if (!searchVal.trim()) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/orders/track?query=${encodeURIComponent(searchVal.trim())}`);
      const data = await res.json();
      if (res.ok && data?.orders && data.orders.length > 0) {
        setOrders(data.orders);
        setSelectedOrderIndex(0);
      } else {
        setOrders([]);
        setError(data?.error || "No order found with that Order Number or Phone Number.");
      }
    } catch (err) {
      setError("Unable to retrieve tracking details right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrderId) {
      searchOrder(initialOrderId);
    }
  }, [initialOrderId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchOrder(query);
  };

  const steps = [
    { key: "PENDING", label: "Confirmed" },
    { key: "PROCESSING", label: "Processing" },
    { key: "PACKED", label: "Packed" },
    { key: "SHIPPED", label: "In Transit" },
    { key: "DELIVERED", label: "Delivered" },
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case "PENDING": return 0;
      case "PROCESSING": return 1;
      case "PACKED": return 2;
      case "SHIPPED": return 3;
      case "DELIVERED": return 4;
      default: return 0;
    }
  };

  const currentOrder = orders.length > 0 ? orders[selectedOrderIndex] : null;
  const currentStep = currentOrder ? getStepIndex(currentOrder.status) : 0;

  return (
    <div className="space-y-8">
      {/* Search input bar */}
      <form onSubmit={handleSubmit} className="max-w-xl mx-auto flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Order ID (e.g. ORG-2026-...) or 10-digit Phone"
            required
            className="w-full pl-10 pr-4 py-3.5 text-xs sm:text-sm font-semibold border border-stone-300 rounded-2xl focus:outline-none focus:border-amber-600 bg-white shadow-sm"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-stone-900 hover:bg-amber-600 text-white font-bold text-xs uppercase px-7 py-3.5 rounded-2xl transition-all shadow-md disabled:opacity-50 shrink-0"
        >
          {loading ? "Locating..." : "Track Order"}
        </button>
      </form>

      {error && (
        <div className="max-w-xl mx-auto p-4 bg-red-50 border border-red-200 rounded-2xl text-xs font-semibold text-red-600 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Multiple orders selector if searched by phone */}
      {orders.length > 1 && (
        <div className="max-w-2xl mx-auto">
          <p className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
            Found {orders.length} orders for this number:
          </p>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {orders.map((ord, idx) => (
              <button
                key={ord.id}
                type="button"
                onClick={() => setSelectedOrderIndex(idx)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                  selectedOrderIndex === idx
                    ? "bg-amber-600 text-white border-amber-600 shadow-sm"
                    : "bg-white text-stone-700 border-stone-200 hover:border-amber-400"
                }`}
              >
                {ord.orderNumber} ({ord.status})
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Order tracking timeline card */}
      {currentOrder && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6 max-w-2xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-100">
            <div>
              <p className="text-[11px] font-black text-amber-700 uppercase tracking-wider">Order Reference</p>
              <h3 className="text-xl sm:text-2xl font-black text-stone-900">{currentOrder.orderNumber}</h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Placed on {formatDate(currentOrder.createdAt)} • Destination: {currentOrder.destination}
              </p>
            </div>
            <div className="text-right">
              <span className={`text-[11px] font-black uppercase px-3 py-1.5 rounded-full ${
                currentOrder.status === "DELIVERED"
                  ? "bg-emerald-100 text-emerald-800"
                  : currentOrder.status === "CANCELLED"
                  ? "bg-red-100 text-red-800"
                  : "bg-amber-100 text-amber-900"
              }`}>
                {currentOrder.status}
              </span>
              {currentOrder.trackingNumber && (
                <p className="text-xs text-stone-600 mt-2 font-medium">
                  Courier: <strong className="font-bold text-stone-900">{currentOrder.courierName || "Standard Express"}</strong><br/>
                  AWB: <strong className="font-mono text-stone-800">{currentOrder.trackingNumber}</strong>
                </p>
              )}
            </div>
          </div>

          {/* Stepper Progress */}
          <div className="py-2">
            <div className="grid grid-cols-5 gap-2 text-center">
              {steps.map((st, i) => (
                <div key={st.key} className="flex flex-col items-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs mb-2 transition-all ${
                      i <= currentStep
                        ? "bg-amber-600 text-white shadow-sm"
                        : "bg-stone-100 text-stone-400 border border-stone-200"
                    }`}
                  >
                    {i <= currentStep ? "✓" : i + 1}
                  </div>
                  <span className={`text-[10px] sm:text-xs font-bold leading-tight ${
                    i <= currentStep ? "text-stone-900" : "text-stone-400"
                  }`}>
                    {st.label}
                  </span>
                </div>
              ))}
            </div>
            <div className="w-full bg-stone-100 h-2 rounded-full mt-4 overflow-hidden border border-stone-200">
              <div
                className="bg-amber-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, ((currentStep + 1) / steps.length) * 100)}%` }}
              />
            </div>
          </div>

          {/* Items summary */}
          <div className="pt-4 border-t border-stone-100 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-black text-xs uppercase text-stone-900 tracking-wider">
                Consignment Items ({currentOrder.items?.length || 0})
              </h4>
              <span className="text-xs font-black text-stone-900">
                Total: ₹{currentOrder.total}
              </span>
            </div>
            <div className="divide-y divide-stone-100">
              {currentOrder.items?.map((item: any, idx: number) => (
                <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    {item.image && (
                      <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded-lg border border-stone-200" />
                    )}
                    <div>
                      <span className="font-bold text-stone-900 block">{item.name}</span>
                      <span className="text-stone-500 text-[11px]">{item.variantLabel} • Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <span className="font-bold text-stone-800">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Login Banner */}
          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <p className="text-xs text-amber-950 font-medium">
                Log in to download invoices, track live dispatches, and save shipping details.
              </p>
            </div>
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition-colors whitespace-nowrap shadow-sm"
            >
              <span>Login via Phone OTP</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-black uppercase text-amber-700 tracking-wider">
            ORGANICHY DISPATCH PORTAL
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
            Track Your Fresh Consignment
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm max-w-md mx-auto">
            Enter your Order ID (e.g. ORG-2026-...) or your 10-digit mobile number to view live shipment status.
          </p>
        </div>

        <Suspense fallback={<div className="p-12 text-center text-xs text-stone-400">Loading Order Tracking...</div>}>
          <TrackOrderContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
