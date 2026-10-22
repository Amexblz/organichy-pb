import React from "react";
import { prisma } from "@/lib/prisma";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/layout/CartDrawer";
import ProductCard from "@/components/product/ProductCard";
import Link from "next/link";
import { Filter, RotateCcw } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface ShopPageProps {
  searchParams: {
    category?: string;
    flavor?: string;
    texture?: string;
    sort?: string;
    search?: string;
    minPrice?: string;
    maxPrice?: string;
  };
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "default-settings" },
  });

  const categories = await prisma.category.findMany({
    where: { active: true },
    orderBy: { displayOrder: "asc" },
  });

  // Build filter query
  const whereClause: any = { active: true };

  if (searchParams.category) {
    const matchedCategory = categories.find((c) => c.slug === searchParams.category);
    if (matchedCategory) {
      whereClause.categoryId = matchedCategory.id;
    }
  }

  if (searchParams.flavor) {
    whereClause.flavor = { contains: searchParams.flavor };
  }

  if (searchParams.texture) {
    whereClause.texture = { contains: searchParams.texture };
  }

  if (searchParams.search) {
    whereClause.OR = [
      { name: { contains: searchParams.search } },
      { description: { contains: searchParams.search } },
      { shortDescription: { contains: searchParams.search } },
    ];
  }

  if (searchParams.minPrice || searchParams.maxPrice) {
    whereClause.basePrice = {
      ...(searchParams.minPrice && { gte: parseFloat(searchParams.minPrice) }),
      ...(searchParams.maxPrice && { lte: parseFloat(searchParams.maxPrice) }),
    };
  }

  let orderByClause: any = { createdAt: "desc" };
  if (searchParams.sort === "price-low") {
    orderByClause = { basePrice: "asc" };
  } else if (searchParams.sort === "price-high") {
    orderByClause = { basePrice: "desc" };
  } else if (searchParams.sort === "rating") {
    orderByClause = { rating: "desc" };
  } else if (searchParams.sort === "bestseller") {
    orderByClause = [{ isBestseller: "desc" }, { reviewCount: "desc" }];
  }

  const products = await prisma.product.findMany({
    where: whereClause,
    include: {
      category: true,
      variants: {
        where: { active: true },
        orderBy: { price: "asc" },
      },
      images: {
        orderBy: { displayOrder: "asc" },
      },
    },
    orderBy: orderByClause,
  });

  const hasActiveFilters = Boolean(
    searchParams.category ||
    searchParams.flavor ||
    searchParams.texture ||
    searchParams.search ||
    searchParams.minPrice ||
    searchParams.maxPrice
  );

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans">
      <Header announcementText={settings?.announcementText} />
      <CartDrawer />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Breadcrumb & Title */}
        <div className="mb-6">
          <nav className="text-xs text-stone-500 mb-2 flex items-center gap-2">
            <Link href="/" className="hover:text-stone-900">Home</Link>
            <span>/</span>
            <span className="text-stone-900 font-bold">Shop All Products</span>
          </nav>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-stone-900 tracking-tight uppercase">
                {searchParams.category
                  ? categories.find((c) => c.slug === searchParams.category)?.name || "All Products"
                  : searchParams.search
                  ? `Search: "${searchParams.search}"`
                  : "All Organichy Products"}
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 mt-1">
                Showing {products.length} high-protein peanut butter products
              </p>
            </div>

            {/* Sort Dropdown */}
            <form method="GET" action="/shop" className="flex items-center gap-2">
              {searchParams.category && <input type="hidden" name="category" value={searchParams.category} />}
              {searchParams.flavor && <input type="hidden" name="flavor" value={searchParams.flavor} />}
              {searchParams.texture && <input type="hidden" name="texture" value={searchParams.texture} />}
              {searchParams.search && <input type="hidden" name="search" value={searchParams.search} />}
              <span className="text-xs font-bold text-stone-600 uppercase">Sort by:</span>
              <select
                name="sort"
                defaultValue={searchParams.sort || "newest"}
                // Note: user submits or change triggers form submit
                className="text-xs font-bold bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-900 focus:outline-none focus:border-amber-500"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="bestseller">Best Sellers</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Customer Rating</option>
              </select>
              <button
                type="submit"
                className="bg-stone-900 text-white text-xs font-bold px-3 py-2 rounded-lg hover:bg-amber-600 transition-colors"
              >
                Apply
              </button>
            </form>
          </div>
        </div>

        {/* Layout: Sidebar filters + Products grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Sidebar Filters */}
          <aside className="bg-white p-5 rounded-2xl border border-stone-200 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2 font-black text-sm text-stone-900 uppercase">
                <Filter className="w-4 h-4 text-amber-600" />
                <span>Filters</span>
              </div>
              {hasActiveFilters && (
                <Link
                  href="/shop"
                  className="text-xs text-red-600 font-bold hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Clear All</span>
                </Link>
              )}
            </div>

            {/* Category Filter */}
            <div>
              <h4 className="font-extrabold text-xs uppercase text-stone-900 tracking-wider mb-2.5">
                Categories
              </h4>
              <div className="space-y-1.5 text-xs font-medium">
                <Link
                  href="/shop"
                  className={`block px-2.5 py-1.5 rounded-lg transition-colors ${
                    !searchParams.category ? "bg-amber-100 text-amber-900 font-bold" : "text-stone-700 hover:bg-stone-100"
                  }`}
                >
                  All Categories
                </Link>
                {categories.map((c) => (
                  <Link
                    key={c.id}
                    href={`/shop?category=${c.slug}${searchParams.sort ? `&sort=${searchParams.sort}` : ""}`}
                    className={`block px-2.5 py-1.5 rounded-lg transition-colors ${
                      searchParams.category === c.slug
                        ? "bg-amber-100 text-amber-900 font-bold"
                        : "text-stone-700 hover:bg-stone-100"
                    }`}
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Flavor Filter */}
            <div className="pt-3 border-t border-stone-100">
              <h4 className="font-extrabold text-xs uppercase text-stone-900 tracking-wider mb-2.5">
                Flavor
              </h4>
              <div className="space-y-1 text-xs">
                {["Dark Chocolate", "Natural", "Classic"].map((flavor) => (
                  <Link
                    key={flavor}
                    href={`/shop?flavor=${encodeURIComponent(flavor)}${searchParams.category ? `&category=${searchParams.category}` : ""}`}
                    className={`block px-2.5 py-1.5 rounded-lg ${
                      searchParams.flavor === flavor ? "bg-amber-100 text-amber-900 font-bold" : "text-stone-700 hover:bg-stone-100"
                    }`}
                  >
                    {flavor}
                  </Link>
                ))}
              </div>
            </div>

            {/* Texture Filter */}
            <div className="pt-3 border-t border-stone-100">
              <h4 className="font-extrabold text-xs uppercase text-stone-900 tracking-wider mb-2.5">
                Texture
              </h4>
              <div className="space-y-1 text-xs">
                {["Crunchy", "Smooth"].map((texture) => (
                  <Link
                    key={texture}
                    href={`/shop?texture=${encodeURIComponent(texture)}${searchParams.category ? `&category=${searchParams.category}` : ""}`}
                    className={`block px-2.5 py-1.5 rounded-lg ${
                      searchParams.texture === texture ? "bg-amber-100 text-amber-900 font-bold" : "text-stone-700 hover:bg-stone-100"
                    }`}
                  >
                    {texture}
                  </Link>
                ))}
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="lg:col-span-3">
            {products.length === 0 ? (
              <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-4">
                <div className="text-4xl">🔍</div>
                <h3 className="font-extrabold text-stone-900 text-lg">No products found</h3>
                <p className="text-stone-500 text-xs sm:text-sm">
                  We couldn&apos;t find any peanut butter matching your current filter criteria.
                </p>
                <Link
                  href="/shop"
                  className="inline-block bg-stone-900 text-white font-bold text-xs uppercase px-6 py-3 rounded-xl hover:bg-amber-600 transition-colors"
                >
                  Reset All Filters
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
