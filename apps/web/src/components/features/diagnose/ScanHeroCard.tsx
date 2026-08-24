import { Cpu, AlertTriangle } from 'lucide-react'
import { RefObject } from 'react'

interface ScanHeroCardProps {
  status: 'idle' | 'uploading' | 'processing' | 'done' | 'error'
  provider: string
  setProvider: (p: string) => void
  handleDrop: (e: React.DragEvent) => void
  fileRef: RefObject<HTMLInputElement | null>
  handleFile: (f: File) => void
  errorMsg: string
  reset: () => void
  imageUrl: string | null
  diagnosisData: any
  providerNames: Record<string, string>
}

export default function ScanHeroCard({
  status,
  provider,
  setProvider,
  handleDrop,
  fileRef,
  handleFile,
  errorMsg,
  reset,
  imageUrl,
  diagnosisData,
  providerNames
}: ScanHeroCardProps) {
  return (
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
          <input id="camera-input" type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button onClick={() => fileRef.current?.click()} style={{ background: '#2d6a27', color: '#fff', border: 'none', borderRadius: 10, padding: '13px 24px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 14px rgba(45,106,39,0.35)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
              Upload
            </button>
            <button onClick={() => document.getElementById('camera-input')?.click()} style={{ background: '#fff', color: '#2d6a27', border: '2px solid #2d6a27', borderRadius: 10, padding: '11px 24px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 14px rgba(45,106,39,0.1)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
              Camera
            </button>
          </div>
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
            <a href="/resources" style={{ flex: 1, textDecoration: 'none', display: 'flex' }}>
              <button style={{ width: '100%', background: '#2d6a27', color: '#fff', border: 'none', borderRadius: 10, padding: '12px', fontSize: '0.9375rem', fontWeight: 600, cursor: 'pointer' }}>🛒 Buy on Govt. Agrimart</button>
            </a>
            <a href={`https://www.google.com/search?tbm=shop&q=buy+fungicide+for+${encodeURIComponent(diagnosisData.disease)}`} target="_blank" rel="noopener noreferrer" style={{ flex: 1, textDecoration: 'none', display: 'flex' }}>
              <button style={{ width: '100%', background: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db', borderRadius: 10, padding: '12px', fontSize: '0.9375rem', fontWeight: 600, cursor: 'pointer' }}>Search on Google</button>
            </a>
            <button onClick={reset} style={{ flex: 0.5, background: 'transparent', color: '#374151', border: '1.5px solid #e5e7eb', borderRadius: 10, padding: '12px', fontSize: '0.9375rem', fontWeight: 600, cursor: 'pointer' }}>↩ New</button>
          </div>
        </div>
      )}
    </div>
  )
}

