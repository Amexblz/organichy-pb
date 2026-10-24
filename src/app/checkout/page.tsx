"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, Truck, CreditCard, Banknote, ArrowLeft, CheckCircle2, Lock } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import RazorpayModal from "@/components/checkout/RazorpayModal";
import { useCart } from "@/context/CartContext";
import { formatINR } from "@/lib/utils";

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
  "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
  "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi NCR", "Chandigarh"
];

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    updateQuantity,
    removeItem,
    subtotal,
    discount,
    shippingFee,
    total,
    appliedCoupon,
    clearCart,
    siteSettings,
  } = useCart();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "Delhi NCR",
    pincode: "",
  });

  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "RAZORPAY">("RAZORPAY");

  // Razorpay Dummy Gateway Modal State
  const [isRazorpayModalOpen, setIsRazorpayModalOpen] = useState(false);
  const [razorpayOrderData, setRazorpayOrderData] = useState<{
    orderId: string;
    orderNumber: string;
    total: number;
    razorpayOrderId: string;
    prefill: { name?: string; email?: string; contact?: string };
  } | null>(null);

  useEffect(() => {
    if (siteSettings?.enableRazorpay !== false) {
      setPaymentMethod("RAZORPAY");
    } else if (siteSettings?.enableCod) {
      setPaymentMethod("COD");
    }
  }, [siteSettings]);

  useEffect(() => {
    // If cart is empty, redirect back to cart
    if (items.length === 0) {
      router.push("/cart");
      return;
    }

    // Check if user is logged in to prefill
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.authenticated && data.user) {
          setCurrentUser(data.user);
          const defaultAddress = data.user.addresses?.find((a: any) => a.isDefault) || data.user.addresses?.[0];
          setFormData((prev) => ({
            ...prev,
            fullName: data.user.name || "",
            phone: data.user.phone || "",
            ...(defaultAddress && {
              addressLine1: defaultAddress.addressLine1 || "",
              addressLine2: defaultAddress.addressLine2 || "",
              city: defaultAddress.city || "",
              state: defaultAddress.state || prev.state,
              pincode: defaultAddress.pincode || "",
            }),
          }));
        }
      })
      .catch(() => {});
  }, [items.length, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handlePincodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/\D/g, "").slice(0, 6);
    setFormData((prev) => ({ ...prev, pincode: rawVal }));
    if (error) setError("");

    if (rawVal.length === 6) {
      setPincodeLoading(true);
      try {
        const res = await fetch("/api/pincode/check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pincode: rawVal }),
        });
        const data = await res.json();
        if (res.ok && data.serviceable) {
          setFormData((prev) => ({
            ...prev,
            pincode: rawVal,
            ...(data.city && { city: data.city }),
            ...(data.state && {
              state: INDIAN_STATES.find(
                (s) => s.toLowerCase() === data.state.toLowerCase() || data.state.toLowerCase().includes(s.toLowerCase())
              ) || data.state,
            }),
          }));
        }
      } catch (err) {
        // Silently fail, user can still enter manually
      } finally {
        setPincodeLoading(false);
      }
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.addressLine1.trim() || !formData.city.trim() || !formData.pincode.trim()) {
      setError("Please fill in all mandatory delivery address fields.");
      return;
    }

    if (!/^\d{6}$/.test(formData.pincode.trim())) {
      setError("Please enter a valid 6-digit Indian PIN code.");
      return;
    }

    setLoading(true);

    try {
      const cleanPhone = formData.phone.trim().replace(/\D/g, "").slice(-10);
      const orderPayload = {
        items: items.map((i) => ({ variantId: i.variantId, quantity: i.quantity })),
        shippingAddress: {
          fullName: formData.fullName.trim(),
          phone: formData.phone.trim(),
          email: `${cleanPhone}@customer.organichy.com`,
          addressLine1: formData.addressLine1.trim(),
          addressLine2: formData.addressLine2.trim(),
          city: formData.city.trim(),
          state: formData.state,
          pincode: formData.pincode.trim(),
        },
        paymentMethod,
        couponCode: appliedCoupon ? appliedCoupon.code : null,
        guestEmail: `${cleanPhone}@customer.organichy.com`,
        guestPhone: formData.phone.trim(),
      };

      // A. Online Payment Flow (Razorpay Dummy Gateway)
      if (paymentMethod === "RAZORPAY") {
        const res = await fetch("/api/razorpay/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderPayload),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Failed to initialize Razorpay payment.");
          setLoading(false);
          return;
        }

        setRazorpayOrderData({
          orderId: data.orderId,
          orderNumber: data.orderNumber,
          total: data.total,
          razorpayOrderId: data.razorpayOrder.id,
          prefill: data.prefill,
        });
        setIsRazorpayModalOpen(true);
        setLoading(false);
        return;
      }

      // B. Cash on Delivery (COD) Flow
      const res = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to place order. Please try again.");
        setLoading(false);
        return;
      }

      // Order created successfully!
      clearCart();
      router.push(`/order-success?orderNumber=${encodeURIComponent(data.orderNumber)}&total=${data.total}&method=${data.paymentMethod}`);
    } catch (err: any) {
      console.error(err);
      setError("An unexpected error occurred while placing your order.");
      setLoading(false);
    }
  };

  const handleRazorpaySuccess = async (paymentData: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    paymentMethodDetail: string;
  }) => {
    if (!razorpayOrderData) return;
    setLoading(true);

    try {
      const res = await fetch("/api/razorpay/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: razorpayOrderData.orderId,
          orderNumber: razorpayOrderData.orderNumber,
          ...paymentData,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Razorpay payment verification failed.");
        setIsRazorpayModalOpen(false);
        setLoading(false);
        return;
      }

      clearCart();
      setIsRazorpayModalOpen(false);
      router.push(
        `/order-success?orderNumber=${encodeURIComponent(data.orderNumber)}&total=${data.total}&method=RAZORPAY&paymentId=${encodeURIComponent(data.paymentId)}`
      );
    } catch (err: any) {
      console.error(err);
      setError("An unexpected error occurred while verifying your payment.");
      setIsRazorpayModalOpen(false);
      setLoading(false);
    }
  };

  const handleRazorpayFailure = async (errorMessage: string) => {
    if (razorpayOrderData) {
      try {
        await fetch("/api/razorpay/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: razorpayOrderData.orderId,
            orderNumber: razorpayOrderData.orderNumber,
            simulateFailure: true,
          }),
        });
      } catch (e) {}
    }
    setError(errorMessage);
    setIsRazorpayModalOpen(false);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Navigation link back to cart */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/cart"
            className="flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-stone-900 transition-colors uppercase"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Shopping Cart</span>
          </Link>
          <div className="flex items-center gap-1.5 text-xs font-extrabold text-stone-800">
            <Lock className="w-3.5 h-3.5 text-green-600" />
            <span>256-Bit SSL Encrypted Checkout</span>
          </div>
        </div>

        <form onSubmit={handlePlaceOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Delivery & Payment Form (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Step 1: Customer Contact Info */}
              <div className="bg-white p-4 sm:p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <h2 className="font-black text-sm uppercase text-stone-900 tracking-wider flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-stone-900 text-white text-xs flex items-center justify-center">1</span>
                    Customer Information
                  </h2>
                  {!currentUser && (
                    <Link href="/login?redirect=/checkout" className="text-xs font-bold text-amber-700 hover:underline">
                      Have an account? Log in
                    </Link>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="e.g. Sourav Sharma"
                      required
                      className="w-full px-3 py-2.5 text-xs font-medium border border-stone-300 rounded-xl bg-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Mobile Number (10 digits for delivery updates) *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="e.g. 98765 43210"
                      required
                      className="w-full px-3 py-2.5 text-xs font-medium border border-stone-300 rounded-xl bg-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Shipping Address */}
              <div className="bg-white p-4 sm:p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
                <div className="border-b border-stone-100 pb-3">
                  <h2 className="font-black text-sm uppercase text-stone-900 tracking-wider flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-stone-900 text-white text-xs flex items-center justify-center">2</span>
                    Shipping Address (India)
                  </h2>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Flat, House no., Building, Company, Apartment *
                  </label>
                  <input
                    type="text"
                    name="addressLine1"
                    value={formData.addressLine1}
                    onChange={handleChange}
                    placeholder="e.g. Flat 402, Green Glen Heights"
                    required
                    className="w-full px-3 py-2.5 text-xs font-medium border border-stone-300 rounded-xl bg-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Area, Street, Sector, Village (Optional)
                  </label>
                  <input
                    type="text"
                    name="addressLine2"
                    value={formData.addressLine2}
                    onChange={handleChange}
                    placeholder="e.g. Outer Ring Road, Bellandur"
                    className="w-full px-3 py-2.5 text-xs font-medium border border-stone-300 rounded-xl bg-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center justify-between">
                      <span>PIN Code *</span>
                      {pincodeLoading && (
                        <span className="text-[10px] text-amber-600 font-normal animate-pulse">Auto-fetching...</span>
                      )}
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      name="pincode"
                      value={formData.pincode}
                      onChange={handlePincodeChange}
                      placeholder="e.g. 560103"
                      required
                      className="w-full px-3 py-2.5 text-xs font-medium border border-stone-300 rounded-xl bg-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      City / District *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Auto-detected or enter"
                      required
                      className="w-full px-3 py-2.5 text-xs font-medium border border-stone-300 rounded-xl bg-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      State *
                    </label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 text-xs font-medium border border-stone-300 rounded-xl bg-white focus:outline-none focus:border-amber-500"
                    >
                      {INDIAN_STATES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Step 3: Payment Method */}
              <div className="bg-white p-4 sm:p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
                <div className="border-b border-stone-100 pb-3">
                  <h2 className="font-black text-sm uppercase text-stone-900 tracking-wider flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-stone-900 text-white text-xs flex items-center justify-center">3</span>
                    Select Payment Method
                  </h2>
                </div>

                <div className="space-y-3">
                  {/* Online Payment (Razorpay simulation) - Displayed FIRST above COD */}
                  {siteSettings?.enableRazorpay !== false && (
                    <label
                      onClick={() => setPaymentMethod("RAZORPAY")}
                      className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        paymentMethod === "RAZORPAY"
                          ? "border-amber-500 bg-amber-50/50 shadow-sm"
                          : "border-stone-200 hover:border-stone-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === "RAZORPAY"}
                        onChange={() => setPaymentMethod("RAZORPAY")}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 font-black text-sm text-stone-900">
                            <CreditCard className="w-4 h-4 text-amber-600" />
                            <span>Online Payment (UPI, Cards, Netbanking)</span>
                          </div>
                          <span className="bg-amber-100 text-amber-900 font-extrabold text-[10px] px-2 py-0.5 rounded-full">
                            FASTEST
                          </span>
                        </div>
                        <p className="text-xs text-stone-500 mt-1">
                          Pay securely with Google Pay, PhonePe, Paytm, Credit/Debit cards via Razorpay.
                        </p>
                      </div>
                    </label>
                  )}

                  {/* COD - Displayed below Online Payment */}
                  {siteSettings?.enableCod !== false && (
                    <label
                      onClick={() => setPaymentMethod("COD")}
                      className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        paymentMethod === "COD"
                          ? "border-amber-500 bg-amber-50/50 shadow-sm"
                          : "border-stone-200 hover:border-stone-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === "COD"}
                        onChange={() => setPaymentMethod("COD")}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 font-black text-sm text-stone-900">
                          <Banknote className="w-4 h-4 text-green-700" />
                          <span>Cash on Delivery (COD)</span>
                        </div>
                        <p className="text-xs text-stone-500 mt-1">
                          Pay in cash or through UPI upon physical package delivery at your doorstep.
                        </p>
                      </div>
                    </label>
                  )}
                </div>
              </div>
            </div>

            {/* Order Review Sidebar (5 cols) */}
            <div className="lg:col-span-5 bg-white p-4 sm:p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
              <h2 className="font-black text-sm uppercase text-stone-900 tracking-wider pb-3 border-b border-stone-100">
                Order Items ({items.length})
              </h2>

              <div className="divide-y divide-stone-100 max-h-72 overflow-y-auto space-y-3">
                {items.map((item) => (
                  <div key={item.variantId} className="flex gap-3 pt-3 items-center">
                    <div className="relative w-14 h-14 bg-stone-50 rounded-lg border border-stone-200 overflow-hidden shrink-0 flex items-center justify-center">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="56px"
                        className="object-contain p-1"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-xs text-stone-900 line-clamp-1">{item.name}</p>
                      <p className="text-[11px] text-stone-500">{item.variantLabel}</p>
                      
                      {/* Interactive Quantity Stepper directly on Checkout */}
                      <div className="flex items-center gap-2 mt-1.5">
                        <div className="inline-flex items-center border border-stone-200 rounded-lg bg-stone-50 overflow-hidden">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                            className="px-2 py-0.5 text-stone-600 hover:bg-stone-200 text-xs font-bold"
                          >
                            -
                          </button>
                          <span className="px-2 font-bold text-xs text-stone-900 min-w-[18px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                            disabled={item.quantity >= item.stock}
                            className="px-2 py-0.5 text-stone-600 hover:bg-stone-200 text-xs font-bold disabled:opacity-40"
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeItem(item.variantId)}
                          className="text-[11px] text-red-500 hover:text-red-700 hover:underline font-semibold"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <span className="font-extrabold text-xs text-stone-900">
                      {formatINR(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Calculation */}
              <div className="space-y-2 text-xs text-stone-600 pt-3 border-t border-stone-100">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-stone-900">{formatINR(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-700 font-semibold">
                    <span>Coupon Discount ({appliedCoupon?.code})</span>
                    <span>-{formatINR(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping Fee</span>
                  <span className="font-bold text-stone-900">
                    {shippingFee === 0 ? <span className="text-green-600 font-bold">FREE</span> : formatINR(shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-black text-stone-950 pt-3 border-t border-stone-200">
                  <span>Grand Total</span>
                  <span className="text-amber-800 text-lg">{formatINR(total)}</span>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-semibold text-red-600">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-sm uppercase py-4 rounded-xl transition-all shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <span>INITIALIZING CHECKOUT...</span>
                ) : paymentMethod === "RAZORPAY" ? (
                  <span>PAY {formatINR(total)} VIA RAZORPAY</span>
                ) : (
                  <span>PLACE COD ORDER ({formatINR(total)})</span>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-stone-500 pt-1">
                <ShieldCheck className="w-4 h-4 text-green-600" />
                <span>Orders backed by 100% Organichy Purity Guarantee</span>
              </div>
            </div>
          </div>
        </form>
      </main>

      {/* Razorpay Interactive Dummy Gateway Modal */}
      {razorpayOrderData && (
        <RazorpayModal
          isOpen={isRazorpayModalOpen}
          onClose={() => setIsRazorpayModalOpen(false)}
          orderNumber={razorpayOrderData.orderNumber}
          orderId={razorpayOrderData.orderId}
          amount={razorpayOrderData.total}
          razorpayOrderId={razorpayOrderData.razorpayOrderId}
          prefill={razorpayOrderData.prefill}
          onSuccess={handleRazorpaySuccess}
          onFailure={handleRazorpayFailure}
        />
      )}

      <Footer />
    </div>
  );
}
