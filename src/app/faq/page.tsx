"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "Why is there natural oil floating on top of my Organichy Peanut Butter?",
      a: "Natural oil separation is the ultimate proof of purity! Conventional commercial spreads add hydrogenated palm oil and chemical emulsifiers to keep the oil artificially bound. We don't. Simply stir the natural peanut oil back in with a clean butter knife. Storing your jar upside down or in the refrigerator also helps maintain a firm, creamy texture.",
    },
    {
      q: "How much protein does one serving deliver?",
      a: "Each 32g serving (approximately 2 level tablespoons) delivers over 10g of clean, high-biological-value protein. Our Dark Chocolate Crunchy provides 32g of pure protein per 100g, making it ideal for muscle repair and high-energy breakfasts.",
    },
    {
      q: "Does Organichy use palm oil, hydrogenated fats, or trans fats?",
      a: "NEVER. We have a zero-tolerance policy towards palm oil, trans fats, and artificial additives. Only 100% slow-roasted runner peanuts and pure dark cocoa solids are used.",
    },
    {
      q: "What is the shelf life of unopened and opened jars?",
      a: "Unopened jars have a shelf life of 12 months from the date of manufacture. Once opened, we recommend finishing the jar within 3 months for optimal freshness and aroma.",
    },
    {
      q: "What are your shipping charges and delivery timelines?",
      a: "We offer FREE Express Shipping on all orders above ₹499 across India (orders below ₹499 carry a flat ₹50 fee). Orders placed before 2:00 PM IST are dispatched the same day. Deliveries in metro cities arrive within 2 business days; rest of India takes 3 to 4 business days.",
    },
    {
      q: "Do you offer Cash on Delivery (COD)?",
      a: "Yes! Cash on Delivery is available across 19,000+ Indian PIN codes. You can pay with cash or directly scan a UPI QR code upon arrival at your doorstep.",
    },
    {
      q: "What if my product arrives damaged or leaking?",
      a: "We pack all jars in heavy-duty protective bubble pods. However, if your order is damaged in transit, simply take a quick picture and email care@organichy.com or WhatsApp us at +91 98765 43210 within 48 hours for an instant, hassle-free replacement.",
    },
  ];

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-black uppercase text-amber-700 tracking-wider">
            FREQUENTLY ASKED QUESTIONS
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
            Got Questions? We Have Answers.
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm">
            Everything you need to know about our ingredients, oil separation, macro profiles, and shipping.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm transition-all"
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full text-left p-5 flex items-center justify-between gap-4 font-extrabold text-sm sm:text-base text-stone-900 hover:text-amber-700 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 shrink-0 text-stone-400 transition-transform duration-300 ${
                    openIndex === idx ? "rotate-180 text-amber-600" : ""
                  }`}
                />
              </button>

              {openIndex === idx && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100 bg-stone-50/40">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
