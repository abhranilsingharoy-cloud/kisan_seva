'use client';

import React, { useState } from 'react';
import { Search, Filter, AlertTriangle, Bug, Leaf, X, ChevronRight, Droplets, ThermometerSun, Check } from 'lucide-react';

const PAGE_BG = { background: '#f9fafb', minHeight: '100vh', paddingBottom: 100 };

const DISEASES = [
  {
    id: 'd1', name: 'Early Blight', scientific: 'Alternaria solani', crop: 'Tomato', severity: 'High',
    symptoms: ['Brown spots with concentric rings on lower leaves', 'Yellowing of tissue around spots', 'Stem lesions'],
    cause: 'Fungal',
    treatment: ['Apply Mancozeb or Chlorothalonil', 'Remove infected lower leaves', 'Ensure proper spacing for air flow'],
    organic: ['Neem oil spray (5ml/L)', 'Copper-based fungicides', 'Bacillus subtilis bio-fungicide'],
    conditions: 'Warm temperatures (24-29°C) and high humidity or dew.',
    prevention: 'Crop rotation, use resistant varieties, avoid overhead watering.'
  },
  {
    id: 'd2', name: 'Late Blight', scientific: 'Phytophthora infestans', crop: 'Tomato', severity: 'High',
    symptoms: ['Large, dark, water-soaked spots on leaves', 'White fungal growth on undersides in wet weather', 'Rapid plant death'],
    cause: 'Oomycete (Fungal-like)',
    treatment: ['Apply Cymoxanil + Mancozeb', 'Destroy infected plants immediately'],
    organic: ['Copper spray (preventive only)', 'Remove and burn infected plants'],
    conditions: 'Cool, wet weather (15-20°C) with high moisture.',
    prevention: 'Plant resistant varieties, ensure good drainage, avoid late-season overhead irrigation.'
  },
  {
    id: 'd3', name: 'Yellow Rust', scientific: 'Puccinia striiformis', crop: 'Wheat', severity: 'High',
    symptoms: ['Yellowish-orange pustules arranged in stripes on leaves', 'Stunted growth', 'Shriveled grains'],
    cause: 'Fungal',
    treatment: ['Propiconazole 25 EC @ 0.1%', 'Tebuconazole 250 EC'],
    organic: ['Early sowing', 'Sulfur dust (limited efficacy)'],
    conditions: 'Cool temperatures (10-20°C) and intermittent rain.',
    prevention: 'Use resistant varieties (e.g., HD 2967), avoid late sowing.'
  },
  {
    id: 'd4', name: 'Bacterial Leaf Blight', scientific: 'Xanthomonas oryzae', crop: 'Rice', severity: 'High',
    symptoms: ['Water-soaked to yellowish stripes on leaf blades', 'Leaves turn grayish-white and die', 'Ooze drops on leaves in morning'],
    cause: 'Bacterial',
    treatment: ['Streptocycline + Copper Oxychloride', 'Drain field and let soil dry for a few days'],
    organic: ['Cow dung extract spray', 'Neem seed kernel extract (NSKE 5%)'],
    conditions: 'High temperatures (25-34°C), heavy rain, strong winds.',
    prevention: 'Balanced nitrogen use, clean seeds, proper field drainage.'
  },
  {
    id: 'd5', name: 'Fall Armyworm', scientific: 'Spodoptera frugiperda', crop: 'Maize', severity: 'High',
    symptoms: ['Ragged holes in leaves', 'Sawdust-like frass in the whorl', 'Damage to tassels and ears'],
    cause: 'Pest (Insect)',
    treatment: ['Emamectin Benzoate 5 SG', 'Spinosad 45 SC'],
    organic: ['Release Trichogramma egg parasitoids', 'Neem oil spray (10,000 ppm)', 'Sand + ash mixture in whorls'],
    conditions: 'Warm, dry weather promotes rapid life cycle.',
    prevention: 'Deep summer ploughing, intercropping with legumes, pheromone traps.'
  }
];

