"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Video, Upload, ExternalLink, Check, Eye, EyeOff, Play } from "lucide-react";

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    videoUrl: "",
    thumbnailUrl: "",
    productLink: "/shop",
    tagText: "REEL SHOWCASE",
    displayOrder: 1,
    active: true,
  });

  const loadVideos = () => {
    fetch("/api/admin/videos")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.videos) setVideos(data.videos);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadVideos();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError("");

    try {
      const formData = new FormData();
      formData.append("video", file);

      const res = await fetch("/api/admin/upload-video", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setForm((prev) => ({
          ...prev,
          videoUrl: data.url,
          title: prev.title || file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
        }));
      } else {
        setUploadError(data.error || "Failed to upload video file.");
      }
    } catch (err) {
      setUploadError("Network error while uploading video.");
    } finally {
      setUploading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.videoUrl) {
      alert("Please upload a video or enter a valid video URL.");
      return;
    }

    const res = await fetch("/api/admin/videos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setShowAddForm(false);
      setForm({
        title: "",
        description: "",
        videoUrl: "",
        thumbnailUrl: "",
        productLink: "/shop",
        tagText: "REEL SHOWCASE",
        displayOrder: 1,
        active: true,
      });
      loadVideos();
    } else {
      const data = await res.json();
      alert(data.error || "Failed to save video advertisement.");
    }
  };

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    await fetch("/api/admin/videos", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, active: !currentActive }),
    });
    loadVideos();
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    await fetch(`/api/admin/videos?id=${id}`, { method: "DELETE" });
    loadVideos();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight uppercase flex items-center gap-2">
            <Video className="w-6 h-6 text-amber-600" />
            <span>Product Video Advertisements</span>
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Upload vertical 9:16 video reels shown at the bottom of the homepage on continuous loop.
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-stone-900 hover:bg-amber-600 text-white font-bold text-xs uppercase px-5 py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>{showAddForm ? "Close Form" : "Upload Video Ad"}</span>
        </button>
      </div>

      {showAddForm && (
        <form
          onSubmit={handleCreate}
          className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4 max-w-2xl text-xs"
        >
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h3 className="font-black uppercase text-stone-900 tracking-wider">
              Add New Product Video Reel
            </h3>
            <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded">
              Recommended: 9:16 Vertical Video (MP4/WebM)
            </span>
          </div>

          {/* Video upload input */}
          <div className="space-y-2">
            <label className="font-bold text-stone-700 block">
              1. Upload Video File (.mp4, .webm, .mov)
            </label>
            <div className="flex items-center gap-3">
              <label className="cursor-pointer bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-xl px-4 py-2.5 flex items-center gap-2 font-bold text-stone-800 transition-colors">
                <Upload className="w-4 h-4 text-stone-600" />
                <span>{uploading ? "Uploading..." : "Choose Video File"}</span>
                <input
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime,video/ogg"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
              {form.videoUrl && (
                <span className="text-emerald-600 font-bold flex items-center gap-1 text-[11px]">
                  <Check className="w-4 h-4" /> Video uploaded ready
                </span>
              )}
            </div>
            {uploadError && (
              <p className="text-red-500 font-medium text-[11px]">{uploadError}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="font-bold text-stone-700 block">
              Or Direct Video URL (Relative or CDN URL)
            </label>
            <input
              type="text"
              value={form.videoUrl}
              onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
              placeholder="/uploads/videos/sample.mp4 or https://cdn.example.com/video.mp4"
              required
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-amber-600 font-mono text-xs"
            />
          </div>

          {/* Preview of video */}
          {form.videoUrl && (
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center gap-4">
              <div className="w-24 aspect-[9/16] bg-black rounded-lg overflow-hidden shrink-0 shadow-inner">
                <video
                  src={form.videoUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-1">
                <p className="font-bold text-stone-900">Vertical Card Preview</p>
                <p className="text-stone-500 text-[11px]">
                  This is how the video will continuously loop in the vertical card carousel on the homepage.
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-stone-700 block">Ad Title / Product Name</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. 100% Roasted Dark Crunchy Peanut Butter"
                required
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-amber-600"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-stone-700 block">Badge Tag Text</label>
              <input
                type="text"
                value={form.tagText}
                onChange={(e) => setForm({ ...form, tagText: e.target.value })}
                placeholder="e.g. BESTSELLER or 30G PROTEIN"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-amber-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-stone-700 block">Product Destination Link</label>
              <input
                type="text"
                value={form.productLink}
                onChange={(e) => setForm({ ...form, productLink: e.target.value })}
                placeholder="e.g. /shop or /product/slug"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-amber-600"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-stone-700 block">Display Order</label>
              <input
                type="number"
                value={form.displayOrder}
                onChange={(e) => setForm({ ...form, displayOrder: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-amber-600"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-stone-700 block">Description / Caption (Optional)</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={2}
              placeholder="e.g. Watch how our handpicked Gujarat peanuts get slow-roasted and ground to velvety perfection."
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-amber-600"
            />
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
              disabled={uploading || !form.videoUrl}
              className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition-colors shadow-sm disabled:opacity-50"
            >
              Save & Publish Video
            </button>
          </div>
        </form>
      )}

      {/* Videos List */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-stone-200 flex items-center justify-between">
          <h2 className="font-black text-sm text-stone-900 uppercase tracking-wider">
            Active Video Advertisements ({videos.length})
          </h2>
          <span className="text-xs text-stone-500">
            Displayed on Homepage just above footer
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-stone-400 text-xs">Loading videos...</div>
        ) : videos.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Video className="w-10 h-10 text-stone-300 mx-auto" />
            <p className="text-sm font-bold text-stone-600">No advertisement videos uploaded yet.</p>
            <p className="text-xs text-stone-400">Click &quot;Upload Video Ad&quot; to add your first product showcase reel.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
            {videos.map((vid) => (
              <div
                key={vid.id}
                className="bg-stone-900 rounded-2xl overflow-hidden border border-stone-800 shadow-md flex flex-col group"
              >
                {/* 9:16 Vertical Card Video container */}
                <div className="relative aspect-[9/16] bg-black overflow-hidden">
                  <video
                    src={vid.videoUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Top badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
                    <span className="bg-amber-500/90 backdrop-blur-md text-stone-950 font-black text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {vid.tagText || "ORGANICHY"}
                    </span>
                    <span className="bg-stone-900/80 backdrop-blur-md text-white font-mono text-[10px] px-2 py-0.5 rounded">
                      Order: {vid.displayOrder}
                    </span>
                  </div>

                  {/* Bottom overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-black/20 pointer-events-none" />

                  {/* Title & Info inside overlay */}
                  <div className="absolute bottom-3 left-3 right-3 text-white z-10 space-y-1">
                    <h4 className="font-black text-sm leading-tight drop-shadow-md line-clamp-2">
                      {vid.title}
                    </h4>
                    {vid.description && (
                      <p className="text-[11px] text-stone-300 line-clamp-2 opacity-90">
                        {vid.description}
                      </p>
                    )}
                    <div className="pt-1 flex items-center gap-1.5 text-[10px] text-amber-400 font-bold">
                      <ExternalLink className="w-3 h-3" />
                      <span className="truncate">{vid.productLink}</span>
                    </div>
                  </div>
                </div>

                {/* Admin controls card footer */}
                <div className="p-3 bg-stone-950 border-t border-stone-800 flex items-center justify-between text-xs">
                  <button
                    onClick={() => handleToggleActive(vid.id, vid.active)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-bold text-[11px] transition-colors ${
                      vid.active
                        ? "bg-emerald-950/80 text-emerald-400 border border-emerald-800"
                        : "bg-stone-800 text-stone-400 border border-stone-700"
                    }`}
                  >
                    {vid.active ? (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span>Active</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Hidden</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleDelete(vid.id, vid.title)}
                    className="p-1.5 text-stone-400 hover:text-red-400 hover:bg-stone-900 rounded-lg transition-colors"
                    title="Delete Video"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
