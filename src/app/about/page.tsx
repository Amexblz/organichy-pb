import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Award,
  ShieldCheck,
  Heart,
  Sparkles,
  CheckCircle2,
  MapPin,
  Building2,
  Phone,
  Mail,
  Clock,
  ExternalLink,
  Quote,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const revalidate = 3600;

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-16">
        {/* 1. Hero Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="bg-amber-500 text-stone-950 font-black text-xs px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
            OUR STORY &amp; MISSION
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-stone-900 tracking-tight">
            Crafting India&apos;s Purest 32g High Protein Peanut Butter
          </h1>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            At Organichy (Organichy Food), we refuse to compromise your health with cheap industrial palm oil or inflated protein claims.
          </p>
        </div>

        {/* 2. Visual Story Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white p-6 sm:p-10 rounded-3xl border border-stone-200 shadow-sm">
          <div className="space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed">
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 uppercase">
              From Saurashtra Farms to Your Shaker Bottle
            </h2>
            <p>
              Founded by fitness professionals and certified clinical nutritionists, Organichy was born out of frustration. Mainstream shelf spreads add hydrogenated palm oil and chemical emulsifiers to halt oil separation, trading long-term cardiovascular health for artificial convenience.
            </p>
            <p>
              We source strictly Grade-A runner peanuts directly from organic farms in Saurashtra, Gujarat. They are slow-roasted in small batches to preserve vital monounsaturated fats, polyphenols, and complete micronutrient profiles.
            </p>
            <div className="pt-2 grid grid-cols-2 gap-3 text-stone-900 font-bold">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                <span>Zero Palm Oil</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                <span>True 32g Protein</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                <span>FSSAI Certified</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                <span>100% Recyclable Tubs</span>
              </div>
            </div>
          </div>

          <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-amber-50/50 border border-amber-100 flex items-center justify-center p-6 shadow-inner">
            <Image
              src="/images/products/organichy-tub-front.png"
              alt="Organichy Tub"
              fill
              sizes="400px"
              className="object-contain p-4 drop-shadow-xl"
            />
          </div>
        </div>

        {/* 3. Business Owner & Founder Spotlight */}
        <section className="bg-gradient-to-br from-amber-50 via-white to-orange-50/40 p-6 sm:p-10 rounded-3xl border-2 border-amber-200/80 shadow-md">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-12">
            {/* Founder Photo */}
            <div className="relative shrink-0 flex flex-col items-center">
              <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-full overflow-hidden border-4 border-amber-500 shadow-2xl bg-amber-100">
                <Image
                  src="/images/team/founder.svg"
                  alt="Aman Saxena - Business Owner & Founder, Organichy Food"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="mt-3 inline-flex items-center gap-1.5 bg-stone-900 text-amber-400 text-[11px] font-black uppercase px-3 py-1 rounded-full shadow-md">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Verified Founder</span>
              </div>
            </div>

            {/* Founder Message & Bio */}
            <div className="space-y-3.5 text-center md:text-left flex-1">
              <span className="text-amber-800 font-extrabold text-xs uppercase tracking-wider">
                MEET THE BUSINESS OWNER
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                Aman Saxena
              </h2>
              <p className="text-xs sm:text-sm font-bold text-stone-600">
                Founder &amp; Managing Director — Organichy Food
              </p>

              <div className="relative py-2">
                <Quote className="w-8 h-8 text-amber-400/40 absolute -top-1 -left-2 rotate-180 -z-0" />
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed italic relative z-10">
                  &ldquo;When we founded Organichy, we set one non-negotiable rule: if we wouldn&apos;t feed it to our own families before a grueling workout, it would never leave our facility. Every spoon contains 100% slow-roasted Saurashtra runner peanuts, genuine 32g protein, and zero hydrogenated industrial palm oil.&rdquo;
                </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs font-bold text-stone-700">
                <span className="bg-white px-3 py-1.5 rounded-lg border border-stone-200 shadow-sm">
                  🏅 Sports Nutritionist Backed
                </span>
                <span className="bg-white px-3 py-1.5 rounded-lg border border-stone-200 shadow-sm">
                  🌾 Direct Farmer Partnership
                </span>
                <span className="bg-white px-3 py-1.5 rounded-lg border border-stone-200 shadow-sm">
                  🔬 Lab Tested Batches
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Physical Locations & Registered Facilities */}
        <section className="space-y-6">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="bg-amber-100 text-amber-900 text-xs font-black uppercase px-3 py-1 rounded-full">
              TRANSPARENCY &amp; TRACEABILITY
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 uppercase">
              Our Locations &amp; Facilities
            </h2>
            <p className="text-stone-500 text-xs sm:text-sm">
              We take pride in complete transparency. Every jar can be traced directly to our registered premises and organic sourcing grounds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Facility 1: Head Office / Marketed By */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-sm space-y-4 hover:border-amber-400 transition-colors">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center font-black">
                    <Building2 className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-black text-stone-900 text-sm uppercase">Registered Head Office</h3>
                    <p className="text-xs text-amber-800 font-bold">Marketed by Organichy Food</p>
                  </div>
                </div>
                <span className="bg-emerald-50 text-emerald-800 text-[10px] font-black px-2.5 py-1 rounded-full border border-emerald-200">
                  HQ &amp; DISPATCH
                </span>
              </div>

              <div className="space-y-2 text-xs text-stone-700 leading-relaxed">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Address:</strong> A-11 Shakti Nagar, Prem Nagar, Linepar, Moradabad - 244001 (Uttar Pradesh), India
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-600 shrink-0" />
                  <span><strong>FSSAI Central Lic No:</strong> 22725719000592</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-amber-600 shrink-0" />
                  <span><strong>Helpdesk:</strong> +91 7427446941 (Mon-Sat 9:30 AM - 6:30 PM)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-amber-600 shrink-0" />
                  <span><strong>Email:</strong> organichypb@gmail.com</span>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="https://maps.google.com/?q=A-11+Shakti+Nagar+Prem+Nagar+Linepar+Moradabad+244001"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 bg-stone-100 hover:bg-amber-500 hover:text-stone-950 text-stone-800 text-xs font-bold rounded-xl transition-all"
                >
                  <span>View on Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Facility 2: Certified Manufacturing Facility */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-sm space-y-4 hover:border-amber-400 transition-colors">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center font-black">
                    <ShieldCheck className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-black text-stone-900 text-sm uppercase">State-of-the-Art Plant</h3>
                    <p className="text-xs text-amber-800 font-bold">Manufactured by JUST BITE FOODS</p>
                  </div>
                </div>
                <span className="bg-blue-50 text-blue-800 text-[10px] font-black px-2.5 py-1 rounded-full border border-blue-200">
                  ISO 22000 &amp; GMP
                </span>
              </div>

              <div className="space-y-2 text-xs text-stone-700 leading-relaxed">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Plant Address:</strong> Plot No. 39, Block No. 221, Industrial Society, Village - Masma, Sub District-Olpad, Dist - Surat, Gujarat - 394540
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-600 shrink-0" />
                  <span><strong>FSSAI Manufacturing Lic:</strong> 10721999000720</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                  <span><strong>Certifications:</strong> US FDA Registered | Good Manufacturing Practice (GMP)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                  <span><strong>Production:</strong> Small-batch slow stoneground roasting</span>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="https://maps.google.com/?q=JUST+BITE+FOODS+Masma+Olpad+Surat+394540"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 bg-stone-100 hover:bg-amber-500 hover:text-stone-950 text-stone-800 text-xs font-bold rounded-xl transition-all"
                >
                  <span>View Facility Location</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Sourcing Origin Banner */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-5 text-center flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-left space-y-1">
              <p className="font-black text-xs text-amber-900 uppercase">Peanut Sourcing Origin</p>
              <p className="text-xs text-stone-700">Grade-A Organic Runner Peanuts sustainably harvested directly from Saurashtra, Gujarat.</p>
            </div>
            <span className="shrink-0 font-extrabold text-xs text-amber-800 bg-white px-3 py-1.5 rounded-lg border border-amber-200 shadow-sm">
              🌱 100% Organic Soil Origin
            </span>
          </div>
        </section>

        {/* 5. The 4 Quality Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 text-center space-y-2 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mx-auto mb-3 font-black text-lg border border-amber-200">
              1
            </div>
            <h3 className="font-extrabold text-sm text-stone-900 uppercase">Zero Palm Oil Ever</h3>
            <p className="text-xs text-stone-500">Natural oil separation is our proof of pure, unadulterated ingredients.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-stone-200 text-center space-y-2 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mx-auto mb-3 font-black text-lg border border-amber-200">
              2
            </div>
            <h3 className="font-extrabold text-sm text-stone-900 uppercase">32g High Protein</h3>
            <p className="text-xs text-stone-500">The highest natural biological value protein per 100g in Indian D2C.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-stone-200 text-center space-y-2 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mx-auto mb-3 font-black text-lg border border-amber-200">
              3
            </div>
            <h3 className="font-extrabold text-sm text-stone-900 uppercase">Pure Dark Cocoa</h3>
            <p className="text-xs text-stone-500">Authentic roasted dark cocoa without high refined sugars or cheap fats.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-stone-200 text-center space-y-2 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mx-auto mb-3 font-black text-lg border border-amber-200">
              4
            </div>
            <h3 className="font-extrabold text-sm text-stone-900 uppercase">Fresh Dispatch</h3>
            <p className="text-xs text-stone-500">Small batch manufacturing ensures every tub reaches you at peak freshness.</p>
          </div>
        </div>

        {/* 6. CTA */}
        <div className="text-center pt-2 pb-6">
          <Link
            href="/shop"
            className="inline-block bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs sm:text-sm uppercase px-8 py-4 rounded-xl transition-all shadow-xl hover:shadow-amber-500/20 active:scale-95"
          >
            EXPERIENCE ORGANICHY PURITY TODAY →
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
