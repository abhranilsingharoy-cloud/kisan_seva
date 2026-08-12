'use client'
import { useState } from 'react'
import { Users, Zap, ShieldCheck, Clock } from 'lucide-react'

// Copied EXACTLY from JanSuvidha CivicJusticeImpact.tsx
// Same: colored bg cards, rounded-3xl, icon in colored square, big font-extrabold number, hover lift

export default function AgriImpact() {
  const [hoveredStat, setHoveredStat] = useState<string | null>(null)

  return (
    <section
      id="agri-impact"
      className="relative py-20 overflow-hidden bg-slate-50 text-slate-900 flex flex-col justify-center h-full"
    >
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">

        {/* ─── HEADER — same as JanSuvidha ─── */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-mono font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            MEASURABLE RESULTS
          </span>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Trusted by Farmers Across India
          </h3>
          <p className="text-sm text-slate-600 max-w-xl mx-auto">
            Every feature transforms into verified farm impact. Here is what AI-powered agri intelligence delivers across India.
          </p>
        </div>

        {/* ─── IMPACT STATS — same colored cards as JanSuvidha ─── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              id: 'stat-farmers',
              value: '50,000+',
              label: 'Farmers Assisted',
              icon: Users,
              bg: 'bg-blue-50/80 border-blue-200 text-blue-900',
              iconBg: 'bg-blue-600 text-white',
            },
            {
              id: 'stat-diseases',
              value: '38',
              label: 'Diseases Detected',
              icon: Zap,
              bg: 'bg-purple-50/80 border-purple-200 text-purple-900',
              iconBg: 'bg-purple-600 text-white',
            },
            {
              id: 'stat-mandis',
              value: '500+',
              label: 'Live Mandi Prices',
              icon: ShieldCheck,
              bg: 'bg-emerald-50/80 border-emerald-200 text-emerald-900',
              iconBg: 'bg-emerald-600 text-white',
            },
            {
              id: 'stat-forecast',
              value: '7 Days',
              label: 'Weather Forecast',
              icon: Clock,
              bg: 'bg-amber-50/80 border-amber-200 text-amber-900',
              iconBg: 'bg-amber-500 text-white',
            },
          ].map((stat) => {
            const IconComp = stat.icon
            const isHovered = hoveredStat === stat.id

            return (
              <div
                key={stat.id}
                onMouseEnter={() => setHoveredStat(stat.id)}
                onMouseLeave={() => setHoveredStat(null)}
                // Same classes as JanSuvidha — rounded-3xl, hover lift, border
                className={`p-6 rounded-3xl border text-center cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] ${stat.bg} ${
                  isHovered ? 'shadow-md' : 'shadow-xs'
                }`}
              >
                <div className={`w-12 h-12 mx-auto rounded-2xl ${stat.iconBg} flex items-center justify-center mb-3 shadow-xs`}>
                  <IconComp className="w-6 h-6" />
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight">
                  {stat.value}
                </div>
                <div className="text-xs font-bold opacity-80 mt-1">
                  {stat.label}
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
