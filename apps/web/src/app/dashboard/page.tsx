'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Leaf, CloudSun, TrendingUp, Bell, ArrowRight, Plus,
  AlertTriangle, CheckCircle, Droplets, Thermometer,
  ChevronRight, BarChart3, Settings, LogOut, User,
  Zap, Map, MessageSquare
} from 'lucide-react'

const PLOTS = [
  { id: '1', name: 'Plot 2A', crop: 'Tomato', area: '1.2 ac', stage: 'Flowering', daysLeft: 42, health: 'warning' },
  { id: '2', name: 'Plot 3B', crop: 'Wheat', area: '0.8 ac', stage: 'Vegetative', daysLeft: 78, health: 'good' },
  { id: '3', name: 'Plot 1C', crop: 'Rice', area: '1.5 ac', stage: 'Transplanted', daysLeft: 95, health: 'good' },
]

const ALERTS = [
  { id: '1', type: 'urgent', icon: AlertTriangle, color: 'var(--color-danger)', bg: 'var(--color-danger-bg)', title: 'Disease Alert', body: 'Early Blight detected on Plot 2A (Tomato). Treat within 48 hrs.', action: '/diagnose', actionLabel: 'View Diagnosis', time: '2h ago' },
  { id: '2', type: 'high',   icon: Droplets, color: 'var(--color-info)', bg: 'var(--color-info-bg)', title: 'Irrigate Today', body: 'Plot 2A needs 28mm irrigation. Soil moisture at 32% (below optimal 45%).', action: '/schedule', actionLabel: 'View Schedule', time: '6h ago' },
  { id: '3', type: 'normal', icon: TrendingUp, color: 'var(--color-success)', bg: 'var(--color-success-bg)', title: 'Price Alert Triggered', body: 'Tomato price at Azadpur hit ₹2,340/qtl — your target was ₹2,300.', action: '/market', actionLabel: 'View Prices', time: 'Just now' },
]

const WEATHER = {
  temp: 32, condition: 'Partly Cloudy', humidity: 68, wind: 12, rain: 0,
  location: 'Vidisha, MP',
  forecast: [
    { day: 'Mon', icon: '🌤', high: 33, low: 22 },
    { day: 'Tue', icon: '🌦', high: 29, low: 21 },
    { day: 'Wed', icon: '🌧', high: 26, low: 20 },
    { day: 'Thu', icon: '⛅', high: 31, low: 22 },
    { day: 'Fri', icon: '☀️', high: 35, low: 24 },
  ]
}

const QUICK_ACTIONS = [
  { label: 'Diagnose Crop', icon: Leaf, href: '/diagnose', color: 'var(--color-success)', bg: 'var(--color-success-bg)' },
  { label: 'Mandi Prices', icon: TrendingUp, href: '/market', color: 'var(--color-honey-amber)', bg: 'rgba(240,200,145,0.2)' },
  { label: 'My Schedule', icon: CloudSun, href: '/schedule', color: 'var(--color-info)', bg: 'var(--color-info-bg)' },
  { label: 'Disease Map', icon: Map, href: '/map', color: 'var(--color-deep-olive)', bg: 'var(--color-bone)' },
  { label: 'Price Alerts', icon: Bell, href: '/alerts', color: 'var(--color-warning)', bg: 'var(--color-warning-bg)' },
  { label: 'SMS Advisory', icon: MessageSquare, href: '/sms', color: 'var(--color-sage)', bg: 'rgba(122,151,121,0.12)' },
]

