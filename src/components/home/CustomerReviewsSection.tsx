import React from "react";
import { Star, CheckCircle, Quote } from "lucide-react";

export default function CustomerReviewsSection() {
  const reviews = [
    {
      name: "Sourav Sharma",
      role: "Marathon Runner, Bengaluru",
      rating: 5,
      title: "Hands down the best chocolate peanut butter in India!",
      comment: "I have tried MyFitness, Pintola and Alpino, but Organichy has the cleanest taste and real chocolate crunch. No artificial oily aftertaste. Delivered in 2 days to Bengaluru!",
    },
    {
      name: "Dr. Vikram Sethi",
      role: "Sports Medicine Physician, Delhi",
      rating: 5,
      title: "Outstanding macro profile & genuine ingredients",
      comment: "As a sports physician, I closely inspect trans-fat and sodium. Organichy delivers genuine 32g protein per 100g without using cheap palm stearin. Highly recommended to all fitness seekers.",
    },
    {
      name: "Pooja Malhotra",
      role: "CrossFit Coach, Mumbai",
      rating: 5,
      title: "Pure roasted peanuts with incredible aroma",
      comment: "Zero sugar and zero salt is exactly what I needed for my contest prep. The peanut aroma when opening the lid is heavenly. My clients swear by this now.",
    },
  ];

  return (
    <section className="py-16 bg-stone-50 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="flex items-center justify-center gap-1 text-amber-500 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-current" />
            ))}
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-stone-900 tracking-tight">
            LOVED BY OVER 50,000+ ATHLETES ACROSS INDIA
          </h2>
          <p className="text-stone-500 text-xs sm:text-sm mt-2">
            Real feedback from verified fitness enthusiasts, doctors, and trainers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition-shadow relative flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-500 mb-3">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <h4 className="font-extrabold text-sm sm:text-base text-stone-900 mb-2">
                  &ldquo;{rev.title}&rdquo;
                </h4>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed italic">
                  {rev.comment}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <h5 className="font-bold text-xs sm:text-sm text-stone-900">{rev.name}</h5>
                  <p className="text-[11px] text-stone-400 font-medium">{rev.role}</p>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Verified Buyer</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
