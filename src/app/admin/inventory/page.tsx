"use client";

import React, { useState, useEffect } from "react";
import { Boxes, AlertTriangle, Plus, Minus, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { formatINR } from "@/lib/utils";

export default function AdminInventoryPage() {
  const [variants, setVariants] = useState<any[]>([]);
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [adjustment, setAdjustment] = useState("10");
  const [notes, setNotes] = useState("Batch restock from Saurashtra processing hub");
  const [actionLoading, setActionLoading] = useState(false);

  const loadInventory = () => {
    fetch(`/api/admin/inventory?lowStock=${lowStockOnly}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.variants) setVariants(data.variants);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadInventory();
  }, [lowStockOnly]);

  const handleAdjustStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVariant || !adjustment) return;

    setActionLoading(true);
    try {
      const res = await fetch("/api/admin/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          variantId: selectedVariant.id,
          adjustment: parseInt(adjustment),
          type: parseInt(adjustment) > 0 ? "RESTOCK" : "ADJUSTMENT",
          notes,
        }),
      });

      if (res.ok) {
        setSelectedVariant(null);
        loadInventory();
      } else {
        alert("Failed to adjust inventory.");
      }
    } catch (e) {
      alert("Error adjusting inventory.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight uppercase">
            INVENTORY & STOCK CONTROL
          </h1>
          <p className="text-xs text-stone-500">Real-time variant stock tracking and warehouse adjustments</p>
        </div>

        <button
          onClick={() => setLowStockOnly(!lowStockOnly)}
          className={`px-4 py-2 rounded-xl font-bold text-xs uppercase transition-colors flex items-center gap-2 border ${
            lowStockOnly
              ? "bg-red-600 text-white border-red-600 shadow-sm"
              : "bg-white text-stone-700 border-stone-300 hover:bg-stone-50"
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>{lowStockOnly ? "Showing Low Stock (≤10)" : "Show Low Stock Alerts Only"}</span>
        </button>
      </div>

      {/* Stock Adjustment Modal */}
      {selectedVariant && (
        <form onSubmit={handleAdjustStock} className="bg-white p-6 rounded-2xl border-2 border-amber-500 shadow-lg space-y-4 max-w-lg">
          <h3 className="font-black text-sm uppercase text-stone-900">
            Adjust Stock for {selectedVariant.product?.name} ({selectedVariant.weight})
          </h3>
          <p className="text-xs text-stone-500">Current Stock: <strong>{selectedVariant.stock} units</strong></p>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Adjustment Delta (+ or -)</label>
              <input
                type="number"
                required
                value={adjustment}
                onChange={(e) => setAdjustment(e.target.value)}
                placeholder="+25 or -10"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg font-bold"
              />
            </div>
            <div>
              <label className="block font-bold text-stone-700 mb-1">Reason / Note</label>
              <input
                type="text"
                required
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={actionLoading}
              className="bg-stone-900 hover:bg-amber-600 text-white font-bold text-xs uppercase px-5 py-2.5 rounded-lg transition-colors"
            >
              {actionLoading ? "Saving..." : "Confirm Stock Change"}
            </button>
            <button
              type="button"
              onClick={() => setSelectedVariant(null)}
              className="text-stone-500 font-bold text-xs px-4 py-2 hover:text-stone-800"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase font-black tracking-wider">
            <tr>
              <th className="py-3.5 px-4">Product Name</th>
              <th className="py-3.5 px-4">Variant Weight</th>
              <th className="py-3.5 px-4">SKU</th>
              <th className="py-3.5 px-4">Selling Price</th>
              <th className="py-3.5 px-4">Current Stock</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Stock Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 font-medium text-stone-800">
            {loading ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-stone-400">Loading inventory data...</td>
              </tr>
            ) : variants.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-stone-400">No inventory records found.</td>
              </tr>
            ) : (
              variants.map((v) => (
                <tr key={v.id} className="hover:bg-stone-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-stone-900">
                    {v.product?.name}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-amber-800">
                    {v.weight}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-stone-500">
                    {v.sku}
                  </td>
                  <td className="py-3.5 px-4 font-black text-stone-900">
                    {formatINR(v.price)}
                  </td>
                  <td className="py-3.5 px-4 font-black text-stone-950 text-sm">
                    {v.stock}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                        v.stock <= 0
                          ? "bg-red-100 text-red-800"
                          : v.stock <= 15
                          ? "bg-amber-100 text-amber-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {v.stock <= 0 ? "Out of Stock" : v.stock <= 15 ? "Low Stock" : "In Stock"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedVariant(v)}
                      className="bg-stone-100 hover:bg-stone-900 hover:text-white font-bold text-[11px] uppercase px-3 py-1.5 rounded-lg transition-colors border border-stone-200"
                    >
                      Adjust Stock
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
