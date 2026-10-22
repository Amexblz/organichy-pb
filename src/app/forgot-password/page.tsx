"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, ArrowRight, CheckCircle2 } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans">
      <Header />

      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-black text-stone-900 tracking-tight">
              Reset Your Password
            </h1>
            <p className="text-xs text-stone-500">
              Enter your registered email and we&apos;ll send instructions to recover your account.
            </p>
          </div>

          {submitted ? (
            <div className="p-4 bg-green-50 border border-green-200 rounded-2xl text-center space-y-2 text-xs">
              <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto" />
              <p className="font-bold text-green-900">Password Reset Link Dispatched</p>
              <p className="text-green-700">
                If an account exists for <strong>{email}</strong>, you will receive a secure token to reset your password.
              </p>
              <Link href="/login" className="inline-block pt-2 font-bold text-stone-900 underline">
                Return to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="name@example.com"
                    className="w-full pl-9 pr-3 py-2.5 text-xs font-medium border border-stone-300 rounded-xl focus:outline-none focus:border-amber-500"
                  />
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-stone-900 hover:bg-amber-600 text-white font-black text-xs uppercase py-3.5 rounded-xl transition-colors shadow-md"
              >
                Send Reset Link
              </button>

              <div className="text-center pt-2">
                <Link href="/login" className="text-xs font-bold text-stone-600 hover:text-stone-900">
                  ← Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
