"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Layers } from "lucide-react";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCat, setNewCat] = useState({ name: "", slug: "", description: "", image: "" });
  const [error, setError] = useState("");

  const loadCategories = () => {
    fetch("/api/admin/categories")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.categories) setCategories(data.categories);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleNameChange = (name: string) => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    setNewCat({ ...newCat, name, slug });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCat),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create category");
      } else {
        setShowAddForm(false);
        setNewCat({ name: "", slug: "", description: "", image: "" });
        loadCategories();
      }
    } catch (err) {
      setError("Error creating category");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete category "${name}"?`)) return;

    const res = await fetch(`/api/admin/categories?id=${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Failed to delete category");
    } else {
      loadCategories();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight uppercase">
            CATEGORIES
          </h1>
          <p className="text-xs text-stone-500">Organize and manage store collections</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-stone-900 hover:bg-amber-600 text-white font-bold text-xs uppercase px-5 py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleCreate} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4 max-w-xl">
          <h3 className="font-black text-xs uppercase text-stone-900 tracking-wider">
            Create Category
          </h3>
          {error && <p className="text-xs text-red-600 font-semibold">{error}</p>}
          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Category Name *</label>
              <input
                type="text"
                required
                value={newCat.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Protein Bars"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block font-bold text-stone-700 mb-1">Slug *</label>
              <input
                type="text"
                required
                value={newCat.slug}
                onChange={(e) => setNewCat({ ...newCat, slug: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg font-mono"
              />
            </div>
            <div>
              <label className="block font-bold text-stone-700 mb-1">Description</label>
              <input
                type="text"
                value={newCat.description}
                onChange={(e) => setNewCat({ ...newCat, description: e.target.value })}
                placeholder="Brief summary..."
                className="w-full px-3 py-2 border border-stone-300 rounded-lg"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="bg-stone-900 text-white font-bold text-xs uppercase px-5 py-2.5 rounded-lg hover:bg-amber-600 transition-colors"
              >
                Save Category
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="text-stone-500 font-bold text-xs px-4 py-2 hover:text-stone-800"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {categories.map((c) => (
          <div
            key={c.id}
            className="p-5 bg-white rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-black text-base text-stone-900">{c.name}</h3>
                <span className="bg-stone-100 text-stone-800 text-[11px] font-bold px-2 py-0.5 rounded-full">
                  {c._count?.products || 0} Products
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-1 font-mono">/collections/{c.slug}</p>
              {c.description && (
                <p className="text-xs text-stone-600 mt-2 line-clamp-2">{c.description}</p>
              )}
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
              <span className="text-[10px] font-bold text-amber-700 uppercase">
                Active on Storefront
              </span>
              <button
                onClick={() => handleDelete(c.id, c.name)}
                className="text-stone-400 hover:text-red-600 p-1 transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
