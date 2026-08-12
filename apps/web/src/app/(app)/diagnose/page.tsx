'use client'

import Link from 'next/link'
import { useState, useRef } from 'react'
import { ChevronLeft, ChevronRight, Cpu, AlertTriangle } from 'lucide-react'

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
  const [status, setStatus] = useState<'idle' | 'uploading' | 'processing' | 'done' | 'error'>('idle')
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [pestIndex, setPestIndex] = useState(0)
  
  const [provider, setProvider] = useState<string>('gemini')
  const [diagnosisData, setDiagnosisData] = useState<any>(null)
  const [errorMsg, setErrorMsg] = useState<string>('')

  const fileRef = useRef<HTMLInputElement>(null)

  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.src = URL.createObjectURL(file)
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const MAX_WIDTH = 800
        const MAX_HEIGHT = 800
        let width = img.width
        let height = img.height

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width
            width = MAX_WIDTH
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height
            height = MAX_HEIGHT
          }
        }
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx?.drawImage(img, 0, 0, width, height)
        
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(new File([blob], file.name, { type: 'image/jpeg' }))
          } else {
            resolve(file) // fallback
          }
        }, 'image/jpeg', 0.8)
      }
      img.onerror = () => resolve(file) // fallback
    })
  }

  const handleFile = async (file: File) => {
    setImageUrl(URL.createObjectURL(file))
    setStatus('uploading')
    
    // Quick artificial delay for UI
    await new Promise(r => setTimeout(r, 600))
    
    setStatus('processing')
    
    try {
      const compressedFile = await compressImage(file)
      const formData = new FormData()
      formData.append('image', compressedFile)
      formData.append('provider', provider)

      const response = await fetch('/api/v1/diagnose', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()
      
      if (!result.success) throw new Error(result.error || 'Diagnosis failed')
      
      setDiagnosisData(result.data)
      setStatus('done')
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong')
      setStatus('error')
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const reset = () => { 
    setStatus('idle')
    setImageUrl(null)
    setDiagnosisData(null)
    setErrorMsg('')
    if (fileRef.current) fileRef.current.value = ''
  }

  const VISIBLE = 3
  const maxIndex = PESTS.length - VISIBLE

  const providerNames: Record<string, string> = {
    'gemini': 'Google Gemini 2.5 Vision',
    'nvidia': 'NVIDIA LLaMA 3.2 Vision'
  }

  return (
    <div style={PAGE_BG}>
      <div style={{ maxWidth: 880, margin: '0 auto', padding: '32px 24px' }}>
        {/* Scan Your Crop hero card */}
        <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #e8ede7', padding: '40px 24px', textAlign: 'center', marginBottom: 32 }}>
          {status === 'idle' && (
            <>
              <div style={{ fontSize: '3.5rem', marginBottom: 16 }}>📷🌿</div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', margin: '0 0 10px', letterSpacing: '-0.025em' }}>Scan Your Crop</h1>
              <p style={{ fontSize: '0.9375rem', color: '#6b7280', margin: '0 0 28px' }}>Identify health issues and get treatment advice instantly.</p>
              
              <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                <Cpu size={18} color="#6b7280" />
                <span style={{ fontSize: '0.9rem', color: '#4b5563', fontWeight: 600 }}>AI Engine:</span>
                <select 
                  value={provider} 
                  onChange={(e) => setProvider(e.target.value)}
                  style={{
                    background: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    borderRadius: 8,
                    padding: '8px 12px',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#111827',
                    cursor: 'pointer',
                    outline: 'none',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                  }}
                >
                  <option value="gemini">Google Gemini 2.5 Vision (Fastest)</option>
                  <option value="nvidia">NVIDIA NIM Vision</option>
                </select>
              </div>

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
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#f0fdf4', border: '2px solid #86efac', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', animation: 'pulse 1.5s ease-in-out infinite' }}>
                <Cpu size={32} color="#16a34a" />
              </div>
              <div style={{ fontWeight: 700, fontSize: '1.125rem', color: '#111827', marginBottom: 8 }}>{providerNames[provider]} is analysing...</div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Running advanced visual diagnostics</div>
            </div>
          )}

          {status === 'error' && (
            <div style={{ padding: '20px 0' }}>
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#fef2f2', border: '2px solid #fca5a5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <AlertTriangle size={32} color="#dc2626" />
              </div>
              <div style={{ fontWeight: 700, fontSize: '1.125rem', color: '#111827', marginBottom: 8 }}>Scan Failed</div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: 20 }}>{errorMsg}</div>
              <button onClick={reset} style={{ background: 'transparent', color: '#374151', border: '1.5px solid #e5e7eb', borderRadius: 10, padding: '10px 24px', fontSize: '0.9375rem', fontWeight: 600, cursor: 'pointer' }}>Try Again</button>
            </div>
          )}

          {status === 'done' && imageUrl && diagnosisData && (
            <div>
              <div style={{ background: diagnosisData.severity === 'High' ? '#fff1f2' : diagnosisData.severity === 'Moderate' ? '#fff8f0' : '#f0fdf4', border: '1px solid', borderColor: diagnosisData.severity === 'High' ? '#fecdd3' : diagnosisData.severity === 'Moderate' ? '#fed7aa' : '#bbf7d0', borderRadius: 12, padding: '14px 20px', marginBottom: 20, textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <span style={{ fontSize: '1.2rem' }}>{diagnosisData.severity === 'High' ? '🚨' : diagnosisData.severity === 'Moderate' ? '⚠️' : '✅'}</span>
                  <span style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#111827' }}>{diagnosisData.disease} Detected</span>
                  <span style={{ marginLeft: 'auto', background: '#fff', color: '#111827', border: '1px solid #e5e7eb', fontSize: '0.75rem', fontWeight: 700, padding: '3px 10px', borderRadius: 9999 }}>{diagnosisData.confidence}% Confidence</span>
                </div>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0, lineHeight: 1.6 }}>
                  {diagnosisData.description}
                </p>
                <div style={{ display: 'inline-block', marginTop: 12, fontSize: '0.75rem', fontWeight: 600, color: '#2d6a27', background: '#dcfce7', padding: '2px 8px', borderRadius: 6 }}>
                  Analyzed by {providerNames[provider]}
                </div>
              </div>

              <div style={{ textAlign: 'left', marginBottom: 20 }}>
                {diagnosisData.symptoms && diagnosisData.symptoms.length > 0 && (
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', fontWeight: 700, letterSpacing: '0.08em', color: '#6b7280', textTransform: 'uppercase', marginBottom: 8 }}>🩺 KEY SYMPTOMS</div>
                    <ul style={{ margin: 0, paddingLeft: 20, fontSize: '0.875rem', color: '#374151', lineHeight: 1.6 }}>
                      {diagnosisData.symptoms.map((sym: string, i: number) => <li key={i}>{sym}</li>)}
                    </ul>
                  </div>
                )}
                
                {diagnosisData.causes && (
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', fontWeight: 700, letterSpacing: '0.08em', color: '#6b7280', textTransform: 'uppercase', marginBottom: 8 }}>🦠 ROOT CAUSE</div>
                    <p style={{ margin: 0, fontSize: '0.875rem', color: '#374151', lineHeight: 1.6 }}>{diagnosisData.causes}</p>
                  </div>
                )}
                
                {diagnosisData.prevention && (
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', fontWeight: 700, letterSpacing: '0.08em', color: '#6b7280', textTransform: 'uppercase', marginBottom: 8 }}>🛡️ PREVENTION</div>
                    <p style={{ margin: 0, fontSize: '0.875rem', color: '#374151', lineHeight: 1.6 }}>{diagnosisData.prevention}</p>
                  </div>
                )}

                <div style={{ fontSize: '0.7rem', fontFamily: 'monospace', fontWeight: 700, letterSpacing: '0.08em', color: '#6b7280', textTransform: 'uppercase', marginBottom: 12 }}>RECOMMENDED ACTION PLAN</div>
                {diagnosisData.treatmentSteps?.map((step: string, index: number) => (
                  <div key={index} style={{ display: 'flex', gap: 14, padding: '14px', background: '#f9fafb', border: '1px solid #f3f4f6', borderRadius: 10, marginBottom: 10, textAlign: 'left', alignItems: 'center' }}>
                    <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#2d6a27', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0 }}>{index + 1}</div>
                    <div style={{ fontSize: '0.9rem', color: '#374151', lineHeight: 1.5, fontWeight: 500 }}>
                      {step}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <a href={`https://www.bighaat.com/search?q=${encodeURIComponent(diagnosisData.disease)}`} target="_blank" rel="noopener noreferrer" style={{ flex: 1, textDecoration: 'none', display: 'flex' }}>
                  <button style={{ width: '100%', background: '#2d6a27', color: '#fff', border: 'none', borderRadius: 10, padding: '12px', fontSize: '0.9375rem', fontWeight: 600, cursor: 'pointer' }}>🛒 Buy Recommended Supplies</button>
                </a>
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

      <style>{`
        @keyframes pulse { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.05);opacity:0.8} }
        @keyframes grow { from{width:0} to{width:60%} }
      `}</style>
    </div>
  )
}
