'use client'

// Assembled EXACTLY like JanSuvidha page.tsx — FullPageScroller with snap sections
import FullPageScroller from '@/components/ui/FullPageScroller'
import Hero from '@/components/home/Hero'
import AgriFeatures from '@/components/home/AgriFeatures'
import AgriImpact from '@/components/home/AgriImpact'
import AgriPillarCards from '@/components/home/AgriPillarCards'
import AgriHowItWorks from '@/components/home/AgriHowItWorks'
import AgriStats from '@/components/home/AgriStats'
import Link from 'next/link'
import { ArrowRight, Leaf, Phone, MapPin, GitBranch } from 'lucide-react'

export default function HomePage() {
  return (
    <FullPageScroller>

      {/* ── 0. HERO ── same as JanSuvidha section 0 */}
      <div className="w-full h-full bg-white flex flex-col justify-center">
        <Hero />
      </div>

      {/* ── 1. FEATURES ── same as JanSuvidha section 1 */}
      <div className="w-full min-h-full bg-slate-50 flex flex-col justify-center">
        <AgriFeatures />
      </div>

      {/* ── 2. IMPACT STATS ── same as JanSuvidha section 1.5 */}
      <div className="w-full min-h-full bg-slate-50 flex flex-col justify-center">
        <AgriImpact />
      </div>

      {/* ── 3. PILLAR CARDS ── same as JanSuvidha section 2 */}
      <div className="w-full min-h-full bg-white flex flex-col justify-center py-12">
        <AgriPillarCards />
      </div>

      {/* ── 4. HOW IT WORKS ── same as JanSuvidha section 3 */}
      <div className="w-full min-h-full bg-slate-50 flex flex-col justify-center py-12">
        <AgriHowItWorks />
      </div>

      {/* ── 5. STATS + TRUST ── same as JanSuvidha section 4 */}
      <div className="w-full min-h-full bg-white flex flex-col justify-center py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: AgriStats (StatsBand equivalent) */}
            <div className="lg:col-span-5">
              <AgriStats />
            </div>
            {/* Right: Trust cards (TrustStrip equivalent) */}
            <div className="lg:col-span-7">
              <div className="space-y-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Why Farmers Trust Us</span>
                <h3 className="text-xl font-bold text-slate-900">Built for Indian Agricultural Conditions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  {[
                    { icon: '🔒', title: 'Private & Secure', desc: 'Your farm data never leaves your device without consent. Zero-knowledge architecture.' },
                    { icon: '📶', title: 'Works Offline', desc: 'Core diagnosis works offline. Sync when connectivity returns. No data wasted.' },
                    { icon: '🌾', title: 'India-Trained AI', desc: 'Models trained specifically on Indian crop varieties, field conditions, and local diseases.' },
                    { icon: '🆓', title: 'Free Forever', desc: 'Core features always free for smallholder farmers. No subscription. No hidden fees.' },
                    { icon: '🗣️', title: '8 Indian Languages', desc: 'Hindi, Bengali, Telugu, Tamil, Marathi, Gujarati, Kannada, and English.' },
                    { icon: '📞', title: 'IVR & SMS', desc: 'Full advisory via missed-call IVR. No smartphone required at all.' },
                  ].map((t, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-[#65a30d]/30 hover:bg-[#65a30d]/5 transition-all duration-200">
                      <span className="text-xl mt-0.5 shrink-0">{t.icon}</span>
                      <div>
                        <div className="text-sm font-bold text-slate-900">{t.title}</div>
                        <div className="text-xs text-slate-500 mt-0.5 leading-relaxed">{t.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 6. FOOTER ── same dark navy as JanSuvidha footer */}
      <div className="w-full min-h-full bg-white flex flex-col justify-end">
        <footer className="w-full bg-gradient-to-b from-[#050A30] via-[#0a1040] to-[#120830] text-slate-400">

          {/* Top agri SVG scene */}
          <div className="relative w-full h-32 overflow-hidden opacity-20">
            <svg viewBox="0 0 1200 128" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <path d="M0 128 Q150 80 300 100 Q450 120 600 90 Q750 60 900 85 Q1050 110 1200 75 L1200 128 Z" fill="#4f8ff7" opacity="0.3" />
              {[80,200,380,520,680,820,1000,1140].map((x, i) => (
                <g key={i} transform={`translate(${x}, ${60 + (i%3)*8})`} opacity="0.6">
                  <line x1="0" y1="68" x2="0" y2="0" stroke="#818cf8" strokeWidth="1.5" />
                  <circle cx="0" cy="-8" r={10+(i%3)*3} fill="#818cf8" opacity="0.4" />
                </g>
              ))}
              {[150,400,700,950,1100].map((x,i) => (
                <g key={i} transform={`translate(${x}, 80)`} opacity="0.4">
                  <line x1="0" y1="0" x2="0" y2="-12" stroke="#4f8ff7" strokeWidth="1" />
                  <path d="M-4,-8 Q0,-14 4,-8" fill="#4f8ff7" opacity="0.6" />
                </g>
              ))}
            </svg>
          </div>

          {/* Footer content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

              {/* Brand */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-xl bg-[#65a30d] flex items-center justify-center">
                    <Leaf className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-lg font-bold text-white">KisanSeva</span>
                </div>
                <p className="text-sm leading-relaxed text-slate-400 max-w-xs">
                  AI-powered farm advisory for 140 million smallholder farmers across India. Built for Track 03 AgriTech.
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <a href="https://github.com/abhranilsingharoy-cloud/kisan_seva" target="_blank" rel="noopener noreferrer"
                    className="p-2 rounded-lg border border-slate-700 hover:border-slate-500 text-slate-500 hover:text-slate-300 transition-all">
                    <GitBranch className="w-4 h-4" />
                  </a>
                  <a href="tel:+1800-KISAN" className="p-2 rounded-lg border border-slate-700 hover:border-slate-500 text-slate-500 hover:text-slate-300 transition-all">
                    <Phone className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Platform links */}
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-slate-300 mb-4">Platform</div>
                <ul className="space-y-2.5">
                  {[['Home', '/'], ['Diagnose Crop', '/diagnose'], ['Mandi Prices', '/market'], ['Farm Schedule', '/schedule'], ['Dashboard', '/dashboard']].map(([label, href]) => (
                    <li key={label}>
                      <Link href={href} className="text-sm text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1.5 group">
                        <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-[#65a30d]" />
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Features */}
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-slate-300 mb-4">Features</div>
                <ul className="space-y-2.5">
                  {['AI Disease Detection', 'Live Mandi Prices', 'Weather Advisory', 'Soil Health Tracking', 'SMS & IVR Access', 'Hindi Support'].map(f => (
                    <li key={f} className="text-sm text-slate-400">{f}</li>
                  ))}
                </ul>
              </div>

              {/* Emergency agri helpline */}
              <div>
                <div className="text-lg font-bold text-white mb-4">Kisan Helpline</div>
                <div className="flex flex-col gap-3">
                  <a href="tel:1800-180-1551"
                    className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-red-500/25 bg-red-500/10 text-red-300 text-sm font-semibold hover:border-red-500/50 hover:shadow-lg hover:-translate-y-0.5 transition-all">
                    <Phone className="w-4 h-4 shrink-0" />
                    Kisan Call Centre: 1800-180-1551
                  </a>
                  <Link href="/dashboard"
                    className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-slate-600/40 bg-slate-700/30 text-slate-200 text-sm font-semibold hover:border-[#65a30d]/40 hover:shadow-lg hover:-translate-y-0.5 transition-all backdrop-blur-sm">
                    <MapPin className="w-4 h-4 shrink-0" />
                    View Nearest Agri Centres
                    <ArrowRight className="w-4 h-4 ml-auto" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10">
              {[
                { emoji: '🛡️', label: 'Data Privacy Protected' },
                { emoji: '🌾', label: 'India-Trained AI Models' },
                { emoji: '📶', label: 'Works Offline' },
              ].map((t) => (
                <div key={t.label} className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-800/50 border border-slate-700/40 backdrop-blur-sm hover:border-[#65a30d]/30 transition-all">
                  <span className="text-xl">{t.emoji}</span>
                  <span className="text-sm font-semibold text-slate-300">{t.label}</span>
                </div>
              ))}
            </div>

            {/* Bottom strip with heartbeat line */}
            <div className="mt-10 pt-6 relative">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent overflow-hidden">
                <div className="footer-heartbeat-pulse" />
              </div>
              <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-slate-500">
                <span>© 2025 KisanSeva. All rights reserved.</span>
                <span>Track 03 AgriTech · IEMH4-AG-01 · Powered by Gemini, Groq, OpenWeather, Agmarknet</span>
              </div>
            </div>
          </div>
        </footer>
      </div>

    </FullPageScroller>
  )
}