export default function DashboardPage() {
  const [greeting] = useState(() => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 18) return 'Good afternoon'
    return 'Good evening'
  })

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-parchment)' }}>
      {/* ── Top Nav ─────────────────────── */}
      <nav className="top-nav" role="navigation" aria-label="App navigation">
        <div className="page-container w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-sm flex items-center justify-center" style={{ background: 'var(--color-honey-amber)' }}>
              <Leaf size={15} color="var(--color-ink)" />
            </div>
            <span className="font-display font-medium" style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: 'var(--color-ink)', letterSpacing: '-0.02em' }}>
              KisanSeva
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/alerts" className="btn btn-icon btn-ghost relative" aria-label="Notifications">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full" style={{ background: 'var(--color-danger)' }} />
            </Link>
            <Link href="/settings" className="btn btn-icon btn-ghost" aria-label="Settings">
              <Settings size={18} />
            </Link>
          </div>
        </div>
      </nav>

      <main className="page-container py-6 pb-24 lg:pb-8">
        {/* ── Greeting ────────────────── */}
        <div className="mb-6">
          <div className="eyebrow eyebrow-sage mb-1">{greeting}</div>
          <h1 className="font-display font-medium" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 4vw, 36px)', color: 'var(--color-ink)', letterSpacing: '-0.02em' }}>
            Ramesh Patel
          </h1>
          <p style={{ color: 'var(--color-bark)', fontSize: 'var(--text-eyebrow)' }}>
            Vidisha, Madhya Pradesh · 3 active plots · 3.5 acres
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── LEFT / MAIN COLUMN ────── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Weather Widget */}
            <div className="weather-widget" role="region" aria-label="Weather forecast">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="eyebrow mb-1" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px' }}>WEATHER TODAY</div>
                  <div className="flex items-end gap-3">
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '52px', color: 'white', lineHeight: 1, fontWeight: 500 }}>
                      {WEATHER.temp}°
                    </span>
                    <div>
                      <div style={{ color: 'white', fontSize: 'var(--text-body-lg)', fontWeight: 500 }}>{WEATHER.condition}</div>
                      <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 'var(--text-eyebrow)' }}>{WEATHER.location}</div>
                    </div>
                  </div>
                  <div className="flex gap-4 mt-3">
                    {[
                      { label: 'Humidity', value: `${WEATHER.humidity}%`, icon: '💧' },
                      { label: 'Wind', value: `${WEATHER.wind} km/h`, icon: '🌬' },
                      { label: 'Rain', value: `${WEATHER.rain}mm`, icon: '🌧' },
                    ].map(({ label, value, icon }) => (
                      <div key={label}>
                        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{icon} {label}</div>
                        <div style={{ color: 'white', fontSize: 'var(--text-body)', fontWeight: 500 }}>{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="text-right hidden sm:block">
                  <CloudSun size={48} color="rgba(255,255,255,0.4)" />
                </div>
              </div>
              {/* 5-day forecast */}
              <div className="flex gap-2 overflow-x-auto mt-2">
                {WEATHER.forecast.map(({ day, icon, high, low }) => (
                  <div key={day} className="flex-1 text-center py-2 px-1 rounded" style={{ background: 'rgba(255,255,255,0.08)', minWidth: '56px' }}>
                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' }}>{day}</div>
                    <div style={{ fontSize: '20px', margin: '4px 0' }}>{icon}</div>
                    <div style={{ fontSize: '12px', color: 'white', fontWeight: 500 }}>{high}°</div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>{low}°</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Alerts */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-display font-medium" style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-subheading)', color: 'var(--color-ink)' }}>
                  Active Alerts
                </h2>
                <Link href="/alerts" className="flex items-center gap-1" style={{ color: 'var(--color-honey-amber)', fontSize: 'var(--text-eyebrow)', fontWeight: 500 }}>
                  View all <ChevronRight size={14} />
                </Link>
              </div>
              <div className="space-y-3">
                {ALERTS.map(({ id, icon: Icon, color, bg, title, body, action, actionLabel, time, type }) => (
                  <div key={id} className={`rec-card rec-card-${type}`}>
                    <div className="rec-card-icon" style={{ background: bg }}>
                      <Icon size={20} color={color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-medium" style={{ fontSize: 'var(--text-body)', color: 'var(--color-ink)' }}>{title}</h3>
                        <span style={{ fontSize: 'var(--text-caption)', color: 'var(--color-bark)', flexShrink: 0 }}>{time}</span>
                      </div>
                      <p className="truncate-2 mt-1" style={{ fontSize: 'var(--text-body)', color: 'var(--color-saddle)', lineHeight: 1.5 }}>{body}</p>
                      <Link href={action} className="inline-flex items-center gap-1 mt-2 font-medium" style={{ fontSize: 'var(--text-eyebrow)', color }}>
                        {actionLabel} <ArrowRight size={12} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions Grid */}
            <div>
              <h2 className="font-display font-medium mb-3" style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-subheading)', color: 'var(--color-ink)' }}>
                Quick Actions
              </h2>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {QUICK_ACTIONS.map(({ label, icon: Icon, href, color, bg }) => (
                  <Link key={label} href={href} className="card card-interactive text-center" style={{ padding: '16px 8px', gap: 0 }}>
                    <div className="w-10 h-10 rounded-sm flex items-center justify-center mx-auto mb-2" style={{ background: bg }}>
                      <Icon size={18} color={color} />
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--color-ink)', fontWeight: 500, lineHeight: 1.3 }}>{label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN (Desktop) ── */}
          <div className="space-y-6">
            {/* My Plots */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-display font-medium" style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-subheading)', color: 'var(--color-ink)' }}>
                  My Plots
                </h2>
                <button className="btn btn-ghost btn-sm" id="btn-add-plot" aria-label="Add new plot">
                  <Plus size={14} /> Add
                </button>
              </div>
              <div className="space-y-3">
                {PLOTS.map(({ id, name, crop, area, stage, daysLeft, health }) => (
                  <Link key={id} href={`/schedule?plot=${id}`} className="card card-interactive flex items-center gap-3" style={{ padding: '14px 16px', textDecoration: 'none' }}>
                    <div className="w-10 h-10 rounded-sm flex items-center justify-center flex-shrink-0" style={{
                      background: health === 'good' ? 'var(--color-success-bg)' : 'var(--color-warning-bg)'
                    }}>
                      <Leaf size={16} color={health === 'good' ? 'var(--color-success)' : 'var(--color-warning)'} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium" style={{ fontSize: 'var(--text-body)', color: 'var(--color-ink)' }}>{crop}</span>
                        <span className="badge badge-neutral" style={{ fontSize: '9px' }}>{name}</span>
                      </div>
                      <div style={{ fontSize: 'var(--text-caption)', color: 'var(--color-bark)' }}>
                        {area} · {stage} · {daysLeft}d to harvest
                      </div>
                    </div>
                    <ChevronRight size={14} color="var(--color-loam)" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div>
              <h2 className="font-display font-medium mb-3" style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-subheading)', color: 'var(--color-ink)' }}>
                Season Stats
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Diagnoses', value: '12', delta: '+3 this week', up: true },
                  { label: 'Irrigations', value: '28', delta: '4 this week', up: true },
                  { label: 'Price Alerts', value: '3', delta: '1 triggered', up: null },
                  { label: 'Income Saved', value: '₹6.2K', delta: 'vs local mandi', up: true },
                ].map(({ label, value, delta, up }) => (
                  <div key={label} className="stat-card">
                    <div className="stat-label">{label}</div>
                    <div className="stat-value">{value}</div>
                    <div className={up === true ? 'stat-delta-up' : up === false ? 'stat-delta-down' : ''} style={{ fontSize: 'var(--text-caption)', color: 'var(--color-bark)' }}>
                      {delta}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FPO Notice */}
            <div className="card" style={{ padding: '16px', background: 'var(--color-bone)' }}>
              <div className="eyebrow eyebrow-sage mb-2">FPO OPPORTUNITY</div>
              <p style={{ fontSize: 'var(--text-body)', color: 'var(--color-saddle)', lineHeight: 1.6 }}>
                Vidisha Farmers Group is buying Tomato at ₹2,410/qtl. Combine with 8 other farmers to get group pricing.
              </p>
              <button className="btn btn-ghost btn-sm mt-3 w-full" id="btn-join-fpo" aria-label="Join group sale">
                Join Group Sale <ArrowRight size={12} />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* ── Bottom Nav (Mobile) ─────── */}
      <nav className="bottom-nav lg:hidden" aria-label="Main navigation">
        {[
          { label: 'Home', href: '/dashboard', icon: '🏠', active: true },
          { label: 'Diagnose', href: '/diagnose', icon: '🔬' },
          { label: 'Market', href: '/market', icon: '📈' },
          { label: 'Schedule', href: '/schedule', icon: '📅' },
          { label: 'Alerts', href: '/alerts', icon: '🔔' },
        ].map(({ label, href, icon, active }) => (
          <Link key={label} href={href} className={`bottom-nav-item${active ? ' active' : ''}`} aria-label={label}>
            <span style={{ fontSize: '20px' }}>{icon}</span>
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}
