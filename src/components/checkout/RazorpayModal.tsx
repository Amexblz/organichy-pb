"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  ShieldCheck,
  X,
  CreditCard,
  Smartphone,
  Building2,
  Wallet,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Lock,
  QrCode,
  ArrowRight,
  Info,
} from "lucide-react";
import { generateDummyRazorpaySignature } from "@/lib/razorpay";

interface RazorpayModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderNumber: string;
  orderId: string;
  amount: number; // in rupees (e.g. 499)
  razorpayOrderId: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  onSuccess: (paymentData: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    paymentMethodDetail: string;
  }) => void;
  onFailure: (errorMessage: string) => void;
}

export default function RazorpayModal({
  isOpen,
  onClose,
  orderNumber,
  orderId,
  amount,
  razorpayOrderId,
  prefill,
  onSuccess,
  onFailure,
}: RazorpayModalProps) {
  const [activeTab, setActiveTab] = useState<"UPI" | "CARD" | "NETBANKING" | "WALLET">("UPI");
  const [selectedUpiApp, setSelectedUpiApp] = useState("GPay");
  const [upiId, setUpiId] = useState("organichy.athlete@okhdfcbank");
  const [cardNumber, setCardNumber] = useState("4111 1111 1111 1111");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvv, setCardCvv] = useState("123");
  const [cardName, setCardName] = useState(prefill?.name || "Athletic Customer");
  const [selectedBank, setSelectedBank] = useState("HDFC Bank");
  const [selectedWallet, setSelectedWallet] = useState("Paytm");

  const [processing, setProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSimulatePayment = async (fail = false) => {
    setProcessing(true);

    if (fail) {
      setProcessingStep("Contacting issuing bank...");
      await new Promise((r) => setTimeout(r, 1000));
      setProcessingStep("Declined by customer bank");
      await new Promise((r) => setTimeout(r, 600));
      setProcessing(false);
      onFailure("Bank transaction declined: Insufficient test funds or customer cancellation simulated.");
      return;
    }

    // Success flow
    setProcessingStep("Authenticating with Razorpay Gateway...");
    await new Promise((r) => setTimeout(r, 700));

    const methodDetail =
      activeTab === "UPI"
        ? `UPI (${selectedUpiApp} - ${upiId})`
        : activeTab === "CARD"
        ? `Card (Ending in ${cardNumber.slice(-4)})`
        : activeTab === "NETBANKING"
        ? `NetBanking (${selectedBank})`
        : `Wallet (${selectedWallet})`;

    setProcessingStep(`Authorizing ₹${amount.toFixed(2)} via ${activeTab}...`);
    await new Promise((r) => setTimeout(r, 700));

    // Generate valid test signature
    const paymentId = `pay_dummy_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const signature = generateDummyRazorpaySignature(razorpayOrderId, paymentId);

    setIsSuccess(true);
    setProcessingStep("Payment Verified & Authorized!");
    await new Promise((r) => setTimeout(r, 800));

    onSuccess({
      razorpay_order_id: razorpayOrderId,
      razorpay_payment_id: paymentId,
      razorpay_signature: signature,
      paymentMethodDetail: methodDetail,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-stone-200 my-auto">
        {/* Top Header - Razorpay Navy Brand */}
        <div className="bg-[#0c2340] text-white p-3.5 sm:p-5 flex items-center justify-between border-b border-[#13335c]">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-amber-500/10 border border-amber-400/40 p-1 flex items-center justify-center shrink-0">
              <Image
                src="/images/branding/logo.png"
                alt="Organichy"
                width={70}
                height={24}
                className="object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h3 className="font-extrabold text-xs sm:text-sm text-white tracking-wide">
                  Organichy Peanut Butter
                </h3>
                <span className="bg-amber-400 text-stone-950 font-black text-[8px] sm:text-[9px] px-1 sm:px-1.5 py-0.5 rounded tracking-wider uppercase">
                  DEMO API
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-stone-300 truncate max-w-[160px] sm:max-w-none">
                Order #{orderNumber} • {prefill?.contact || prefill?.email}
              </p>
            </div>
          </div>

          <div className="text-right flex items-center gap-2 sm:gap-3">
            <div>
              <span className="text-[9px] sm:text-[10px] text-stone-400 block uppercase font-bold tracking-wider">
                Pay
              </span>
              <span className="text-base sm:text-xl font-black text-amber-400">
                ₹{amount.toFixed(2)}
              </span>
            </div>
            <button
              onClick={onClose}
              disabled={processing}
              className="p-1 rounded-full hover:bg-white/10 text-stone-400 hover:text-white transition-colors disabled:opacity-40"
              aria-label="Close Razorpay checkout"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Test Notice Banner */}
        <div className="bg-amber-50 border-b border-amber-200/80 px-3 sm:px-4 py-2 flex items-center justify-between text-[10px] sm:text-[11px] text-amber-900 font-semibold gap-2">
          <div className="flex items-center gap-1.5 truncate">
            <Info className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            <span className="truncate">
              Razorpay Sandbox: Safe test credentials pre-filled.
            </span>
          </div>
          <span className="bg-amber-200 text-amber-950 px-1.5 py-0.5 rounded text-[9px] font-black shrink-0">
            TEST MODE
          </span>
        </div>

        {/* Main Content Area */}
        {processing ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-amber-50 border-2 border-amber-500 flex items-center justify-center">
              {isSuccess ? (
                <CheckCircle2 className="w-8 h-8 text-green-600 animate-bounce" />
              ) : (
                <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
              )}
            </div>
            <div>
              <p className="text-base font-black text-stone-900">{processingStep}</p>
              <p className="text-xs text-stone-500 mt-1">
                Please do not refresh or press back button
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col md:grid md:grid-cols-12 min-h-[340px]">
            {/* Left Tabs */}
            <div className="md:col-span-5 bg-stone-50 border-b md:border-b-0 md:border-r border-stone-200 p-2 flex md:flex-col gap-1 overflow-x-auto md:overflow-x-visible text-xs font-bold text-stone-700 scrollbar-none">
              <button
                type="button"
                onClick={() => setActiveTab("UPI")}
                className={`flex-1 md:w-full flex items-center justify-center md:justify-start gap-2 px-3 py-2.5 rounded-xl transition-all shrink-0 whitespace-nowrap ${
                  activeTab === "UPI"
                    ? "bg-[#0c2340] text-white shadow-sm"
                    : "hover:bg-stone-200 text-stone-700 bg-white md:bg-transparent"
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span className="text-left">UPI / QR</span>
                <span className="text-[10px] font-extrabold text-amber-400 hidden sm:inline">FAST</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("CARD")}
                className={`flex-1 md:w-full flex items-center justify-center md:justify-start gap-2 px-3 py-2.5 rounded-xl transition-all shrink-0 whitespace-nowrap ${
                  activeTab === "CARD"
                    ? "bg-[#0c2340] text-white shadow-sm"
                    : "hover:bg-stone-200 text-stone-700 bg-white md:bg-transparent"
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span className="text-left">Cards</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("NETBANKING")}
                className={`flex-1 md:w-full flex items-center justify-center md:justify-start gap-2 px-3 py-2.5 rounded-xl transition-all shrink-0 whitespace-nowrap ${
                  activeTab === "NETBANKING"
                    ? "bg-[#0c2340] text-white shadow-sm"
                    : "hover:bg-stone-200 text-stone-700 bg-white md:bg-transparent"
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span className="text-left">NetBanking</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("WALLET")}
                className={`flex-1 md:w-full flex items-center justify-center md:justify-start gap-2 px-3 py-2.5 rounded-xl transition-all shrink-0 whitespace-nowrap ${
                  activeTab === "WALLET"
                    ? "bg-[#0c2340] text-white shadow-sm"
                    : "hover:bg-stone-200 text-stone-700 bg-white md:bg-transparent"
                }`}
              >
                <Wallet className="w-4 h-4" />
                <span className="text-left">Wallets</span>
              </button>
            </div>

            {/* Right Tab Content */}
            <div className="md:col-span-7 p-5 space-y-4 text-xs">
              {/* 1. UPI Tab */}
              {activeTab === "UPI" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-extrabold text-stone-700 uppercase mb-2">
                      Popular UPI Apps
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {["Google Pay", "PhonePe", "Paytm", "BHIM UPI"].map((app) => (
                        <button
                          key={app}
                          type="button"
                          onClick={() => {
                            setSelectedUpiApp(app);
                            setUpiId(
                              app === "Google Pay"
                                ? "athlete@okaxis"
                                : app === "PhonePe"
                                ? "athlete@ybl"
                                : app === "Paytm"
                                ? "athlete@paytm"
                                : "athlete@upi"
                            );
                          }}
                          className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all ${
                            selectedUpiApp === app
                              ? "border-amber-500 bg-amber-50/50 font-black text-amber-950"
                              : "border-stone-200 hover:border-stone-400 bg-white"
                          }`}
                        >
                          <div className="w-6 h-6 rounded-lg bg-stone-100 flex items-center justify-center font-black text-[10px]">
                            {app[0]}
                          </div>
                          <span>{app}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-extrabold text-stone-700 uppercase mb-1">
                      UPI ID / VPA
                    </label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-xl font-mono text-xs focus:outline-none focus:border-amber-500"
                      placeholder="e.g. mobile@upi"
                    />
                  </div>

                  <div className="p-2.5 bg-stone-50 border border-stone-200 rounded-xl flex items-center gap-2.5 text-[11px] text-stone-600">
                    <QrCode className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>QR Code scanner will be simulated automatically on click.</span>
                  </div>
                </div>
              )}

              {/* 2. CARD Tab */}
              {activeTab === "CARD" && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-extrabold text-stone-700 uppercase mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-xl font-mono text-xs tracking-wider"
                      placeholder="4111 1111 1111 1111"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-extrabold text-stone-700 uppercase mb-1">
                        Expiry (MM/YY)
                      </label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full px-3 py-2 border border-stone-300 rounded-xl font-mono text-xs text-center"
                        placeholder="12/28"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-extrabold text-stone-700 uppercase mb-1">
                        CVV
                      </label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full px-3 py-2 border border-stone-300 rounded-xl font-mono text-xs text-center"
                        placeholder="123"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-extrabold text-stone-700 uppercase mb-1">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-xl text-xs"
                      placeholder="Name on card"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-1 text-[10px] text-stone-500">
                    <Lock className="w-3 h-3 text-green-600" />
                    <span>Supports Visa, MasterCard, RuPay & American Express</span>
                  </div>
                </div>
              )}

              {/* 3. NET BANKING Tab */}
              {activeTab === "NETBANKING" && (
                <div className="space-y-3">
                  <label className="block text-[11px] font-extrabold text-stone-700 uppercase">
                    Select Bank
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {["HDFC Bank", "ICICI Bank", "State Bank of India", "Axis Bank", "Kotak Bank", "Punjab National Bank"].map((bank) => (
                      <button
                        key={bank}
                        type="button"
                        onClick={() => setSelectedBank(bank)}
                        className={`p-2 rounded-xl border text-left text-xs transition-all ${
                          selectedBank === bank
                            ? "border-amber-500 bg-amber-50 font-black text-amber-950"
                            : "border-stone-200 hover:border-stone-400 bg-white"
                        }`}
                      >
                        {bank}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. WALLETS Tab */}
              {activeTab === "WALLET" && (
                <div className="space-y-3">
                  <label className="block text-[11px] font-extrabold text-stone-700 uppercase">
                    Select Digital Wallet
                  </label>
                  <div className="space-y-2">
                    {["Paytm Wallet", "PhonePe Wallet", "MobiKwik", "Amazon Pay"].map((wallet) => (
                      <button
                        key={wallet}
                        type="button"
                        onClick={() => setSelectedWallet(wallet)}
                        className={`w-full p-2.5 rounded-xl border text-left text-xs flex items-center justify-between transition-all ${
                          selectedWallet === wallet
                            ? "border-amber-500 bg-amber-50 font-black text-amber-950"
                            : "border-stone-200 hover:border-stone-400 bg-white"
                        }`}
                      >
                        <span>{wallet}</span>
                        {selectedWallet === wallet && (
                          <CheckCircle2 className="w-4 h-4 text-amber-600" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Pay Action Buttons */}
              <div className="pt-3 border-t border-stone-200 space-y-2">
                <button
                  type="button"
                  onClick={() => handleSimulatePayment(false)}
                  className="w-full bg-[#0c2340] hover:bg-[#13335c] text-white font-black text-xs uppercase py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 group"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Pay ₹{amount.toFixed(2)} with Test {activeTab}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="flex items-center justify-between gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleSimulatePayment(true)}
                    className="text-[10px] text-red-600 hover:text-red-700 hover:underline font-bold"
                  >
                    Simulate Bank Decline (Test Error Flow)
                  </button>

                  <div className="flex items-center gap-1 text-[10px] text-stone-400">
                    <ShieldCheck className="w-3 h-3 text-green-600" />
                    <span>Razorpay PCI-DSS Level 1</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer info */}
        <div className="bg-stone-100 px-5 py-2.5 border-t border-stone-200 flex items-center justify-between text-[10px] text-stone-500">
          <span>Secured by Razorpay API ({process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_TqvEEanuQFa49Y"})</span>
          <span>Order ID: {razorpayOrderId}</span>
        </div>
      </div>
    </div>
  );
}
