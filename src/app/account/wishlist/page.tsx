"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Trash2, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatINR } from "@/lib/utils";

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addItem } = useCart();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/products") // public listing endpoint
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.products) {
          const filtered = data.products.filter((p: any) => wishlist.includes(p.id));
          setProducts(filtered);
        }
      })
      .finally(() => setLoading(false));
  }, [wishlist]);

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-stone-200 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-stone-900 uppercase tracking-tight">
            My Wishlist
          </h1>
          <p className="text-xs text-stone-500">Items saved for your upcoming orders</p>
        </div>
        <span className="text-xs font-bold text-stone-600 bg-stone-100 px-3 py-1 rounded-full">
          {wishlist.length} Items Saved
        </span>
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-16 space-y-3">
          <Heart className="w-12 h-12 text-stone-300 mx-auto" />
          <h3 className="font-bold text-stone-900">Your wishlist is empty</h3>
          <p className="text-xs text-stone-500">Tap the heart on any product card to save it here.</p>
          <Link
            href="/shop"
            className="inline-block bg-stone-900 text-white font-bold text-xs uppercase px-5 py-2.5 rounded-xl hover:bg-amber-600 transition-colors"
          >
            Explore Catalog
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {products.map((p) => {
            const primaryImage = p.images?.[0]?.url || "/images/products/organichy-jar.png";
            const firstVariant = p.variants?.[0];
            return (
              <div key={p.id} className="p-4 rounded-2xl border border-stone-200 bg-white flex flex-col justify-between">
                <div>
                  <div className="relative aspect-square w-full bg-stone-50 rounded-xl mb-3 flex items-center justify-center overflow-hidden">
                    <Image
                      src={primaryImage}
                      alt={p.name}
                      fill
                      sizes="200px"
                      className="object-contain p-2"
                    />
                  </div>
                  <h4 className="font-extrabold text-xs sm:text-sm text-stone-900 line-clamp-1">{p.name}</h4>
                  <p className="text-sm font-black text-stone-950 mt-1">{formatINR(p.basePrice)}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex gap-2">
                  <button
                    onClick={() => {
                      if (firstVariant) {
                        addItem({
                          productId: p.id,
                          variantId: firstVariant.id,
                          name: p.name,
                          variantLabel: firstVariant.weight,
                          price: firstVariant.price,
                          mrp: firstVariant.mrp,
                          image: primaryImage,
                          stock: firstVariant.stock,
                        });
                      }
                    }}
                    className="flex-1 bg-stone-900 hover:bg-amber-600 text-white font-bold text-[11px] uppercase py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Add to Cart</span>
                  </button>
                  <button
                    onClick={() => toggleWishlist(p.id)}
                    className="p-2 text-stone-400 hover:text-red-600 rounded-lg border border-stone-200"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
