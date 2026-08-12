'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Microscope, Menu, X, ChevronRight } from 'lucide-react'

const PAGE_BG = {
  minHeight: '100vh',
  background: 'radial-gradient(ellipse at 0% 0%, rgba(255,210,80,0.45) 0%, transparent 55%), radial-gradient(ellipse at 100% 100%, rgba(80,190,130,0.35) 0%, transparent 55%), #f8faf5',
}

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div style={PAGE_BG}>
      {/* ── Pill Navbar ── */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, padding: '14px 20px' }}>
        <div style={{
          maxWidth: 1160, margin: '0 auto',
          background: '#fff', borderRadius: 9999,
          boxShadow: '0 2px 20px rgba(0,0,0,0.08)',
          height: 60, display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', padding: '0 24px',
        }}>
          <Link href="/" style={{ fontSize: '1.3rem', fontWeight: 800, color: '#2d6a27', textDecoration: 'none', fontFamily: 'Inter,sans-serif', letterSpacing: '-0.03em' }}>
            KisanSeva
          </Link>
          <nav style={{ display: 'flex', gap: 32, listStyle: 'none' }}>
            {[['Home', '/'], ['Crops', '/diagnose'], ['Markets', '/market'], ['Weather', '/schedule'], ['Dashboard', '/dashboard']].map(([label, href]) => (
              <Link key={label} href={href} style={{ fontSize: '0.9375rem', fontWeight: 500, color: '#374151', textDecoration: 'none', fontFamily: 'Inter,sans-serif' }}>{label}</Link>
            ))}
          </nav>
          <div style={{ display: 'flex', gap: 10 }}>
            <Link href="/login" style={{
              padding: '8px 20px', borderRadius: 9999, border: '1.5px solid #d1d5db',
              background: 'transparent', color: '#374151', fontSize: '0.9rem', fontWeight: 600, textDecoration: 'none', fontFamily: 'Inter,sans-serif'
            }}>Login</Link>
            <Link href="/login" style={{
              padding: '8px 20px', borderRadius: 9999,
              background: '#2d6a27', color: '#fff', fontSize: '0.9rem', fontWeight: 600, textDecoration: 'none', fontFamily: 'Inter,sans-serif'
            }}>Register</Link>
          </div>
        </div>
      </div>

      {/* ── Hero ── */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', paddingTop: 88, textAlign: 'center', padding: '88px 24px 0' }}>
        <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.25rem)', fontWeight: 800, color: '#111827', letterSpacing: '-0.035em', lineHeight: 1.1, margin: '0 0 20px', fontFamily: 'Inter,sans-serif' }}>
          Empower your farm,<br />grow your future
        </h1>
        <p style={{ fontSize: '1.125rem', color: '#4b5563', maxWidth: 560, margin: '0 0 36px', lineHeight: 1.7, fontFamily: 'Inter,sans-serif' }}>
          Track prices, get weather updates, and manage crops all in one place.
        </p>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 64 }}>
          <Link href="/market" style={{
            padding: '13px 32px', borderRadius: 12, border: '1.5px solid #2d6a27',
            background: 'transparent', color: '#2d6a27', fontSize: '1rem', fontWeight: 600, textDecoration: 'none', fontFamily: 'Inter,sans-serif'
          }}>Monitor Prices</Link>
          <Link href="/schedule" style={{
            padding: '13px 32px', borderRadius: 12,
            background: '#2d6a27', color: '#fff', fontSize: '1rem', fontWeight: 600, textDecoration: 'none', fontFamily: 'Inter,sans-serif',
            boxShadow: '0 4px 14px rgba(45,106,39,0.35)'
          }}>Check Weather</Link>
        </div>

        {/* Farm illustration SVG */}
        <div style={{ width: '100%', maxWidth: 760, margin: '0 auto' }}>
          <svg viewBox="0 0 760 320" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto' }}>
            {/* Ground line */}
            <line x1="0" y1="220" x2="760" y2="220" stroke="#2d6a27" strokeWidth="1.5" opacity="0.3"/>
            {/* Rolling hills */}
            <path d="M0 220 Q120 170 240 195 Q360 220 480 185 Q600 150 760 175 L760 320 L0 320 Z" fill="rgba(45,106,39,0.07)"/>
            
            {/* Market building */}
            <rect x="280" y="150" width="100" height="70" rx="4" stroke="#2d6a27" strokeWidth="1.5" fill="none" opacity="0.5"/>
            <path d="M270 155 L330 130 L390 155" stroke="#2d6a27" strokeWidth="1.5" fill="none" opacity="0.5"/>
            <rect x="310" y="175" width="40" height="45" rx="3" stroke="#2d6a27" strokeWidth="1.2" fill="none" opacity="0.5"/>
            <text x="295" y="170" fill="#2d6a27" fontSize="10" opacity="0.6" fontFamily="Inter,sans-serif" fontWeight="600">MARKET</text>
            {/* Market awning */}
            <path d="M275 158 Q330 148 385 158" stroke="#2d6a27" strokeWidth="1.2" fill="rgba(45,106,39,0.1)" opacity="0.7"/>

            {/* Tower left */}
            <line x1="160" y1="100" x2="160" y2="220" stroke="#2d6a27" strokeWidth="1.5" opacity="0.4"/>
            <line x1="145" y1="120" x2="175" y2="120" stroke="#2d6a27" strokeWidth="1.2" opacity="0.4"/>
            <line x1="150" y1="140" x2="170" y2="140" stroke="#2d6a27" strokeWidth="1.2" opacity="0.4"/>
            {/* Wifi signal left */}
            <path d="M148 105 Q160 98 172 105" stroke="#2d6a27" strokeWidth="1.2" fill="none" opacity="0.5"/>
            <path d="M152 110 Q160 104 168 110" stroke="#2d6a27" strokeWidth="1.2" fill="none" opacity="0.5"/>
            <circle cx="160" cy="114" r="2" fill="#2d6a27" opacity="0.5"/>

            {/* Tower right */}
            <line x1="520" y1="110" x2="520" y2="220" stroke="#2d6a27" strokeWidth="1.5" opacity="0.4"/>
            <line x1="505" y1="130" x2="535" y2="130" stroke="#2d6a27" strokeWidth="1.2" opacity="0.4"/>
            <line x1="510" y1="150" x2="530" y2="150" stroke="#2d6a27" strokeWidth="1.2" opacity="0.4"/>
            {/* Wifi signal right */}
            <path d="M508 115 Q520 108 532 115" stroke="#2d6a27" strokeWidth="1.2" fill="none" opacity="0.5"/>
            <path d="M512 120 Q520 114 528 120" stroke="#2d6a27" strokeWidth="1.2" fill="none" opacity="0.5"/>
            <circle cx="520" cy="124" r="2" fill="#2d6a27" opacity="0.5"/>

            {/* Tractor */}
            <rect x="580" y="185" width="60" height="35" rx="4" stroke="#2d6a27" strokeWidth="1.5" fill="none" opacity="0.5"/>
            <circle cx="595" cy="222" r="12" stroke="#2d6a27" strokeWidth="1.5" fill="none" opacity="0.5"/>
            <circle cx="628" cy="222" r="9" stroke="#2d6a27" strokeWidth="1.5" fill="none" opacity="0.5"/>
            <rect x="598" y="175" width="32" height="16" rx="3" stroke="#2d6a27" strokeWidth="1.2" fill="none" opacity="0.4"/>
            {/* Exhaust */}
            <line x1="625" y1="175" x2="625" y2="162" stroke="#2d6a27" strokeWidth="1.2" opacity="0.4"/>
            <path d="M620 162 Q625 155 630 162" stroke="#2d6a27" strokeWidth="1" fill="none" opacity="0.3"/>

            {/* Trees */}
            {[70, 110, 220, 450, 490, 700, 730].map((x, i) => (
              <g key={i} opacity="0.45">
                <circle cx={x} cy={165 + (i % 3) * 5} r={16 + (i % 2) * 4} stroke="#2d6a27" strokeWidth="1.3" fill="none"/>
                <line x1={x} y1={181 + (i % 3) * 5} x2={x} y2={220} stroke="#2d6a27" strokeWidth="1.3"/>
              </g>
            ))}

            {/* Crop rows */}
            {[0, 1, 2, 3, 4, 5, 6, 7].map(row => (
              <g key={row}>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(col => (
                  <g key={col} transform={`translate(${60 + col * 75 + row * 8}, ${232 + row * 10})`} opacity="0.4">
                    <line x1="0" y1="0" x2="0" y2="-12" stroke="#2d6a27" strokeWidth="1.2"/>
                    <path d="M-5,-8 Q0,-14 5,-8" stroke="#2d6a27" strokeWidth="1" fill="none"/>
                    <path d="M-4,-6 Q0,-11 4,-6" stroke="#2d6a27" strokeWidth="1" fill="none"/>
                  </g>
                ))}
              </g>
            ))}

            {/* Farmer left (woman with tablet) */}
            <g transform="translate(100, 200)" opacity="0.55">
              <circle cx="0" cy="-32" r="10" stroke="#2d6a27" strokeWidth="1.3" fill="none"/>
              <line x1="0" y1="-22" x2="0" y2="10" stroke="#2d6a27" strokeWidth="1.5"/>
              <line x1="0" y1="-10" x2="-18" y2="0" stroke="#2d6a27" strokeWidth="1.3"/>
              <rect x="-30" y="-5" width="14" height="10" rx="2" stroke="#2d6a27" strokeWidth="1.2" fill="none"/>
              <line x1="0" y1="-10" x2="12" y2="5" stroke="#2d6a27" strokeWidth="1.3"/>
              <line x1="0" y1="10" x2="-8" y2="28" stroke="#2d6a27" strokeWidth="1.3"/>
              <line x1="0" y1="10" x2="8" y2="28" stroke="#2d6a27" strokeWidth="1.3"/>
              {/* Hat */}
              <path d="M-14,-40 Q0,-48 14,-40" stroke="#2d6a27" strokeWidth="1.2" fill="none"/>
            </g>

            {/* Farmer right (man with tablet) */}
            <g transform="translate(660, 200)" opacity="0.55">
              <circle cx="0" cy="-32" r="10" stroke="#2d6a27" strokeWidth="1.3" fill="none"/>
              <line x1="0" y1="-22" x2="0" y2="10" stroke="#2d6a27" strokeWidth="1.5"/>
              <line x1="0" y1="-10" x2="20" y2="2" stroke="#2d6a27" strokeWidth="1.3"/>
              <rect x="18" y="-3" width="14" height="10" rx="2" stroke="#2d6a27" strokeWidth="1.2" fill="none"/>
              <line x1="0" y1="-10" x2="-12" y2="5" stroke="#2d6a27" strokeWidth="1.3"/>
              <line x1="0" y1="10" x2="-8" y2="28" stroke="#2d6a27" strokeWidth="1.3"/>
              <line x1="0" y1="10" x2="8" y2="28" stroke="#2d6a27" strokeWidth="1.3"/>
              {/* Hat wide brim */}
              <path d="M-16,-40 Q0,-50 16,-40" stroke="#2d6a27" strokeWidth="1.5" fill="none"/>
              <line x1="-20" y1="-40" x2="20" y2="-40" stroke="#2d6a27" strokeWidth="1.2" opacity="0.7"/>
            </g>

            {/* Clouds */}
            <g opacity="0.3">
              <ellipse cx="420" cy="60" rx="28" ry="14" stroke="#2d6a27" strokeWidth="1.2" fill="none"/>
              <ellipse cx="440" cy="55" rx="20" ry="12" stroke="#2d6a27" strokeWidth="1.2" fill="none"/>
              <ellipse cx="400" cy="58" rx="18" ry="10" stroke="#2d6a27" strokeWidth="1.2" fill="none"/>
            </g>
            <g opacity="0.25">
              <ellipse cx="590" cy="80" rx="22" ry="11" stroke="#2d6a27" strokeWidth="1.2" fill="none"/>
              <ellipse cx="608" cy="75" rx="16" ry="10" stroke="#2d6a27" strokeWidth="1.2" fill="none"/>
            </g>
            {/* Sun rays */}
            <g opacity="0.2" transform="translate(680,50)">
              {[0,45,90,135,180,225,270,315].map(a => (
                <line key={a} x1={Math.cos(a*Math.PI/180)*20} y1={Math.sin(a*Math.PI/180)*20}
                  x2={Math.cos(a*Math.PI/180)*28} y2={Math.sin(a*Math.PI/180)*28} stroke="#2d6a27" strokeWidth="1.5"/>
              ))}
              <circle cx="0" cy="0" r="14" stroke="#2d6a27" strokeWidth="1.5" fill="none"/>
            </g>
          </svg>
        </div>
      </div>

      {/* ── Features Section ── */}
      <section style={{ padding: '80px 24px', background: 'rgba(249,250,245,0.7)' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(45,106,39,0.1)', border: '1px solid rgba(45,106,39,0.2)', color: '#2d6a27', borderRadius: 9999, padding: '5px 14px', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', fontFamily: 'monospace', marginBottom: 16, textTransform: 'uppercase' }}>
              ● AGRI INTELLIGENCE PLATFORM
            </div>
            <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: '#111827', letterSpacing: '-0.025em', margin: '0 0 12px', fontFamily: 'Inter,sans-serif' }}>
              Engineered for Indian Smallholder Farmers
            </h2>
            <p style={{ color: '#6b7280', fontSize: '1rem', maxWidth: 560, margin: '0 auto', fontFamily: 'Inter,sans-serif' }}>
              Secure, data-driven tools built to help 140 million smallholder farmers make better decisions.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
            {[
              { tag: 'AI ENGINE', icon: '🔬', title: 'Crop Disease AI', desc: 'Upload a photo — get disease name, confidence score, and treatment plan in under 5 seconds.', chips: ['38 Diseases', 'MobileNetV3', '<5s Result'], iconBg: '#eff6ff', iconBorder: '#bfdbfe', iconColor: '#2563eb' },
              { tag: 'LIVE MARKET', icon: '📈', title: 'Live Mandi Prices', desc: 'Real-time Agmarknet prices across 500+ mandis with net-value ranking by distance.', chips: ['Agmarknet Live', '500+ Mandis', 'Distance Ranked'], iconBg: '#fffbeb', iconBorder: '#fde68a', iconColor: '#d97706' },
              { tag: 'WEATHER AI', icon: '🌤️', title: 'Weather Advisory', desc: 'OpenWeather 7-day forecast with crop-specific irrigation recommendations using ET₀ Hargreaves.', chips: ['7-Day Forecast', 'ET₀ Calc', 'Spray Windows'], iconBg: '#ecfeff', iconBorder: '#a5f3fc', iconColor: '#0891b2' },
              { tag: 'IRRIGATION', icon: '💧', title: 'Smart Scheduling', desc: 'Personalised weekly irrigation and fertilizer schedules based on soil health and crop stage.', chips: ['Plot-wise', 'N-P-K Tracking', 'Stage Aware'], iconBg: '#f0fdfa', iconBorder: '#99f6e4', iconColor: '#0d9488' },
              { tag: 'SOIL HEALTH', icon: '🌿', title: 'Soil Health Monitor', desc: 'Track N-P-K levels, pH, organic carbon and moisture. Integrated with Soil Card Portal.', chips: ['N-P-K Bars', 'pH Tracking', 'Soil Card'], iconBg: '#f0fdf4', iconBorder: '#bbf7d0', iconColor: '#16a34a' },
              { tag: 'OUTREACH', icon: '📱', title: 'SMS & IVR Access', desc: 'Full advisory access via SMS or missed-call IVR — no smartphone or internet required.', chips: ['No Internet', 'Hindi Support', 'IVR Ready'], iconBg: '#faf5ff', iconBorder: '#e9d5ff', iconColor: '#9333ea' },
              { tag: 'ALERTS', icon: '🔔', title: 'Outbreak Detection', desc: 'Regional disease outbreak alerts based on aggregated farmer reports and weather patterns.', chips: ['Regional', 'Auto-Alert', 'Pattern AI'], iconBg: '#fff1f2', iconBorder: '#fecdd3', iconColor: '#e11d48' },
              { tag: 'MULTI-LANG', icon: '🌐', title: 'Hindi + English', desc: '8 Indian languages supported with automatic transliteration and voice-ready response cards.', chips: ['8 Languages', 'Transliterate', 'Voice Ready'], iconBg: '#eef2ff', iconBorder: '#c7d2fe', iconColor: '#6366f1' },
            ].map((f, i) => (
              <div key={i} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, padding: 22, display: 'flex', flexDirection: 'column', gap: 12, transition: 'all 0.2s', cursor: 'pointer' }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; (e.currentTarget as HTMLDivElement).style.transform = 'none'; }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.625rem', fontFamily: 'monospace', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', background: '#f3f4f6', color: '#6b7280', border: '1px solid #e5e7eb', borderRadius: 9999, padding: '3px 9px' }}>{f.tag}</span>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: f.iconBg, border: `1px solid ${f.iconBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>{f.icon}</div>
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', margin: '0 0 5px', fontFamily: 'Inter,sans-serif' }}>{f.title}</h3>
                  <p style={{ fontSize: '0.8125rem', color: '#6b7280', lineHeight: 1.6, margin: 0, fontFamily: 'Inter,sans-serif' }}>{f.desc}</p>
                </div>
                <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: 10, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {f.chips.map(c => <span key={c} style={{ fontSize: '0.625rem', fontFamily: 'monospace', fontWeight: 600, padding: '2px 7px', borderRadius: 4, background: '#f9fafb', color: '#6b7280', border: '1px solid #e5e7eb' }}>{c}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section style={{ padding: '80px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span style={{ fontSize: '0.7rem', fontFamily: 'monospace', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', borderRadius: 9999, padding: '4px 12px' }}>MEASURABLE RESULTS</span>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 800, color: '#111827', margin: '16px 0 0', fontFamily: 'Inter,sans-serif', letterSpacing: '-0.025em' }}>Trusted by Farmers Across India</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            {[
              { bg: '#eff6ff', border: '#bfdbfe', text: '#1e40af', iconBg: '#2563eb', icon: '👥', num: '50,000+', label: 'Farmers Assisted' },
              { bg: '#faf5ff', border: '#e9d5ff', text: '#6b21a8', iconBg: '#9333ea', icon: '🔬', num: '38', label: 'Diseases Detected' },
              { bg: '#f0fdf4', border: '#bbf7d0', text: '#14532d', iconBg: '#16a34a', icon: '📊', num: '500+', label: 'Live Mandi Prices' },
              { bg: '#fffbeb', border: '#fde68a', text: '#92400e', iconBg: '#f59e0b', icon: '🌤️', num: '7 Days', label: 'Weather Forecast' },
            ].map((s, i) => (
              <div key={i} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 24, padding: 24, textAlign: 'center', color: s.text }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: s.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: '1.25rem' }}>{s.icon}</div>
                <div style={{ fontSize: '2.25rem', fontWeight: 900, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.03em', fontFamily: 'Inter,sans-serif' }}>{s.num}</div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, marginTop: 4, opacity: 0.85, fontFamily: 'Inter,sans-serif' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '80px 24px', background: 'rgba(249,250,245,0.8)' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: 'clamp(1.25rem, 3vw, 1.75rem)', fontWeight: 700, color: '#111827', marginBottom: 32, fontFamily: 'Inter,sans-serif' }}>Choose Your Path</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {[
              { emoji: '🔬', title: 'Diagnose Crop', desc: 'Upload a photo and get AI-powered disease detection in under 5 seconds.', badge: 'AI Powered', badgeBg: '#eff6ff', badgeColor: '#2563eb', href: '/diagnose' },
              { emoji: '📈', title: 'Check Mandi Prices', desc: 'Live Agmarknet prices from 500+ mandis ranked by net value to your farm.', badge: 'Live Data', badgeBg: '#f0fdf4', badgeColor: '#16a34a', href: '/market' },
              { emoji: '📅', title: 'Farm Schedule', desc: 'Get your personalised weekly irrigation and fertilizer schedule based on weather.', badge: 'Personalised', badgeBg: '#fffbeb', badgeColor: '#d97706', href: '/schedule' },
            ].map((c, i) => (
              <Link key={i} href={c.href} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 20, padding: '28px 24px', textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: 12, transition: 'all 0.25s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 12px 30px rgba(0,0,0,0.1)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.transform = 'none'; (e.currentTarget as HTMLAnchorElement).style.boxShadow = 'none'; }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ width: 52, height: 52, borderRadius: 14, background: '#f9fafb', border: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>{c.emoji}</div>
                  <ChevronRight size={18} color="#9ca3af" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#111827', margin: '0 0 6px', fontFamily: 'Inter,sans-serif' }}>{c.title}</h3>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: 1.6, margin: 0, fontFamily: 'Inter,sans-serif' }}>{c.desc}</p>
                </div>
                <div style={{ paddingTop: 12, borderTop: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '3px 10px', borderRadius: 9999, background: c.badgeBg, color: c.badgeColor, fontFamily: 'Inter,sans-serif' }}>{c.badge}</span>
                  <span style={{ fontSize: '0.8125rem', color: '#9ca3af', fontFamily: 'Inter,sans-serif' }}>Explore →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background: '#1a2e16', color: '#fff', padding: '48px 24px', fontFamily: 'Inter,sans-serif' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 32 }}>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', marginBottom: 10, letterSpacing: '-0.02em' }}>KisanSeva</div>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', maxWidth: 280, lineHeight: 1.7 }}>AI-powered farm advisory for smallholder farmers across India.</p>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', marginTop: 20 }}>© 2025 KisanSeva. Track 03 AgriTech · IEMH4-AG-01</p>
          </div>
          <div style={{ display: 'flex', gap: 48, flexWrap: 'wrap' }}>
            {[['Platform', [['Home', '/'], ['Diagnose', '/diagnose'], ['Market', '/market'], ['Schedule', '/schedule'], ['AI Agent', '/agent']]], ['Account', [['Dashboard', '/dashboard'], ['Login', '/login'], ['Register', '/login']]]].map(([group, links]) => (
              <div key={group as string}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14, fontFamily: 'monospace' }}>{group as string}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {(links as string[][]).map(([label, href]) => (
                    <Link key={label} href={href} style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem', textDecoration: 'none' }}>{label}</Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
