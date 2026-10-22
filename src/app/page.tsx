import React from "react";
import { prisma } from "@/lib/prisma";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/layout/CartDrawer";
import HeroCarousel from "@/components/home/HeroCarousel";
import CategoryPills from "@/components/home/CategoryPills";
import ProductSection from "@/components/home/ProductSection";
import NutritionShowcase from "@/components/home/NutritionShowcase";
import CustomerReviewsSection from "@/components/home/CustomerReviewsSection";
import VideoAdvertisementShowcase from "@/components/home/VideoAdvertisementShowcase";

export const dynamic = "force-dynamic";
export const revalidate = 0; // dynamic data

export default async function HomePage() {
  let settings: any = null;
  let banners: any[] = [];
  let categories: any[] = [];
  let advertisementVideos: any[] = [];
  let allProducts: any[] = [];

  try {
    // Fetch site settings
    settings = await prisma.siteSettings.findUnique({
      where: { id: "default-settings" },
    });

    // Fetch active banners
    banners = await prisma.banner.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: "asc" },
    });

    // Fetch active categories
    categories = await prisma.category.findMany({
      where: { active: true },
      orderBy: { displayOrder: "asc" },
    });

    // Fetch active advertisement videos
    advertisementVideos = await prisma.advertisementVideo.findMany({
      where: { active: true },
      orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
    });

    // Fetch products with variants and images
    allProducts = await prisma.product.findMany({
      where: { active: true },
      include: {
        variants: {
          where: { active: true },
          orderBy: { price: "asc" },
        },
        images: {
          orderBy: { displayOrder: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("HomePage Database SSR error (verify DATABASE_URL is configured):", error);
  }

  const bestSellers = allProducts.filter((p) => p.isBestseller);
  const chocolateProducts = allProducts.filter((p) => p.isChocolate);
  const highProteinProducts = allProducts.filter((p) => p.isHighProtein);

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans w-full max-w-full overflow-x-hidden">
      <Header announcementText={settings?.announcementText} />
      <CartDrawer />

      <main className="flex-1 w-full max-w-full min-w-0 overflow-x-hidden">
        {/* 1. Hero Carousel */}
        <HeroCarousel banners={banners} />

        {/* 2. Category Navigation Pills */}
        <CategoryPills categories={categories} />

        {/* 3. Bestsellers Section */}
        <ProductSection
          title="BEST SELLERS"
          subtitle="The nation's most loved peanut butter blends trusted by thousands daily"
          badge="🔥 MOST POPULAR"
          products={bestSellers}
          viewAllLink="/shop?sort=bestseller"
        />

        {/* 4. High Protein 32g Section */}
        <ProductSection
          title="32G HIGH PROTEIN COLLECTION"
          subtitle="Maximized biological value to fuel serious muscle gains and recovery"
          badge="⚡ ATHLETE FAVORITE"
          products={highProteinProducts}
          viewAllLink="/collections/high-protein"
          bgDark={true}
        />

        {/* 5. Dark Chocolate Collection */}
        <ProductSection
          title="DARK CHOCOLATE INDULGENCE"
          subtitle="Real Belgian roasted cocoa with crunch in every bite. Zero added guilt."
          badge="🍫 RICH & DECADENT"
          products={chocolateProducts}
          viewAllLink="/collections/chocolate-collection"
        />

        {/* 6. Nutrition Showcase & Comparison */}
        <NutritionShowcase />

        {/* 7. Verified Athlete & Customer Reviews */}
        <CustomerReviewsSection />

        {/* 8. Product Advertisement Videos Loop */}
        <VideoAdvertisementShowcase initialVideos={advertisementVideos} />
      </main>

      <Footer />
    </div>
  );
}
