'use client'

import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { Microscope, TrendingUp, Cloud, Users, Settings, MessageSquare, X, Send, Leaf, Landmark, Loader2, AlertTriangle, Droplets, ThermometerSun } from 'lucide-react'

const PAGE_BG = {
  minHeight: '100vh',
  background: 'radial-gradient(ellipse at 80% 10%, rgba(255,210,80,0.4) 0%, transparent 50%), radial-gradient(ellipse at 10% 90%, rgba(80,190,130,0.35) 0%, transparent 50%), #f0f7ee',
}

export default function DashboardPage() {
  const [weatherData, setWeatherData] = useState<any>(null)
  const [marketData, setMarketData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      try {
        const [weatherRes, marketRes] = await Promise.all([
          fetch('/api/weather?city=Delhi&crop=wheat').then(res => res.json().catch(() => null)),
          fetch('/api/market?commodity=Wheat').then(res => res.json().catch(() => null))
        ])
        if (weatherRes?.success) setWeatherData(weatherRes)
        if (marketRes?.success) setMarketData(marketRes)
      } catch (e) {
        console.error(e)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <div>
      <main style={{ flex: 1, ...PAGE_BG, paddingBottom: 100 }}>
        {/* Top header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '28px 32px 20px' }}>
          <div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#111827', margin: 0, letterSpacing: '-0.025em' }}>Good morning, Farmer. 🌾</h1>
            <p style={{ color: '#4b5563', fontSize: '1rem', margin: '6px 0 0', fontWeight: 500 }}>Here is the latest data for your 2 plots.</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#166534', color: '#fff', borderRadius: 9999, padding: '8px 16px', fontSize: '0.875rem', fontWeight: 600, marginTop: 4, boxShadow: '0 2px 10px rgba(22,101,52,0.2)' }}>
            <span style={{ width: 8, height: 8, background: '#86efac', borderRadius: '50%', display: 'inline-block' }} />
            System Online
          </div>
        </div>

        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
            <Loader2 size={32} color="#166534" className="lucide-spin" />
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } .lucide-spin { animation: spin 1s linear infinite; }`}</style>
          </div>
        ) : (
          <>
            {/* Stat cards row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, padding: '0 32px', marginBottom: 24 }}>
              {[
                { 
                  icon: <ThermometerSun size={24} color="#2d6a27" />, 
                  label: 'Weather (Delhi)', 
                  big: weatherData ? `${weatherData.current.temp}°C` : '28°C', 
                  sub: weatherData ? `${weatherData.current.description}, ${weatherData.current.humidity}% Hum` : 'Partly Cloudy', 
                  desc: 'Forecast looks clear. Ideal conditions for plot maintenance.', 
                  btn: 'View 7-Day Forecast', btnHref: '/schedule', btnPrimary: true 
                },
                { 
                  icon: <Droplets size={24} color="#0891b2" />, 
                  label: 'Irrigation', 
                  big: weatherData?.advisory?.irrigate ? `Apply ${weatherData.advisory.irrigationMm}mm` : 'Skip Today', 
                  sub: '', 
                  desc: weatherData?.advisory?.generalAdvice || 'Soil moisture is optimal.', 
                  btn: 'View Details', btnHref: '/schedule', btnPrimary: false 
                },
                { 
                  icon: '⚗️', 
                  label: 'Fertilizer', 
                  big: 'Apply Urea Mix', 
                  sub: '', 
                  desc: 'Plot A requires nitrogen boost within the next 48 hours.', 
                  btn: 'View Details', btnHref: '/schedule', btnPrimary: false 
                },
                { 
                  icon: <AlertTriangle size={24} color="#dc2626" />, 
                  label: 'Pest Alert', 
                  big: weatherData?.advisory?.diseaseAlert ? 'High Risk' : 'Low Risk', 
                  sub: '', 
                  desc: weatherData?.advisory?.diseaseAlert || 'Conditions favorable. Monitor lower leaves.', 
                  btn: 'Scan Crop', btnHref: '/diagnose', btnPrimary: false 
                },
              ].map((card, i) => (
                <div key={i} style={{ background: '#fff', borderRadius: 16, padding: '20px', border: '1px solid #e8ede7', display: 'flex', flexDirection: 'column', gap: 8, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 2 }}>
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{card.icon}</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>{card.label}</span>
                  </div>
                  {card.sub && <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{card.sub}</div>}
                  <div style={{ fontSize: card.big.length > 12 ? '1.125rem' : '1.5rem', fontWeight: 800, color: '#111827', letterSpacing: '-0.01em' }}>{card.big}</div>
                  <p style={{ fontSize: '0.8125rem', color: '#4b5563', lineHeight: 1.55, margin: '0 0 auto', flex: 1 }}>{card.desc}</p>
                  <Link href={card.btnHref} style={{
                    display: 'block', textAlign: 'center', marginTop: 10,
                    padding: '10px 0', borderRadius: 10, textDecoration: 'none',
                    fontSize: '0.875rem', fontWeight: 600,
                    background: card.btnPrimary ? '#166534' : '#f9fafb',
                    color: card.btnPrimary ? '#fff' : '#166534',
                    border: card.btnPrimary ? 'none' : '1px solid #dcfce7',
                    transition: 'all 0.2s'
                  }}>
                    {card.btn}
                  </Link>
                </div>
              ))}
            </div>

            {/* Middle Row: Visual Plot Tracker */}
            <div style={{ padding: '0 32px', marginBottom: 24 }}>
              <div style={{ background: '#fff', borderRadius: 16, padding: '24px', border: '1px solid #e8ede7', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                  <Leaf size={24} color="#166534" />
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', margin: 0 }}>My Plots &amp; Growth Tracker</h2>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
                  {/* Plot 1 */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontWeight: 700, color: '#1f2937' }}>Plot A — Wheat (2.4 Acres)</span>
                      <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#ea580c' }}>45 Days to Harvest</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, height: 12, marginBottom: 8 }}>
                      <div style={{ flex: 1, height: '100%', background: '#166534', borderRadius: '99px 0 0 99px' }} title="Sowing"></div>
                      <div style={{ flex: 1.5, height: '100%', background: '#22c55e' }} title="Vegetative"></div>
                      <div style={{ flex: 1, height: '100%', background: '#e5e7eb' }} title="Flowering"></div>
                      <div style={{ flex: 1, height: '100%', background: '#e5e7eb', borderRadius: '0 99px 99px 0' }} title="Harvest"></div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#6b7280', fontWeight: 500 }}>
                      <span>Sowing</span>
                      <span style={{ color: '#166534', fontWeight: 700 }}>Vegetative (Current)</span>
                      <span>Flowering</span>
                      <span>Harvest</span>
                    </div>
                  </div>

                  {/* Plot 2 */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontWeight: 700, color: '#1f2937' }}>Plot B — Tomato (1.2 Acres)</span>
                      <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#2563eb' }}>Fruiting Stage</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, height: 12, marginBottom: 8 }}>
                      <div style={{ flex: 1, height: '100%', background: '#166534', borderRadius: '99px 0 0 99px' }}></div>
                      <div style={{ flex: 1.5, height: '100%', background: '#166534' }}></div>
                      <div style={{ flex: 1, height: '100%', background: '#22c55e' }}></div>
                      <div style={{ flex: 1, height: '100%', background: '#e5e7eb', borderRadius: '0 99px 99px 0' }}></div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#6b7280', fontWeight: 500 }}>
                      <span>Sowing</span>
                      <span>Vegetative</span>
                      <span style={{ color: '#166534', fontWeight: 700 }}>Fruiting (Current)</span>
                      <span>Harvest</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Lower row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, padding: '0 32px' }}>
              
              {/* LEFT COLUMN */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {/* Scan Crop card */}
                <div style={{ background: '#fff', borderRadius: 16, padding: '32px 24px', border: '1px solid #e8ede7', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, textAlign: 'center', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)' }}>
                  <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#f0fdf4', border: '1.5px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>📷</div>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', margin: '0 0 5px' }}>Scan Crop with AI</h3>
                    <p style={{ fontSize: '0.9rem', color: '#4b5563', margin: 0 }}>Instantly diagnose pests &amp; diseases using multi-model AI</p>
                  </div>
                  <Link href="/diagnose" style={{ background: '#166534', color: '#fff', padding: '12px 36px', borderRadius: 10, textDecoration: 'none', fontSize: '0.9375rem', fontWeight: 600, boxShadow: '0 4px 12px rgba(22,101,52,0.3)' }}>
                    Start Scan
                  </Link>
                </div>

                {/* Gov Schemes Card */}
                <div style={{ background: '#fff', borderRadius: 16, padding: '24px', border: '1px solid #e8ede7', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                    <Landmark size={20} color="#1d4ed8" />
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#111827', margin: 0 }}>Recommended Schemes</h3>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: '#eff6ff', borderRadius: 10, border: '1px solid #bfdbfe' }}>
                      <div>
                        <div style={{ fontWeight: 700, color: '#1e3a8a', fontSize: '0.9rem' }}>PM-KISAN Samman Nidhi</div>
                        <div style={{ fontSize: '0.8rem', color: '#3b82f6' }}>₹6000/year minimum income support</div>
                      </div>
                      <button style={{ background: '#1d4ed8', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 12px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>Apply</button>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: '#fdf4ff', borderRadius: 10, border: '1px solid #fbcfe8' }}>
                      <div>
                        <div style={{ fontWeight: 700, color: '#831843', fontSize: '0.9rem' }}>Crop Insurance (PMFBY)</div>
                        <div style={{ fontSize: '0.8rem', color: '#d946ef' }}>Protect Plot A against unseasonal rain</div>
                      </div>
                      <button style={{ background: '#be185d', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 12px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>Enroll</button>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {/* Nearby Markets card */}
                <div style={{ background: '#fff', borderRadius: 16, padding: '24px', border: '1px solid #e8ede7', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <TrendingUp size={20} color="#047857" />
                      <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#111827', margin: 0 }}>Nearby Markets</h3>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#111827', background: '#f3f4f6', fontWeight: 600, borderRadius: 6, padding: '4px 10px' }}>Wheat (Quintal)</span>
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
                      {marketData?.mandis?.slice(0,3).map((row: any, i: number) => (
                        <tr key={i} style={{ borderBottom: i < 2 ? '1px solid #f9fafb' : 'none' }}>
                          <td style={{ padding: '14px 0', color: '#111827', fontWeight: 600 }}>{row.mandiName}</td>
                          <td style={{ padding: '14px 0', color: '#1f2937', fontWeight: 500 }}>₹{row.modalPrice}</td>
                          <td style={{ padding: '14px 0', color: row.vsAverage > 0 ? '#16a34a' : '#dc2626', fontWeight: 700, fontSize: '0.875rem' }}>
                            {row.vsAverage > 0 ? `+${row.vsAverage} ↑` : `${row.vsAverage} ↓`}
                          </td>
                        </tr>
                      )) || (
                        <tr><td colSpan={3} style={{ padding: '14px 0', color: '#6b7280' }}>No market data available today.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Financial Outlook */}
                <div style={{ background: 'linear-gradient(135deg, #166534 0%, #064e3b 100%)', borderRadius: 16, padding: '24px', color: '#fff', boxShadow: '0 10px 25px -5px rgba(6,78,59,0.3)' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#86efac', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Projected Harvest Revenue</h3>
                  <div style={{ fontSize: '2.5rem', fontWeight: 800, margin: '0 0 12px', letterSpacing: '-0.02em' }}>
                    ₹{marketData?.highestPrice ? (marketData.highestPrice * 38).toLocaleString() : '85,500'} <span style={{ fontSize: '1.25rem', color: '#a7f3d0', fontWeight: 500 }}>Est.</span>
                  </div>
                  <p style={{ fontSize: '0.9rem', color: '#d1fae5', margin: 0, lineHeight: 1.5 }}>
                    Based on an estimated yield of <strong>38 quintals</strong> from Plot A and current highest mandi price {marketData?.bestMandi ? `(₹${marketData.bestMandi.modalPrice} at ${marketData.bestMandi.mandiName})` : ''}.
                  </p>
                </div>
              </div>

            </div>
          </>
        )}
      </main>
      
      <FloatingChatbot />
    </div>
  )
}

function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<{role: 'user'|'bot', text: string}[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const handleSend = async () => {
    if (!input.trim()) return
    const userMsg = input.trim()
    setMessages(prev => [...prev, { role: 'user', text: userMsg }])
    setInput('')
    setIsTyping(true)

    try {
      const res = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userMsg, language: 'en', plot_id: 'plot_a' })
      })
      const data = await res.json()
      
      if (data.success && data.result?.text) {
        setMessages(prev => [...prev, { role: 'bot', text: data.result.text }])
      } else {
        setMessages(prev => [...prev, { role: 'bot', text: 'Sorry, I am having trouble connecting to the network right now.' }])
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: 'Network error. Please try again later.' }])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <>
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed', bottom: 30, right: 30, width: 64, height: 64, 
            borderRadius: '50%', background: '#166534', color: '#fff', 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: 'none', cursor: 'pointer', boxShadow: '0 8px 24px rgba(22,101,52,0.4)',
            zIndex: 50, transition: 'transform 0.2s'
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <MessageSquare size={28} />
        </button>
      )}

      {isOpen && (
        <div style={{
          position: 'fixed', bottom: 30, right: 30, width: 380, height: 550,
          background: '#fff', borderRadius: 20, boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden', zIndex: 50,
          border: '1px solid #e5e7eb'
        }}>
          {/* Header */}
          <div style={{ background: '#166534', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#fff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 32, height: 32, background: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '1.2rem' }}>🤖</span>
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1rem' }}>KisanBot AI</div>
                <div style={{ fontSize: '0.75rem', color: '#bbf7d0' }}>Online • Ready to help</div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, padding: 20, overflowY: 'auto', background: '#f9fafb', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {messages.length === 0 && (
              <div style={{ textAlign: 'center', marginTop: 40, color: '#6b7280' }}>
                <div style={{ fontSize: '3rem', marginBottom: 12 }}>👋</div>
                <div style={{ fontWeight: 600, color: '#374151', marginBottom: 6 }}>Hello, Farmer!</div>
                <div style={{ fontSize: '0.875rem' }}>Ask me about your crops, weather, or market prices.</div>
              </div>
            )}
            
            {messages.map((msg, idx) => (
              <div key={idx} style={{ 
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                background: msg.role === 'user' ? '#166534' : '#fff',
                color: msg.role === 'user' ? '#fff' : '#1f2937',
                padding: '12px 16px',
                borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                border: msg.role === 'bot' ? '1px solid #e5e7eb' : 'none',
                fontSize: '0.9rem',
                lineHeight: 1.5,
                whiteSpace: 'pre-wrap'
              }}>
                {msg.text}
              </div>
            ))}
            
            {isTyping && (
              <div style={{ alignSelf: 'flex-start', background: '#fff', padding: '12px 16px', borderRadius: '16px 16px 16px 4px', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Loader2 size={16} className="lucide-spin" color="#6b7280" />
                <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{ padding: 16, background: '#fff', borderTop: '1px solid #e5e7eb', display: 'flex', gap: 10 }}>
            <input 
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Type your question..."
              style={{ flex: 1, padding: '12px 16px', borderRadius: 99, border: '1px solid #d1d5db', outline: 'none', fontSize: '0.9rem' }}
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              style={{ width: 44, height: 44, borderRadius: '50%', background: input.trim() && !isTyping ? '#166534' : '#e5e7eb', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: input.trim() && !isTyping ? 'pointer' : 'default' }}
            >
              <Send size={18} style={{ marginLeft: -2 }} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
