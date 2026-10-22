"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Mail, ArrowRight, Smartphone, KeyRound, CheckCircle2, RotateCcw } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/account";

  const [authMode, setAuthMode] = useState<"PHONE_OTP" | "PASSWORD">("PHONE_OTP");

  // Phone OTP State
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [demoOtp, setDemoOtp] = useState("");
  const [otpMessage, setOtpMessage] = useState("");

  // Email/Password State
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 1. Send OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setOtpMessage("");

    const cleanPhone = phone.replace(/\D/g, "").slice(-10);
    if (cleanPhone.length !== 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/phone/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: cleanPhone }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to send OTP.");
      } else {
        setOtpSent(true);
        setDemoOtp(data.demoOtp || "123456");
        setOtp(data.demoOtp || "");
        setOtpMessage(data.message || `OTP sent to +91 ${cleanPhone}`);
      }
    } catch (err) {
      setError("Failed to connect to authentication server.");
    } finally {
      setLoading(false);
    }
  };

  // 2. Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!otp || otp.length !== 6) {
      setError("Please enter the 6-digit OTP code.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/phone/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Invalid OTP code.");
      } else {
        router.push(redirectUrl);
        router.refresh();
      }
    } catch (err) {
      setError("Failed to verify OTP.");
    } finally {
      setLoading(false);
    }
  };

  // 3. Password Login
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailOrPhone, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to sign in. Please verify your credentials.");
      } else {
        router.push(redirectUrl);
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl border border-stone-200 shadow-sm space-y-6">
      <div className="text-center space-y-2">
        <div className="relative h-14 w-48 mx-auto mb-2">
          <Image
            src="/images/branding/logo.png"
            alt="Organichy Peanut Butter"
            fill
            sizes="192px"
            className="object-contain"
            priority
          />
        </div>
        <h1 className="text-2xl font-black text-stone-900 tracking-tight">
          Customer Account Login
        </h1>
        <p className="text-xs text-stone-500">
          Sign in using your mobile number or email to view and track your orders
        </p>
      </div>

      {/* Auth Mode Toggle Tabs */}
      <div className="grid grid-cols-2 gap-2 p-1 bg-stone-100 rounded-2xl text-xs font-bold text-stone-600">
        <button
          type="button"
          onClick={() => {
            setAuthMode("PHONE_OTP");
            setError("");
          }}
          className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            authMode === "PHONE_OTP"
              ? "bg-white text-stone-900 shadow-sm font-extrabold"
              : "hover:text-stone-900"
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Mobile & OTP</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setAuthMode("PASSWORD");
            setError("");
          }}
          className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            authMode === "PASSWORD"
              ? "bg-white text-stone-900 shadow-sm font-extrabold"
              : "hover:text-stone-900"
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Password</span>
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-semibold text-red-600">
          {error}
        </div>
      )}

      {/* MODE 1: PHONE NUMBER & OTP LOGIN */}
      {authMode === "PHONE_OTP" && (
        <div className="space-y-4">
          {!otpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Indian Mobile Number
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3 text-xs font-extrabold text-stone-500 border-r border-stone-200 pr-2">
                    +91
                  </div>
                  <input
                    type="tel"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                    placeholder="98765 43210"
                    required
                    className="w-full pl-14 pr-3 py-3 text-xs font-bold border border-stone-300 rounded-xl focus:outline-none focus:border-amber-500 font-mono tracking-wider"
                  />
                </div>
                <p className="text-[11px] text-stone-500 mt-1">
                  We will send a 6-digit OTP to verify your order and account.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || phone.length < 10}
                className="w-full bg-stone-900 hover:bg-amber-600 text-white font-black text-xs uppercase py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 group disabled:opacity-50"
              >
                <span>{loading ? "SENDING OTP..." : "GET VERIFICATION CODE"}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="p-3 bg-green-50 border border-green-200 rounded-xl flex items-center justify-between text-xs text-green-900">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                  <span>{otpMessage}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setOtpSent(false)}
                  className="text-stone-500 hover:text-stone-900 text-[11px] font-bold flex items-center gap-0.5"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Change</span>
                </button>
              </div>

              {demoOtp && (
                <div className="p-2.5 bg-amber-50 border border-amber-300/80 rounded-xl text-center text-xs text-amber-900 font-bold">
                  ⚡ Demo OTP: <span className="font-mono text-sm font-black text-amber-700">{demoOtp}</span> (Pre-filled for you)
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Enter 6-Digit Verification Code
                </label>
                <div className="relative">
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    placeholder="123456"
                    required
                    className="w-full pl-9 pr-3 py-3 text-center text-sm font-black tracking-widest border border-stone-300 rounded-xl focus:outline-none focus:border-amber-500 font-mono"
                  />
                  <KeyRound className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs uppercase py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>{loading ? "VERIFYING..." : "VERIFY & VIEW MY ORDERS"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      )}

      {/* MODE 2: EMAIL / PHONE + PASSWORD LOGIN */}
      {authMode === "PASSWORD" && (
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
              Email or Mobile Number
            </label>
            <div className="relative">
              <input
                type="text"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                placeholder="customer@gmail.com or 9876543210"
                required
                className="w-full pl-9 pr-3 py-2.5 text-xs font-medium border border-stone-300 rounded-xl focus:outline-none focus:border-amber-500"
              />
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-bold text-stone-700 uppercase">
                Password
              </label>
              <Link href="/forgot-password" className="text-xs text-amber-700 font-semibold hover:underline">
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-9 pr-3 py-2.5 text-xs font-medium border border-stone-300 rounded-xl focus:outline-none focus:border-amber-500"
              />
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-stone-900 hover:bg-amber-600 text-white font-black text-xs uppercase py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 group disabled:opacity-50"
          >
            <span>{loading ? "AUTHENTICATING..." : "SIGN IN WITH PASSWORD"}</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          {/* Demo Credentials hint */}
          <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200 text-[11px] text-amber-900 space-y-1">
            <p className="font-bold">Demo Customer Account:</p>
            <p>Email: <code className="font-mono bg-white px-1 py-0.5 rounded">customer@gmail.com</code></p>
            <p>Password: <code className="font-mono bg-white px-1 py-0.5 rounded">CustomerPassword@123</code></p>
          </div>
        </form>
      )}

      <div className="text-center pt-2 border-t border-stone-100 text-xs text-stone-500 space-y-2">
        <div>
          Have an Order ID?{" "}
          <Link href="/track-order" className="font-bold text-amber-700 hover:underline">
            Track Order Directly
          </Link>
        </div>
        <div>
          Don&apos;t have an account yet?{" "}
          <Link href="/register" className="font-bold text-stone-900 hover:text-amber-700">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<div className="p-12 text-center text-xs text-stone-400">Loading Login...</div>}>
          <LoginForm />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
