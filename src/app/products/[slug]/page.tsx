import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/layout/CartDrawer";
import ProductDetailClient from "@/components/product/ProductDetailClient";
import ProductCard from "@/components/product/ProductCard";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
  });

  if (!product) return { title: "Product Not Found | Organichy" };

  return {
    title: `${product.name} | Organichy Peanut Butter`,
    description: product.shortDescription || product.description.slice(0, 150),
    openGraph: {
      title: product.name,
      description: product.shortDescription || "",
    },
  };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "default-settings" },
  });

  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: {
      category: true,
      variants: {
        where: { active: true },
        orderBy: { price: "asc" },
      },
      images: {
        orderBy: { displayOrder: "asc" },
      },
      reviews: {
        where: { isApproved: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!product || !product.active) {
    notFound();
  }

  // Related products in same category
  const relatedProducts = await prisma.product.findMany({
    where: {
      active: true,
      categoryId: product.categoryId,
      id: { not: product.id },
    },
    include: {
      variants: { where: { active: true } },
      images: { orderBy: { displayOrder: "asc" } },
    },
    take: 4,
  });

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans">
      <Header announcementText={settings?.announcementText} />
      <CartDrawer />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Breadcrumbs */}
        <nav className="text-xs text-stone-500 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-stone-900">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-stone-900">Shop</Link>
          <span>/</span>
          <Link href={`/collections/${product.category.slug}`} className="hover:text-stone-900">
            {product.category.name}
          </Link>
          <span>/</span>
          <span className="text-stone-900 font-bold truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Product Details Section */}
        <ProductDetailClient product={product} />

        {/* Related Products Grid */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-12 border-t border-stone-200">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-black text-amber-700 uppercase tracking-wider">
                  COMPLETE YOUR FITNESS REGIMEN
                </span>
                <h3 className="text-2xl font-black text-stone-900 tracking-tight mt-1">
                  YOU MAY ALSO LOVE
                </h3>
              </div>
              <Link
                href="/shop"
                className="text-xs font-black text-amber-700 hover:text-amber-800 uppercase tracking-wider"
              >
                View Catalog →
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p as any} />
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
