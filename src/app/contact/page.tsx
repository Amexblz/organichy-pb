"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2 } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useCart } from "@/context/CartContext";

export default function ContactPage() {
  const { siteSettings } = useCart();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", subject: "", message: "" });

  const email = siteSettings?.contactEmail || "care@organichy.com";
  const phone = siteSettings?.contactPhone || "+91 98765 43210";
  const address = siteSettings?.contactAddress || "Dr Health Xpert Pvt Ltd, Industrial Area, Sector 62, Noida, Uttar Pradesh, 201309";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-10">
        <div className="text-center space-y-2">
          <span className="text-xs font-black uppercase text-amber-700 tracking-wider">
            CUSTOMER SUPPORT & INQUIRIES
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
            We&apos;re Here to Help
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm max-w-md mx-auto">
            Have questions regarding an ongoing order, delivery timelines, or wholesale gym distribution?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Contact Details (5 cols) */}
          <div className="md:col-span-5 bg-stone-900 text-white p-6 sm:p-8 rounded-3xl space-y-6 shadow-sm">
            <h3 className="font-black text-lg text-amber-400 uppercase tracking-tight">
              Direct Contact Channels
            </h3>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white">Registered Corporate Office</p>
                  <p className="text-stone-400 mt-0.5">
                    {address}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white">Email Support</p>
                  <p className="text-stone-400 mt-0.5">{email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white">Phone & WhatsApp Helpdesk</p>
                  <p className="text-stone-400 mt-0.5">{phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white">Operating Hours</p>
                  <p className="text-stone-400 mt-0.5">Monday to Saturday: 9:30 AM to 6:30 PM IST</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-800 text-[11px] text-stone-400">
              ⚡ National Hubs: Bengaluru (South) | Noida (North) | Mumbai (West)
            </div>
          </div>

          {/* Query Form (7 cols) */}
          <div className="md:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm">
            {submitted ? (
              <div className="text-center py-12 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto" />
                <h3 className="font-black text-stone-900 text-lg">Message Received!</h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  Thank you for reaching out. A customer support representative will get back to you within 24 business hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="font-black text-sm uppercase text-stone-900 tracking-wider">
                  Send us a Message
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Sourav Sharma"
                      className="w-full px-3 py-2.5 border border-stone-300 rounded-xl bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@example.com"
                      className="w-full px-3 py-2.5 border border-stone-300 rounded-xl bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-3 py-2.5 border border-stone-300 rounded-xl bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Subject</label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Order Inquiry / Bulk Gym Order"
                      className="w-full px-3 py-2.5 border border-stone-300 rounded-xl bg-white"
                    />
                  </div>
                </div>

                <div className="text-xs">
                  <label className="block font-bold text-stone-700 mb-1">How can we assist you? *</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Provide details about your query..."
                    className="w-full px-3 py-2.5 border border-stone-300 rounded-xl bg-white"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-stone-900 hover:bg-amber-600 text-white font-bold text-xs uppercase px-6 py-3.5 rounded-xl transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Message</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
