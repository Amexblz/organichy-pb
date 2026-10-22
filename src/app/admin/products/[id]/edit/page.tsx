"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import ProductImageUploader, { ProductPhoto } from "@/components/admin/ProductImageUploader";

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    slug: "",
    categoryId: "",
    basePrice: "",
    baseMrp: "",
    shortDescription: "",
    description: "",
    texture: "Crunchy",
    flavor: "Dark Chocolate",
    ingredients: "",
    benefits: "",
    directions: "",
    isBestseller: false,
    isHighProtein: false,
    isChocolate: false,
    isNatural: false,
    active: true,
    images: [] as ProductPhoto[],
  });

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/categories").then((r) => r.json()),
      fetch(`/api/admin/products/${params.id}`).then((r) => r.json()),
    ]).then(([catData, prodData]) => {
      if (catData?.categories) setCategories(catData.categories);
      if (prodData?.product) {
        const p = prodData.product;
        setForm({
          name: p.name,
          slug: p.slug,
          categoryId: p.categoryId,
          basePrice: p.basePrice.toString(),
          baseMrp: p.baseMrp.toString(),
          shortDescription: p.shortDescription || "",
          description: p.description || "",
          texture: p.texture || "Crunchy",
          flavor: p.flavor || "Dark Chocolate",
          ingredients: p.ingredients || "",
          benefits: p.benefits || "",
          directions: p.directions || "",
          isBestseller: p.isBestseller,
          isHighProtein: p.isHighProtein,
          isChocolate: p.isChocolate,
          isNatural: p.isNatural,
          active: p.active,
          images: (p.images || []).map((img: any) => ({
            url: img.url,
            altText: img.altText || "",
            isPrimary: img.isPrimary,
          })),
        });
      }
      setLoading(false);
    });
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch(`/api/admin/products/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        router.push("/admin/products");
      } else {
        const d = await res.json();
        setError(d.error || "Failed to update product");
      }
    } catch (e) {
      setError("Error saving product");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-xs text-stone-400">Loading product data...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between pb-4 border-b border-stone-200">
        <Link
          href="/admin/products"
          className="flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-stone-900 uppercase"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </Link>
        <h1 className="text-xl font-black text-stone-900 uppercase">
          Edit Product: {form.name}
        </h1>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-semibold text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Product Title *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">URL Slug *</label>
              <input
                type="text"
                required
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-xl font-mono text-stone-600"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Category *</label>
              <select
                value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-xl"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Base Price (₹)</label>
                <input
                  type="number"
                  value={form.basePrice}
                  onChange={(e) => setForm({ ...form, basePrice: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl font-bold"
                />
              </div>
              <div>
                <label className="block font-bold text-stone-700 mb-1">Base MRP (₹)</label>
                <input
                  type="number"
                  value={form.baseMrp}
                  onChange={(e) => setForm({ ...form, baseMrp: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">Short Description</label>
            <input
              type="text"
              value={form.shortDescription}
              onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
              className="w-full px-3 py-2 border border-stone-300 rounded-xl"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">Full Description</label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2 border border-stone-300 rounded-xl"
            />
          </div>

          <div className="flex flex-wrap gap-4 pt-2">
            <label className="flex items-center gap-2 font-bold text-stone-700 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isBestseller}
                onChange={(e) => setForm({ ...form, isBestseller: e.target.checked })}
              />
              <span>Mark Bestseller</span>
            </label>
            <label className="flex items-center gap-2 font-bold text-stone-700 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isHighProtein}
                onChange={(e) => setForm({ ...form, isHighProtein: e.target.checked })}
              />
              <span>High Protein Badge (32g)</span>
            </label>
            <label className="flex items-center gap-2 font-bold text-stone-700 cursor-pointer">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm({ ...form, active: e.target.checked })}
              />
              <span>Published & Active on Storefront</span>
            </label>
          </div>
        </div>

        {/* Product Photos Card */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-black text-xs uppercase text-stone-900 tracking-wider">
              2. Product Photos & Gallery
            </h2>
            <span className="text-[11px] text-stone-500 font-semibold">
              Upload from computer or pick from brand library
            </span>
          </div>

          <ProductImageUploader
            images={form.images}
            onChange={(newImages) => setForm({ ...form, images: newImages })}
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-stone-900 hover:bg-amber-600 text-white font-black text-xs uppercase px-8 py-3.5 rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? "Saving Changes..." : "Save Product"}</span>
        </button>
      </form>
    </div>
  );
}
