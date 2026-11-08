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

  const email = siteSettings?.contactEmail || "organichypb@gmail.com";
  const phone = siteSettings?.contactPhone || "+91 7427446941";
  const address = siteSettings?.contactAddress || "Organichy Food, A-11 Shakti Nagar, Prem Nagar, Linepar, Moradabad - 244001 (U.P.), India";

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
          {/* Contact Details (5 cols) - Light Theme */}
          <div className="md:col-span-5 bg-gradient-to-br from-amber-50/80 via-white to-stone-50 border border-amber-200/70 text-stone-900 p-6 sm:p-8 rounded-3xl space-y-6 shadow-sm">
            <h3 className="font-black text-lg text-stone-950 uppercase tracking-tight flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              Direct Contact Channels
            </h3>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-stone-900">Marketed By</p>
                  <p className="text-stone-700 mt-0.5 font-semibold">Organichy Food</p>
                  <p className="text-stone-600 mt-0.5">A-11 Shakti Nagar, Prem Nagar, Linepar, Moradabad - 244001 (U.P.), India</p>
                  <p className="text-amber-800 font-bold text-xs mt-1">FSSAI Lic No: 22725719000592</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-stone-900">Manufactured By</p>
                  <p className="text-stone-700 mt-0.5 font-semibold">JUST BITE FOODS</p>
                  <p className="text-stone-600 mt-0.5">Plot No. 39, Block No. 221, Industrial Society, Village - Masma, Sub District-Olpad, Dist - Surat, Gujarat-394540</p>
                  <p className="text-amber-800 font-bold text-xs mt-1">FSSAI Lic No: 10721999000720</p>
                  <p className="text-[11px] text-stone-500 mt-0.5">Certified for: ISO 22000 | GMP | FDA Registered</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-stone-900">Email Support</p>
                  <p className="text-stone-700 mt-0.5 font-medium">{email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-stone-900">Phone & WhatsApp Helpdesk</p>
                  <p className="text-stone-700 mt-0.5 font-medium">{phone}</p>
                  <p className="text-amber-700 font-semibold text-xs mt-0.5">Instagram: @organichy_pb</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-stone-900">Operating Hours</p>
                  <p className="text-stone-600 mt-0.5">Monday to Saturday: 9:30 AM to 6:30 PM IST</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-amber-200/50 text-[11px] text-stone-500 font-medium">
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
                    <label className="block font-bold text-stone-700 mb-1">
                      Your Name <span className="text-red-500 font-bold">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Sourav Sharma"
                      className="w-full px-3 py-2.5 border border-stone-300 rounded-xl bg-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">
                      Email Address <span className="text-red-500 font-bold">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@example.com"
                      className="w-full px-3 py-2.5 border border-stone-300 rounded-xl bg-white focus:outline-none focus:border-amber-500"
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
                      className="w-full px-3 py-2.5 border border-stone-300 rounded-xl bg-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Subject</label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Order Inquiry / Bulk Gym Order"
                      className="w-full px-3 py-2.5 border border-stone-300 rounded-xl bg-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="text-xs">
                  <label className="block font-bold text-stone-700 mb-1">
                    How can we assist you? <span className="text-red-500 font-bold">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Provide details about your query..."
                    className="w-full px-3 py-2.5 border border-stone-300 rounded-xl bg-white focus:outline-none focus:border-amber-500"
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
