"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Search, Edit2, Trash2, ExternalLink, Star } from "lucide-react";
import { formatINR } from "@/lib/utils";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const loadProducts = () => {
    fetch(`/api/admin/products?search=${encodeURIComponent(search)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.products) setProducts(data.products);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProducts();
  }, [search]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        loadProducts();
      } else {
        alert("Failed to delete product.");
      }
    } catch (e) {
      alert("Error deleting product.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight uppercase">
            PRODUCT MANAGEMENT
          </h1>
          <p className="text-xs text-stone-500">Configure catalog, pricing, variants, and stock</p>
        </div>
        <Link
          href="/admin/products/new"
          className="bg-stone-900 hover:bg-amber-600 text-white font-bold text-xs uppercase px-5 py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product name, slug, or flavor..."
            className="w-full pl-9 pr-4 py-2.5 text-xs font-semibold bg-white border border-stone-300 rounded-xl focus:outline-none focus:border-amber-500 shadow-sm"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase font-black tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Product</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Base Price</th>
                <th className="py-3.5 px-4">Variants</th>
                <th className="py-3.5 px-4">Total Stock</th>
                <th className="py-3.5 px-4">Rating</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-medium text-stone-800">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-400">
                    Loading products catalog...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-400">
                    No products found.
                  </td>
                </tr>
              ) : (
                products.map((p) => {
                  const primaryImg = p.images?.[0]?.url || "/images/products/organichy-jar.png";
                  const totalStock = p.variants?.reduce((sum: number, v: any) => sum + v.stock, 0) || 0;

                  return (
                    <tr key={p.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 bg-stone-50 rounded-lg border border-stone-200 shrink-0 overflow-hidden flex items-center justify-center">
                            <Image
                              src={primaryImg}
                              alt={p.name}
                              fill
                              sizes="48px"
                              className="object-contain p-1"
                            />
                          </div>
                          <div>
                            <p className="font-extrabold text-stone-900 line-clamp-1">{p.name}</p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              {p.isBestseller && (
                                <span className="text-[9px] font-black bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded">
                                  BESTSELLER
                                </span>
                              )}
                              {p.isHighProtein && (
                                <span className="text-[9px] font-black bg-stone-900 text-amber-400 px-1.5 py-0.2 rounded">
                                  32G PROTEIN
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-stone-600 font-semibold">
                        {p.category?.name || "Uncategorized"}
                      </td>

                      <td className="py-3.5 px-4 font-black text-stone-900">
                        {formatINR(p.basePrice)}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="bg-stone-100 text-stone-800 font-bold px-2 py-0.5 rounded text-[11px]">
                          {p.variants?.length || 0} variant(s)
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`font-black px-2 py-0.5 rounded text-[11px] ${
                            totalStock <= 15
                              ? "bg-red-100 text-red-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {totalStock} units
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1 font-bold text-stone-900">
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />
                          <span>{p.rating.toFixed(1)}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/products/${p.slug}`}
                            target="_blank"
                            className="p-1.5 text-stone-400 hover:text-stone-900 transition-colors"
                            title="View on Storefront"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/admin/products/${p.id}/edit`}
                            className="p-1.5 text-stone-400 hover:text-amber-700 transition-colors"
                            title="Edit Product"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(p.id, p.name)}
                            className="p-1.5 text-stone-400 hover:text-red-600 transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
