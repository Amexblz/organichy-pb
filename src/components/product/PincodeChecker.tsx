"use client";

import React, { useState } from "react";
import { MapPin, Truck, CheckCircle2, AlertCircle } from "lucide-react";

export default function PincodeChecker() {
  const [pincode, setPincode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincode.trim() || pincode.length !== 6) {
      setError("Please enter a valid 6-digit Indian PIN code");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/pincode/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pincode }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Unable to check pincode");
      } else {
        setResult(data);
      }
    } catch (err) {
      setError("Error checking PIN code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 my-6">
      <div className="flex items-center gap-2 mb-2">
        <Truck className="w-4 h-4 text-amber-600" />
        <span className="text-xs font-bold text-stone-900 uppercase tracking-wider">
          Estimate Delivery & COD Check
        </span>
      </div>

      <form onSubmit={handleCheck} className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            maxLength={6}
            placeholder="Enter 6-digit Pincode (e.g. 560103, 110001)"
            value={pincode}
            onChange={(e) => {
              setPincode(e.target.value.replace(/\D/g, ""));
              if (error) setError("");
            }}
            className="w-full px-3 py-2 text-xs font-semibold bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-amber-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading || pincode.length !== 6}
          className="px-4 py-2 bg-stone-900 text-white font-bold text-xs uppercase rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-40"
        >
          {loading ? "Checking..." : "Check"}
        </button>
      </form>

      {error && (
        <div className="flex items-center gap-1.5 mt-2.5 text-[11px] text-red-600 font-semibold">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {result && result.serviceable && (
        <div className="mt-3 pt-3 border-t border-stone-200/70 space-y-1.5 text-xs">
          <div className="flex items-center gap-1.5 text-green-700 font-bold">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-green-600" />
            <span>Delivering to {result.location} ({result.pincode})</span>
          </div>
          <p className="text-stone-600 text-[11px] pl-5.5">
            📦 Estimated Delivery by <strong className="text-stone-900">{result.estimatedDeliveryDate}</strong>
          </p>
          <div className="flex gap-3 text-[11px] font-semibold text-stone-700 pl-5.5 pt-1">
            <span className="text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200">
              ✓ Cash on Delivery Available
            </span>
            <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              ✓ Free Express Shipping
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
