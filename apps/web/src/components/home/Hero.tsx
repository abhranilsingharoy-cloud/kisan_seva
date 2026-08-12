'use client'
import Link from 'next/link'

// Copied from JanSuvidha Hero.tsx — same radial gradient, same layout, farm content
export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white flex flex-col items-center w-full h-full">

      {/* Same Indian tricolour radial gradients as JanSuvidha */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 0% 0%, rgba(255,185,50,0.35) 0%, transparent 60%)' }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 100% 0%, rgba(30,160,30,0.25) 0%, transparent 60%)' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.6) 40%, #ffffff 90%)' }} />
      </div>

      {/* Text content — same structure as JanSuvidha */}
      <div
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative w-full flex flex-col items-center pt-8 lg:pt-12 pb-6"
        style={{ zIndex: 1 }}
      >
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-slate-900 tracking-tight leading-[1.08] mb-5">
          Grow smarter,<br />harvest better
        </h1>
        <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto font-normal leading-relaxed mb-9">
          Take control of your farm by discovering crop diseases instantly, checking live mandi prices, and getting personalised irrigation advice.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/market"
            className="w-full sm:w-auto bg-white text-slate-700 font-medium px-8 py-3.5 rounded-xl border border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-all text-base shadow-sm"
          >
            Browse Market Prices
          </Link>
          <Link
            href="/diagnose"
            className="w-full sm:w-auto bg-[#65a30d] hover:bg-[#4d7c0f] text-white font-medium px-8 py-3.5 rounded-xl shadow-sm hover:shadow-md transition-all text-base"
          >
            Diagnose Crop Now
          </Link>
        </div>
      </div>

      {/* Farm illustration fills remaining space — same mix-blend-darken technique */}
      <div className="w-full relative flex-1 overflow-hidden flex justify-center" style={{ zIndex: 1 }}>
        <div className="absolute top-0 left-0 right-0 h-14 bg-gradient-to-b from-white to-transparent z-10" />
        {/* Inline SVG farm scene — same line-art style as JanSuvidha's welfare illustration */}
        <svg
          viewBox="0 0 1200 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full max-w-5xl h-full object-contain object-bottom mix-blend-darken"
          aria-label="Farm illustration"
        >
          {/* Sky gradient layer */}
          <defs>
            <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f0fdf4" />
              <stop offset="100%" stopColor="#ffffff" />
            </linearGradient>
            <linearGradient id="groundGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#bbf7d0" />
              <stop offset="100%" stopColor="#86efac" />
            </linearGradient>
          </defs>

          {/* Ground */}
          <rect x="0" y="300" width="1200" height="100" fill="url(#groundGrad)" opacity="0.3" />
          <line x1="0" y1="300" x2="1200" y2="300" stroke="#16a34a" strokeWidth="2" opacity="0.4" />

          {/* Rolling hills */}
          <path d="M0 300 Q200 240 400 270 Q600 300 800 255 Q1000 210 1200 240 L1200 400 L0 400 Z" fill="#dcfce7" opacity="0.5" />

          {/* ── TRACTOR ── */}
          <g transform="translate(780, 230)">
            {/* Body */}
            <rect x="10" y="20" width="90" height="50" rx="6" fill="#166534" opacity="0.85" />
            {/* Cabin */}
            <rect x="50" y="4" width="48" height="24" rx="4" fill="#15803d" opacity="0.9" />
            {/* Windows */}
            <rect x="56" y="8" width="16" height="14" rx="2" fill="#bbf7d0" opacity="0.7" />
            <rect x="76" y="8" width="14" height="14" rx="2" fill="#bbf7d0" opacity="0.7" />
            {/* Exhaust pipe */}
            <rect x="94" y="0" width="5" height="14" rx="2" fill="#166534" opacity="0.7" />
            <ellipse cx="96.5" cy="0" rx="4" ry="2.5" fill="#166534" opacity="0.5" />
            {/* Smoke puffs */}
            <circle cx="96" cy="-6" r="4" fill="#e2e8f0" opacity="0.4" />
            <circle cx="100" cy="-12" r="3" fill="#e2e8f0" opacity="0.3" />
            <circle cx="94" cy="-16" r="2.5" fill="#e2e8f0" opacity="0.2" />
            {/* Big rear wheel */}
            <circle cx="28" cy="72" r="28" fill="none" stroke="#166534" strokeWidth="5" opacity="0.8" />
            <circle cx="28" cy="72" r="18" fill="none" stroke="#166534" strokeWidth="2" opacity="0.5" />
            <circle cx="28" cy="72" r="5" fill="#166534" opacity="0.8" />
            {/* Tread lines */}
            {[0,45,90,135,180,225,270,315].map(a => (
              <line key={a}
                x1={28 + Math.cos(a*Math.PI/180)*18} y1={72 + Math.sin(a*Math.PI/180)*18}
                x2={28 + Math.cos(a*Math.PI/180)*26} y2={72 + Math.sin(a*Math.PI/180)*26}
                stroke="#166534" strokeWidth="2.5" opacity="0.7" />
            ))}
            {/* Small front wheel */}
            <circle cx="88" cy="68" r="18" fill="none" stroke="#166534" strokeWidth="4" opacity="0.8" />
            <circle cx="88" cy="68" r="10" fill="none" stroke="#166534" strokeWidth="1.5" opacity="0.4" />
            <circle cx="88" cy="68" r="4" fill="#166534" opacity="0.8" />
            {/* Plough attachment */}
            <line x1="10" y1="55" x2="-30" y2="60" stroke="#166534" strokeWidth="3" opacity="0.6" />
            <path d="M-30,55 L-40,65 L-20,65 Z" fill="#166534" opacity="0.6" />
          </g>

          {/* ── MARKET STALL ── */}
          <g transform="translate(440, 180)">
            {/* Building */}
            <rect x="0" y="40" width="140" height="90" rx="4" fill="#f0fdf4" stroke="#16a34a" strokeWidth="2" opacity="0.7" />
            {/* Roof */}
            <path d="M-15 44 L70 10 L155 44" fill="#dcfce7" stroke="#16a34a" strokeWidth="2" opacity="0.8" />
            {/* Sign */}
            <rect x="30" y="50" width="80" height="20" rx="3" fill="#16a34a" opacity="0.8" />
            <text x="70" y="64" textAnchor="middle" fill="white" fontSize="10" fontFamily="Inter,sans-serif" fontWeight="700" opacity="0.9">MANDI</text>
            {/* Door */}
            <rect x="55" y="90" width="30" height="40" rx="3" fill="#bbf7d0" stroke="#16a34a" strokeWidth="1.5" opacity="0.6" />
            {/* Windows */}
            <rect x="12" y="88" width="28" height="22" rx="2" fill="#bbf7d0" stroke="#16a34a" strokeWidth="1.2" opacity="0.5" />
            <rect x="100" y="88" width="28" height="22" rx="2" fill="#bbf7d0" stroke="#16a34a" strokeWidth="1.2" opacity="0.5" />
            {/* Produce boxes outside */}
            <rect x="-20" y="118" width="20" height="12" rx="2" fill="#fef08a" stroke="#ca8a04" strokeWidth="1" opacity="0.7" />
            <rect x="-20" y="107" width="20" height="12" rx="2" fill="#fca5a5" stroke="#dc2626" strokeWidth="1" opacity="0.6" />
            <rect x="140" y="112" width="22" height="14" rx="2" fill="#86efac" stroke="#16a34a" strokeWidth="1" opacity="0.7" />
          </g>

          {/* ── IoT TOWER LEFT ── */}
          <g transform="translate(180, 130)">
            <line x1="20" y1="0" x2="20" y2="170" stroke="#64748b" strokeWidth="3" opacity="0.5" />
            <line x1="5" y1="30" x2="35" y2="30" stroke="#64748b" strokeWidth="2" opacity="0.4" />
            <line x1="8" y1="55" x2="32" y2="55" stroke="#64748b" strokeWidth="2" opacity="0.4" />
            <line x1="10" y1="80" x2="30" y2="80" stroke="#64748b" strokeWidth="2" opacity="0.4" />
            {/* Wifi rings */}
            <path d="M4,16 Q20,6 36,16" stroke="#16a34a" strokeWidth="2" fill="none" opacity="0.7" />
            <path d="M9,22 Q20,14 31,22" stroke="#16a34a" strokeWidth="2" fill="none" opacity="0.6" />
            <circle cx="20" cy="27" r="3" fill="#16a34a" opacity="0.7" />
            {/* Signal dot animated */}
            <circle cx="20" cy="27" r="6" fill="none" stroke="#16a34a" strokeWidth="1" opacity="0.4">
              <animate attributeName="r" values="6;12;6" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.4;0;0.4" dur="2s" repeatCount="indefinite" />
            </circle>
          </g>

          {/* ── IoT TOWER RIGHT ── */}
          <g transform="translate(960, 150)">
            <line x1="20" y1="0" x2="20" y2="150" stroke="#64748b" strokeWidth="3" opacity="0.5" />
            <line x1="5" y1="25" x2="35" y2="25" stroke="#64748b" strokeWidth="2" opacity="0.4" />
            <line x1="8" y1="50" x2="32" y2="50" stroke="#64748b" strokeWidth="2" opacity="0.4" />
            <path d="M4,10 Q20,0 36,10" stroke="#16a34a" strokeWidth="2" fill="none" opacity="0.7" />
            <path d="M9,16 Q20,8 31,16" stroke="#16a34a" strokeWidth="2" fill="none" opacity="0.6" />
            <circle cx="20" cy="21" r="3" fill="#16a34a" opacity="0.7" />
          </g>

          {/* ── TREES ── */}
          {[60, 110, 360, 390, 680, 1080, 1120, 1160].map((x, i) => (
            <g key={i} transform={`translate(${x}, ${210 + (i%3)*8})`} opacity="0.6">
              <line x1="0" y1="90" x2="0" y2="0" stroke="#166534" strokeWidth="3" />
              <circle cx="0" cy="-16" r={20 + (i%3)*4} fill="#16a34a" opacity="0.7" />
              <circle cx="-10" cy="-8" r={12 + (i%2)*3} fill="#22c55e" opacity="0.5" />
            </g>
          ))}

          {/* ── CROP ROWS ── */}
          {[0,1,2,3,4].map(row => (
            <g key={row}>
              {[0,1,2,3,4,5,6,7,8,9,10,11].map(col => {
                const x = 50 + col * 95 + row * 12
                const y = 315 + row * 14
                return (
                  <g key={col} transform={`translate(${x}, ${y})`} opacity={0.5 + row*0.06}>
                    <line x1="0" y1="0" x2="0" y2="-18" stroke="#16a34a" strokeWidth="1.5" />
                    <path d="M-6,-12 Q0,-20 6,-12" fill="#22c55e" opacity="0.8" />
                    <path d="M-5,-8 Q0,-15 5,-8" fill="#16a34a" opacity="0.7" />
                    <path d="M-3,-5 Q0,-10 3,-5" fill="#166534" opacity="0.6" />
                  </g>
                )
              })}
            </g>
          ))}

          {/* ── FARMER LEFT (woman with phone) ── */}
          <g transform="translate(290, 255)" opacity="0.75">
            {/* Hat */}
            <ellipse cx="0" cy="-64" rx="18" ry="5" fill="#854d0e" opacity="0.7" />
            <path d="M-10,-64 Q0,-80 10,-64" fill="#a16207" opacity="0.7" />
            {/* Head */}
            <circle cx="0" cy="-50" r="12" fill="#fde68a" opacity="0.9" />
            {/* Body */}
            <path d="M0,-38 L-14,0 L14,0 Z" fill="#16a34a" opacity="0.8" />
            {/* Arms */}
            <line x1="-8" y1="-28" x2="-30" y2="-10" stroke="#fde68a" strokeWidth="4" opacity="0.8" />
            <rect x="-42" y="-16" width="14" height="10" rx="2" fill="#0f172a" opacity="0.7" />
            {/* Screen glow */}
            <rect x="-41" y="-15" width="12" height="8" rx="1" fill="#bbf7d0" opacity="0.5" />
            <line x1="8" y1="-28" x2="18" y2="-8" stroke="#fde68a" strokeWidth="4" opacity="0.8" />
            {/* Legs */}
            <line x1="-6" y1="0" x2="-10" y2="38" stroke="#fde68a" strokeWidth="5" opacity="0.8" />
            <line x1="6" y1="0" x2="10" y2="38" stroke="#fde68a" strokeWidth="5" opacity="0.8" />
          </g>

          {/* ── FARMER RIGHT (man with tablet, inspecting crop) ── */}
          <g transform="translate(920, 260)" opacity="0.75">
            {/* Hat */}
            <ellipse cx="0" cy="-64" rx="22" ry="5" fill="#854d0e" opacity="0.7" />
            <path d="M-14,-64 Q0,-82 14,-64" fill="#a16207" opacity="0.7" />
            {/* Head */}
            <circle cx="0" cy="-50" r="12" fill="#fde68a" opacity="0.9" />
            {/* Body */}
            <path d="M0,-38 L-14,0 L14,0 Z" fill="#0f5132" opacity="0.8" />
            {/* Arms */}
            <line x1="8" y1="-28" x2="34" y2="-12" stroke="#fde68a" strokeWidth="4" opacity="0.8" />
            <rect x="32" y="-18" width="18" height="12" rx="2" fill="#0f172a" opacity="0.7" />
            <rect x="33" y="-17" width="16" height="10" rx="1" fill="#bbf7d0" opacity="0.5" />
            <line x1="-8" y1="-28" x2="-18" y2="-5" stroke="#fde68a" strokeWidth="4" opacity="0.8" />
            {/* Legs */}
            <line x1="-5" y1="0" x2="-9" y2="38" stroke="#fde68a" strokeWidth="5" opacity="0.8" />
            <line x1="5" y1="0" x2="9" y2="38" stroke="#fde68a" strokeWidth="5" opacity="0.8" />
          </g>

          {/* ── CLOUDS ── */}
          <g opacity="0.35">
            <ellipse cx="320" cy="55" rx="40" ry="18" fill="#e2e8f0" />
            <ellipse cx="350" cy="45" rx="30" ry="16" fill="#f1f5f9" />
            <ellipse cx="290" cy="52" rx="28" ry="13" fill="#e2e8f0" />
          </g>
          <g opacity="0.25">
            <ellipse cx="750" cy="70" rx="32" ry="14" fill="#e2e8f0" />
            <ellipse cx="778" cy="62" rx="22" ry="13" fill="#f1f5f9" />
          </g>

          {/* ── SUN ── */}
          <g transform="translate(1100,70)" opacity="0.3">
            <circle cx="0" cy="0" r="22" fill="#fef08a" />
            {[0,45,90,135,180,225,270,315].map(a => (
              <line key={a}
                x1={Math.cos(a*Math.PI/180)*26} y1={Math.sin(a*Math.PI/180)*26}
                x2={Math.cos(a*Math.PI/180)*36} y2={Math.sin(a*Math.PI/180)*36}
                stroke="#fbbf24" strokeWidth="2.5" />
            ))}
          </g>

          {/* ── DATA FLOW lines (IoT connected feel) ── */}
          <path d="M200,200 Q400,160 450,200" stroke="#16a34a" strokeWidth="1" strokeDasharray="6,4" fill="none" opacity="0.3" />
          <path d="M980,170 Q900,140 800,250" stroke="#16a34a" strokeWidth="1" strokeDasharray="6,4" fill="none" opacity="0.3" />
        </svg>
      </div>
    </section>
  )
}
