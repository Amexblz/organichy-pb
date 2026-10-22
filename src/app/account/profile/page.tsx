"use client";

import React, { useState, useEffect } from "react";
import { User, Phone, Lock, Check } from "lucide-react";

export default function ProfilePage() {
  const [hasPassword, setHasPassword] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; error?: boolean } | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) {
          setHasPassword(!!data.user.hasPassword);
          setFormData((prev) => ({
            ...prev,
            name: data.user.name || "",
            email: data.user.email || "",
            phone: data.user.phone || "",
          }));
        }
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/account/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage({ text: data.error || "Failed to update profile", error: true });
      } else {
        setMessage({ text: "Profile updated successfully!" });
        setFormData((prev) => ({ ...prev, currentPassword: "", newPassword: "" }));
      }
    } catch (err) {
      setMessage({ text: "An unexpected error occurred", error: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-xl">
      <div className="pb-4 border-b border-stone-200">
        <h1 className="text-xl font-black text-stone-900 uppercase tracking-tight">
          My Profile
        </h1>
        <p className="text-xs text-stone-500">Manage your personal information and security</p>
      </div>

      {message && (
        <div
          className={`p-3 rounded-xl text-xs font-semibold ${
            message.error
              ? "bg-red-50 text-red-700 border border-red-200"
              : "bg-green-50 text-green-700 border border-green-200"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
            Full Name
          </label>
          <div className="relative">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full pl-9 pr-3 py-2.5 text-xs font-medium border border-stone-300 rounded-xl focus:outline-none focus:border-amber-500"
            />
            <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
            Email Address (Read-only)
          </label>
          <input
            type="email"
            value={formData.email}
            disabled
            className="w-full px-3 py-2.5 text-xs font-medium border border-stone-200 bg-stone-100 rounded-xl text-stone-500 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
            Phone Number
          </label>
          <div className="relative">
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              className="w-full pl-9 pr-3 py-2.5 text-xs font-medium border border-stone-300 rounded-xl focus:outline-none focus:border-amber-500"
            />
            <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Password update section */}
        <div className="pt-4 border-t border-stone-200 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs uppercase text-stone-900 tracking-wider">
              {hasPassword ? "Change Password" : "Set Account Password"}
            </h3>
            {!hasPassword && (
              <span className="text-[10px] font-black uppercase text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                Phone OTP Active
              </span>
            )}
          </div>

          {!hasPassword && (
            <p className="text-[11px] text-stone-500 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
              💡 You originally logged in via Mobile Number & OTP. You can add a password below to enable logging in with both password and OTP anytime!
            </p>
          )}

          {hasPassword && (
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                Current Password
              </label>
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-3 py-2.5 text-xs font-medium border border-stone-300 rounded-xl focus:outline-none focus:border-amber-500"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
              {hasPassword ? "New Password (min 6 characters)" : "Create Password (min 6 characters)"}
            </label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="••••••••"
              minLength={6}
              className="w-full px-3 py-2.5 text-xs font-medium border border-stone-300 rounded-xl focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-stone-900 hover:bg-amber-600 text-white font-bold text-xs uppercase px-6 py-3 rounded-xl transition-colors shadow-md disabled:opacity-50"
        >
          {loading ? "Saving Changes..." : "Save Profile Changes"}
        </button>
      </form>
    </div>
  );
}
