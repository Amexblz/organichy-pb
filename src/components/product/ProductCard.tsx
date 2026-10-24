"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Star, ShoppingCart, Check, Eye } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatINR, calculateDiscount } from "@/lib/utils";

export interface VariantType {
  id: string;
  weight: string;
  flavor?: string | null;
  texture?: string | null;
  price: number;
  mrp: number;
  stock: number;
  sku: string;
}

export interface ProductType {
  id: string;
  name: string;
  slug: string;
  basePrice: number;
  baseMrp: number;
  rating: number;
  reviewCount: number;
  texture?: string | null;
  flavor?: string | null;
  shortDescription?: string | null;
  isBestseller?: boolean;
  isNewArrival?: boolean;
  isHighProtein?: boolean;
  variants: VariantType[];
  images: Array<{ url: string; altText?: string | null; isPrimary: boolean }>;
}

export default function ProductCard({ product }: { product: ProductType }) {
  const { addItem, toggleWishlist, isInWishlist } = useCart();
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const variants = product.variants && product.variants.length > 0 ? product.variants : [];
  const activeVariant = variants[selectedVariantIndex] || {
    id: product.id,
    weight: "1kg",
    price: product.basePrice,
    mrp: product.baseMrp,
    stock: 50,
    sku: product.slug,
  };

  const discountPercent = calculateDiscount(activeVariant.price, activeVariant.mrp);
  const inWishlist = isInWishlist(product.id);
  const primaryImage =
    product.images && product.images.length > 0
      ? product.images.find((img) => img.isPrimary)?.url || product.images[0].url
      : "/images/products/organichy-jar.png";

  const isOutOfStock = activeVariant.stock <= 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isOutOfStock) return;

    addItem(
      {
        productId: product.id,
        variantId: activeVariant.id,
        name: product.name,
        variantLabel: `${activeVariant.weight}${activeVariant.flavor ? ` - ${activeVariant.flavor}` : ""}`,
        price: activeVariant.price,
        mrp: activeVariant.mrp,
        image: primaryImage,
        stock: activeVariant.stock,
      },
      1
    );

    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  return (
    <div className="group relative bg-white border border-stone-200/80 rounded-2xl p-3 sm:p-4 hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:border-amber-400/60">
      <div>
        {/* Badges & Wishlist Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex flex-wrap gap-1">
            {product.isBestseller && (
              <span className="bg-amber-500 text-stone-950 font-black text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                Bestseller
              </span>
            )}
            {product.isHighProtein && (
              <span className="bg-stone-900 text-amber-400 font-extrabold text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                32g Protein
              </span>
            )}
            {discountPercent > 0 && (
              <span className="bg-red-50 text-red-600 border border-red-200 font-black text-[10px] px-1.5 py-0.5 rounded-full">
                {discountPercent}% OFF
              </span>
            )}
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(product.id);
            }}
            className={`p-1.5 rounded-full transition-colors ${
              inWishlist
                ? "text-red-500 bg-red-50"
                : "text-stone-400 hover:text-red-500 hover:bg-stone-100"
            }`}
            aria-label="Add to Wishlist"
          >
            <Heart className={`w-4 h-4 ${inWishlist ? "fill-current" : ""}`} />
          </button>
        </div>

        {/* Product Image Link */}
        <Link href={`/products/${product.slug}`} className="block relative aspect-square w-full rounded-xl bg-stone-50 overflow-hidden mb-3">
          <div className="relative w-full h-full flex items-center justify-center p-3">
            <Image
              src={primaryImage}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 300px"
              className="object-contain transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          {isOutOfStock && (
            <div className="absolute inset-0 bg-stone-900/60 flex items-center justify-center">
              <span className="bg-stone-900 text-white font-black text-xs px-3 py-1.5 rounded-full uppercase tracking-wider">
                Sold Out
              </span>
            </div>
          )}
        </Link>

        {/* Rating and Reviews */}
        <div className="flex items-center gap-1.5 mb-1.5">
          <div className="flex items-center gap-0.5 bg-green-50 text-green-700 px-1.5 py-0.5 rounded text-[11px] font-extrabold">
            <span>{product.rating.toFixed(1)}</span>
            <Star className="w-3 h-3 fill-current text-green-600" />
          </div>
          <span className="text-[11px] text-stone-400 font-medium">
            ({product.reviewCount || 24} reviews)
          </span>
        </div>

        {/* Product Title */}
        <Link href={`/products/${product.slug}`} className="block">
          <h3 className="font-extrabold text-xs sm:text-base text-stone-900 line-clamp-2 leading-tight hover:text-amber-600 transition-colors min-h-[2rem] sm:min-h-[2.5rem]">
            {product.name}
          </h3>
        </Link>

        {/* Variant / Weight Selector Pills */}
        {variants.length > 1 && (
          <div className="flex flex-wrap gap-1.5 my-3">
            {variants.map((v, idx) => (
              <button
                key={v.id}
                onClick={() => setSelectedVariantIndex(idx)}
                className={`text-[11px] font-bold px-2 py-1 rounded-md border transition-all ${
                  selectedVariantIndex === idx
                    ? "bg-stone-900 text-white border-stone-900 shadow-sm"
                    : "bg-stone-50 text-stone-700 border-stone-200 hover:border-amber-500"
                }`}
              >
                {v.weight}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Pricing & Add to Cart Action */}
      <div className="mt-2 sm:mt-3 pt-2.5 sm:pt-3 border-t border-stone-100">
        <div className="flex items-baseline gap-1.5 sm:gap-2 mb-2 sm:mb-3 flex-wrap">
          <span className="text-base sm:text-xl font-black text-stone-950">
            {formatINR(activeVariant.price)}
          </span>
          {activeVariant.mrp > activeVariant.price && (
            <span className="text-[11px] sm:text-sm text-stone-400 line-through">
              {formatINR(activeVariant.mrp)}
            </span>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`w-full py-2 sm:py-2.5 px-2 sm:px-3 rounded-xl font-black text-[11px] sm:text-sm uppercase tracking-wider flex items-center justify-center gap-1.5 sm:gap-2 transition-all shadow-md active:scale-95 ${
            isOutOfStock
              ? "bg-stone-200 text-stone-400 cursor-not-allowed shadow-none"
              : addedAnimation
              ? "bg-green-600 text-white"
              : "bg-stone-900 hover:bg-amber-500 hover:text-stone-950 text-white"
          }`}
        >
          {addedAnimation ? (
            <>
              <Check className="w-4 h-4" />
              <span>ADDED!</span>
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4" />
              <span>{isOutOfStock ? "OUT OF STOCK" : "ADD TO CART"}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
