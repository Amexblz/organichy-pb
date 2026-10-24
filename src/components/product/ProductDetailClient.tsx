"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Star,
  Heart,
  ShoppingCart,
  Zap,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  Award,
  ChevronDown,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatINR, calculateDiscount } from "@/lib/utils";
import PincodeChecker from "./PincodeChecker";
import NutritionTable from "./NutritionTable";

export default function ProductDetailClient({ product }: { product: any }) {
  const router = useRouter();
  const { addItem, toggleWishlist, isInWishlist } = useCart();

  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"desc" | "nutrition" | "ingredients" | "reviews">("desc");

  // Reviews state
  const [reviews, setReviews] = useState(product.reviews || []);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewMessage, setReviewMessage] = useState("");

  const variants = product.variants && product.variants.length > 0 ? product.variants : [];
  const activeVariant = variants[selectedVariantIndex] || {
    id: product.id,
    weight: "1kg",
    price: product.basePrice,
    mrp: product.baseMrp,
    stock: 50,
    sku: product.slug,
  };

  const images = product.images && product.images.length > 0 ? product.images : [{ url: "/images/products/organichy-jar.png" }];
  const currentImage = images[selectedImageIndex]?.url || images[0]?.url;

  const discountPercent = calculateDiscount(activeVariant.price, activeVariant.mrp);
  const inWishlist = isInWishlist(product.id);
  const isOutOfStock = activeVariant.stock <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addItem(
      {
        productId: product.id,
        variantId: activeVariant.id,
        name: product.name,
        variantLabel: `${activeVariant.weight}${activeVariant.flavor ? ` - ${activeVariant.flavor}` : ""}`,
        price: activeVariant.price,
        mrp: activeVariant.mrp,
        image: currentImage,
        stock: activeVariant.stock,
      },
      quantity
    );
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    handleAddToCart();
    router.push("/checkout");
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    setReviewSubmitting(true);
    setReviewMessage("");

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          rating: reviewRating,
          title: reviewTitle,
          comment: reviewComment,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setReviewMessage(data.error || "Failed to submit review");
      } else {
        setReviews([data.review, ...reviews]);
        setReviewTitle("");
        setReviewComment("");
        setReviewMessage("Thank you! Your review has been submitted successfully.");
      }
    } catch (err) {
      setReviewMessage("Error submitting review. Please try again.");
    } finally {
      setReviewSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
      {/* Left Column: Image Gallery (5 cols) */}
      <div className="lg:col-span-5 space-y-4">
        {/* Main Display Image */}
        <div className="relative aspect-square w-full bg-white border border-stone-200 rounded-3xl p-6 flex items-center justify-center overflow-hidden shadow-sm group">
          <Image
            src={currentImage}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 500px"
            className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
            priority
          />
          {discountPercent > 0 && (
            <div className="absolute top-4 left-4 bg-red-600 text-white font-black text-xs px-2.5 py-1 rounded-full uppercase shadow">
              {discountPercent}% OFF
            </div>
          )}
        </div>

        {/* Thumbnails Row */}
        {images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {images.map((img: any, idx: number) => (
              <button
                key={idx}
                onClick={() => setSelectedImageIndex(idx)}
                className={`relative w-20 h-20 rounded-xl bg-white border-2 p-1 overflow-hidden shrink-0 transition-all ${
                  selectedImageIndex === idx ? "border-amber-500 shadow-md" : "border-stone-200 hover:border-stone-400"
                }`}
              >
                <Image
                  src={img.url}
                  alt={img.altText || "thumbnail"}
                  fill
                  sizes="80px"
                  className="object-contain p-1"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right Column: Product Info & Buy Box (7 cols) */}
      <div className="lg:col-span-7 space-y-6">
        {/* Category & Rating */}
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-amber-700 uppercase tracking-wider">
              {product.category?.name || "Premium Peanut Butter"}
            </span>
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border transition-colors ${
                inWishlist
                  ? "bg-red-50 text-red-600 border-red-200"
                  : "bg-white text-stone-600 border-stone-200 hover:text-red-600"
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${inWishlist ? "fill-current" : ""}`} />
              <span>{inWishlist ? "Saved" : "Add to Wishlist"}</span>
            </button>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-stone-900 tracking-tight mt-1.5 leading-tight">
            {product.name}
          </h1>

          <div className="flex items-center gap-3 mt-2.5">
            <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-0.5 rounded text-xs font-black">
              <span>{product.rating.toFixed(1)}</span>
              <Star className="w-3.5 h-3.5 fill-current text-green-600" />
            </div>
            <span className="text-xs font-medium text-stone-500">
              ({reviews.length || product.reviewCount} customer reviews)
            </span>
            <span className="text-xs text-stone-300">|</span>
            <span className="text-xs font-bold text-amber-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
              100% Genuine Lab Certified
            </span>
          </div>
        </div>

        {/* Pricing Box */}
        <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 flex items-baseline gap-3">
          <span className="text-3xl sm:text-4xl font-black text-stone-950">
            {formatINR(activeVariant.price)}
          </span>
          {activeVariant.mrp > activeVariant.price && (
            <span className="text-base sm:text-lg text-stone-400 line-through font-medium">
              MRP: {formatINR(activeVariant.mrp)}
            </span>
          )}
          {discountPercent > 0 && (
            <span className="text-xs sm:text-sm font-extrabold text-green-700 bg-green-100 px-2.5 py-0.5 rounded-md">
              Save {discountPercent}% ({formatINR(activeVariant.mrp - activeVariant.price)})
            </span>
          )}
        </div>

        {/* Variant / Size Selection */}
        {variants.length > 0 && (
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-stone-900 tracking-wider">
              Select Package Size:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {variants.map((v: any, idx: number) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariantIndex(idx)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedVariantIndex === idx
                      ? "border-amber-500 bg-amber-50/60 shadow-sm ring-1 ring-amber-500"
                      : "border-stone-200 bg-white hover:border-stone-300"
                  }`}
                >
                  <p className="font-black text-sm text-stone-900">{v.weight}</p>
                  <p className="text-xs font-bold text-amber-800 mt-0.5">{formatINR(v.price)}</p>
                  <p className="text-[10px] text-stone-400">
                    {v.stock > 0 ? `${v.stock} in stock` : "Out of stock"}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity & CTA Buttons */}
        <div className="space-y-3 pt-2">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex items-center justify-between sm:justify-start border border-stone-300 rounded-xl bg-white shadow-sm overflow-hidden h-12">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-5 py-3 text-stone-600 hover:bg-stone-100 transition-colors font-bold text-base"
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="px-4 font-black text-sm text-stone-900 min-w-[36px] text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(Math.min(activeVariant.stock, quantity + 1))}
                className="px-5 py-3 text-stone-600 hover:bg-stone-100 transition-colors font-bold text-base"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="flex-1 bg-stone-900 hover:bg-stone-800 text-white font-black text-xs sm:text-sm uppercase py-3.5 px-6 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-40 h-12 active:scale-98"
            >
              <ShoppingCart className="w-4 h-4 shrink-0" />
              <span>{isOutOfStock ? "SOLD OUT" : "ADD TO CART"}</span>
            </button>
          </div>

          <button
            onClick={handleBuyNow}
            disabled={isOutOfStock}
            className="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs sm:text-sm uppercase py-3.5 sm:py-4 rounded-xl transition-all shadow-xl flex items-center justify-center gap-2 disabled:opacity-40 active:scale-98"
          >
            <Zap className="w-4 h-4 fill-current shrink-0" />
            <span>BUY NOW (INSTANT CHECKOUT)</span>
          </button>
        </div>

        {/* PIN Code Delivery Checker */}
        <PincodeChecker />

        {/* Tabbed Content: Description, Nutrition Facts, Ingredients, Reviews */}
        <div className="pt-6 border-t border-stone-200">
          <div className="flex border-b border-stone-200 gap-2 sm:gap-4 text-xs sm:text-sm font-black uppercase overflow-x-auto scrollbar-none pb-0.5">
            <button
              onClick={() => setActiveTab("desc")}
              className={`pb-3 transition-colors shrink-0 whitespace-nowrap ${
                activeTab === "desc"
                  ? "border-b-2 border-amber-600 text-amber-700"
                  : "text-stone-500 hover:text-stone-800"
              }`}
            >
              Description & Benefits
            </button>
            <button
              onClick={() => setActiveTab("nutrition")}
              className={`pb-3 transition-colors shrink-0 whitespace-nowrap ${
                activeTab === "nutrition"
                  ? "border-b-2 border-amber-600 text-amber-700"
                  : "text-stone-500 hover:text-stone-800"
              }`}
            >
              Nutrition Facts
            </button>
            <button
              onClick={() => setActiveTab("ingredients")}
              className={`pb-3 transition-colors shrink-0 whitespace-nowrap ${
                activeTab === "ingredients"
                  ? "border-b-2 border-amber-600 text-amber-700"
                  : "text-stone-500 hover:text-stone-800"
              }`}
            >
              Ingredients
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`pb-3 transition-colors shrink-0 whitespace-nowrap ${
                activeTab === "reviews"
                  ? "border-b-2 border-amber-600 text-amber-700"
                  : "text-stone-500 hover:text-stone-800"
              }`}
            >
              Reviews ({reviews.length})
            </button>
          </div>

          <div className="pt-6">
            {activeTab === "desc" && (
              <div className="prose prose-stone text-xs sm:text-sm leading-relaxed space-y-4">
                <p className="whitespace-pre-line text-stone-700">{product.description}</p>
                {product.benefits && (
                  <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200/60 mt-4">
                    <h4 className="font-black text-xs uppercase text-amber-900 tracking-wider mb-2">
                      KEY ATHLETIC BENEFITS
                    </h4>
                    <p className="whitespace-pre-line text-xs text-amber-950 font-medium">
                      {product.benefits}
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "nutrition" && (
              <NutritionTable nutritionJson={product.nutritionPer100g} />
            )}

            {activeTab === "ingredients" && (
              <div className="space-y-4 text-xs sm:text-sm">
                <div>
                  <h4 className="font-extrabold text-stone-900 mb-1">Ingredients:</h4>
                  <p className="text-stone-700 bg-stone-50 p-3 rounded-lg border border-stone-200">
                    {product.ingredients || "100% Roasted Runner Peanuts."}
                  </p>
                </div>
                {product.directions && (
                  <div>
                    <h4 className="font-extrabold text-stone-900 mb-1">Directions & Storage:</h4>
                    <p className="text-stone-700 bg-stone-50 p-3 rounded-lg border border-stone-200">
                      {product.directions}
                    </p>
                  </div>
                )}
                {product.disclaimer && (
                  <p className="text-[11px] text-stone-400 italic">
                    {product.disclaimer}
                  </p>
                )}
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-6">
                {/* Submit Review Form */}
                <form onSubmit={handleReviewSubmit} className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-3">
                  <h4 className="font-black text-xs uppercase text-stone-900 tracking-wider">
                    Write a Review
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-stone-700">Rating:</span>
                    <select
                      value={reviewRating}
                      onChange={(e) => setReviewRating(parseInt(e.target.value))}
                      className="text-xs font-bold bg-white border border-stone-300 rounded px-2 py-1"
                    >
                      <option value="5">⭐⭐⭐⭐⭐ 5 Stars</option>
                      <option value="4">⭐⭐⭐⭐ 4 Stars</option>
                      <option value="3">⭐⭐⭐ 3 Stars</option>
                      <option value="2">⭐⭐ 2 Stars</option>
                      <option value="1">⭐ 1 Star</option>
                    </select>
                  </div>
                  <input
                    type="text"
                    placeholder="Review headline (e.g. Delicious texture & high energy)"
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg bg-white"
                  />
                  <textarea
                    rows={3}
                    placeholder="Share your experience with this product..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg bg-white"
                    required
                  />
                  <button
                    type="submit"
                    disabled={reviewSubmitting}
                    className="bg-stone-900 hover:bg-amber-600 text-white font-bold text-xs uppercase px-5 py-2.5 rounded-lg transition-colors"
                  >
                    {reviewSubmitting ? "Submitting..." : "Submit Review"}
                  </button>
                  {reviewMessage && (
                    <p className="text-xs font-semibold text-green-700">{reviewMessage}</p>
                  )}
                </form>

                {/* Reviews List */}
                <div className="space-y-4">
                  {reviews.length === 0 ? (
                    <p className="text-xs text-stone-500 italic">No reviews yet. Be the first to review!</p>
                  ) : (
                    reviews.map((r: any) => (
                      <div key={r.id} className="p-4 bg-white rounded-xl border border-stone-200 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-xs text-stone-900">{r.userName}</span>
                          <div className="flex items-center gap-0.5 text-amber-500">
                            {[...Array(r.rating)].map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 fill-current" />
                            ))}
                          </div>
                        </div>
                        {r.title && <p className="font-bold text-xs text-stone-900">{r.title}</p>}
                        <p className="text-xs text-stone-600">{r.comment}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
