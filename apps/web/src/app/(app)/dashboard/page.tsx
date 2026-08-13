'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Leaf, TrendingUp, Landmark, Loader2, AlertTriangle, Droplets, ThermometerSun, Sprout, Clock } from 'lucide-react'

const PAGE_BG = {
  minHeight: '100vh',
  background: 'radial-gradient(ellipse at 80% 10%, rgba(255,210,80,0.4) 0%, transparent 50%), radial-gradient(ellipse at 10% 90%, rgba(80,190,130,0.35) 0%, transparent 50%), #f0f7ee',
}

const DEFAULT_PLOTS = [
  { id: 'plot2a', name: 'Plot 2A', crop: 'Tomato', area: '1.2 ac', city: 'Vidisha' },
  { id: 'plot3b', name: 'Plot 3B', crop: 'Wheat', area: '0.8 ac', city: 'Bhopal' },
  { id: 'plot1c', name: 'Plot 1C', crop: 'Rice', area: '1.5 ac', city: 'Jabalpur' },
]

const CROP_STAGES: Record<string, string[]> = {
  wheat:   ['Sowing', 'Vegetative', 'Flowering', 'Harvest'],
  rice:    ['Nursery', 'Transplanting', 'Flowering', 'Harvest'],
  tomato:  ['Seedling', 'Vegetative', 'Fruiting', 'Harvest'],
  onion:   ['Sowing', 'Bulbing', 'Maturation', 'Harvest'],
  cotton:  ['Sowing', 'Vegetative', 'Boll Formation', 'Harvest'],
  potato:  ['Planting', 'Vegetative', 'Tuber Init.', 'Harvest'],
  default: ['Sowing', 'Vegetative', 'Flowering', 'Harvest'],
}

const CROP_DAYS: Record<string, number> = {
  wheat: 120, rice: 130, tomato: 90, onion: 110,
  cotton: 150, potato: 80, default: 100,
}

