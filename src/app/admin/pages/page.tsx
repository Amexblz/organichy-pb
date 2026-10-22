"use client";

import React, { useState, useEffect } from "react";
import { FileText, Save, CheckCircle2 } from "lucide-react";

export default function AdminCMSPages() {
  const [pages, setPages] = useState<any[]>([]);
  const [selectedSlug, setSelectedSlug] = useState("about-us");
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const pageSlugs = [
    { slug: "about-us", label: "About Us Page" },
    { slug: "faq", label: "FAQ Page" },
    { slug: "shipping-policy", label: "Shipping Policy" },
    { slug: "return-refund-policy", label: "Return & Refund Policy" },
    { slug: "privacy-policy", label: "Privacy Policy" },
    { slug: "terms-conditions", label: "Terms & Conditions" },
  ];

  const loadPage = (slug: string) => {
    setLoading(true);
    fetch(`/api/admin/cms?slug=${slug}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.page) {
          setTitle(data.page.title);
          setContent(data.page.content);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadPage(selectedSlug);
  }, [selectedSlug]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/admin/cms", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: selectedSlug, title, content }),
      });

      if (res.ok) {
        setMessage("Page content updated and published live!");
      }
    } catch (e) {
      setMessage("Error updating page.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="pb-4 border-b border-stone-200">
        <h1 className="text-2xl font-black text-stone-900 tracking-tight uppercase">
          WEBSITE CONTENT & CMS
        </h1>
        <p className="text-xs text-stone-500">Edit legal policies, About Us story, and FAQs without touching code</p>
      </div>

      {message && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-xs font-semibold text-green-700 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{message}</span>
        </div>
      )}

      {/* Selector Tabs */}
      <div className="flex flex-wrap gap-2">
        {pageSlugs.map((p) => (
          <button
            key={p.slug}
            onClick={() => setSelectedSlug(p.slug)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedSlug === p.slug
                ? "bg-stone-900 text-white shadow-sm"
                : "bg-white text-stone-700 border border-stone-200 hover:bg-stone-50"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Editor Form */}
      <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4 text-xs">
        <div>
          <label className="block font-bold text-stone-700 mb-1">Page Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-stone-300 rounded-xl font-bold"
          />
        </div>

        <div>
          <label className="block font-bold text-stone-700 mb-1">Page Content (Markdown / Plain Text)</label>
          <textarea
            rows={14}
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-3 py-2 border border-stone-300 rounded-xl font-mono text-xs leading-relaxed"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-stone-900 hover:bg-amber-600 text-white font-black text-xs uppercase px-6 py-3 rounded-xl transition-colors shadow-md flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? "Publishing..." : "Save & Update Live Page"}</span>
        </button>
      </form>
    </div>
  );
}
