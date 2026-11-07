"use client";

import React, { useState } from "react";
import Script from "next/script";

interface RazorpayPayButtonProps {
  amountInPaise?: number; // e.g. 100 paise = 1 INR
  currency?: string;
  name?: string;
  description?: string;
  receipt?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  onSuccess?: (data: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => void;
  onFailure?: (error: string) => void;
  className?: string;
  buttonText?: string;
}

export default function RazorpayPayButton({
  amountInPaise = 50000, // Default 500 INR (50,000 paise)
  currency = "INR",
  name = "Organichy Peanut Butter",
  description = "Standard Razorpay Checkout Test",
  receipt,
  prefill = {
    name: "Organichy Customer",
    email: "customer@organichy.com",
    contact: "9876543210",
  },
  onSuccess,
  onFailure,
  className = "w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-black py-3.5 px-6 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2",
  buttonText,
}: RazorpayPayButtonProps) {
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

  const handlePayment = async () => {
    try {
      setLoading(true);
      setStatusMessage(null);
      setIsSuccess(null);

      // 1. Ensure Razorpay script is loaded
      if (typeof window === "undefined" || !(window as any).Razorpay) {
        throw new Error("Razorpay SDK not loaded. Please wait a moment and try again.");
      }

      // 2. Call backend endpoint to create order (STEP 1)
      const createRes = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amountInPaise,
          currency,
          receipt: receipt || `rcpt_${Date.now()}`,
        }),
      });

      const orderData = await createRes.json();

      if (!createRes.ok || !orderData.order_id) {
        throw new Error(orderData.error || "Failed to create Razorpay order.");
      }

      // 3. Open Razorpay Checkout Modal (STEP 2)
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_TxAzIKfsEz5va1",
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name,
        description,
        order_id: orderData.order_id,
        prefill,
        theme: {
          color: "#f59e0b",
        },
        handler: async function (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) {
          // 4. Send payment details to verification endpoint (STEP 3)
          setLoading(true);
          try {
            const verifyRes = await fetch("/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                order_id: response.razorpay_order_id,
                payment_id: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();

            if (!verifyRes.ok || !verifyData.success) {
              throw new Error(verifyData.error || "Payment signature verification failed.");
            }

            setIsSuccess(true);
            setStatusMessage(`Payment Verified! Payment ID: ${response.razorpay_payment_id}`);
            if (onSuccess) onSuccess(response);
          } catch (verifyErr: any) {
            console.error("Verification error:", verifyErr);
            setIsSuccess(false);
            setStatusMessage(verifyErr.message || "Verification failed");
            if (onFailure) onFailure(verifyErr.message);
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            setStatusMessage("Payment cancelled by user.");
            setIsSuccess(false);
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);

      rzp.on("payment.failed", function (response: any) {
        console.error("Razorpay payment failed:", response.error);
        setLoading(false);
        setIsSuccess(false);
        const errMsg = response.error?.description || "Payment failed or was declined.";
        setStatusMessage(errMsg);
        if (onFailure) onFailure(errMsg);
      });

      rzp.open();
    } catch (err: any) {
      console.error("Payment initiation error:", err);
      setLoading(false);
      setIsSuccess(false);
      setStatusMessage(err.message || "An error occurred.");
      if (onFailure) onFailure(err.message);
    }
  };

  const displayAmount = (amountInPaise / 100).toLocaleString("en-IN", {
    style: "currency",
    currency,
  });

  return (
    <div className="w-full space-y-3">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <button
        type="button"
        onClick={handlePayment}
        disabled={loading}
        className={className}
      >
        {loading ? (
          <span>Processing Payment...</span>
        ) : (
          buttonText || <span>Pay {displayAmount} with Razorpay</span>
        )}
      </button>

      {statusMessage && (
        <div
          className={`p-3 rounded-xl text-xs font-semibold ${
            isSuccess
              ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
              : "bg-red-50 border border-red-200 text-red-700"
          }`}
        >
          {statusMessage}
        </div>
      )}
    </div>
  );
}
