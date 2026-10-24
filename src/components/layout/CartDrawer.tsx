"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { X, Trash2, Plus, Minus, ArrowRight, Sparkles, Tag, ShieldCheck } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatINR } from "@/lib/utils";

export default function CartDrawer() {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeItem,
    subtotal,
    discount,
    shippingFee,
    total,
    freeShippingThreshold,
    amountNeededForFreeShipping,
    couponCode,
    setCouponCode,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const router = useRouter();

  if (!isCartOpen) return null;

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

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    router.push("/checkout");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-4 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-extrabold text-stone-900 tracking-tight">
                YOUR CART ({items.reduce((s, i) => s + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-200/60 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Goal Bar */}
          <div className="bg-amber-50/80 p-3.5 border-b border-amber-200/60">
            {amountNeededForFreeShipping > 0 ? (
              <p className="text-xs sm:text-sm font-semibold text-amber-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                Add <span className="font-extrabold text-amber-800">{formatINR(amountNeededForFreeShipping)}</span> more for <span className="font-black text-amber-700 underline">FREE EXPRESS SHIPPING!</span>
              </p>
            ) : (
              <p className="text-xs sm:text-sm font-bold text-green-700 flex items-center gap-1.5">
                🎉 Congratulations! You have unlocked <span className="font-black underline">FREE Express Shipping!</span>
              </p>
            )}
            <div className="w-full bg-amber-200/70 h-2 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-amber-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-3xl">
                  🥜
                </div>
                <h3 className="font-extrabold text-stone-900 text-lg">Your cart is feeling light</h3>
                <p className="text-stone-500 text-xs sm:text-sm max-w-xs mx-auto">
                  Fuel up with India's highest rated Dark Chocolate and Natural Peanut Butters!
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    router.push("/shop");
                  }}
                  className="bg-stone-900 hover:bg-amber-600 text-white font-bold text-xs uppercase px-6 py-3 rounded-full transition-all shadow-md inline-block"
                >
                  START SHOPPING
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.variantId}
                  className="flex gap-4 p-3 bg-stone-50 rounded-xl border border-stone-100 hover:border-amber-200 transition-colors"
                >
                  {/* Thumbnail */}
                  <div className="relative w-20 h-20 bg-white rounded-lg border border-stone-200 overflow-hidden shrink-0 flex items-center justify-center">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="80px"
                      className="object-contain p-1"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-stone-900 line-clamp-1 leading-snug">
                        {item.name}
                      </h4>
                      <p className="text-[11px] font-semibold text-amber-700 mt-0.5">
                        {item.variantLabel}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-extrabold text-sm text-stone-900">
                          {formatINR(item.price)}
                        </span>
                        {item.mrp > item.price && (
                          <span className="text-xs text-stone-400 line-through">
                            {formatINR(item.mrp)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-200/60">
                      <div className="flex items-center border border-stone-300 rounded-full bg-white shadow-sm overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          className="px-2.5 py-1 text-stone-600 hover:bg-stone-100 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 font-bold text-xs text-stone-900 min-w-[20px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                          className="px-2.5 py-1 text-stone-600 hover:bg-stone-100 transition-colors disabled:opacity-40"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.variantId)}
                        className="text-stone-400 hover:text-red-600 p-1 transition-colors"
                        title="Remove Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Area */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-stone-200 bg-stone-50 space-y-3.5">
              {/* Coupon Section */}
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 bg-green-50 border border-green-200 rounded-lg text-xs">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-green-600" />
                    <div>
                      <p className="font-extrabold text-green-900">{appliedCoupon.code} APPLIED</p>
                      <p className="text-green-700 font-medium">You saved {formatINR(discount)}!</p>
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
                <form onSubmit={handleApplyCoupon} className="space-y-1">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter promo code (e.g. ORGANIC15)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs uppercase font-semibold border border-stone-300 rounded-lg focus:outline-none focus:border-amber-500 bg-white"
                    />
                    <button
                      type="submit"
                      disabled={couponLoading || !couponInput.trim()}
                      className="px-4 py-2 bg-stone-900 text-white font-bold text-xs rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50"
                    >
                      {couponLoading ? "..." : "APPLY"}
                    </button>
                  </div>
                  {couponError && <p className="text-[11px] text-red-600 font-medium">{couponError}</p>}
                </form>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-stone-600 pt-1">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-stone-900">{formatINR(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-700 font-semibold">
                    <span>Discount</span>
                    <span>-{formatINR(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-bold text-stone-900">
                    {shippingFee === 0 ? <span className="text-green-600">FREE</span> : formatINR(shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between text-sm sm:text-base font-black text-stone-950 pt-2 border-t border-stone-200">
                  <span>Estimated Total</span>
                  <span className="text-amber-800">{formatINR(total)}</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={handleProceedToCheckout}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-stone-950 font-black text-sm uppercase py-3.5 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 group"
                >
                  <span>PROCEED TO CHECKOUT</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
                <div className="flex items-center justify-center gap-2 text-[11px] text-stone-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
                  <span>100% Safe & Secure Checkout with COD & UPI</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
