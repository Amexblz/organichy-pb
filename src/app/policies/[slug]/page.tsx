import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const revalidate = 0;

export default async function PolicyPage({ params }: { params: { slug: string } }) {
  const page = await prisma.cMSPage.findUnique({
    where: { slug: params.slug },
  });

  if (!page || !page.published) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-stone-200 shadow-sm space-y-6">
          <div className="border-b border-stone-200 pb-4">
            <span className="text-[11px] font-black uppercase text-amber-700 tracking-wider">
              LEGAL & POLICIES
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-stone-900 tracking-tight mt-1">
              {page.title}
            </h1>
          </div>

          <div className="prose prose-stone text-xs sm:text-sm leading-relaxed whitespace-pre-line text-stone-700">
            {page.content}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
