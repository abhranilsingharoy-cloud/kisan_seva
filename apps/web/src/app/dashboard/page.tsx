'use client'

import Link from 'next/link'
import { useState } from 'react'
import { LayoutDashboard, Microscope, TrendingUp, Cloud, Users, Settings, CloudSun, Droplets, AlertTriangle, ChevronRight, Home } from 'lucide-react'

const PAGE_BG = {
  minHeight: '100vh',
  background: 'radial-gradient(ellipse at 80% 10%, rgba(255,210,80,0.4) 0%, transparent 50%), radial-gradient(ellipse at 10% 90%, rgba(80,190,130,0.35) 0%, transparent 50%), #f0f7ee',
}

const SIDEBAR_STYLE = {
  width: 230,
  minHeight: '100vh',
  background: '#fff',
  borderRight: '1px solid #e8ede7',
  display: 'flex' as const,
  flexDirection: 'column' as const,
  padding: '24px 16px',
  flexShrink: 0,
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { id: 'diagnose', label: 'Crop Health', icon: Microscope, href: '/diagnose' },
  { id: 'market', label: 'Market Prices', icon: TrendingUp, href: '/market' },
  { id: 'weather', label: 'Weather', icon: Cloud, href: '/schedule' },
  { id: 'community', label: 'Community', icon: Users, href: '/dashboard' },
  { id: 'settings', label: 'Settings', icon: Settings, href: '/dashboard' },
]

