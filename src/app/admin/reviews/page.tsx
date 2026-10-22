"use client";

import React, { useState, useEffect } from "react";
import { Star, Check, X, Trash2, CheckCircle2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadReviews = () => {
    fetch("/api/admin/reviews")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.reviews) setReviews(data.reviews);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleToggleApprove = async (id: string, current: boolean) => {
    await fetch("/api/admin/reviews", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, isApproved: !current }),
    });
    loadReviews();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this review?")) return;
    await fetch(`/api/admin/reviews?id=${id}`, { method: "DELETE" });
    loadReviews();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight uppercase">
            REVIEWS MODERATION
          </h1>
          <p className="text-xs text-stone-500">Moderate customer ratings, testimonials, and verified purchase flags</p>
        </div>
        <span className="text-xs font-bold text-stone-600 bg-white border border-stone-300 px-3 py-1.5 rounded-full">
          {reviews.length} Total Reviews
        </span>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase font-black tracking-wider">
            <tr>
              <th className="py-3.5 px-4">Product</th>
              <th className="py-3.5 px-4">Customer</th>
              <th className="py-3.5 px-4">Rating</th>
              <th className="py-3.5 px-4">Comment</th>
              <th className="py-3.5 px-4">Verified</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 font-medium text-stone-800">
            {loading ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-stone-400">Loading reviews...</td>
              </tr>
            ) : reviews.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-stone-400">No reviews found.</td>
              </tr>
            ) : (
              reviews.map((r) => (
                <tr key={r.id} className="hover:bg-stone-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-stone-900 max-w-[150px] truncate">
                    {r.product?.name || "Product"}
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-extrabold text-stone-900">{r.userName}</p>
                    <p className="text-[10px] text-stone-400">{formatDate(r.createdAt)}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1 font-bold text-amber-500">
                      <span>{r.rating}</span>
                      <Star className="w-3.5 h-3.5 fill-current" />
                    </div>
                  </td>
                  <td className="py-3.5 px-4 max-w-xs">
                    {r.title && <p className="font-bold text-stone-900">{r.title}</p>}
                    <p className="text-stone-600 line-clamp-2 text-[11px]">{r.comment}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    {r.isVerifiedPurchase ? (
                      <span className="text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                        ✓ Verified
                      </span>
                    ) : (
                      <span className="text-[10px] text-stone-400">Standard</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                        r.isApproved ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {r.isApproved ? "Approved" : "Hidden"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleToggleApprove(r.id, r.isApproved)}
                        className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors ${
                          r.isApproved
                            ? "bg-stone-100 text-stone-700 hover:bg-stone-200"
                            : "bg-green-600 text-white hover:bg-green-700"
                        }`}
                      >
                        {r.isApproved ? "Hide" : "Approve"}
                      </button>
                      <button
                        onClick={() => handleDelete(r.id)}
                        className="p-1 text-stone-400 hover:text-red-600 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