export default function DiseaseLibraryPage() {
  const [search, setSearch] = useState('');
  const [filterCrop, setFilterCrop] = useState('All');
  const [filterSeverity, setFilterSeverity] = useState('All');
  const [selected, setSelected] = useState<typeof DISEASES[0] | null>(null);

  const filtered = DISEASES.filter(d => {
    if (filterCrop !== 'All' && d.crop !== filterCrop) return false;
    if (filterSeverity !== 'All' && d.severity !== filterSeverity) return false;
    if (search && !d.name.toLowerCase().includes(search.toLowerCase()) && !d.symptoms.some(s => s.toLowerCase().includes(search.toLowerCase()))) return false;
    return true;
  });

  return (
    <div style={PAGE_BG}>
      <div style={{ background: '#fff', padding: '32px 28px 20px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ background: '#f0fdf4', color: '#166534', padding: '4px 10px', borderRadius: 12, fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
              <Check size={14} /> Available Offline
            </span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#111827', margin: '0 0 16px', letterSpacing: '-0.03em' }}>Disease Library</h1>
          
          <div style={{ position: 'relative', marginBottom: 16 }}>
            <Search style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} size={20} />
            <input 
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search diseases or symptoms..." 
              style={{ width: '100%', padding: '14px 16px 14px 46px', borderRadius: 12, border: '1px solid #d1d5db', outline: 'none', fontSize: '1rem' }} 
            />
          </div>

          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
            {['All', 'Tomato', 'Wheat', 'Rice', 'Maize'].map(c => (
              <button key={c} onClick={() => setFilterCrop(c)} style={{ padding: '8px 16px', borderRadius: 20, fontWeight: 600, fontSize: '0.875rem', whiteSpace: 'nowrap', border: 'none', cursor: 'pointer', background: filterCrop === c ? '#2d6a27' : '#f3f4f6', color: filterCrop === c ? '#fff' : '#4b5563' }}>
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
          {filtered.map(d => (
            <div key={d.id} onClick={() => setSelected(d)} style={{ background: '#fff', borderRadius: 16, border: '1px solid #e8ede7', padding: 20, cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#111827' }}>{d.name}</h3>
                  <div style={{ fontSize: '0.8125rem', color: '#6b7280', fontStyle: 'italic' }}>{d.scientific}</div>
                </div>
                <span style={{ background: d.severity === 'High' ? '#fef2f2' : '#fffbeb', color: d.severity === 'High' ? '#dc2626' : '#d97706', padding: '4px 10px', borderRadius: 12, fontSize: '0.75rem', fontWeight: 700 }}>
                  {d.severity} Risk
                </span>
              </div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                <span style={{ background: '#f3f4f6', color: '#4b5563', padding: '4px 10px', borderRadius: 6, fontSize: '0.75rem', fontWeight: 600 }}>{d.crop}</span>
                <span style={{ background: '#f3f4f6', color: '#4b5563', padding: '4px 10px', borderRadius: 6, fontSize: '0.75rem', fontWeight: 600 }}>{d.cause}</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#4b5563', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {d.symptoms[0]}...
              </p>
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#2d6a27', fontSize: '0.875rem', fontWeight: 600 }}>
                View Full Details <ChevronRight size={16} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} onClick={() => setSelected(null)} />
          <div style={{ position: 'relative', background: '#fff', width: '100%', maxWidth: 600, borderRadius: 20, maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '24px 24px 16px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#111827' }}>{selected.name}</h2>
                <div style={{ fontSize: '0.9rem', color: '#6b7280', fontStyle: 'italic', marginBottom: 8 }}>{selected.scientific}</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span style={{ background: '#f3f4f6', color: '#4b5563', padding: '4px 10px', borderRadius: 6, fontSize: '0.75rem', fontWeight: 600 }}>{selected.crop}</span>
                  <span style={{ background: '#f3f4f6', color: '#4b5563', padding: '4px 10px', borderRadius: 6, fontSize: '0.75rem', fontWeight: 600 }}>{selected.cause}</span>
                </div>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: '#f3f4f6', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={16} /></button>
            </div>
            
            <div style={{ padding: 24, overflowY: 'auto', flex: 1 }}>
              <div style={{ marginBottom: 24 }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#111827', margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: 8 }}><AlertTriangle size={18} color="#d97706" /> Symptoms</h4>
                <ul style={{ margin: 0, paddingLeft: 24, color: '#4b5563', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  {selected.symptoms.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
                <div style={{ background: '#eff6ff', padding: 16, borderRadius: 12 }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1d4ed8', textTransform: 'uppercase', marginBottom: 4 }}>Chemical Treatment</div>
                  <ul style={{ margin: 0, paddingLeft: 16, color: '#1e3a8a', fontSize: '0.875rem' }}>
                    {selected.treatment.map((t, i) => <li key={i}>{t}</li>)}
                  </ul>
                </div>
                <div style={{ background: '#f0fdf4', padding: 16, borderRadius: 12 }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#166534', textTransform: 'uppercase', marginBottom: 4 }}>Organic / Natural</div>
                  <ul style={{ margin: 0, paddingLeft: 16, color: '#14532d', fontSize: '0.875rem' }}>
                    {selected.organic.map((o, i) => <li key={i}>{o}</li>)}
                  </ul>
                </div>
              </div>

              <div style={{ marginBottom: 24 }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#111827', margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: 8 }}><ThermometerSun size={18} color="#ea580c" /> Trigger Conditions</h4>
                <p style={{ margin: 0, color: '#4b5563', fontSize: '0.9rem', lineHeight: 1.6 }}>{selected.conditions}</p>
              </div>

              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#111827', margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: 8 }}><Leaf size={18} color="#16a34a" /> Prevention</h4>
                <p style={{ margin: 0, color: '#4b5563', fontSize: '0.9rem', lineHeight: 1.6 }}>{selected.prevention}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
