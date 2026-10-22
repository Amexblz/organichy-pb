"use client";

import React, { useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import confetti from "canvas-confetti";
import { CheckCircle2, Package, ArrowRight, Printer, Home } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { formatINR } from "@/lib/utils";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber") || "ORG-2026-CONFIRMED";
  const total = searchParams.get("total") ? parseFloat(searchParams.get("total")!) : 0;
  const method = searchParams.get("method") || "COD";
  const paymentId = searchParams.get("paymentId");

  useEffect(() => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {}
  }, []);

  return (
    <div className="bg-white rounded-3xl border border-stone-200 p-8 sm:p-12 shadow-sm space-y-6">
      <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-600">
        <CheckCircle2 className="w-12 h-12" />
      </div>

      <div>
        <span className="text-xs font-black uppercase text-amber-700 tracking-wider">
          THANK YOU FOR YOUR PURCHASE
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight mt-1">
          Order Placed Successfully!
        </h1>
        <p className="text-stone-500 text-xs sm:text-sm mt-2 max-w-md mx-auto">
          Your order has been confirmed and our fulfillment warehouse has begun freshly packing your peanut butter jars.
        </p>
      </div>

      <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 text-left max-w-md mx-auto space-y-3 text-xs sm:text-sm">
        <div className="flex justify-between border-b border-stone-200 pb-2">
          <span className="text-stone-500">Order Number:</span>
          <span className="font-black text-stone-900">{orderNumber}</span>
        </div>
        {total > 0 && (
          <div className="flex justify-between border-b border-stone-200 pb-2">
            <span className="text-stone-500">Order Total:</span>
            <span className="font-black text-stone-900">{formatINR(total)}</span>
          </div>
        )}
        <div className="flex justify-between border-b border-stone-200 pb-2">
          <span className="text-stone-500">Payment Method:</span>
          <span className="font-extrabold text-stone-900">
            {method === "COD" ? "Cash on Delivery" : "Online Payment (Razorpay)"}
          </span>
        </div>
        {paymentId && (
          <div className="flex justify-between border-b border-stone-200 pb-2">
            <span className="text-stone-500">Razorpay Payment ID:</span>
            <span className="font-mono text-xs font-bold text-amber-700">{paymentId}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-stone-500">Estimated Delivery:</span>
          <span className="font-extrabold text-green-700">2 - 4 Business Days</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
        <Link
          href={`/track-order?orderId=${encodeURIComponent(orderNumber)}`}
          className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs uppercase px-6 py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
        >
          <Package className="w-4 h-4" />
          <span>TRACK YOUR SHIPMENT</span>
        </Link>

        <Link
          href="/shop"
          className="bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs uppercase px-6 py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <Home className="w-4 h-4" />
          <span>CONTINUE SHOPPING</span>
        </Link>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto px-4 py-16 w-full text-center">
        <Suspense fallback={<div className="p-12 text-center text-xs text-stone-400">Loading Order Confirmation...</div>}>
          <OrderSuccessContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
