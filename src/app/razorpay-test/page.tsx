"use client";

import React, { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import RazorpayPayButton from "@/components/checkout/RazorpayPayButton";
import { ShieldCheck, CheckCircle2 } from "lucide-react";

export default function RazorpayTestPage() {
  const [testAmount, setTestAmount] = useState<number>(100); // 100 INR
  const [paymentResult, setPaymentResult] = useState<any>(null);

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-2xl mx-auto px-4 py-12 w-full">
        <div className="bg-white rounded-3xl border border-stone-200 p-8 shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <span className="bg-amber-100 text-amber-900 text-xs font-black uppercase px-3 py-1 rounded-full">
              Standard Web Checkout
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900">
              Razorpay Integration Test
            </h1>
            <p className="text-stone-600 text-sm">
              Test standard Razorpay modal checkout with real test credentials.
            </p>
          </div>

          <div className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                Test Amount (INR)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="1"
                  value={testAmount}
                  onChange={(e) => setTestAmount(Math.max(1, Number(e.target.value)))}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm font-bold focus:border-amber-500 focus:outline-none"
                />
                <span className="text-sm font-black text-stone-600 whitespace-nowrap">
                  = {(testAmount * 100).toLocaleString()} paise
                </span>
              </div>
            </div>

            <div className="bg-stone-50 rounded-2xl p-4 border border-stone-100 space-y-2 text-xs text-stone-600">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Key ID:</span>
                <span className="font-mono text-stone-800">
                  {process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_TxAzIKfsEz5va1"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold">Endpoint (Create):</span>
                <span className="font-mono text-stone-800">POST /api/create-order</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold">Endpoint (Verify):</span>
                <span className="font-mono text-stone-800">POST /api/verify-payment</span>
              </div>
            </div>

            <div className="pt-2">
              <RazorpayPayButton
                amountInPaise={testAmount * 100}
                currency="INR"
                name="Organichy Peanut Butter"
                description={`Test Checkout ₹${testAmount}`}
                onSuccess={(data) => setPaymentResult(data)}
              />
            </div>

            {paymentResult && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Payment Successfully Authorized & Verified</span>
                </div>
                <div className="text-xs font-mono text-emerald-900 space-y-1 overflow-x-auto">
                  <p>Order ID: {paymentResult.razorpay_order_id}</p>
                  <p>Payment ID: {paymentResult.razorpay_payment_id}</p>
                  <p className="truncate">Signature: {paymentResult.razorpay_signature}</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-stone-400 pt-2 border-t border-stone-100">
            <ShieldCheck className="w-4 h-4 text-stone-500" />
            <span>Razorpay Test Mode Active (Zero Real Bank Debits)</span>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
