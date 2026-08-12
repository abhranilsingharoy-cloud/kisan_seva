'use client'

import Link from 'next/link'
import { useState, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const PAGE_BG = {
  minHeight: '100vh',
  background: 'radial-gradient(ellipse at 0% 0%, rgba(255,220,90,0.4) 0%, transparent 50%), radial-gradient(ellipse at 100% 85%, rgba(80,200,150,0.38) 0%, transparent 55%), #f2f8f0',
  fontFamily: 'Inter,sans-serif',
}

const BADGE_STYLES: Record<string, { bg: string; color: string }> = {
  Healthy: { bg: '#dcfce7', color: '#16a34a' },
  'Action Required: Early Blight': { bg: '#fff7ed', color: '#ea580c' },
  'Monitoring: Thrips': { bg: '#fffbeb', color: '#d97706' },
}

const PESTS = [
  { icon: '🦗', name: 'Aphids', desc: 'Small insects that suck sap, causing leaf curling.', color: '#f0fdf4' },
  { icon: '🌽', name: 'Stem Borer', desc: 'Larvae that bore into stems, weakening the plant.', color: '#fffbeb' },
  { icon: '🍄', name: 'Powdery Mildew', desc: 'White powdery spots on leaves and stems.', color: '#faf5ff' },
  { icon: '🪲', name: 'Whitefly', desc: 'Tiny white flies that weaken plants by feeding.', color: '#eff6ff' },
  { icon: '🐛', name: 'Caterpillar', desc: 'Defoliating larvae attacking leaves and fruits.', color: '#fff1f2' },
]

export default function DiagnosePage() {
  const [status, setStatus] = useState<'idle' | 'uploading' | 'processing' | 'done'>('idle')
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [expanded, setExpanded] = useState(false)
  const [pestIndex, setPestIndex] = useState(0)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = (file: File) => {
    setImageUrl(URL.createObjectURL(file))
    setStatus('uploading')
    setTimeout(() => setStatus('processing'), 1200)
    setTimeout(() => setStatus('done'), 3500)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const reset = () => { setStatus('idle'); setImageUrl(null) }

  const VISIBLE = 3
  const maxIndex = PESTS.length - VISIBLE

  return (
    <div style={PAGE_BG}>
      {/* Top nav — same as weather page */}
      <nav style={{ background: 'rgba(255,255,255,0.9)', borderBottom: '1px solid rgba(0,0,0,0.06)', padding: '0 28px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', backdropFilter: 'blur(8px)' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none' }}>
          <span style={{ fontSize: '1.2rem' }}>🌿</span>
          <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#2d6a27', letterSpacing: '-0.02em' }}>KisanSeva</span>
        </Link>
        <div style={{ display: 'flex', gap: 28 }}>
          {[['Home', '/'], ['Crops', '/diagnose'], ['Weather', '/schedule'], ['Market Prices', '/market'], ['Profile', '/dashboard']].map(([label, href]) => (
            <Link key={label} href={href} style={{ fontSize: '0.9rem', fontWeight: 500, color: label === 'Crops' ? '#2d6a27' : '#374151', textDecoration: 'none', borderBottom: label === 'Crops' ? '2px solid #2d6a27' : 'none', paddingBottom: 2 }}>{label}</Link>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>📡</div>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #a7d9a0, #5ab54e)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: '#fff', cursor: 'pointer' }}>PS</div>
          <span style={{ fontSize: '0.8rem', color: '#6b7280', cursor: 'pointer' }}>▾</span>
        </div>
      </nav>

      <div style={{ maxWidth: 880, margin: '0 auto', padding: '32px 24px 100px' }}>
        {/* Scan Your Crop hero card */}
        <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #e8ede7', padding: '40px 24px', textAlign: 'center', marginBottom: 32 }}>
          {status === 'idle' && (
            <>
              <div style={{ fontSize: '3.5rem', marginBottom: 16 }}>📷🌿</div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', margin: '0 0 10px', letterSpacing: '-0.025em' }}>Scan Your Crop</h1>
              <p style={{ fontSize: '0.9375rem', color: '#6b7280', margin: '0 0 28px' }}>Identify health issues and get treatment advice instantly.</p>
              <div
                onDrop={handleDrop}
                onDragOver={e => e.preventDefault()}
                onClick={() => fileRef.current?.click()}
                style={{ border: '2px dashed #c9ddc6', borderRadius: 14, padding: '24px', cursor: 'pointer', marginBottom: 16, transition: 'all 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = '#2d6a27')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '#c9ddc6')}
              >
                <div style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Drag & drop an image here, or tap the button below</div>
              </div>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
              <button onClick={() => fileRef.current?.click()} style={{ background: '#2d6a27', color: '#fff', border: 'none', borderRadius: 10, padding: '13px 40px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 14px rgba(45,106,39,0.35)' }}>
                Start Scan
              </button>
            </>
          )}

          {status === 'uploading' && (
            <div style={{ padding: '20px 0' }}>
              <div style={{ fontSize: '2rem', marginBottom: 16 }}>📤</div>
              <div style={{ fontWeight: 600, color: '#374151', marginBottom: 16 }}>Uploading photo...</div>
              <div style={{ height: 6, background: '#e5e7eb', borderRadius: 99, overflow: 'hidden', maxWidth: 320, margin: '0 auto' }}>
                <div style={{ height: '100%', width: '60%', background: '#2d6a27', borderRadius: 99, animation: 'grow 1.2s ease forwards' }} />
              </div>
            </div>
          )}

          {status === 'processing' && (
            <div style={{ padding: '20px 0' }}>
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#f0fdf4', border: '2px solid #86efac', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 16px', animation: 'pulse 1.5s ease-in-out infinite' }}>🤖</div>
              <div style={{ fontWeight: 700, fontSize: '1.125rem', color: '#111827', marginBottom: 8 }}>AI Analysing...</div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Running MobileNetV3 disease classifier</div>
            </div>
          )}

          {status === 'done' && imageUrl && (
            <div>
              <div style={{ background: '#fff8f0', border: '1px solid #fed7aa', borderRadius: 12, padding: '14px 20px', marginBottom: 20, textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <span style={{ fontSize: '1.2rem' }}>⚠️</span>
                  <span style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#111827' }}>Early Stage Rice Blast Detected</span>
                  <span style={{ marginLeft: 'auto', background: '#fef3c7', color: '#92400e', fontSize: '0.75rem', fontWeight: 700, padding: '3px 10px', borderRadius: 9999 }}>✓ 92% Confidence</span>
                </div>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0, lineHeight: 1.6 }}>
                  The uploaded image shows characteristic diamond-shaped lesions indicative of Magnaporthe oryzae infection. Immediate action recommended.
                </p>
              </div>

              <div style={{ textAlign: 'left', marginBottom: 20 }}>
                <div style={{ fontSize: '0.7rem', fontFamily: 'monospace', fontWeight: 700, letterSpacing: '0.08em', color: '#6b7280', textTransform: 'uppercase', marginBottom: 12 }}>RECOMMENDED ACTION PLAN</div>
                {[
                  { n: 1, title: 'Apply Fungicide X', desc: 'Spray affected areas immediately during early morning or late afternoon.' },
                  { n: 2, title: 'Reduce Standing Water', desc: 'Lower water levels in the paddy to decrease humidity around the plants.' },
                  { n: 3, title: 'Notify Neighbor Farmers', desc: 'Spores travel by wind; alerting nearby farms helps prevent regional outbreak.' },
                ].map(step => (
                  <div key={step.n} style={{ display: 'flex', gap: 14, padding: '14px', background: '#f9fafb', border: '1px solid #f3f4f6', borderRadius: 10, marginBottom: 10, textAlign: 'left' }}>
                    <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#2d6a27', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0 }}>{step.n}</div>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#111827', marginBottom: 3 }}>{step.title}</div>
                      <div style={{ fontSize: '0.8125rem', color: '#6b7280', lineHeight: 1.5 }}>{step.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button style={{ flex: 1, background: '#2d6a27', color: '#fff', border: 'none', borderRadius: 10, padding: '12px', fontSize: '0.9375rem', fontWeight: 600, cursor: 'pointer' }}>🛒 Buy Recommended Supplies</button>
                <button onClick={reset} style={{ flex: 1, background: 'transparent', color: '#374151', border: '1.5px solid #e5e7eb', borderRadius: 10, padding: '12px', fontSize: '0.9375rem', fontWeight: 600, cursor: 'pointer' }}>↩ New Scan</button>
              </div>
            </div>
          )}
        </div>

        {/* Recent Scans */}
        {status === 'idle' && (
          <>
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', margin: '0 0 16px' }}>Recent Scans</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
                {[
                  { crop: 'Wheat - Plot A', date: 'Oct 26, 2024', badge: 'Healthy', img: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=200&q=80' },
                  { crop: 'Tomato - Field 2', date: 'Oct 24, 2024', badge: 'Action Required: Early Blight', img: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=200&q=80' },
                  { crop: 'Cotton - Plot C', date: 'Oct 22, 2024', badge: 'Monitoring: Thrips', img: 'https://images.unsplash.com/photo-1601329025664-e4e6e8e5543a?w=200&q=80' },
                ].map((scan, i) => (
                  <div key={i} style={{ background: '#fff', borderRadius: 14, border: '1px solid #e8ede7', overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.15s' }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = 'none')}>
                    <div style={{ height: 80, background: '#f0f7ee', position: 'relative', overflow: 'hidden' }}>
                      <img src={scan.img} alt={scan.crop} onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ padding: '12px 14px' }}>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827', marginBottom: 3 }}>{scan.crop}</div>
                      <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: 10 }}>{scan.date}</div>
                      <span style={{
                        fontSize: '0.7rem', fontWeight: 700, padding: '3px 10px', borderRadius: 9999,
                        background: BADGE_STYLES[scan.badge]?.bg ?? '#f3f4f6',
                        color: BADGE_STYLES[scan.badge]?.color ?? '#374151',
                      }}>{scan.badge}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Common Pests & Diseases */}
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', margin: '0 0 16px' }}>Common Pests &amp; Diseases</h2>
              <div style={{ position: 'relative' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, overflow: 'hidden' }}>
                  {PESTS.slice(pestIndex, pestIndex + VISIBLE).map((pest, i) => (
                    <div key={i} style={{ background: '#fff', borderRadius: 14, border: '1px solid #e8ede7', padding: '20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <div style={{ width: 64, height: 64, borderRadius: 14, background: pest.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>{pest.icon}</div>
                      <div>
                        <div style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', marginBottom: 5 }}>{pest.name}</div>
                        <div style={{ fontSize: '0.8125rem', color: '#6b7280', lineHeight: 1.55, marginBottom: 10 }}>{pest.desc}</div>
                        <button style={{ background: 'none', border: 'none', color: '#2d6a27', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', padding: 0 }}>Learn More</button>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 10, marginTop: 16, justifyContent: 'center' }}>
                  <button onClick={() => setPestIndex(i => Math.max(0, i - 1))} disabled={pestIndex === 0}
                    style={{ width: 36, height: 36, borderRadius: '50%', border: '1.5px solid #e5e7eb', background: pestIndex === 0 ? '#f9fafb' : '#fff', cursor: pestIndex === 0 ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ChevronLeft size={16} color={pestIndex === 0 ? '#d1d5db' : '#374151'} />
                  </button>
                  <button onClick={() => setPestIndex(i => Math.min(maxIndex, i + 1))} disabled={pestIndex >= maxIndex}
                    style={{ width: 36, height: 36, borderRadius: '50%', border: '1.5px solid #e5e7eb', background: pestIndex >= maxIndex ? '#f9fafb' : '#fff', cursor: pestIndex >= maxIndex ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ChevronRight size={16} color={pestIndex >= maxIndex ? '#d1d5db' : '#374151'} />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Mobile bottom nav */}
      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'rgba(255,255,255,0.97)', borderTop: '1px solid #e8ede7', display: 'flex', justifyContent: 'space-around', padding: '8px 0', zIndex: 50 }}>
        {[['🏠', 'Home', '/'], ['🔬', 'Crops', '/diagnose'], ['📈', 'Market', '/market'], ['📅', 'Schedule', '/schedule'], ['🤖', 'Agent', '/agent']].map(([icon, label, href]) => (
          <Link key={label} href={href} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, textDecoration: 'none', color: href === '/diagnose' ? '#2d6a27' : '#6b7280', fontSize: '0.625rem', fontWeight: 500, padding: '4px 12px', minWidth: 44 }}>
            <span style={{ fontSize: '1.25rem' }}>{icon}</span>
            {label}
          </Link>
        ))}
      </nav>

      <style>{`
        @keyframes pulse { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.05);opacity:0.8} }
        @keyframes grow { from{width:0} to{width:60%} }
      `}</style>
    </div>
  )
}
