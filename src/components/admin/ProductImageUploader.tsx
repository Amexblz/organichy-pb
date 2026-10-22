"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import {
  Upload,
  Image as ImageIcon,
  Trash2,
  Star,
  Plus,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

export interface ProductPhoto {
  url: string;
  altText?: string;
  isPrimary?: boolean;
}

interface ProductImageUploaderProps {
  images: ProductPhoto[];
  onChange: (images: ProductPhoto[]) => void;
}

const BRAND_PRESET_IMAGES = [
  { url: "/images/products/organichy-tub-front.png", label: "Flagship 32g Tub Front" },
  { url: "/images/products/organichy-jar.png", label: "Classic Glass Jar View" },
  { url: "/images/products/chocolate-crunchy-half-kg.png", label: "Chocolate Crunchy 500g" },
  { url: "/images/products/organichy-nutrition.png", label: "Nutrition Facts Table" },
  { url: "/images/products/organichy-back.png", label: "Ingredients Back View" },
  { url: "/images/products/organichy-lid.png", label: "Golden Seal Brand Lid" },
];

export default function ProductImageUploader({
  images,
  onChange,
}: ProductImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [customUrl, setCustomUrl] = useState("");
  const [showPresets, setShowPresets] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to upload file(s)");
      }

      const newPhotos: ProductPhoto[] = (data.images || [data]).map(
        (img: any, idx: number) => ({
          url: img.url,
          altText: img.altText || "Product photo",
          isPrimary: images.length === 0 && idx === 0,
        })
      );

      onChange([...images, ...newPhotos]);
    } catch (err: any) {
      setError(err.message || "Failed to upload image.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    // If we removed the primary photo and photos remain, set the first as primary
    if (updated.length > 0 && !updated.some((p) => p.isPrimary)) {
      updated[0].isPrimary = true;
    }
    onChange(updated);
  };

  const handleSetPrimary = (index: number) => {
    const updated = images.map((img, i) => ({
      ...img,
      isPrimary: i === index,
    }));
    // Move the primary photo to the front of the list
    const primaryImg = updated.splice(index, 1)[0];
    updated.unshift(primaryImg);
    onChange(updated);
  };

  const handleMove = (index: number, direction: "left" | "right") => {
    const targetIdx = direction === "left" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= images.length) return;

    const updated = [...images];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;

    // First item is always primary
    updated.forEach((img, i) => {
      img.isPrimary = i === 0;
    });

    onChange(updated);
  };

  const handleAddCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrl.trim()) return;

    const newPhoto: ProductPhoto = {
      url: customUrl.trim(),
      altText: "Product photo",
      isPrimary: images.length === 0,
    };

    onChange([...images, newPhoto]);
    setCustomUrl("");
  };

  const handleSelectPreset = (presetUrl: string, label: string) => {
    // Avoid exact duplicate
    if (images.some((p) => p.url === presetUrl)) {
      return;
    }
    const newPhoto: ProductPhoto = {
      url: presetUrl,
      altText: label,
      isPrimary: images.length === 0,
    };
    onChange([...images, newPhoto]);
  };

  return (
    <div className="space-y-4">
      {/* Upload Drag & Drop Box */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
          uploading
            ? "border-amber-400 bg-amber-50/50 cursor-wait"
            : "border-stone-300 hover:border-amber-500 hover:bg-stone-50"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/png,image/jpeg,image/webp,image/avif,image/gif"
          onChange={handleFileUpload}
          disabled={uploading}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 shadow-sm">
            {uploading ? (
              <Loader2 className="w-6 h-6 animate-spin text-amber-600" />
            ) : (
              <Upload className="w-6 h-6" />
            )}
          </div>
          <div>
            <p className="text-xs sm:text-sm font-extrabold text-stone-900">
              {uploading ? "Uploading Product Photos..." : "Click or drag photos to upload"}
            </p>
            <p className="text-[11px] text-stone-500 mt-0.5">
              Supports PNG, JPG, JPEG, WEBP or AVIF (Up to 10MB each)
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-semibold text-red-600">
          {error}
        </div>
      )}

      {/* Uploaded Gallery Grid */}
      {images.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-stone-700">
            <span>Attached Photos ({images.length})</span>
            <span className="text-[11px] text-stone-500 font-normal">
              First photo is the primary store cover
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {images.map((img, idx) => {
              const isFirst = idx === 0 || img.isPrimary;
              return (
                <div
                  key={idx}
                  className={`relative group bg-stone-50 rounded-xl border p-2 flex flex-col items-center justify-between transition-all ${
                    isFirst
                      ? "border-amber-500 bg-amber-50/20 ring-2 ring-amber-400/30"
                      : "border-stone-200 hover:border-stone-400"
                  }`}
                >
                  {/* Primary Badge */}
                  {isFirst && (
                    <div className="absolute top-2 left-2 z-10 bg-amber-500 text-stone-950 text-[10px] font-black uppercase px-2 py-0.5 rounded-full shadow flex items-center gap-1">
                      <Star className="w-3 h-3 fill-stone-950" />
                      <span>Primary</span>
                    </div>
                  )}

                  {/* Image Thumbnail */}
                  <div className="relative w-full h-32 flex items-center justify-center overflow-hidden rounded-lg bg-white border border-stone-100">
                    <Image
                      src={img.url}
                      alt={img.altText || `Photo ${idx + 1}`}
                      fill
                      sizes="180px"
                      className="object-contain p-2"
                    />
                  </div>

                  {/* Controls Toolbar */}
                  <div className="w-full flex items-center justify-between pt-2 border-t border-stone-200/60 mt-2 text-stone-600">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMove(idx, "left")}
                        className="p-1 rounded hover:bg-stone-200 disabled:opacity-20 transition-colors"
                        title="Move left"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === images.length - 1}
                        onClick={() => handleMove(idx, "right")}
                        className="p-1 rounded hover:bg-stone-200 disabled:opacity-20 transition-colors"
                        title="Move right"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      {!isFirst && (
                        <button
                          type="button"
                          onClick={() => handleSetPrimary(idx)}
                          className="text-[10px] font-bold text-amber-700 hover:text-amber-800 bg-amber-100 hover:bg-amber-200 px-1.5 py-0.5 rounded transition-colors"
                          title="Make Primary Cover Photo"
                        >
                          Make Cover
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemove(idx)}
                        className="p-1 text-stone-400 hover:text-red-600 rounded transition-colors"
                        title="Delete photo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Alternative Options: Quick Presets or Direct URL */}
      <div className="pt-2 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <button
          type="button"
          onClick={() => setShowPresets(!showPresets)}
          className="font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1"
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>{showPresets ? "Hide Brand Asset Library" : "Select from Brand Assets Library"}</span>
        </button>

        {/* Custom URL Input */}
        <form onSubmit={handleAddCustomUrl} className="flex items-center gap-2">
          <input
            type="url"
            placeholder="Or enter Image URL (https://...)"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            className="px-2.5 py-1 text-xs border border-stone-300 rounded-lg w-52 focus:outline-none focus:border-amber-500"
          />
          <button
            type="submit"
            disabled={!customUrl.trim()}
            className="px-2.5 py-1 bg-stone-800 hover:bg-stone-900 disabled:opacity-40 text-white rounded-lg font-bold text-xs"
          >
            Add URL
          </button>
        </form>
      </div>

      {/* Brand Asset Library Drawer */}
      {showPresets && (
        <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
          <p className="text-[11px] font-extrabold uppercase tracking-wider text-stone-500">
            Available Brand Assets (Click to attach)
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {BRAND_PRESET_IMAGES.map((preset, i) => {
              const isSelected = images.some((p) => p.url === preset.url);
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelectPreset(preset.url, preset.label)}
                  disabled={isSelected}
                  className={`p-2 rounded-lg border text-center transition-all flex flex-col items-center justify-between ${
                    isSelected
                      ? "border-amber-500 bg-amber-50 opacity-60 cursor-default"
                      : "border-stone-200 hover:border-amber-500 bg-white hover:shadow-sm"
                  }`}
                >
                  <div className="relative w-16 h-16 mb-1">
                    <Image
                      src={preset.url}
                      alt={preset.label}
                      fill
                      sizes="64px"
                      className="object-contain"
                    />
                  </div>
                  <span className="text-[10px] font-bold text-stone-700 leading-tight">
                    {preset.label}
                  </span>
                  {isSelected && (
                    <span className="text-[9px] font-black text-amber-600 mt-1">
                      ✓ Attached
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
