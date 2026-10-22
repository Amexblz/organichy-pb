"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2, Plus, Minus, ArrowRight, Sparkles, Tag, ShieldCheck, ShoppingBag } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useCart } from "@/context/CartContext";
import { formatINR } from "@/lib/utils";

export default function CartPage() {
  const router = useRouter();
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    subtotal,
    discount,
    shippingFee,
    total,
    freeShippingThreshold,
    amountNeededForFreeShipping,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);

  const freeShippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError("");
    setCouponLoading(true);
    const res = await applyCoupon(couponInput);
    setCouponLoading(false);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponInput("");
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <h1 className="text-2xl sm:text-4xl font-black text-stone-900 tracking-tight uppercase mb-6">
          SHOPPING CART ({items.reduce((s, i) => s + i.quantity, 0)})
        </h1>

        {items.length === 0 ? (
          <div className="bg-white rounded-3xl border border-stone-200 p-12 sm:p-20 text-center max-w-lg mx-auto space-y-4">
            <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-3xl">
              <ShoppingBag className="w-8 h-8 text-amber-600" />
            </div>
            <h2 className="text-xl font-black text-stone-900">Your shopping cart is empty</h2>
            <p className="text-xs sm:text-sm text-stone-500">
              Browse our high-protein peanut butters and special combos to fuel your fitness journey.
            </p>
            <Link
              href="/shop"
              className="inline-block bg-stone-900 hover:bg-amber-600 text-white font-black text-xs uppercase px-8 py-3.5 rounded-full transition-all shadow-md"
            >
              SHOP PRODUCTS
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Items list (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              {/* Free Shipping Alert */}
              <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4">
                {amountNeededForFreeShipping > 0 ? (
                  <p className="text-xs sm:text-sm font-semibold text-amber-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>
                      Add <strong className="text-amber-950 font-black">{formatINR(amountNeededForFreeShipping)}</strong> more to get <strong className="text-amber-800 underline">FREE EXPRESS SHIPPING!</strong>
                    </span>
                  </p>
                ) : (
                  <p className="text-xs sm:text-sm font-bold text-green-700 flex items-center gap-2">
                    🎉 You have unlocked <strong>FREE Express Shipping</strong> across India!
                  </p>
                )}
                <div className="w-full bg-amber-200/70 h-2.5 rounded-full mt-2.5 overflow-hidden">
                  <div
                    className="bg-amber-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>

              {/* Items Card */}
              <div className="bg-white rounded-2xl border border-stone-200 divide-y divide-stone-100 overflow-hidden shadow-sm">
                {items.map((item) => (
                  <div key={item.variantId} className="p-4 sm:p-5 flex gap-4 sm:gap-6 items-center">
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-stone-50 rounded-xl border border-stone-200 shrink-0 flex items-center justify-center">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="96px"
                        className="object-contain p-2"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-extrabold text-sm sm:text-base text-stone-900 line-clamp-1">
                        {item.name}
                      </h3>
                      <p className="text-xs font-bold text-amber-700 mt-0.5">{item.variantLabel}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-black text-sm text-stone-950">{formatINR(item.price)}</span>
                        {item.mrp > item.price && (
                          <span className="text-xs text-stone-400 line-through">{formatINR(item.mrp)}</span>
                        )}
                      </div>
                    </div>

                    {/* Quantity & Total */}
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="flex items-center border border-stone-300 rounded-lg bg-stone-50 overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          className="px-2.5 py-1 text-stone-600 hover:bg-stone-200 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 font-bold text-xs text-stone-900 min-w-[24px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                          className="px-2.5 py-1 text-stone-600 hover:bg-stone-200 transition-colors disabled:opacity-40"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-black text-sm sm:text-base text-stone-950 min-w-[70px] text-right">
                        {formatINR(item.price * item.quantity)}
                      </span>

                      <button
                        onClick={() => removeItem(item.variantId)}
                        className="p-1 text-stone-400 hover:text-red-600 transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary Box (4 cols) */}
            <div className="lg:col-span-4 bg-white rounded-2xl border border-stone-200 p-6 space-y-4 shadow-sm">
              <h2 className="font-black text-base text-stone-900 uppercase tracking-tight pb-3 border-b border-stone-100">
                ORDER SUMMARY
              </h2>

              {/* Coupon Form */}
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-xl text-xs">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-green-600" />
                    <div>
                      <p className="font-black text-green-900">{appliedCoupon.code} APPLIED</p>
                      <p className="text-green-700">Saved {formatINR(discount)} on this order</p>
                    </div>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs font-bold text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-1.5">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Coupon Code"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs uppercase font-bold border border-stone-300 rounded-lg bg-stone-50"
                    />
                    <button
                      type="submit"
                      disabled={couponLoading || !couponInput.trim()}
                      className="px-4 py-2 bg-stone-900 text-white font-bold text-xs rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-40"
                    >
                      {couponLoading ? "..." : "APPLY"}
                    </button>
                  </div>
                  {couponError && <p className="text-[11px] text-red-600 font-semibold">{couponError}</p>}
                </form>
              )}

              {/* Pricing breakdown */}
              <div className="space-y-2 text-xs sm:text-sm text-stone-600 pt-2 border-t border-stone-100">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-stone-900">{formatINR(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-700 font-semibold">
                    <span>Coupon Discount</span>
                    <span>-{formatINR(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping Charges</span>
                  <span className="font-bold text-stone-900">
                    {shippingFee === 0 ? <span className="text-green-600 font-bold">FREE</span> : formatINR(shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between text-base sm:text-lg font-black text-stone-950 pt-3 border-t border-stone-200">
                  <span>Total Amount</span>
                  <span className="text-amber-800">{formatINR(total)}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={() => router.push("/checkout")}
                className="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-sm uppercase py-4 rounded-xl transition-all shadow-xl flex items-center justify-center gap-2 group"
              >
                <span>PROCEED TO CHECKOUT</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-stone-500 pt-2">
                <ShieldCheck className="w-4 h-4 text-green-600" />
                <span>100% Secure Checkout with Razorpay & COD</span>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
