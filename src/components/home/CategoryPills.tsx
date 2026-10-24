import React from "react";
import Link from "next/link";
import Image from "next/image";

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  image?: string | null;
  description?: string | null;
}

export default function CategoryPills({ categories }: { categories: CategoryItem[] }) {
  return (
    <section className="py-10 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
              EXPLORE BY CATEGORY
            </h2>
            <p className="text-xs sm:text-sm text-stone-500">Pick your daily protein fuel</p>
          </div>
          <Link
            href="/shop"
            className="text-xs sm:text-sm font-extrabold text-amber-700 hover:text-amber-800 uppercase tracking-wider"
          >
            View All →
          </Link>
        </div>

        <div className="flex sm:grid sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 overflow-x-auto sm:overflow-x-visible pb-3 sm:pb-0 scrollbar-none snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/collections/${cat.slug}`}
              className="snap-start shrink-0 w-36 sm:w-auto group flex flex-col items-center p-3.5 sm:p-4 rounded-2xl bg-stone-50 border border-stone-200 hover:border-amber-400 hover:bg-amber-50/50 hover:shadow-md transition-all duration-300 text-center"
            >
              <div className="relative w-16 h-16 sm:w-24 sm:h-24 mb-2.5 sm:mb-3 flex items-center justify-center">
                <Image
                  src={cat.image || "/images/products/organichy-jar.png"}
                  alt={cat.name}
                  fill
                  sizes="96px"
                  className="object-contain transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <h3 className="font-extrabold text-xs sm:text-sm text-stone-900 group-hover:text-amber-700 transition-colors line-clamp-2">
                {cat.name}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