export default function DashboardPage() {
  const [active, setActive] = useState('dashboard')

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Inter,sans-serif' }}>
      {/* Sidebar */}
      <aside style={SIDEBAR_STYLE}>
        {/* Logo */}
        <div style={{ fontSize: '1.125rem', fontWeight: 800, color: '#2d6a27', letterSpacing: '-0.02em', paddingLeft: 10, marginBottom: 28 }}>
          KisanSeva
        </div>

        {/* Farmer profile */}
        <div style={{ paddingLeft: 6, marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'linear-gradient(135deg, #a7d9a0, #5ab54e)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: 700, color: '#fff', flexShrink: 0 }}>PS</div>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#111827' }}>Farmer Profile</div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Managing 2 Plots</div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Language</span>
            <span style={{ fontSize: '0.75rem', color: '#374151', fontWeight: 600 }}>EN / HI</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Low Data Mode</span>
            <div style={{ width: 36, height: 20, background: '#e5e7eb', borderRadius: 10, position: 'relative' as const, cursor: 'pointer' }}>
              <div style={{ width: 16, height: 16, background: '#9ca3af', borderRadius: '50%', position: 'absolute' as const, top: 2, left: 2, transition: 'left 0.2s' }} />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: '#f3f4f6', margin: '8px 0 16px' }} />

        {/* Nav items */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {navItems.map(({ id, label, icon: Icon, href }) => (
            <Link key={id} href={href}
              onClick={() => setActive(id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px', borderRadius: 10, textDecoration: 'none',
                background: active === id ? '#f0fdf4' : 'transparent',
                color: active === id ? '#2d6a27' : '#4b5563',
                fontWeight: active === id ? 600 : 500, fontSize: '0.9rem',
                transition: 'all 0.15s',
              }}>
              <Icon size={19} />
              {label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, ...PAGE_BG }}>
        {/* Top header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '28px 32px 20px' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#111827', margin: 0, letterSpacing: '-0.025em' }}>Good morning, Farmer. 🌾</h1>
            <p style={{ color: '#6b7280', fontSize: '0.9375rem', margin: '6px 0 0', fontFamily: 'Inter,sans-serif' }}>Here is the latest data for your 2 plots.</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#2d6a27', color: '#fff', borderRadius: 9999, padding: '7px 14px', fontSize: '0.8125rem', fontWeight: 600, marginTop: 4 }}>
            <span style={{ width: 7, height: 7, background: '#86efac', borderRadius: '50%', display: 'inline-block' }} />
            System Online
          </div>
        </div>

        {/* Stat cards row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, padding: '0 32px' }}>
          {[
            { icon: '⛅', iconColor: '#2d6a27', label: 'Weather', big: '28°C', sub: 'Partly Cloudy, 60% Humidity', desc: 'Rain expected in 2 days. Adjust irrigation schedule accordingly.', btn: 'View 7-Day Forecast', btnHref: '/schedule', btnPrimary: true },
            { icon: '💧', iconColor: '#0891b2', label: 'Irrigation', big: 'Skip Today', sub: '', desc: 'Soil moisture is optimal. Expected rain will cover needs.', btn: 'View Details', btnHref: '/schedule', btnPrimary: false },
            { icon: '⚗️', iconColor: '#d97706', label: 'Fertilizer', big: 'Apply Urea Mix', sub: '', desc: 'Plot 1 requires nitrogen boost before upcoming rain.', btn: 'View Details', btnHref: '/schedule', btnPrimary: false },
            { icon: '⚠️', iconColor: '#dc2626', label: 'Pest Alert', big: 'Moderate Risk', sub: '', desc: 'Conditions favorable for blight. Monitor lower leaves.', btn: 'View Details', btnHref: '/diagnose', btnPrimary: false },
          ].map((card, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: 16, padding: '20px', border: '1px solid #e8ede7', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 2 }}>
                <span style={{ fontSize: '1.1rem' }}>{card.icon}</span>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: card.iconColor }}>{card.label}</span>
              </div>
              {card.sub && <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{card.sub}</div>}
              <div style={{ fontSize: card.big.length > 10 ? '1rem' : '1.25rem', fontWeight: 700, color: '#111827', letterSpacing: '-0.01em' }}>{card.big}</div>
              <p style={{ fontSize: '0.8125rem', color: '#6b7280', lineHeight: 1.55, margin: '0 0 auto', flex: 1 }}>{card.desc}</p>
              <Link href={card.btnHref} style={{
                display: 'block', textAlign: 'center', marginTop: 10,
                padding: '9px 0', borderRadius: 10, textDecoration: 'none',
                fontSize: '0.8125rem', fontWeight: 600,
                background: card.btnPrimary ? '#2d6a27' : 'transparent',
                color: card.btnPrimary ? '#fff' : '#2d6a27',
                border: card.btnPrimary ? 'none' : '1.5px solid #c9ddc6',
              }}>
                {card.btn}
              </Link>
            </div>
          ))}
        </div>

        {/* Lower row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 16, padding: '16px 32px 32px', alignItems: 'stretch' }}>
          {/* Scan Crop card */}
          <div style={{ background: '#fff', borderRadius: 16, padding: '32px 24px', border: '1px solid #e8ede7', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, textAlign: 'center' }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#f0fdf4', border: '1.5px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>📷</div>
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#111827', margin: '0 0 5px' }}>Scan Crop</h3>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>Instantly diagnose pests &amp; diseases</p>
            </div>
            <Link href="/diagnose" style={{ background: '#2d6a27', color: '#fff', padding: '11px 32px', borderRadius: 10, textDecoration: 'none', fontSize: '0.9375rem', fontWeight: 600, boxShadow: '0 4px 12px rgba(45,106,39,0.3)' }}>
              Scan Crop
            </Link>
          </div>

          {/* Nearby Markets card */}
          <div style={{ background: '#fff', borderRadius: 16, padding: '20px', border: '1px solid #e8ede7', minWidth: 340 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', margin: 0 }}>Nearby Markets</h3>
              <span style={{ fontSize: '0.75rem', color: '#6b7280', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 6, padding: '3px 8px' }}>Wheat (Quintal)</span>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                  {['Mandi', 'Price (₹)', 'Trend'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '0 0 10px', fontSize: '0.75rem', fontWeight: 600, color: '#9ca3af', letterSpacing: '0.04em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { mandi: 'Azadpur', price: '2,250', trend: '+15 ↑', trendColor: '#16a34a' },
                  { mandi: 'Najafgarh', price: '2,230', trend: '-5 ↓', trendColor: '#dc2626' },
                  { mandi: 'Narela', price: '2,245', trend: '-- —', trendColor: '#9ca3af' },
                ].map((row, i) => (
                  <tr key={i} style={{ borderBottom: i < 2 ? '1px solid #f9fafb' : 'none' }}>
                    <td style={{ padding: '13px 0', color: '#111827', fontWeight: 500 }}>{row.mandi}</td>
                    <td style={{ padding: '13px 0', color: '#111827' }}>{row.price}</td>
                    <td style={{ padding: '13px 0', color: row.trendColor, fontWeight: 600, fontSize: '0.875rem' }}>{row.trend}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Link href="/market" style={{ display: 'block', textAlign: 'center', marginTop: 14, padding: '9px', border: '1.5px solid #c9ddc6', borderRadius: 8, color: '#2d6a27', fontSize: '0.8125rem', fontWeight: 600, textDecoration: 'none' }}>
              View all prices →
            </Link>
          </div>
        </div>
      </main>

      {/* Mobile bottom nav */}
      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'rgba(255,255,255,0.97)', borderTop: '1px solid #e8ede7', display: 'flex', justifyContent: 'space-around', padding: '8px 0', zIndex: 50 }} className="lg-hidden">
        {[['🏠', 'Home', '/'], ['🔬', 'Crops', '/diagnose'], ['📈', 'Market', '/market'], ['📅', 'Schedule', '/schedule'], ['🤖', 'Agent', '/agent']].map(([icon, label, href]) => (
          <Link key={label} href={href} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, textDecoration: 'none', color: href === '/dashboard' ? '#2d6a27' : '#6b7280', fontSize: '0.625rem', fontWeight: 500, padding: '4px 12px', minWidth: 44 }}>
            <span style={{ fontSize: '1.25rem' }}>{icon}</span>
            {label}
          </Link>
        ))}
      </nav>
    </div>
  )
}