function getStageInfo(crop: string) {
  const cKey = Object.keys(CROP_STAGES).find(k => crop.toLowerCase().includes(k)) || 'default'
  const dKey = Object.keys(CROP_DAYS).find(k => crop.toLowerCase().includes(k)) || 'default'
  const stages = CROP_STAGES[cKey]
  const totalDays = CROP_DAYS[dKey]
  const daysSinceSowing = Math.floor(totalDays * 0.4)
  const daysToHarvest = totalDays - daysSinceSowing
  const stageIndex = Math.min(Math.floor((daysSinceSowing / totalDays) * stages.length), stages.length - 2)
  return { stages, stageIndex, daysToHarvest }
}

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function DashboardPage() {
  const [plots, setPlots] = useState<any[]>(DEFAULT_PLOTS)
  const [plotWeather, setPlotWeather] = useState<Record<string, any>>({})
  const [marketData, setMarketData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load saved plots from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('kisanseva_plots')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.length > 0) setPlots(parsed)
      }
    } catch (e) {}
  }, [])

  // Fetch live weather for ALL plots simultaneously
  useEffect(() => {
    if (!plots.length) return
    const fetchAll = async () => {
      setIsLoading(true)
      try {
        const results = await Promise.all(
          plots.map(plot =>
            fetch(`/api/weather?city=${encodeURIComponent(plot.city)}&crop=${encodeURIComponent(plot.crop)}&stage=flowering`)
              .then(r => r.json()).catch(() => null)
          )
        )
        const map: Record<string, any> = {}
        plots.forEach((plot, i) => { if (results[i]?.success) map[plot.id] = results[i] })
        setPlotWeather(map)

        const mkt = await fetch(`/api/v1/market?commodity=${encodeURIComponent(plots[0].crop)}`)
          .then(r => r.json()).catch(() => null)
        if (mkt?.success) setMarketData(mkt)
      } catch (e) {
        console.error(e)
      } finally {
        setIsLoading(false)
      }
    }
    fetchAll()
  }, [plots])

  const totalArea = plots.reduce((sum, p) => {
    const n = parseFloat(p.area.replace(/[^\d.]/g, ''))
    return sum + (isNaN(n) ? 0 : n)
  }, 0)

  const firstPlot = plots[0]
  const firstWeather = plotWeather[firstPlot?.id]
  const worstRiskPlot = plots.find(p => plotWeather[p.id]?.advisory?.diseaseRisk?.startsWith('\u26a0')) || null
  const bestIrrigationPlot = plots.find(p => plotWeather[p.id]?.advisory?.irrigate) || null

  return (
    <div style={PAGE_BG}>
      <main style={{ flex: 1, paddingBottom: 100 }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '28px 32px 20px' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#111827', margin: 0, letterSpacing: '-0.025em' }}>
              {greeting()}, Farmer. 🌾
            </h1>
            <p style={{ color: '#4b5563', fontSize: '0.9375rem', margin: '6px 0 0', fontWeight: 500 }}>
              Tracking <strong>{plots.length} plots</strong> across <strong>{totalArea.toFixed(1)} acres</strong>
              {' — '}{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#166534', color: '#fff', borderRadius: 9999, padding: '8px 16px', fontSize: '0.875rem', fontWeight: 600, marginTop: 4, boxShadow: '0 2px 10px rgba(22,101,52,0.2)' }}>
            <span style={{ width: 8, height: 8, background: '#86efac', borderRadius: '50%', display: 'inline-block' }} />
            System Online
          </div>
        </div>

        {isLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '300px', gap: 16 }}>
            <Loader2 size={36} color="#166534" style={{ animation: 'spin 1s linear infinite' }} />
            <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>Loading live data for all {plots.length} plots…</p>
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : (
          <>
            {/* TOP 4 STAT CARDS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, padding: '0 32px', marginBottom: 24 }}>

              {/* Weather */}
              <div style={{ background: '#fff', borderRadius: 16, padding: '20px', border: '1px solid #e8ede7', display: 'flex', flexDirection: 'column', gap: 6, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <ThermometerSun size={20} color="#2d6a27" />
                  <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#374151' }}>Weather ({firstPlot?.city})</span>
                </div>
                {firstWeather && <div style={{ fontSize: '0.8125rem', color: '#6b7280' }}>{firstWeather.current.description}, {firstWeather.current.humidity}% Hum</div>}
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', letterSpacing: '-0.02em' }}>
                  {firstWeather ? `${firstWeather.current.temp}°C` : '—'}
                </div>
                <p style={{ fontSize: '0.8rem', color: '#4b5563', lineHeight: 1.5, margin: '0 0 auto', flex: 1 }}>
                  {firstWeather?.advisory?.sprayAdvice?.replace(/^[^\s]+ /, '') || 'Fetching weather…'}
                </p>
                <Link href="/schedule" style={{ display: 'block', textAlign: 'center', marginTop: 8, padding: '9px 0', borderRadius: 10, textDecoration: 'none', fontSize: '0.8125rem', fontWeight: 600, background: '#166534', color: '#fff' }}>
                  10-Day Forecast →
                </Link>
              </div>

              {/* Irrigation */}
              <div style={{ background: '#fff', borderRadius: 16, padding: '20px', border: '1px solid #e8ede7', borderLeft: `3px solid ${bestIrrigationPlot ? '#2563eb' : '#bbf7d0'}`, display: 'flex', flexDirection: 'column', gap: 6, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <Droplets size={20} color="#0891b2" />
                  <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#374151' }}>Irrigation</span>
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827' }}>
                  {bestIrrigationPlot ? `Apply ${plotWeather[bestIrrigationPlot.id]?.advisory?.irrigationMm}mm` : 'Skip Today'}
                </div>
                <p style={{ fontSize: '0.8rem', color: '#4b5563', lineHeight: 1.5, margin: '0 0 auto', flex: 1 }}>
                  {bestIrrigationPlot
                    ? `${bestIrrigationPlot.name} (${bestIrrigationPlot.crop}) needs water today.`
                    : `All ${plots.length} plots have adequate moisture.`}
                </p>
                <Link href="/schedule" style={{ display: 'block', textAlign: 'center', marginTop: 8, padding: '9px 0', borderRadius: 10, textDecoration: 'none', fontSize: '0.8125rem', fontWeight: 600, background: '#f0fdf4', color: '#166534', border: '1px solid #dcfce7' }}>
                  View Details
                </Link>
              </div>

              {/* Pest & Disease */}
              <div style={{ background: '#fff', borderRadius: 16, padding: '20px', border: '1px solid #e8ede7', borderLeft: `3px solid ${worstRiskPlot ? '#dc2626' : '#bbf7d0'}`, display: 'flex', flexDirection: 'column', gap: 6, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <AlertTriangle size={20} color={worstRiskPlot ? '#dc2626' : '#16a34a'} />
                  <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#374151' }}>Pest & Disease</span>
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: worstRiskPlot ? '#dc2626' : '#166534' }}>
                  {worstRiskPlot ? 'High Risk' : 'Low Risk'}
                </div>
                <p style={{ fontSize: '0.8rem', color: '#4b5563', lineHeight: 1.5, margin: '0 0 auto', flex: 1 }}>
                  {worstRiskPlot
                    ? `${worstRiskPlot.name}: ${plotWeather[worstRiskPlot.id]?.advisory?.diseaseRisk?.replace(/^⚠️\s*/, '').split('.')[0]}.`
                    : `All plots are low-risk today. Monitor weekly.`}
                </p>
                <Link href="/diagnose" style={{ display: 'block', textAlign: 'center', marginTop: 8, padding: '9px 0', borderRadius: 10, textDecoration: 'none', fontSize: '0.8125rem', fontWeight: 600, background: '#f0fdf4', color: '#166534', border: '1px solid #dcfce7' }}>
                  Scan Crop
                </Link>
              </div>

              {/* Farm Summary */}
              <div style={{ background: 'linear-gradient(135deg, #166534 0%, #065f46 100%)', borderRadius: 16, padding: '20px', color: '#fff', display: 'flex', flexDirection: 'column', gap: 6, boxShadow: '0 4px 20px rgba(22,101,52,0.25)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <Sprout size={20} color="#86efac" />
                  <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#a7f3d0' }}>My Farm Summary</span>
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em' }}>{plots.length} Plots</div>
                <div style={{ fontSize: '0.8rem', color: '#d1fae5', lineHeight: 1.7 }}>
                  {plots.map(p => `${p.name} (${p.crop})`).join('\n• ')}
                </div>
                <Link href="/schedule" style={{ display: 'block', textAlign: 'center', marginTop: 8, padding: '9px 0', borderRadius: 10, textDecoration: 'none', fontSize: '0.8125rem', fontWeight: 600, background: 'rgba(255,255,255,0.15)', color: '#fff' }}>
                  Manage Plots
                </Link>
              </div>
            </div>

            {/* GROWTH TRACKER — fully dynamic */}
            <div style={{ padding: '0 32px', marginBottom: 24 }}>
              <div style={{ background: '#fff', borderRadius: 16, padding: '24px', border: '1px solid #e8ede7', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                  <Leaf size={22} color="#166534" />
                  <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#111827', margin: 0 }}>My Plots — Live Growth Tracker</h2>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(plots.length, 2)}, 1fr)`, gap: 28 }}>
                  {plots.map((plot) => {
                    const { stages, stageIndex, daysToHarvest } = getStageInfo(plot.crop)
                    const w = plotWeather[plot.id]
                    return (
                      <div key={plot.id}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, alignItems: 'flex-start' }}>
                          <div>
                            <span style={{ fontWeight: 700, color: '#1f2937', fontSize: '0.9375rem' }}>{plot.name} — {plot.crop}</span>
                            <span style={{ marginLeft: 8, fontSize: '0.75rem', color: '#9ca3af' }}>📏 {plot.area} · 📍 {plot.city}</span>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#ea580c' }}>~{daysToHarvest} days to harvest</div>
                            {w?.current?.temp != null && (
                              <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: 2 }}>🌡 {w.current.temp}°C · {w.current.description}</div>
                            )}
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 3, height: 10, borderRadius: 99, overflow: 'hidden', marginBottom: 6 }}>
                          {stages.map((s, idx) => (
                            <div key={s} style={{
                              flex: 1, height: '100%',
                              background: idx < stageIndex ? '#166534' : idx === stageIndex ? '#22c55e' : '#e5e7eb',
                              borderRadius: idx === 0 ? '99px 0 0 99px' : idx === stages.length - 1 ? '0 99px 99px 0' : 0,
                            }} title={s} />
                          ))}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', fontWeight: 500 }}>
                          {stages.map((s, idx) => (
                            <span key={s} style={{ color: idx === stageIndex ? '#166534' : '#9ca3af', fontWeight: idx === stageIndex ? 700 : 400 }}>
                              {s}{idx === stageIndex ? ' ✦' : ''}
                            </span>
                          ))}
                        </div>
                        {w?.advisory && (
                          <div style={{ marginTop: 10, padding: '8px 12px', background: '#f0fdf4', borderRadius: 8, border: '1px solid #dcfce7', fontSize: '0.75rem', color: '#166534', lineHeight: 1.5 }}>
                            💧 {w.advisory.irrigation?.split('.')[0]}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* BOTTOM ROW */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, padding: '0 32px' }}>

              {/* Today's actions per plot */}
              <div style={{ background: '#fff', borderRadius: 16, padding: '24px', border: '1px solid #e8ede7', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <Clock size={18} color="#166534" />
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#111827', margin: 0 }}>{"Today's Actions Per Plot"}</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {plots.map(plot => {
                    const w = plotWeather[plot.id]
                    const irrigate = w?.advisory?.irrigate
                    const risk = w?.advisory?.diseaseRisk?.startsWith('⚠️')
                    return (
                      <div key={plot.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 10, background: risk ? '#fef2f2' : irrigate ? '#eff6ff' : '#f0fdf4', border: `1px solid ${risk ? '#fecaca' : irrigate ? '#bfdbfe' : '#dcfce7'}` }}>
                        <span style={{ fontSize: '1.25rem' }}>{risk ? '⚠️' : irrigate ? '💧' : '✅'}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#111827' }}>{plot.name} — {plot.crop}</div>
                          <div style={{ fontSize: '0.75rem', color: '#4b5563', marginTop: 2 }}>
                            {!w ? 'Loading…' : risk ? 'High disease risk — apply preventive fungicide' : irrigate ? `Irrigate ${w.advisory.irrigationMm}mm today` : 'All clear — monitor as usual'}
                          </div>
                        </div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280' }}>{plot.city}</span>
                      </div>
                    )
                  })}
                </div>
                <Link href="/schedule" style={{ display: 'block', textAlign: 'center', marginTop: 14, padding: '10px 0', borderRadius: 10, textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600, background: '#f0fdf4', color: '#166534', border: '1px solid #dcfce7' }}>
                  View Full Schedule →
                </Link>
              </div>

              {/* Markets + Revenue */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ background: '#fff', borderRadius: 16, padding: '22px', border: '1px solid #e8ede7', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <TrendingUp size={18} color="#047857" />
                      <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#111827', margin: 0 }}>Nearby Markets</h3>
                    </div>
                    <span style={{ fontSize: '0.75rem', background: '#f3f4f6', fontWeight: 600, borderRadius: 6, padding: '4px 10px' }}>{plots[0]?.crop} (Quintal)</span>
                  </div>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                        {['Mandi', 'Price (₹)', 'Trend'].map(h => (
                          <th key={h} style={{ textAlign: 'left', padding: '0 0 10px', fontSize: '0.75rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {marketData?.mandis?.slice(0, 3).map((row: any, i: number) => (
                        <tr key={i} style={{ borderBottom: i < 2 ? '1px solid #f9fafb' : 'none' }}>
                          <td style={{ padding: '12px 0', color: '#111827', fontWeight: 600 }}>{row.mandiName}</td>
                          <td style={{ padding: '12px 0', color: '#1f2937', fontWeight: 500 }}>₹{row.modalPrice}</td>
                          <td style={{ padding: '12px 0', color: row.vsAverage > 0 ? '#16a34a' : '#dc2626', fontWeight: 700 }}>
                            {row.vsAverage > 0 ? `+${row.vsAverage} ↑` : `${row.vsAverage} ↓`}
                          </td>
                        </tr>
                      )) || <tr><td colSpan={3} style={{ padding: '14px 0', color: '#6b7280' }}>No market data today.</td></tr>}
                    </tbody>
                  </table>
                </div>

                <div style={{ background: 'linear-gradient(135deg, #166534 0%, #064e3b 100%)', borderRadius: 16, padding: '22px', color: '#fff', boxShadow: '0 10px 25px -5px rgba(6,78,59,0.3)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <Landmark size={18} color="#86efac" />
                    <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#86efac', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Projected Harvest Revenue</h3>
                  </div>
                  <div style={{ fontSize: '2.25rem', fontWeight: 800, margin: '0 0 8px', letterSpacing: '-0.02em' }}>
                    ₹{marketData?.highestPrice
                      ? (marketData.highestPrice * Math.round(totalArea * 18)).toLocaleString('en-IN')
                      : Math.round(totalArea * 18 * 2200).toLocaleString('en-IN')
                    } <span style={{ fontSize: '1.1rem', color: '#a7f3d0', fontWeight: 500 }}>Est.</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#d1fae5', margin: 0, lineHeight: 1.5 }}>
                    Based on <strong>{totalArea.toFixed(1)} acres</strong> across {plots.length} plots at avg. yield.
                    {marketData?.bestMandi ? ` Best: ₹${marketData.bestMandi.modalPrice} at ${marketData.bestMandi.mandiName}.` : ''}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}