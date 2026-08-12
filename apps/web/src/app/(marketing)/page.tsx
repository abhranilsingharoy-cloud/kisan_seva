"use client";

import HowItWorks from "@/components/home/HowItWorks";
import AgriFeatures from "@/components/home/AgriFeatures";
import AgriImpact from "@/components/home/AgriImpact";
import AgriStats from "@/components/home/AgriStats";
import AgriTrustStrip from "@/components/home/AgriTrustStrip";
import FarmerTestimonials from "@/components/home/FarmerTestimonials";
import AgriFAQ from "@/components/home/AgriFAQ";
import AgriFooter from "@/components/layout/AgriFooter";
import FullPageScroller from "@/components/ui/FullPageScroller";
import { ScrollReveal, StaggerReveal, StaggerChild } from "@/components/ui/ScrollReveal";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <FullPageScroller>
      {/* ── 0. HERO ── */}
      <div className="w-full h-full marketing-wrapper flex flex-col pt-24 relative overflow-hidden">
        {/* Text content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative w-full flex flex-col items-center pt-12 lg:pt-16 pb-8 z-10">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-slate-900 tracking-tight leading-[1.08] mb-6">
            Empower your farm, <br /> grow your future
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto font-normal leading-relaxed mb-9">
            Track prices, get weather updates, and manage crops all in one place.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/market"
              className="w-full sm:w-auto bg-transparent text-[#2A854B] font-medium px-8 py-3.5 rounded-full border border-[#2A854B] hover:bg-[#e7f4ec] transition-all text-base shadow-sm"
            >
              Monitor Prices
            </Link>
            <Link
              href="/schedule"
              className="w-full sm:w-auto bg-[#2A854B] hover:bg-[#226b3c] text-white font-medium px-8 py-3.5 rounded-full shadow-sm hover:shadow-md transition-all text-base"
            >
              Check Weather
            </Link>
          </div>
        </div>

        {/* Illustration — fills remaining height */}
        <div className="w-full relative flex-1 overflow-hidden flex justify-center z-10">
          <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-transparent to-transparent z-10 pointer-events-none" />
          <Image
            src="/hero-illustration.png"
            alt="AgriSmart Platform Illustration"
            width={1200}
            height={600}
            className="w-full max-w-5xl h-full object-contain object-bottom mix-blend-darken"
            priority
          />
        </div>
      </div>

      {/* ── 1. AGRI FEATURES ── */}
      <div className="w-full h-full bg-slate-50 flex flex-col justify-center pt-28 pb-4">
        <AgriFeatures />
      </div>

      {/* ── 2. AGRI IMPACT ── */}
      <div className="w-full h-full bg-slate-50 flex flex-col justify-center pt-28 pb-4">
        <AgriImpact />
      </div>

      {/* ── 3. PILLAR CARDS ── */}
      <div className="w-full h-full bg-white flex flex-col justify-center pt-28 pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <ScrollReveal preset="fade-down" className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-slate-300" />
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-wide text-center">
              What Do You Need?
            </h2>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-slate-300" />
          </ScrollReveal>
          <StaggerReveal className="grid grid-cols-1 md:grid-cols-3 gap-6" delay={0.1}>
            <PillarCard
              id="diagnose"
              title="Diagnose Crop"
              description="Snap a photo of your plant. Our AI identifies the disease, severity, and gives you step-by-step treatment in seconds."
              href="/diagnose"
              cardStyle="hover:border-blue-300"
              iconBg="bg-blue-50 text-blue-600 border border-blue-100"
              hoverColor="group-hover:text-blue-600"
              badgeColor="bg-blue-50 text-blue-700 border-blue-100"
              emoji="🔬"
            />
            <PillarCard
              id="market"
              title="Check Mandi Prices"
              description="Compare live prices across 500+ mandis nationwide. Find the highest bidder before you load your harvest."
              href="/market"
              cardStyle="hover:border-[#65a30d]/40"
              iconBg="bg-[#65a30d]/10 text-[#65a30d] border border-[#65a30d]/20"
              hoverColor="group-hover:text-emerald-600"
              badgeColor="bg-emerald-50 text-emerald-700 border-emerald-100"
              emoji="📈"
            />
            <PillarCard
              id="schedule"
              title="Smart Schedule"
              description="Get personalized irrigation and fertilizer schedules based on live weather, soil data, and your crop stage."
              href="/schedule"
              cardStyle="hover:border-amber-300"
              iconBg="bg-amber-50 text-amber-600 border border-amber-100"
              hoverColor="group-hover:text-amber-600"
              badgeColor="bg-amber-50 text-amber-700 border-amber-100"
              emoji="📅"
            />
          </StaggerReveal>
        </div>
      </div>

      {/* ── 4. HOW IT WORKS ── */}
      <div className="w-full h-full bg-slate-50 flex flex-col justify-center pt-28 pb-4">
        <HowItWorks />
      </div>

      {/* ── 5. STATS + TRUST ── */}
      <div className="w-full h-full bg-white flex flex-col justify-center pt-28 pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <ScrollReveal preset="fade-left" delay={0} className="lg:col-span-5">
              <AgriStats />
            </ScrollReveal>
            <ScrollReveal preset="fade-right" delay={0.15} className="lg:col-span-7">
              <AgriTrustStrip />
            </ScrollReveal>
          </div>
        </div>
      </div>

      {/* ── 6. FARMER TESTIMONIALS ── */}
      <div className="w-full h-full bg-white flex flex-col justify-center pt-28 pb-4">
        <FarmerTestimonials />
      </div>

      {/* ── 7. FAQ ── */}
      <div className="w-full h-full bg-slate-50 flex flex-col justify-center pt-28 pb-4">
        <AgriFAQ />
      </div>

      {/* ── 8. FOOTER ── */}
      <div className="w-full h-full bg-white flex flex-col justify-end">
        <AgriFooter />
      </div>
    </FullPageScroller>
  );
}

// ─── Inline PillarCard ─────
function PillarCard({
  id, title, description, href, cardStyle, iconBg, hoverColor, badgeColor, emoji,
}: {
  id: string; title: string; description: string; href: string;
  cardStyle: string; iconBg: string; hoverColor: string; badgeColor: string; emoji: string;
}) {
  return (
    <StaggerChild preset="stagger-child-scale">
      <Link
        href={href}
        className={`group p-7 rounded-2xl bg-white border border-slate-200 shadow-sm hover:-translate-y-1.5 hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full ${cardStyle}`}
      >
        <div>
          <div className="flex items-center justify-between mb-5">
            <div className={`w-14 h-14 rounded-2xl ${iconBg} flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform duration-300`}>
              {emoji}
            </div>
            <div className="p-2 rounded-full bg-slate-50 border border-slate-100 text-slate-400">
              <ArrowRight className={`w-4 h-4 ${hoverColor} group-hover:translate-x-1 transition-transform duration-300`} />
            </div>
          </div>
          <h3 className={`text-xl font-bold text-slate-900 ${hoverColor} transition-colors duration-300`}>{title}</h3>
          <p className="text-sm text-slate-500 mt-2 leading-relaxed">{description}</p>
        </div>
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
          <span className={`px-2.5 py-1 rounded-full border ${badgeColor}`}>Agri Portal</span>
          <span className="text-slate-400 group-hover:text-slate-600 flex items-center gap-1 transition-colors">
            Explore <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </Link>
    </StaggerChild>
  );
}
