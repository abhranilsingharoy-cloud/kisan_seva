import { ChevronLeft, ChevronRight } from 'lucide-react'

const PESTS = [
  { img: 'https://images.unsplash.com/photo-1580255866894-358043644f80?w=400&q=80', name: 'Aphids', desc: 'Small insects that suck sap, causing leaf curling and yellowing.' },
  { img: 'https://images.unsplash.com/photo-1596489376170-c7ba184a5be7?w=400&q=80', name: 'Stem Borer', desc: 'Larvae that bore into stems, weakening the plant.' },
  { img: 'https://images.unsplash.com/photo-1605367623588-4f7db910d540?w=400&q=80', name: 'Powdery Mildew', desc: 'White powdery spots on leaves and stems reducing yield.' },
  { img: 'https://images.unsplash.com/photo-1616719582531-15582c3c90cb?w=400&q=80', name: 'Whitefly', desc: 'Tiny white flies that weaken plants by feeding and spreading virus.' },
  { img: 'https://images.unsplash.com/photo-1498144846853-60ca2d43853b?w=400&q=80', name: 'Armyworm', desc: 'Defoliating larvae attacking leaves and fruits rapidly.' },
]

interface CommonPestsProps {
  pestIndex: number
  setPestIndex: (val: number | ((prev: number) => number)) => void
}

export default function CommonPests({ pestIndex, setPestIndex }: CommonPestsProps) {
  const VISIBLE = 3
  const maxIndex = PESTS.length - VISIBLE

  return (
    <div>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', margin: '0 0 16px' }}>Common Pests &amp; Diseases</h2>
      <div style={{ position: 'relative' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, overflow: 'hidden' }}>
          {PESTS.slice(pestIndex, pestIndex + VISIBLE).map((pest, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: 14, border: '1px solid #e8ede7', padding: '20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ width: '100%', height: 140, borderRadius: 10, overflow: 'hidden', background: '#f3f4f6', flexShrink: 0 }}>
                <img src={pest.img} alt={pest.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', marginBottom: 5 }}>{pest.name}</div>
                <div style={{ fontSize: '0.8125rem', color: '#6b7280', lineHeight: 1.55, marginBottom: 10 }}>{pest.desc}</div>
                <button style={{ background: 'none', border: 'none', color: '#2d6a27', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', padding: 0 }}>Learn More</button>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 16, justifyContent: 'center' }}>
          <button onClick={() => setPestIndex((i: number) => Math.max(0, i - 1))} disabled={pestIndex === 0}
            style={{ width: 36, height: 36, borderRadius: '50%', border: '1.5px solid #e5e7eb', background: pestIndex === 0 ? '#f9fafb' : '#fff', cursor: pestIndex === 0 ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ChevronLeft size={16} color={pestIndex === 0 ? '#d1d5db' : '#374151'} />
          </button>
          <button onClick={() => setPestIndex((i: number) => Math.min(maxIndex, i + 1))} disabled={pestIndex >= maxIndex}
            style={{ width: 36, height: 36, borderRadius: '50%', border: '1.5px solid #e5e7eb', background: pestIndex >= maxIndex ? '#f9fafb' : '#fff', cursor: pestIndex >= maxIndex ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ChevronRight size={16} color={pestIndex >= maxIndex ? '#d1d5db' : '#374151'} />
          </button>
        </div>
      </div>
    </div>
  )
}
