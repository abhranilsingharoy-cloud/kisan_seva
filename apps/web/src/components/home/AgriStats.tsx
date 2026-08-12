'use client'
import { Users, Leaf, TrendingUp, Clock } from 'lucide-react'

// Copied from JanSuvidha StatsBand.tsx + TrustStrip — same 2x2 rounded stat cards

export default function AgriStats() {
  const stats = [
    { label: 'Farmers Assisted', value: '50,000+', icon: Users,      iconBg: 'bg-[#65a30d]/10 text-[#65a30d]' },
    { label: 'Diseases Detected', value: '38',      icon: Leaf,       iconBg: 'bg-amber-50 text-amber-500' },
    { label: 'Live Mandi Prices', value: '500+',    icon: TrendingUp, iconBg: 'bg-[#65a30d]/10 text-[#65a30d]' },
    { label: 'Forecast Accuracy', value: '94%',     icon: Clock,      iconBg: 'bg-slate-50 text-slate-500' },
  ]

  return (
    <div className="space-y-5">
      <div className="text-left">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Platform Impact</span>
        <h3 className="text-xl font-bold text-slate-900 mt-1">Accuracy &amp; Reach</h3>
      </div>

      {/* Same 2x2 grid as JanSuvidha StatsBand */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map((st, i) => {
          const Icon = st.icon
          return (
            <div key={i} className="p-5 rounded-3xl border border-slate-200 bg-white flex flex-col items-center justify-center text-center shadow-sm hover:scale-[1.02] transition-transform">
              <div className={`w-9 h-9 rounded-full ${st.iconBg} flex items-center justify-center mb-2.5 shadow`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="text-2xl font-black tracking-tight text-slate-900">{st.value}</div>
              <div className="text-xs font-semibold text-slate-500 mt-0.5">{st.label}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
