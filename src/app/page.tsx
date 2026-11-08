import React from "react";
import { prisma } from "@/lib/prisma";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/layout/CartDrawer";
import HeroCarousel from "@/components/home/HeroCarousel";
import CategoryPills from "@/components/home/CategoryPills";
import NewProductHighlight from "@/components/home/NewProductHighlight";
import ProductSection from "@/components/home/ProductSection";
import NutritionShowcase from "@/components/home/NutritionShowcase";
import CustomerReviewsSection from "@/components/home/CustomerReviewsSection";
import VideoAdvertisementShowcase from "@/components/home/VideoAdvertisementShowcase";

// Statically cache with ISR: revalidate in the background every 60 seconds
export const revalidate = 60;

export default async function HomePage() {
  let settings: any = null;
  let banners: any[] = [];
  let categories: any[] = [];
  let advertisementVideos: any[] = [];
  let allProducts: any[] = [];

  try {
    // Run all database fetches in parallel for maximum speed
    const [dbSettings, dbBanners, dbCategories, dbVideos, dbProducts] = await Promise.all([
      prisma.siteSettings.findUnique({
        where: { id: "default-settings" },
      }),
      prisma.banner.findMany({
        where: { isActive: true },
        orderBy: { displayOrder: "asc" },
      }),
      prisma.category.findMany({
        where: { active: true },
        orderBy: { displayOrder: "asc" },
      }),
      prisma.advertisementVideo.findMany({
        where: { active: true },
        orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
      }),
      prisma.product.findMany({
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
      }),
    ]);

    settings = dbSettings;
    banners = dbBanners || [];
    categories = dbCategories || [];
    advertisementVideos = dbVideos || [];
    allProducts = dbProducts || [];
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
        {/* 1. Hero Carousel (Light Luxury Theme with Touch Swipe) */}
        <HeroCarousel banners={banners} />

        {/* 2. Category Navigation Pills */}
        <CategoryPills categories={categories} />

        {/* 3. New Product Highlight Banner (Dark Chocolate Crunchy Duo) */}
        <NewProductHighlight />

        {/* 4. Bestsellers Section */}
        <ProductSection
          title="BEST SELLERS"
          subtitle="The nation's most loved peanut butter blends trusted by thousands daily"
          badge="🔥 MOST POPULAR"
          products={bestSellers}
          viewAllLink="/shop?sort=bestseller"
          bgDark={false}
        />

        {/* 5. High Protein Section */}
        <ProductSection
          title="HIGH PROTEIN COLLECTION"
          subtitle="Maximized biological value to fuel serious muscle gains and recovery"
          badge="⚡ ATHLETE FAVORITE"
          products={highProteinProducts}
          viewAllLink="/collections/high-protein"
          bgDark={false}
        />

        {/* 6. Dark Chocolate Collection */}
        <ProductSection
          title="DARK CHOCOLATE INDULGENCE"
          subtitle="Real Belgian roasted cocoa with crunch in every bite. Zero added guilt."
          badge="🍫 RICH & DECADENT"
          products={chocolateProducts}
          viewAllLink="/collections/chocolate-collection"
          bgDark={false}
        />

        {/* 7. Nutrition Showcase & Comparison (Light Scientific Aesthetic) */}
        <NutritionShowcase />

        {/* 8. Verified Athlete & Customer Reviews */}
        <CustomerReviewsSection />

        {/* 9. Instagram Reels & YouTube Video Showcase */}
        <VideoAdvertisementShowcase initialVideos={advertisementVideos} />
      </main>

      <Footer />
    </div>
  );
}