'use client';

import React, { useState } from 'react';
import { Sprout, MapPin, Droplets, Filter, Check, Star } from 'lucide-react';

const PAGE_BG = { background: '#f9fafb', minHeight: '100vh', paddingBottom: 100 };

const SEED_DB = [
  { id: 's1', crop: 'Wheat', variety: 'HD-2967', yield: '20-22', duration: '140-150', traits: ['High Yield', 'Rust Resistant'], cost: 1800, availability: 'High', source: 'ICAR' },
  { id: 's2', crop: 'Wheat', variety: 'GW-322', yield: '18-20', duration: '115-120', traits: ['Early Sowing', 'Heat Tolerant'], cost: 1600, availability: 'Medium', source: 'State Dept' },
  { id: 's3', crop: 'Wheat', variety: 'DBW-187', yield: '22-24', duration: '145-155', traits: ['Very High Yield', 'Lodging Resistant'], cost: 2000, availability: 'Limited', source: 'ICAR' },
  { id: 's4', crop: 'Rice', variety: 'Swarna (MTU-7029)', yield: '25-28', duration: '145-150', traits: ['Water Logging Tolerant'], cost: 1200, availability: 'High', source: 'Public' },
  { id: 's5', crop: 'Rice', variety: 'Pusa Basmati 1121', yield: '16-18', duration: '140', traits: ['Premium Price', 'Long Grain'], cost: 2500, availability: 'High', source: 'ICAR' },
  { id: 's6', crop: 'Cotton', variety: 'BG-II Bunny', yield: '12-15', duration: '160-170', traits: ['Bollworm Resistant', 'High Yield'], cost: 3500, availability: 'High', source: 'Private' },
  { id: 's7', crop: 'Tomato', variety: 'Arka Vikas', yield: '140-150', duration: '110', traits: ['Drought Tolerant', 'Good Color'], cost: 4500, availability: 'Medium', source: 'IIHR' },
];

export default function SeedsPage() {
  const [form, setForm] = useState({ state: 'Punjab', season: 'Rabi', crop: 'Wheat', soil: 'Loamy', irrigation: 'Canal' });
  const [results, setResults] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const filtered = SEED_DB.filter(s => s.crop === form.crop);
    setResults(filtered);
    setHasSearched(true);
  };

  return (
    <div style={PAGE_BG}>
      <div style={{ background: '#fff', padding: '32px 28px 20px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#111827', margin: '0 0 8px', letterSpacing: '-0.03em' }}>Seed & Variety Recommender</h1>
          <p style={{ color: '#4b5563', margin: 0 }}>Find the highest yielding and most resilient seed varieties tailored to your local region and soil.</p>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: 32 }}>
        
        {/* Search Form */}
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e8ede7', padding: 24 }}>
          <form onSubmit={handleSearch} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: 6 }}>State</label>
              <select value={form.state} onChange={e => setForm({...form, state: e.target.value})} style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #d1d5db' }}>
                <option>Punjab</option><option>Maharashtra</option><option>UP</option><option>MP</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: 6 }}>Crop Type</label>
              <select value={form.crop} onChange={e => setForm({...form, crop: e.target.value})} style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #d1d5db' }}>
                <option>Wheat</option><option>Rice</option><option>Cotton</option><option>Tomato</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: 6 }}>Irrigation</label>
              <select value={form.irrigation} onChange={e => setForm({...form, irrigation: e.target.value})} style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #d1d5db' }}>
                <option>Canal</option><option>Borewell</option><option>Rainfed</option>
              </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button type="submit" style={{ width: '100%', padding: '12px', background: '#2d6a27', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>Find Best Seeds</button>
            </div>
          </form>
        </div>

        {/* Results */}
        {hasSearched && (
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', margin: '0 0 16px' }}>Recommended Varieties for {form.crop} in {form.state}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
              {results.map((seed, idx) => (
                <div key={seed.id} style={{ background: '#fff', borderRadius: 16, border: `2px solid ${idx === 0 ? '#16a34a' : '#e8ede7'}`, overflow: 'hidden', position: 'relative' }}>
                  {idx === 0 && (
                    <div style={{ background: '#16a34a', color: '#fff', padding: '4px 12px', fontSize: '0.75rem', fontWeight: 700, position: 'absolute', top: 0, right: 0, borderBottomLeftRadius: 12 }}>BEST MATCH</div>
                  )}
                  <div style={{ padding: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                      <div style={{ width: 48, height: 48, background: '#f0fdf4', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#166534' }}><Sprout size={24} /></div>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#111827' }}>{seed.variety}</h3>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Source: {seed.source}</div>
                      </div>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                      <div style={{ background: '#f9fafb', padding: 12, borderRadius: 8 }}>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 600 }}>EXPECTED YIELD</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#111827' }}>{seed.yield} <span style={{ fontSize: '0.75rem', fontWeight: 500 }}>q/acre</span></div>
                      </div>
                      <div style={{ background: '#f9fafb', padding: 12, borderRadius: 8 }}>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 600 }}>DURATION</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#111827' }}>{seed.duration} <span style={{ fontSize: '0.75rem', fontWeight: 500 }}>days</span></div>
                      </div>
                    </div>

                    <div style={{ marginBottom: 16 }}>
                      {seed.traits.map((t: string) => (
                        <span key={t} style={{ display: 'inline-block', background: '#eff6ff', color: '#1d4ed8', padding: '4px 8px', borderRadius: 6, fontSize: '0.75rem', fontWeight: 600, marginRight: 8, marginBottom: 8 }}>{t}</span>
                      ))}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f3f4f6', paddingTop: 16 }}>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Estimated Cost</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#111827' }}>₹{seed.cost}<span style={{ fontSize: '0.75rem', fontWeight: 500 }}>/acre</span></div>
                      </div>
                      <button style={{ background: '#fff', border: '1px solid #d1d5db', padding: '8px 16px', borderRadius: 8, fontWeight: 600, color: '#374151', cursor: 'pointer' }}>Where to Buy</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
