'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Loader2, AlertCircle } from 'lucide-react'

const PAGE_BG = {
  minHeight: '100vh',
  background: 'radial-gradient(ellipse at 0% 0%, rgba(255,220,90,0.45) 0%, transparent 50%), radial-gradient(ellipse at 100% 100%, rgba(80,200,160,0.38) 0%, transparent 55%), #f0f7ee',
  fontFamily: 'Inter,sans-serif',
}

function owIconToEmoji(icon: string): string {
  const map: Record<string, string> = {
    '01d': '☀️', '01n': '🌙', '02d': '⛅', '02n': '⛅', '03d': '☁️', '03n': '☁️',
    '04d': '☁️', '04n': '☁️', '09d': '🌧️', '09n': '🌧️', '10d': '🌦️', '10n': '🌧️',
    '11d': '⛈️', '11n': '⛈️', '13d': '❄️', '13n': '❄️', '50d': '🌫️', '50n': '🌫️',
  }
  return map[icon] ?? '🌤️'
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function SchedulePage() {
  const [activePlot, setActivePlot] = useState('plot2a')
  const [weather, setWeather] = useState<any>(null)
  const [weatherLoading, setWeatherLoading] = useState(true)
  const [weatherError, setWeatherError] = useState<string | null>(null)

  const plots = [
    { id: 'plot2a', name: 'Plot 2A', crop: 'Tomato', area: '1.2 ac', city: 'Vidisha' },
    { id: 'plot3b', name: 'Plot 3B', crop: 'Wheat', area: '0.8 ac', city: 'Bhopal' },
    { id: 'plot1c', name: 'Plot 1C', crop: 'Rice', area: '1.5 ac', city: 'Jabalpur' },
  ]
  const activePlotData = plots.find(p => p.id === activePlot)!

  useEffect(() => {
    const fetchWeather = async () => {
      setWeatherLoading(true)
      setWeatherError(null)
      try {
        const resp = await fetch(`/api/weather?city=${encodeURIComponent(activePlotData.city)}&crop=${activePlotData.crop}&stage=flowering`)
        if (!resp.ok) throw new Error(`Status ${resp.status}`)
        const data = await resp.json()
        setWeather(data)
      } catch {
        setWeatherError('Could not load live weather.')
      } finally {
        setWeatherLoading(false)
      }
    }
    fetchWeather()
  }, [activePlot])

  const currentTemp = weather?.current?.temp ? Math.round(weather.current.temp) : null
  const currentDesc = weather?.current?.description ?? ''
  const currentIcon = weather?.current?.icon ?? '01d'
  const humidity = weather?.current?.humidity ?? 65
  const windSpeed = weather?.current?.windSpeed ?? 12
  const dailyForecast = weather?.daily ?? []

  return (
    <div style={PAGE_BG}>
      {/* Top nav */}
      <nav style={{ background: 'rgba(255,255,255,0.9)', borderBottom: '1px solid rgba(0,0,0,0.06)', padding: '0 28px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', backdropFilter: 'blur(8px)' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none' }}>
          <span style={{ fontSize: '1.2rem' }}>🌿</span>
          <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#2d6a27', letterSpacing: '-0.02em' }}>KisanSeva</span>
        </Link>
        <div style={{ display: 'flex', gap: 28 }}>
          {[['Crops', '/diagnose'], ['Weather', '/schedule'], ['Market', '/market'], ['Profile', '/dashboard']].map(([label, href]) => (
            <Link key={label} href={href} style={{ fontSize: '0.9rem', fontWeight: 500, color: label === 'Weather' ? '#2d6a27' : '#374151', textDecoration: 'none', borderBottom: label === 'Weather' ? '2px solid #2d6a27' : 'none', paddingBottom: 2 }}>{label}</Link>
          ))}
        </div>
      </nav>

      {/* Plot selector tabs */}
      <div style={{ display: 'flex', gap: 4, padding: '24px 28px 0', borderBottom: '1px solid rgba(0,0,0,0.06)', background: 'rgba(255,255,255,0.5)' }}>
        {plots.map(plot => (
          <button key={plot.id} onClick={() => setActivePlot(plot.id)} style={{
            padding: '10px 18px', background: 'none', border: 'none', cursor: 'pointer',
            fontSize: '0.875rem', fontWeight: activePlot === plot.id ? 600 : 500,
            color: activePlot === plot.id ? '#2d6a27' : '#6b7280',
            borderBottom: `2px solid ${activePlot === plot.id ? '#2d6a27' : 'transparent'}`,
            fontFamily: 'Inter,sans-serif', transition: 'all 0.15s', whiteSpace: 'nowrap',
          }}>
            {plot.name} — {plot.crop} ({plot.area})
          </button>
        ))}
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 24px 80px' }}>
        {/* Current weather — big centered display */}
        {weatherLoading ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#6b7280' }}>
            <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', marginBottom: 12 }} />
            <div style={{ fontSize: '0.9rem' }}>Loading live weather...</div>
          </div>
        ) : weatherError ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#dc2626' }}>
            <AlertCircle size={24} style={{ marginBottom: 8 }} />
            <div style={{ fontSize: '0.875rem' }}>{weatherError}</div>
          </div>
        ) : (
          <>
            {/* Big temp display */}
            <div style={{ textAlign: 'center', padding: '40px 0 32px' }}>
              <div style={{ fontSize: 'clamp(3rem, 10vw, 5rem)', fontWeight: 700, color: '#111827', letterSpacing: '-0.03em', lineHeight: 1 }}>
                {currentTemp ?? 28}°C, {currentDesc ? currentDesc.charAt(0).toUpperCase() + currentDesc.slice(1) : 'Sunny'} {owIconToEmoji(currentIcon)}
              </div>
            </div>

            {/* 7-day forecast strip */}
            <div style={{ background: '#fff', borderRadius: 18, border: '1px solid #e8ede7', overflow: 'hidden', marginBottom: 20 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
                {(dailyForecast.length > 0 ? dailyForecast.slice(0, 7) : Array(7).fill(null)).map((day: any, i: number) => {
                  const date = new Date()
                  date.setDate(date.getDate() + i)
                  const dayName = i === 0 ? 'Today' : DAYS[date.getDay()]
                  const maxT = day ? Math.round(day.maxTemp ?? day.temp ?? 28 + i) : (28 + i)
                  const minT = day ? Math.round(day.minTemp ?? day.temp ?? 20 + i) : (20 + i)
                  const icon = day?.icon ?? (i % 3 === 0 ? '01d' : i % 3 === 1 ? '03d' : '10d')
                  return (
                    <div key={i} style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '18px 6px',
                      borderRight: i < 6 ? '1px solid #f3f4f6' : 'none',
                      background: i === 0 ? '#f0fdf4' : 'transparent',
                    }}>
                      <div style={{ fontSize: '0.8125rem', fontWeight: i === 0 ? 700 : 500, color: i === 0 ? '#2d6a27' : '#374151', marginBottom: 10 }}>{dayName}</div>
                      <div style={{ fontSize: '1.5rem', marginBottom: 10 }}>{owIconToEmoji(icon)}</div>
                      <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#111827' }}>{maxT}/{minT}°C</div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* 3 metric cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 28 }}>
              {[
                { icon: '💧', label: 'Humidity', value: `${humidity}%`, sub: humidity < 60 ? 'Low' : humidity < 80 ? 'Moderate' : 'High' },
                { icon: '🌬️', label: 'Wind Speed', value: `${windSpeed} km/h`, sub: 'North-East' },
                { icon: '☂️', label: 'Rain Probability', value: `${weather?.current?.rainChance ?? 15}%`, sub: 'Low Chance' },
              ].map((m, i) => (
                <div key={i} style={{ background: '#fff', borderRadius: 14, border: '1px solid #e8ede7', padding: '18px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <span style={{ fontSize: '1.1rem' }}>{m.icon}</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#6b7280' }}>{m.label}</span>
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#111827', letterSpacing: '-0.02em', marginBottom: 4 }}>{m.value}</div>
                  <div style={{ fontSize: '0.8125rem', color: '#9ca3af' }}>{m.sub}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Agricultural Advice */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <div style={{ background: '#2d6a27', color: '#fff', borderRadius: 9999, padding: '10px 28px', fontSize: '0.9375rem', fontWeight: 600 }}>
            Agricultural Advice
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e8ede7', padding: '20px' }}>
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#111827', margin: '0 0 8px' }}>Crop Irrigation</h4>
            <p style={{ fontSize: '0.8125rem', color: '#6b7280', margin: 0, lineHeight: 1.6 }}>
              {weather?.advisory?.irrigation ?? 'Adequate moisture. Schedule irrigation for late evening.'}
            </p>
          </div>
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e8ede7', padding: '20px' }}>
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#111827', margin: '0 0 8px' }}>Pest Alert</h4>
            <p style={{ fontSize: '0.8125rem', color: '#6b7280', margin: 0, lineHeight: 1.6 }}>
              {weather?.advisory?.diseaseRisk ?? 'Low risk. Monitor for aphids in pulses.'}
            </p>
          </div>
        </div>

        {/* Weekly schedule */}
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e8ede7', overflow: 'hidden', marginTop: 28 }}>
          <div style={{ padding: '18px 20px 14px', borderBottom: '1px solid #f3f4f6' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', margin: 0 }}>Weekly Schedule — {activePlotData.name}</h3>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
            <thead>
              <tr style={{ background: '#f9fafb' }}>
                {['Day', 'Irrigation', 'Fertilizer', 'Notes'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '10px 16px', fontSize: '0.75rem', fontWeight: 600, color: '#9ca3af', letterSpacing: '0.04em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { day: 'Mon (Today)', irrigation: '28mm', fert: 'DAP 5kg', notes: 'Apply at root zone', today: true },
                { day: 'Tue', irrigation: '—', fert: '—', notes: '—', today: false },
                { day: 'Wed', irrigation: '15mm', fert: 'Urea 2kg', notes: 'Top dressing', today: false },
                { day: 'Thu', irrigation: '—', fert: '—', notes: '—', today: false },
                { day: 'Fri', irrigation: '20mm', fert: '—', notes: 'Evening only', today: false },
                { day: 'Sat', irrigation: '—', fert: 'Foliar Spray', notes: 'Micronutrients', today: false },
                { day: 'Sun', irrigation: '—', fert: '—', notes: 'Field scouting', today: false },
              ].map((row, i) => (
                <tr key={i} style={{ borderTop: '1px solid #f3f4f6', borderLeft: row.today ? '3px solid #2d6a27' : 'none', background: row.today ? '#f0fdf4' : 'transparent' }}>
                  <td style={{ padding: '12px 16px', fontWeight: row.today ? 700 : 400, color: row.today ? '#2d6a27' : '#374151' }}>{row.day}</td>
                  <td style={{ padding: '12px 16px', color: '#374151' }}>{row.irrigation}</td>
                  <td style={{ padding: '12px 16px', color: '#374151' }}>{row.fert}</td>
                  <td style={{ padding: '12px 16px', color: '#6b7280' }}>{row.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'rgba(255,255,255,0.97)', borderTop: '1px solid #e8ede7', display: 'flex', justifyContent: 'space-around', padding: '8px 0', zIndex: 50 }}>
        {[['🏠', 'Home', '/'], ['🔬', 'Crops', '/diagnose'], ['📈', 'Market', '/market'], ['📅', 'Schedule', '/schedule'], ['🤖', 'Agent', '/agent']].map(([icon, label, href]) => (
          <Link key={label} href={href} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, textDecoration: 'none', color: href === '/schedule' ? '#2d6a27' : '#6b7280', fontSize: '0.625rem', fontWeight: 500, padding: '4px 12px', minWidth: 44 }}>
            <span style={{ fontSize: '1.25rem' }}>{icon}</span>
            {label}
          </Link>
        ))}
      </nav>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
