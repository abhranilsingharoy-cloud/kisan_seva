'use client'
import { useState } from 'react'
import { Shield, Microscope, TrendingUp, CloudSun, Droplets, Leaf, Phone, Bell, Globe, Cpu } from 'lucide-react'

// Copied EXACTLY from JanSuvidha CivicJusticeFeatures.tsx — same card layout, same patterns
// Only content changed: civic justice → agriculture

interface FeatureCard {
  id: string
  title: string
  category: string
  description: string
  icon: any
  accentColor: string
  iconBg: string
  badgeText: string
  revealBadges: string[]
}

const FEATURE_CARDS: FeatureCard[] = [
  {
    id: 'disease-ai',
    title: 'Crop Disease AI',
    category: 'Neural Classification',
    description: 'Upload a leaf photo — get disease name, confidence score, and treatment plan in under 5 seconds using MobileNetV3.',
    icon: Microscope,
    accentColor: 'text-blue-600',
    iconBg: 'bg-blue-50 border-blue-200/80 text-blue-600',
    badgeText: 'AI ENGINE',
    revealBadges: ['38 Diseases', 'MobileNetV3', '<5s Result'],
  },
  {
    id: 'live-mandi',
    title: 'Live Mandi Prices',
    category: 'Agmarknet Integration',
    description: 'Real-time prices from 500+ mandis with net-value ranking, distance filtering, and price trend charts.',
    icon: TrendingUp,
    accentColor: 'text-amber-600',
    iconBg: 'bg-amber-50 border-amber-200/80 text-amber-600',
    badgeText: 'LIVE MARKET',
    revealBadges: ['Agmarknet Live', '500+ Mandis', 'Distance Ranked'],
  },
  {
    id: 'weather-advisory',
    title: 'Weather Advisory',
    category: 'OpenWeather Forecast',
    description: '7-day forecast with crop-specific irrigation recommendations using ET₀ Hargreaves equation for your exact plot.',
    icon: CloudSun,
    accentColor: 'text-cyan-600',
    iconBg: 'bg-cyan-50 border-cyan-200/80 text-cyan-600',
    badgeText: 'WEATHER AI',
    revealBadges: ['7-Day Forecast', 'ET₀ Calc', 'Spray Windows'],
  },
  {
    id: 'smart-scheduling',
    title: 'Smart Scheduling',
    category: 'Personalised Irrigation',
    description: 'Plot-wise weekly irrigation and fertilizer schedules calibrated to soil health, crop stage, and upcoming weather.',
    icon: Droplets,
    accentColor: 'text-teal-600',
    iconBg: 'bg-teal-50 border-teal-200/80 text-teal-600',
    badgeText: 'IRRIGATION',
    revealBadges: ['Plot-wise', 'N-P-K Tracking', 'Stage Aware'],
  },
  {
    id: 'soil-health',
    title: 'Soil Health Monitor',
    category: 'N-P-K Tracking',
    description: 'Track N-P-K levels, pH, organic carbon and moisture. Integrated with Soil Health Card Portal data.',
    icon: Leaf,
    accentColor: 'text-emerald-600',
    iconBg: 'bg-emerald-50 border-emerald-200/80 text-emerald-600',
    badgeText: 'SOIL HEALTH',
    revealBadges: ['N-P-K Bars', 'pH Tracking', 'Soil Card'],
  },
  {
    id: 'outbreak-detection',
    title: 'Outbreak Detection',
    category: 'Regional Disease Alerts',
    description: 'Regional disease outbreak alerts aggregated from farmer reports and weather patterns. Notifies neighbours automatically.',
    icon: Bell,
    accentColor: 'text-rose-600',
    iconBg: 'bg-rose-50 border-rose-200/80 text-rose-600',
    badgeText: 'VIGILANCE GRID',
    revealBadges: ['Regional', 'Auto-Alert', 'Pattern AI'],
  },
  {
    id: 'sms-ivr',
    title: 'SMS & IVR Access',
    category: 'Zero-Smartphone Advisory',
    description: 'Full farm advisory via SMS or missed-call IVR — no smartphone or internet required. Works on any keypad phone.',
    icon: Phone,
    accentColor: 'text-purple-600',
    iconBg: 'bg-purple-50 border-purple-200/80 text-purple-600',
    badgeText: 'OUTREACH',
    revealBadges: ['No Internet', 'Hindi Support', 'IVR Ready'],
  },
  {
    id: 'multi-language',
    title: 'Hindi + 7 Languages',
    category: 'Multilingual Engine',
    description: '8 Indian languages with automatic transliteration and voice-ready response cards for maximum farmer reach.',
    icon: Globe,
    accentColor: 'text-indigo-600',
    iconBg: 'bg-indigo-50 border-indigo-200/80 text-indigo-600',
    badgeText: 'MULTI-LANG',
    revealBadges: ['8 Languages', 'Transliterate', 'Voice Ready'],
  },
]

export default function AgriFeatures() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  return (
    // Exact same section structure as JanSuvidha CivicJusticeFeatures
    <section id="agri-features" className="relative py-20 overflow-hidden bg-slate-50 text-slate-900">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ─── HEADER — same as JanSuvidha ─── */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3.5">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#65a30d]/30 bg-[#65a30d]/10 px-4 py-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[#65a30d] shadow-sm">
            <Shield className="w-3.5 h-3.5 text-[#65a30d] animate-pulse" />
            <span>● AGRI INTELLIGENCE OPERATING SYSTEM</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Engineered for Indian Smallholder Farmers
          </h2>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Secure, data-driven, and intelligence-powered tools built for 140 million smallholder farmers across India.
          </p>
        </div>

        {/* ─── FEATURE CARDS GRID — same 4-col grid as JanSuvidha ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURE_CARDS.map((card) => {
            const IconComponent = card.icon
            const isHovered = hoveredCard === card.id

            return (
              <div
                key={card.id}
                onMouseEnter={() => setHoveredCard(card.id)}
                onMouseLeave={() => setHoveredCard(null)}
                // Same card classes as JanSuvidha — hover:-translate-y-1, hover:shadow-md
                className="relative p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between group overflow-hidden"
              >
                <div>
                  {/* Top: mono badge left + rotating icon right — identical to JanSuvidha */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {card.badgeText}
                    </span>
                    <div className={`p-3 rounded-2xl border ${card.iconBg} group-hover:rotate-6 group-hover:scale-110 transition-all duration-300 shadow-2xs`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className={`text-lg font-bold text-slate-900 transition-colors ${isHovered ? card.accentColor : ''}`}>
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mt-2">
                    {card.description}
                  </p>
                </div>

                {/* Bottom: reveal chips — identical to JanSuvidha */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex flex-wrap gap-1.5">
                  {card.revealBadges.map((badge, idx) => (
                    <span
                      key={idx}
                      className={`text-[9px] font-mono font-semibold px-2 py-0.5 rounded transition-all ${
                        isHovered
                          ? 'bg-slate-100 text-slate-800 border border-slate-200'
                          : 'bg-slate-50 text-slate-500 border border-slate-100'
                      }`}
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
