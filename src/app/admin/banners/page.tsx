"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Plus,
  Trash2,
  Edit2,
  Upload,
  Check,
  Eye,
  EyeOff,
  ExternalLink,
  X,
  Sparkles,
} from "lucide-react";

interface BannerItem {
  id: string;
  title: string;
  subtitle: string | null;
  image: string;
  mobileImage?: string | null;
  link: string;
  ctaText: string;
  badgeText: string | null;
  type: string;
  displayOrder: number;
  isActive: boolean;
}

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState<BannerItem | null>(null);

  // Uploading state
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    image: "/images/products/organichy-tub-front.png",
    link: "/shop",
    ctaText: "SHOP NOW",
    badgeText: "⭐ 4.9/5 RATED BY ATHLETES",
    type: "HERO",
    displayOrder: 1,
    isActive: true,
  });

  const loadBanners = () => {
    fetch("/api/admin/banners")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.banners) setBanners(data.banners);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadBanners();
  }, []);

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    isEdit: boolean = false
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setUploadError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        if (isEdit && editingBanner) {
          setEditingBanner({ ...editingBanner, image: data.url });
        } else {
          setForm((prev) => ({ ...prev, image: data.url }));
        }
      } else {
        setUploadError(data.error || "Failed to upload image.");
      }
    } catch (err) {
      setUploadError("Network error while uploading image.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/admin/banners", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setShowAddForm(false);
      setForm({
        title: "",
        subtitle: "",
        image: "/images/products/organichy-tub-front.png",
        link: "/shop",
        ctaText: "SHOP NOW",
        badgeText: "⭐ 4.9/5 RATED BY ATHLETES",
        type: "HERO",
        displayOrder: banners.length + 1,
        isActive: true,
      });
      loadBanners();
    } else {
      const data = await res.json();
      alert(data.error || "Failed to create banner.");
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBanner) return;

    const res = await fetch("/api/admin/banners", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingBanner),
    });

    if (res.ok) {
      setEditingBanner(null);
      loadBanners();
    } else {
      const data = await res.json();
      alert(data.error || "Failed to update banner.");
    }
  };

  const handleToggleActive = async (banner: BannerItem) => {
    await fetch("/api/admin/banners", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: banner.id, isActive: !banner.isActive }),
    });
    loadBanners();
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete banner "${title}"?`)) return;
    await fetch(`/api/admin/banners?id=${id}`, { method: "DELETE" });
    loadBanners();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight uppercase">
            Homepage Banners &amp; Promotions
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Configure, edit, and reorder hero carousel slides and marketing announcements
          </p>
        </div>
        <button
          onClick={() => {
            setShowAddForm(!showAddForm);
            setEditingBanner(null);
          }}
          className="bg-stone-900 hover:bg-amber-600 text-white font-bold text-xs uppercase px-5 py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>{showAddForm ? "Close Form" : "Add New Slide"}</span>
        </button>
      </div>

      {/* Add New Slide Form */}
      {showAddForm && (
        <form
          onSubmit={handleCreate}
          className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4 max-w-2xl text-xs"
        >
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h3 className="font-black uppercase text-stone-900 tracking-wider">
              Add New Hero Banner Slide
            </h3>
            <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded">
              Hero Section
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block font-bold text-stone-700 mb-1">
                Banner Headline *
              </label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. INDIA'S #1 DARK CHOCOLATE PEANUT BUTTER"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg font-black uppercase text-xs focus:outline-none focus:border-amber-600"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">
                Subheadline / Highlights
              </label>
              <input
                type="text"
                value={form.subtitle}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                placeholder="32g Protein per 100g | Zero Palm Oil | 100% Roasted"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs focus:outline-none focus:border-amber-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Badge Tag Text
                </label>
                <input
                  type="text"
                  value={form.badgeText}
                  onChange={(e) => setForm({ ...form, badgeText: e.target.value })}
                  placeholder="⭐ 4.9/5 RATED BY ATHLETES"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs focus:outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  value={form.displayOrder}
                  onChange={(e) =>
                    setForm({ ...form, displayOrder: parseInt(e.target.value) || 0 })
                  }
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs focus:outline-none focus:border-amber-600"
                />
              </div>
            </div>

            {/* Banner Image Upload & Preview */}
            <div className="space-y-2 p-3 bg-stone-50 rounded-xl border border-stone-200">
              <label className="block font-bold text-stone-800">
                Banner Product Image *
              </label>
              <div className="flex items-center gap-3">
                <label className="cursor-pointer bg-white hover:bg-stone-100 border border-stone-300 rounded-xl px-4 py-2 flex items-center gap-2 font-bold text-stone-800 transition-colors shadow-sm">
                  <Upload className="w-4 h-4 text-stone-600" />
                  <span>{uploadingImage ? "Uploading..." : "Upload Photo"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, false)}
                    disabled={uploadingImage}
                    className="hidden"
                  />
                </label>
                <input
                  type="text"
                  required
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="/images/products/..."
                  className="flex-1 px-3 py-2 border border-stone-300 rounded-lg font-mono text-[11px] bg-white focus:outline-none focus:border-amber-600"
                />
              </div>

              {form.image && (
                <div className="flex items-center gap-3 pt-2">
                  <div className="relative w-16 h-16 bg-white rounded-lg border border-stone-200 overflow-hidden shrink-0 flex items-center justify-center p-1 shadow-sm">
                    <Image
                      src={form.image}
                      alt="Banner Preview"
                      fill
                      sizes="64px"
                      className="object-contain p-1"
                      unoptimized={true}
                    />
                  </div>
                  <p className="text-[11px] text-stone-500">Image loaded for banner.</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Target Link
                </label>
                <input
                  type="text"
                  value={form.link}
                  onChange={(e) => setForm({ ...form, link: e.target.value })}
                  placeholder="/shop or /product/slug"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg font-mono text-xs focus:outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Button CTA Text
                </label>
                <input
                  type="text"
                  value={form.ctaText}
                  onChange={(e) => setForm({ ...form, ctaText: e.target.value })}
                  placeholder="SHOP NOW"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg uppercase font-bold text-xs focus:outline-none focus:border-amber-600"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 border border-stone-300 rounded-lg font-bold text-stone-600 hover:bg-stone-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploadingImage}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold uppercase px-6 py-2 rounded-lg transition-colors shadow-sm disabled:opacity-50"
            >
              Publish Banner
            </button>
          </div>
        </form>
      )}

      {/* Edit Banner Modal */}
      {editingBanner && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-5 text-xs animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase text-amber-700 tracking-wider">
                  EDIT HOMEPAGE SLIDE
                </span>
                <h3 className="text-lg sm:text-xl font-black text-stone-900 uppercase">
                  {editingBanner.title}
                </h3>
              </div>
              <button
                onClick={() => setEditingBanner(null)}
                className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Banner Headline *
                </label>
                <input
                  type="text"
                  required
                  value={editingBanner.title}
                  onChange={(e) =>
                    setEditingBanner({ ...editingBanner, title: e.target.value })
                  }
                  className="w-full px-3 py-2.5 border border-stone-300 rounded-xl font-black uppercase text-xs focus:outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Subheadline / Highlights
                </label>
                <input
                  type="text"
                  value={editingBanner.subtitle || ""}
                  onChange={(e) =>
                    setEditingBanner({ ...editingBanner, subtitle: e.target.value })
                  }
                  className="w-full px-3 py-2.5 border border-stone-300 rounded-xl text-xs focus:outline-none focus:border-amber-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Badge Tag Text
                  </label>
                  <input
                    type="text"
                    value={editingBanner.badgeText || ""}
                    onChange={(e) =>
                      setEditingBanner({ ...editingBanner, badgeText: e.target.value })
                    }
                    className="w-full px-3 py-2.5 border border-stone-300 rounded-xl text-xs focus:outline-none focus:border-amber-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={editingBanner.displayOrder}
                    onChange={(e) =>
                      setEditingBanner({
                        ...editingBanner,
                        displayOrder: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2.5 border border-stone-300 rounded-xl text-xs focus:outline-none focus:border-amber-600"
                  />
                </div>
              </div>

              {/* Banner Image Upload & Preview in Modal */}
              <div className="space-y-2 p-3.5 bg-stone-50 rounded-2xl border border-stone-200">
                <label className="block font-bold text-stone-800">
                  Banner Image *
                </label>
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer bg-white hover:bg-stone-100 border border-stone-300 rounded-xl px-4 py-2 flex items-center gap-2 font-bold text-stone-800 transition-colors shadow-sm shrink-0">
                    <Upload className="w-4 h-4 text-stone-600" />
                    <span>{uploadingImage ? "Uploading..." : "Replace Image"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, true)}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>
                  <input
                    type="text"
                    required
                    value={editingBanner.image}
                    onChange={(e) =>
                      setEditingBanner({ ...editingBanner, image: e.target.value })
                    }
                    className="flex-1 px-3 py-2 border border-stone-300 rounded-lg font-mono text-[11px] bg-white focus:outline-none focus:border-amber-600"
                  />
                </div>

                {editingBanner.image && (
                  <div className="flex items-center gap-3 pt-2">
                    <div className="relative w-20 h-20 bg-white rounded-xl border border-stone-200 overflow-hidden shrink-0 flex items-center justify-center p-1 shadow-sm">
                      <Image
                        src={editingBanner.image}
                        alt="Banner Preview"
                        fill
                        sizes="80px"
                        className="object-contain p-1"
                        unoptimized={true}
                      />
                    </div>
                    <p className="text-[11px] text-stone-500">
                      Live preview of updated hero slide image.
                    </p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Target Link
                  </label>
                  <input
                    type="text"
                    value={editingBanner.link}
                    onChange={(e) =>
                      setEditingBanner({ ...editingBanner, link: e.target.value })
                    }
                    className="w-full px-3 py-2.5 border border-stone-300 rounded-xl font-mono text-xs focus:outline-none focus:border-amber-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Button CTA Text
                  </label>
                  <input
                    type="text"
                    value={editingBanner.ctaText}
                    onChange={(e) =>
                      setEditingBanner({ ...editingBanner, ctaText: e.target.value })
                    }
                    className="w-full px-3 py-2.5 border border-stone-300 rounded-xl uppercase font-bold text-xs focus:outline-none focus:border-amber-600"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <label className="flex items-center gap-2 font-bold text-stone-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingBanner.isActive}
                    onChange={(e) =>
                      setEditingBanner({
                        ...editingBanner,
                        isActive: e.target.checked,
                      })
                    }
                    className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-stone-300"
                  />
                  <span>Active (Displayed on Homepage)</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setEditingBanner(null)}
                  className="px-5 py-2.5 border border-stone-300 rounded-xl font-bold text-stone-600 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadingImage}
                  className="bg-stone-900 hover:bg-amber-600 text-white font-bold uppercase px-7 py-2.5 rounded-xl transition-all shadow-md disabled:opacity-50"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Banners List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center text-xs text-stone-400">Loading banners...</div>
        ) : banners.length === 0 ? (
          <div className="p-12 text-center space-y-2 bg-white rounded-2xl border border-stone-200">
            <p className="text-sm font-bold text-stone-600">No banners found.</p>
            <p className="text-xs text-stone-400">Click &quot;Add New Slide&quot; to create your first hero carousel banner.</p>
          </div>
        ) : (
          banners.map((b) => (
            <div
              key={b.id}
              className={`p-5 bg-white rounded-2xl border transition-all shadow-sm flex flex-col sm:flex-row items-center gap-6 justify-between ${
                b.isActive ? "border-stone-200" : "border-stone-200 opacity-60 bg-stone-50"
              }`}
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="relative w-20 h-20 bg-stone-900 rounded-xl overflow-hidden shrink-0 flex items-center justify-center p-2 shadow-inner">
                  <Image
                    src={b.image}
                    alt={b.title}
                    fill
                    sizes="80px"
                    className="object-contain p-1"
                    unoptimized={true}
                  />
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-black bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {b.badgeText || "HERO SLIDE"}
                    </span>
                    <span className="text-[10px] font-mono bg-stone-100 text-stone-600 px-2 py-0.5 rounded">
                      Order: {b.displayOrder}
                    </span>
                    {!b.isActive && (
                      <span className="text-[10px] font-bold bg-stone-200 text-stone-600 px-2 py-0.5 rounded">
                        Inactive / Hidden
                      </span>
                    )}
                  </div>

                  <h3 className="font-black text-sm sm:text-base text-stone-900 uppercase truncate">
                    {b.title}
                  </h3>

                  {b.subtitle && (
                    <p className="text-xs text-stone-500 line-clamp-1">{b.subtitle}</p>
                  )}

                  <p className="text-[11px] font-mono text-amber-700">
                    CTA: &ldquo;{b.ctaText}&rdquo; → {b.link}
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 shrink-0">
                {/* Active / Inactive Toggle */}
                <button
                  onClick={() => handleToggleActive(b)}
                  className={`p-2 rounded-xl transition-colors border ${
                    b.isActive
                      ? "text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100"
                      : "text-stone-400 bg-stone-100 border-stone-200 hover:bg-stone-200"
                  }`}
                  title={b.isActive ? "Hide slide from homepage" : "Show slide on homepage"}
                >
                  {b.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>

                {/* Edit Button */}
                <button
                  onClick={() => setEditingBanner(b)}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-stone-900 hover:bg-amber-600 text-white font-bold text-xs rounded-xl transition-colors shadow-sm"
                  title="Edit Slide"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>

                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(b.id, b.title)}
                  className="p-2 text-stone-400 hover:text-red-600 rounded-xl hover:bg-red-50 border border-transparent hover:border-red-100 transition-colors"
                  title="Delete Slide"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
