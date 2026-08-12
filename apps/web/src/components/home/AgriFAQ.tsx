"use client";
import { useState } from "react";
import { Search, ChevronDown, HelpCircle } from "lucide-react";
import { ScrollReveal, StaggerReveal, StaggerChild } from "@/components/ui/ScrollReveal";

export default function AgriFAQ() {
  const [searchQuery, setSearchQuery] = useState("");
  const faqs = [
    { question: "How accurate is the crop disease detection?", answer: "Our MobileNetV3 model achieves 91%+ accuracy across 38 plant disease classes from the PlantVillage dataset, including diseases affecting tomato, wheat, rice, cotton, potato, and more." },
    { question: "How often are mandi prices updated?", answer: "Prices are fetched from AGMARKNET (the official government agricultural market data API) and refreshed every 15 minutes for real-time accuracy." },
    { question: "Is my farm data private and secure?", answer: "Yes. We encrypt all data at rest and in transit. Your land records, crop history, and location are never sold or shared with third parties." },
    { question: "Which crops and diseases can the AI detect?", answer: "The system covers 38 disease classes across 14 crops including Tomato, Wheat, Rice, Potato, Cotton, Corn, Grape, Apple, Soybean, Strawberry, and more." },
    { question: "Can I use this without internet?", answer: "The disease scanner requires internet for the initial model query. However, previously loaded mandi prices and schedules are cached locally for offline viewing." },
    { question: "Is there any cost to use KisanSeva?", answer: "No. KisanSeva is completely free for farmers. All features — disease detection, market prices, and scheduling — are available at zero cost." },
  ];

  const [openId, setOpenId] = useState<string | null>(faqs[0].question);

  const filteredFaqs = faqs.filter(
    (f) => f.question.toLowerCase().includes(searchQuery.toLowerCase()) || f.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8">

      {/* Header */}
      <ScrollReveal preset="fade-up" className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-7">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2">
            <HelpCircle className="w-7 h-7 text-[#65a30d]" />
            <span>Frequently Asked Questions</span>
          </h2>
          <p className="text-sm text-slate-500 mt-1">Disease detection, prices, privacy, and schedule answers.</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search FAQs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#65a30d] shadow-sm"
          />
        </div>
      </ScrollReveal>

      {/* 2-column accordion — staggered */}
      <StaggerReveal className="grid grid-cols-1 md:grid-cols-2 gap-3 items-start" delay={0.1} threshold={0.05}>
        {filteredFaqs.map((faq) => {
          const isOpen = openId === faq.question;
          return (
            <StaggerChild key={faq.question} preset="stagger-child">
              <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm">
                <button
                  onClick={() => setOpenId(isOpen ? null : faq.question)}
                  className="w-full px-5 py-3.5 text-left flex items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
                >
                  <span className="text-sm font-semibold text-slate-900">{faq.question}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180 text-[#65a30d]" : ""}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/30">
                    {faq.answer}
                  </div>
                )}
              </div>
            </StaggerChild>
          );
        })}
      </StaggerReveal>

      {filteredFaqs.length === 0 && (
        <div className="text-center py-8 text-slate-500 text-sm">
          No matching questions found for &ldquo;{searchQuery}&rdquo;.
        </div>
      )}
    </div>
  );
}
