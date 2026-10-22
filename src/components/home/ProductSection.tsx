import React from "react";
import Link from "next/link";
import ProductCard, { ProductType } from "@/components/product/ProductCard";

interface ProductSectionProps {
  title: string;
  subtitle?: string;
  badge?: string;
  products: ProductType[];
  viewAllLink?: string;
  bgDark?: boolean;
}

export default function ProductSection({
  title,
  subtitle,
  badge,
  products,
  viewAllLink = "/shop",
  bgDark = false,
}: ProductSectionProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className={`py-12 sm:py-16 ${bgDark ? "bg-stone-900 text-white" : "bg-white text-stone-900"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            {badge && (
              <span className="inline-block bg-amber-500 text-stone-950 font-black text-[10px] sm:text-xs px-2.5 py-1 rounded-md uppercase tracking-wider mb-2">
                {badge}
              </span>
            )}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight uppercase">
              {title}
            </h2>
            {subtitle && (
              <p className={`text-xs sm:text-sm mt-1 max-w-xl ${bgDark ? "text-stone-400" : "text-stone-500"}`}>
                {subtitle}
              </p>
            )}
          </div>

          <Link
            href={viewAllLink}
            className={`text-xs sm:text-sm font-black uppercase tracking-wider hover:underline shrink-0 ${
              bgDark ? "text-amber-400 hover:text-amber-300" : "text-amber-700 hover:text-amber-800"
            }`}
          >
            VIEW ALL PRODUCTS →
          </Link>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
