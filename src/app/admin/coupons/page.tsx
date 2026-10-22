"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Tag, Check, X } from "lucide-react";
import { formatINR } from "@/lib/utils";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState({
    code: "",
    description: "",
    discountType: "PERCENTAGE",
    discountValue: "15",
    minOrderAmount: "799",
    maxDiscountAmount: "250",
    usageLimit: "500",
  });

  const loadCoupons = () => {
    fetch("/api/admin/coupons")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.coupons) setCoupons(data.coupons);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/admin/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setShowAddForm(false);
      setForm({
        code: "",
        description: "",
        discountType: "PERCENTAGE",
        discountValue: "15",
        minOrderAmount: "799",
        maxDiscountAmount: "250",
        usageLimit: "500",
      });
      loadCoupons();
    } else {
      alert("Failed to create coupon.");
    }
  };

  const handleDelete = async (id: string, code: string) => {
    if (!confirm(`Delete coupon "${code}"?`)) return;
    await fetch(`/api/admin/coupons?id=${id}`, { method: "DELETE" });
    loadCoupons();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight uppercase">
            COUPONS & OFFERS
          </h1>
          <p className="text-xs text-stone-500">Configure discount campaigns and promo codes</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-stone-900 hover:bg-amber-600 text-white font-bold text-xs uppercase px-5 py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Coupon</span>
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleCreate} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4 max-w-xl text-xs">
          <h3 className="font-black uppercase text-stone-900 tracking-wider">
            Create Promo Code
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Coupon Code *</label>
              <input
                type="text"
                required
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                placeholder="e.g. FLASH20"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg uppercase font-black"
              />
            </div>
            <div>
              <label className="block font-bold text-stone-700 mb-1">Discount Type</label>
              <select
                value={form.discountType}
                onChange={(e) => setForm({ ...form, discountType: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg font-bold"
              >
                <option value="PERCENTAGE">Percentage (%)</option>
                <option value="FIXED">Flat INR (₹)</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-stone-700 mb-1">Discount Value *</label>
              <input
                type="number"
                required
                value={form.discountValue}
                onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg font-bold"
              />
            </div>
            <div>
              <label className="block font-bold text-stone-700 mb-1">Min Order Amount (₹)</label>
              <input
                type="number"
                value={form.minOrderAmount}
                onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block font-bold text-stone-700 mb-1">Max Cap (₹, for %)</label>
              <input
                type="number"
                value={form.maxDiscountAmount}
                onChange={(e) => setForm({ ...form, maxDiscountAmount: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block font-bold text-stone-700 mb-1">Total Usage Limit</label>
              <input
                type="number"
                value={form.usageLimit}
                onChange={(e) => setForm({ ...form, usageLimit: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg"
              />
            </div>
            <div className="col-span-2">
              <label className="block font-bold text-stone-700 mb-1">Campaign Description</label>
              <input
                type="text"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="e.g. 15% OFF for marathon runners"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="bg-stone-900 text-white font-bold uppercase px-5 py-2.5 rounded-lg hover:bg-amber-600 transition-colors"
            >
              Save Coupon
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-stone-500 font-bold px-4 py-2 hover:text-stone-800"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Coupons Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase font-black tracking-wider">
            <tr>
              <th className="py-3.5 px-4">Coupon Code</th>
              <th className="py-3.5 px-4">Discount</th>
              <th className="py-3.5 px-4">Min Spend</th>
              <th className="py-3.5 px-4">Max Cap</th>
              <th className="py-3.5 px-4">Usage Count</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Delete</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 font-medium text-stone-800">
            {loading ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-stone-400">Loading coupons...</td>
              </tr>
            ) : coupons.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-stone-400">No coupons configured.</td>
              </tr>
            ) : (
              coupons.map((c) => (
                <tr key={c.id} className="hover:bg-stone-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-black text-amber-800 font-mono text-sm">
                    {c.code}
                  </td>
                  <td className="py-3.5 px-4 font-black text-stone-900">
                    {c.discountType === "PERCENTAGE" ? `${c.discountValue}% OFF` : `₹${c.discountValue} FLAT`}
                  </td>
                  <td className="py-3.5 px-4">
                    ₹{c.minOrderAmount}
                  </td>
                  <td className="py-3.5 px-4">
                    {c.maxDiscountAmount ? `₹${c.maxDiscountAmount}` : "No Limit"}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-stone-700">
                    {c.usageCount} / {c.usageLimit || "∞"} used
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="bg-green-100 text-green-800 font-black text-[10px] px-2 py-0.5 rounded-full uppercase">
                      Active
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleDelete(c.id, c.code)}
                      className="p-1.5 text-stone-400 hover:text-red-600 transition-colors"
                      title="Delete Coupon"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
