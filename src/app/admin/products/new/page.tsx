"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, Check } from "lucide-react";
import ProductImageUploader, { ProductPhoto } from "@/components/admin/ProductImageUploader";

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    slug: "",
    categoryId: "",
    basePrice: "349",
    baseMrp: "449",
    shortDescription: "",
    description: "",
    texture: "Crunchy",
    flavor: "Dark Chocolate",
    ingredients: "Roasted Peanuts (85%), Dark Cocoa Solids (10%), Brown Sugar, Sea Salt.",
    benefits: "Supercharges Muscle Recovery\nZero Palm Oil Purity\nSustained Athletic Stamina",
    directions: "Stir well before use. Spread on toast or blend into shakes.",
    isBestseller: true,
    isHighProtein: true,
    isChocolate: true,
    isNatural: false,
    images: [] as ProductPhoto[],
    variants: [
      { weight: "500g", price: "349", mrp: "449", stock: "100", sku: "ORG-NEW-500G" },
      { weight: "1kg", price: "649", mrp: "799", stock: "60", sku: "ORG-NEW-1KG" },
    ],
  });

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.categories) {
          setCategories(data.categories);
          if (data.categories.length > 0) {
            setForm((prev) => ({ ...prev, categoryId: data.categories[0].id }));
          }
        }
      });
  }, []);

  const handleNameChange = (name: string) => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    setForm({ ...form, name, slug });
  };

  const handleAddVariant = () => {
    setForm({
      ...form,
      variants: [
        ...form.variants,
        { weight: "1.25kg", price: "799", mrp: "999", stock: "40", sku: `ORG-VAR-${Date.now().toString().slice(-4)}` },
      ],
    });
  };

  const handleRemoveVariant = (index: number) => {
    setForm({
      ...form,
      variants: form.variants.filter((_, i) => i !== index),
    });
  };

  const handleVariantChange = (index: number, field: string, value: string) => {
    const newVars = [...form.variants];
    newVars[index] = { ...newVars[index], [field]: value };
    setForm({ ...form, variants: newVars });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.slug || !form.categoryId) {
      setError("Please fill in the product name, slug, and select a category.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create product.");
      } else {
        router.push("/admin/products");
      }
    } catch (err: any) {
      setError("An unexpected error occurred while saving the product.");
    } finally {
      setLoading(false);
    }
  };

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
          Create New Product
        </h1>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-semibold text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Details Card */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
          <h2 className="font-black text-xs uppercase text-stone-900 tracking-wider">
            1. Basic Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Product Title *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Organichy Dark Chocolate Crunchy"
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

            <div>
              <label className="block font-bold text-stone-700 mb-1">Base Price (₹) *</label>
              <input
                type="number"
                required
                value={form.basePrice}
                onChange={(e) => setForm({ ...form, basePrice: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-xl font-bold"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="block font-bold text-stone-700 mb-1">Short Punchy Description</label>
            <input
              type="text"
              value={form.shortDescription}
              onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
              placeholder="32g Protein | Premium Dark Cocoa | Zero Trans Fat"
              className="w-full px-3 py-2 border border-stone-300 rounded-xl"
            />
          </div>

          <div className="text-xs">
            <label className="block font-bold text-stone-700 mb-1">Full Product Story & Description</label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2 border border-stone-300 rounded-xl"
            />
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

        {/* Variants Card */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-black text-xs uppercase text-stone-900 tracking-wider">
              3. Product Variants & Package Sizes
            </h2>
            <button
              type="button"
              onClick={handleAddVariant}
              className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Package Size</span>
            </button>
          </div>

          <div className="space-y-3">
            {form.variants.map((v, idx) => (
              <div key={idx} className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex flex-wrap gap-3 items-center text-xs">
                <div className="w-24">
                  <label className="block text-[10px] font-bold text-stone-500 uppercase">Weight</label>
                  <input
                    type="text"
                    value={v.weight}
                    onChange={(e) => handleVariantChange(idx, "weight", e.target.value)}
                    className="w-full px-2 py-1.5 border border-stone-300 rounded-lg bg-white"
                  />
                </div>
                <div className="w-24">
                  <label className="block text-[10px] font-bold text-stone-500 uppercase">Price (₹)</label>
                  <input
                    type="number"
                    value={v.price}
                    onChange={(e) => handleVariantChange(idx, "price", e.target.value)}
                    className="w-full px-2 py-1.5 border border-stone-300 rounded-lg bg-white font-bold"
                  />
                </div>
                <div className="w-24">
                  <label className="block text-[10px] font-bold text-stone-500 uppercase">MRP (₹)</label>
                  <input
                    type="number"
                    value={v.mrp}
                    onChange={(e) => handleVariantChange(idx, "mrp", e.target.value)}
                    className="w-full px-2 py-1.5 border border-stone-300 rounded-lg bg-white"
                  />
                </div>
                <div className="w-20">
                  <label className="block text-[10px] font-bold text-stone-500 uppercase">Stock</label>
                  <input
                    type="number"
                    value={v.stock}
                    onChange={(e) => handleVariantChange(idx, "stock", e.target.value)}
                    className="w-full px-2 py-1.5 border border-stone-300 rounded-lg bg-white"
                  />
                </div>
                <div className="flex-1 min-w-[120px]">
                  <label className="block text-[10px] font-bold text-stone-500 uppercase">SKU</label>
                  <input
                    type="text"
                    value={v.sku}
                    onChange={(e) => handleVariantChange(idx, "sku", e.target.value)}
                    className="w-full px-2 py-1.5 border border-stone-300 rounded-lg bg-white font-mono"
                  />
                </div>
                {form.variants.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveVariant(idx)}
                    className="p-1.5 text-stone-400 hover:text-red-600 mt-3"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Nutritional & Ingredients */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4 text-xs">
          <h2 className="font-black uppercase text-stone-900 tracking-wider">
            4. Nutrition & Clean Label Details
          </h2>
          <div>
            <label className="block font-bold text-stone-700 mb-1">Ingredients</label>
            <input
              type="text"
              value={form.ingredients}
              onChange={(e) => setForm({ ...form, ingredients: e.target.value })}
              className="w-full px-3 py-2 border border-stone-300 rounded-xl"
            />
          </div>
          <div>
            <label className="block font-bold text-stone-700 mb-1">Athletic Benefits (Bullet points)</label>
            <textarea
              rows={3}
              value={form.benefits}
              onChange={(e) => setForm({ ...form, benefits: e.target.value })}
              className="w-full px-3 py-2 border border-stone-300 rounded-xl"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-stone-900 hover:bg-amber-600 text-white font-black text-sm uppercase py-4 rounded-xl transition-colors shadow-xl disabled:opacity-50"
        >
          {loading ? "Publishing Product..." : "Save & Publish Product"}
        </button>
      </form>
    </div>
  );
}
