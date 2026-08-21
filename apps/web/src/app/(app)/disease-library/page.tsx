'use client';

import React, { useState } from 'react';
import { Search, AlertTriangle, Bug, Leaf, X, ChevronRight, Droplets, ThermometerSun, Check, Globe, Shield, SearchCode, Beaker, FileSpreadsheet } from 'lucide-react';

const PAGE_BG = { background: '#f9fafb', minHeight: '100vh', paddingBottom: 100 };

// Injected from Executive Research Summary
const DISEASES = [
  {
    id: 'd1',
    name: 'Wheat Stripe Rust (Yellow Rust)',
    scientific: 'Puccinia striiformis f. sp. tritici',
    crop: 'Wheat',
    severity: 'High',
    cause: 'Fungal (Basidiomycete)',
    affected_hosts: 'Wheat (Triticum aestivum, T. durum) and some grasses. Hosts include spring and winter wheats.',
    symptoms: [
      'Linear yellow-orange pustules (uredinia) appear in stripes along leaf veins.',
      'Early on, plants show small yellow flecks; pustules rupture epidermis in rows.',
      'Severe early infections cause stunting.',
      'Advanced stage shows necrotic stripes and brownish-black stem lesions.'
    ],
    conditions: 'Prefers cool, moist conditions (optimal 10–15°C nights) with dew or fog; can sporulate at 0–25°C. Overwintering on volunteer wheat and mild weather allow early build-up.',
    cycle: 'Urediniospores are wind-dispersed and infect via stomata. Asexual cycle repeats rapidly. In some regions, Berberis species act as alternate hosts. No sexual stage occurs on wheat host.',
    diagnosis: 'Field diagnosis by yellow linear pustules on leaves. Lab culture or PCR assays confirm. Differentiate from leaf rust which has round, orange-brown pustules.',
    impact: 'Can cause 20–100% yield loss if uncontrolled. Losses of ~40% are common in epidemics.',
    prevention: 'Use certified clean seed; rotate with non-host crops; control volunteer wheat. Remove barberry in temperate regions. Implement airborne spore monitoring.',
    organic: ['Biocontrols (Trichoderma or Bacillus) have limited efficacy.', 'Botanical treatments (neem oil, copper) may reduce spore survival.', 'Encourage natural antagonists and maintain healthy soil.'],
    chemical: ['Azoxystrobin, propiconazole, propamocarb target rust.', 'Use mixtures with different modes of action to delay resistance.', 'e.g. tebuconazole applied at 250 g/ha with 14-day PHI.'],
    ipm: 'Integrate resistant cultivars with timely fungicide use. Early detection + forecasting is critical. Alternate non-hosts in crop rotation.',
    geography: 'Temperate wheat-growing regions globally. Has become more common in warmer climates since 2000.',
    differential: 'Distinguish from leaf rust (orange, rounded) or powdery mildew (white powdery growth).'
  },
  {
    id: 'd2',
    name: 'Southern Rust of Corn',
    scientific: 'Puccinia polysora',
    crop: 'Maize',
    severity: 'High',
    cause: 'Fungal (Pucciniaceae)',
    affected_hosts: 'Maize (Zea mays, field and sweet corn) and some related grasses.',
    symptoms: [
      'Small, circular orange pustules mostly on the upper leaf surface.',
      'Pustules (1-2mm) erupt through epidermis releasing powdery orange spores.',
      'Lesions age to dark brown-black.',
      'Severe infection causes chlorosis and necrosis in leaf sheaths, husks, stalks.'
    ],
    conditions: 'Favors high humidity and warm temperatures (~25–30°C). Requires several hours of leaf wetness. Typically appears late in season.',
    cycle: 'Monocyclic in temperate zones: windborne spores from south. Infects within days, sporulates in 7-14 days. Pustule produces spores for 5-7 days. Builds up quickly in hot-humid spells.',
    diagnosis: 'Distinctive small orange pustules densely covering upper leaves. Differentiate from common rust (which is brick-red, on both surfaces).',
    impact: 'Very destructive. Reduces yield by 10–50% or more. Considered more severe than common rust due to rapid epidemics.',
    prevention: 'Use resistant hybrids. Rotate with non-hosts. Destroy crop residue. Monitor regional alerts. Early planting may avoid peak spore influx.',
    organic: ['No reliable organic cures.', 'Kaolin clay or Bacillus subtilis trialed with limited success.', 'Emphasize cultural hygiene.'],
    chemical: ['Early foliar fungicide often needed when ~50% of leaves have ≥1 pustule.', 'Propiconazole, azoxystrobin, pyraclostrobin.', 'Full labeled rates; multiple applications may be required.'],
    ipm: 'Integrate crop rotation, host resistance, timely scouting of upper canopies. Coordinate with neighboring farms to manage regional inoculum.',
    geography: 'Native to tropical Americas, now widespread globally. In US, infects southern states regularly, moves north mid-late season.',
    differential: 'Distinguish from common rust and Physoderma brown spot (purple-brown lesions without removable spores).'
  },
  {
    id: 'd3',
    name: 'Late Blight',
    scientific: 'Phytophthora infestans',
    crop: 'Potato & Tomato',
    severity: 'Critical',
    cause: 'Oomycete (Water mold)',
    affected_hosts: 'Potato (Solanum tuberosum), Tomato (S. lycopersicum), and related Solanaceae.',
    symptoms: [
      'Rapidly expanding water-soaked lesions on leaves, stems, fruit.',
      'Leaf spots are large, irregular, brown-black with pale green borders.',
      'White fuzzy sporulation on undersides under high humidity.',
      'Tubers develop firm, brown decays with pinkish sporangia on cut surfaces.'
    ],
    conditions: 'Favors cool (10–18°C), wet conditions. Requires 6–12h leaf wetness. Slows in hot, dry weather.',
    cycle: 'Airborne sporangia initiate infection. New sporangia form in 3-5 days. Polycyclic asexual cycle. Sexual oospores in warm soils enable long-term survival.',
    diagnosis: 'Large, greasy lesions with white sporulation under moist conditions. PCR assays or ELISA can confirm. Must be distinguished from early blight.',
    impact: 'High potential for devastation. Can cause total yield loss. Historically caused the Irish potato famine.',
    prevention: 'Rotate away from solanaceous crops 3-4 years. Use certified disease-free seed. Destroy cull piles/volunteers. Provide good air circulation. Irrigate in mornings.',
    organic: ['Copper fungicides (Bordeaux mixture) applied protectively.', 'Bacillus or Trichoderma have limited effect.', 'Planting resistant varieties (Rpi genes) is highly effective.'],
    chemical: ['Systemic oomycete-targeting fungicides (mefenoxam, cymoxanil) and protectants (chlorothalonil).', 'Rotate active ingredients.', 'Apply on 7-10 day schedule in conducive weather.'],
    ipm: 'Emphasize resistant cultivars and cultural barriers. Apply fungicides early. Use forecasting systems (BlightCast). Monitor regularly.',
    geography: 'Worldwide wherever hosts grow. Outbreaks coincide with rainy cool periods.',
    differential: 'Distinguish from early blight (target rings, older foliage) and physiological leaf necrosis. White sporulation is key.'
  },
  {
    id: 'd4',
    name: 'Fusarium Wilt (Race 3)',
    scientific: 'Fusarium oxysporum f. sp. lycopersici',
    crop: 'Tomato',
    severity: 'High',
    cause: 'Soilborne Fungal',
    affected_hosts: 'Tomato (Solanum lycopersicum). Race 3 overcomes most older resistances.',
    symptoms: [
      'Bright yellowing of leaves/shoots on ONE side of the plant.',
      'Wilted shoots and yellowing progress to branch dieback and canopy collapse.',
      'Fruits under dead foliage may sunscald or rot.',
      'Chocolate-brown discoloration of vascular tissue in stems when cut.'
    ],
    conditions: 'Warm soil temperatures (25–30°C). Often appears mid-season under hot, dry conditions. Soil pH extremes or poor fertility increases susceptibility.',
    cycle: 'Infects through roots and colonizes xylem, blocking water. No airborne spores; spreads via infected soil/debris. Chlamydospores persist in soil for years.',
    diagnosis: 'Brown vascular streaks in wilted plants. Lab plating on selective media or PCR assays. Soil bioassays used.',
    impact: '30–50% yield loss in susceptible cultivars. One of the greatest economic threats to tomato processing in some regions.',
    prevention: 'Use resistant rootstocks. Crop rotation for 3-4 years. Solarize soil. Use sterilized potting mix for transplants. Clean equipment.',
    organic: ['Compost teas, Trichoderma inoculants sometimes used but variable efficacy.', 'Soil solarization and anaerobic soil disinfestation (ASD).'],
    chemical: ['No effective curative fungicides.', 'Soil fumigants (chloropicrin) can reduce inoculum but are costly.', 'Seed treatments (steaming or formaldehyde).'],
    ipm: 'Avoid infested fields. Use resistant rootstocks. Combine crop sanitation with soil amendments that boost antagonists.',
    geography: 'Present wherever tomatoes are grown (especially warm temperate and tropical).',
    differential: 'Distinguish from Verticillium wilt (has tan vascular streaks instead of brown) and abiotic nutrient disorders.'
  }
];

export default function DiseaseLibraryPage() {
  const [search, setSearch] = useState('');
  const [filterCrop, setFilterCrop] = useState('All');
  const [selected, setSelected] = useState<typeof DISEASES[0] | null>(null);

  const filtered = DISEASES.filter(d => {
    if (filterCrop !== 'All' && !d.crop.includes(filterCrop)) return false;
    if (search && !d.name.toLowerCase().includes(search.toLowerCase()) && !d.symptoms.some(s => s.toLowerCase().includes(search.toLowerCase()))) return false;
    return true;
  });

  return (
    <div style={PAGE_BG}>
      <div style={{ background: '#fff', padding: '32px 28px 20px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ background: '#f0fdf4', color: '#166534', padding: '4px 10px', borderRadius: 12, fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
              <Check size={14} /> Comprehensive Database
            </span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#111827', margin: '0 0 16px', letterSpacing: '-0.03em' }}>Disease Library</h1>
          
          <div style={{ position: 'relative', marginBottom: 16 }}>
            <Search style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} size={20} />
            <input 
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search detailed pathogen profiles..." 
              style={{ width: '100%', padding: '14px 16px 14px 46px', borderRadius: 12, border: '1px solid #d1d5db', outline: 'none', fontSize: '1rem' }} 
            />
          </div>

          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
            {['All', 'Tomato', 'Wheat', 'Maize', 'Potato'].map(c => (
              <button key={c} onClick={() => setFilterCrop(c)} style={{ padding: '8px 16px', borderRadius: 20, fontWeight: 600, fontSize: '0.875rem', whiteSpace: 'nowrap', border: 'none', cursor: 'pointer', background: filterCrop === c ? '#2d6a27' : '#f3f4f6', color: filterCrop === c ? '#fff' : '#4b5563' }}>
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
          {filtered.map(d => (
            <div key={d.id} onClick={() => setSelected(d)} style={{ background: '#fff', borderRadius: 16, border: '1px solid #e8ede7', padding: 20, cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#111827' }}>{d.name}</h3>
                  <div style={{ fontSize: '0.8125rem', color: '#6b7280', fontStyle: 'italic' }}>{d.scientific}</div>
                </div>
                <span style={{ background: d.severity === 'Critical' ? '#7f1d1d' : '#fef2f2', color: d.severity === 'Critical' ? '#fff' : '#dc2626', padding: '4px 10px', borderRadius: 12, fontSize: '0.75rem', fontWeight: 700 }}>
                  {d.severity} Risk
                </span>
              </div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                <span style={{ background: '#f3f4f6', color: '#4b5563', padding: '4px 10px', borderRadius: 6, fontSize: '0.75rem', fontWeight: 600 }}>{d.crop}</span>
                <span style={{ background: '#f0f9ff', color: '#0369a1', padding: '4px 10px', borderRadius: 6, fontSize: '0.75rem', fontWeight: 700 }}>{d.cause}</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#4b5563', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {d.symptoms.join(' ')}
              </p>
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#2d6a27', fontSize: '0.875rem', fontWeight: 600 }}>
                View Full Profile <ChevronRight size={16} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={() => setSelected(null)} />
          <div style={{ position: 'relative', background: '#fff', width: '100%', maxWidth: 800, borderRadius: 20, maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            
            <div style={{ padding: '24px 32px 20px', borderBottom: '1px solid #e5e7eb', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 900, color: '#111827', letterSpacing: '-0.02em' }}>{selected.name}</h2>
                <div style={{ fontSize: '1rem', color: '#475569', fontStyle: 'italic', marginBottom: 12 }}>{selected.scientific}</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ background: '#e2e8f0', color: '#334155', padding: '4px 12px', borderRadius: 6, fontSize: '0.8rem', fontWeight: 700 }}>{selected.crop}</span>
                  <span style={{ background: '#dbeafe', color: '#1e40af', padding: '4px 12px', borderRadius: 6, fontSize: '0.8rem', fontWeight: 700 }}>{selected.cause}</span>
                  <span style={{ background: selected.severity === 'Critical' ? '#7f1d1d' : '#fef2f2', color: selected.severity === 'Critical' ? '#fff' : '#dc2626', padding: '4px 12px', borderRadius: 6, fontSize: '0.8rem', fontWeight: 700 }}>{selected.severity} Impact</span>
                </div>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: '#e2e8f0', border: 'none', borderRadius: '50%', width: 36, height: 36, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569' }}><X size={20} /></button>
            </div>
            
            <div style={{ padding: '0', overflowY: 'auto', flex: 1, backgroundColor: '#fff' }}>
              <div style={{ padding: '32px' }}>
                
                {/* 1. Affected Hosts & Geography */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#111827', margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: 8 }}><Leaf size={18} color="#16a34a" /> Affected Hosts</h4>
                    <p style={{ margin: 0, color: '#4b5563', fontSize: '0.9rem', lineHeight: 1.6 }}>{selected.affected_hosts}</p>
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#111827', margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: 8 }}><Globe size={18} color="#0ea5e9" /> Geographic Distribution</h4>
                    <p style={{ margin: 0, color: '#4b5563', fontSize: '0.9rem', lineHeight: 1.6 }}>{selected.geography}</p>
                  </div>
                </div>

                <hr style={{ border: 0, borderTop: '1px solid #e2e8f0', margin: '0 0 32px 0' }} />

                {/* 2. Symptoms & Diagnosis */}
                <div style={{ marginBottom: 32 }}>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#111827', margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: 8 }}><SearchCode size={20} color="#8b5cf6" /> Symptoms & Diagnosis</h4>
                  <div style={{ background: '#f5f3ff', padding: 20, borderRadius: 12, border: '1px solid #ede9fe', marginBottom: 16 }}>
                    <ul style={{ margin: 0, paddingLeft: 24, color: '#4c1d95', fontSize: '0.95rem', lineHeight: 1.6 }}>
                      {selected.symptoms.map((s, i) => <li key={i} style={{ marginBottom: 8 }}>{s}</li>)}
                    </ul>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div style={{ background: '#f8fafc', padding: 16, borderRadius: 12, border: '1px solid #e2e8f0' }}>
                      <strong style={{ display: 'block', fontSize: '0.85rem', color: '#64748b', textTransform: 'uppercase', marginBottom: 4 }}>Lab / Field Diagnosis</strong>
                      <span style={{ fontSize: '0.9rem', color: '#334155' }}>{selected.diagnosis}</span>
                    </div>
                    <div style={{ background: '#fff1f2', padding: 16, borderRadius: 12, border: '1px solid #ffe4e6' }}>
                      <strong style={{ display: 'block', fontSize: '0.85rem', color: '#9f1239', textTransform: 'uppercase', marginBottom: 4 }}>Differential Diagnosis</strong>
                      <span style={{ fontSize: '0.9rem', color: '#881337' }}>{selected.differential}</span>
                    </div>
                  </div>
                </div>

                <hr style={{ border: 0, borderTop: '1px solid #e2e8f0', margin: '0 0 32px 0' }} />

                {/* 3. Cycle & Conditions */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#111827', margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: 8 }}><ThermometerSun size={18} color="#ea580c" /> Favorable Conditions</h4>
                    <p style={{ margin: 0, color: '#4b5563', fontSize: '0.9rem', lineHeight: 1.6 }}>{selected.conditions}</p>
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#111827', margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: 8 }}><Bug size={18} color="#059669" /> Disease Cycle</h4>
                    <p style={{ margin: 0, color: '#4b5563', fontSize: '0.9rem', lineHeight: 1.6 }}>{selected.cycle}</p>
                  </div>
                </div>

                <hr style={{ border: 0, borderTop: '1px solid #e2e8f0', margin: '0 0 32px 0' }} />

                {/* 4. Treatment & Management */}
                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#111827', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}><Shield size={20} color="#2563eb" /> Treatment & Management</h4>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                    <div style={{ background: '#eff6ff', padding: 20, borderRadius: 12, border: '1px solid #bfdbfe' }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#1d4ed8', textTransform: 'uppercase', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}><Beaker size={16}/> Chemical Control</div>
                      <ul style={{ margin: 0, paddingLeft: 20, color: '#1e3a8a', fontSize: '0.9rem', lineHeight: 1.5 }}>
                        {selected.chemical.map((t, i) => <li key={i} style={{ marginBottom: 6 }}>{t}</li>)}
                      </ul>
                    </div>
                    <div style={{ background: '#f0fdf4', padding: 20, borderRadius: 12, border: '1px solid #bbf7d0' }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#166534', textTransform: 'uppercase', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}><Leaf size={16}/> Organic / Natural</div>
                      <ul style={{ margin: 0, paddingLeft: 20, color: '#14532d', fontSize: '0.9rem', lineHeight: 1.5 }}>
                        {selected.organic.map((o, i) => <li key={i} style={{ marginBottom: 6 }}>{o}</li>)}
                      </ul>
                    </div>
                  </div>

                  <div style={{ background: '#f8fafc', padding: 20, borderRadius: 12, border: '1px solid #e2e8f0', marginBottom: 16 }}>
                    <strong style={{ display: 'block', fontSize: '0.85rem', color: '#475569', textTransform: 'uppercase', marginBottom: 8 }}>Prevention & Cultural Control</strong>
                    <span style={{ fontSize: '0.95rem', color: '#334155', lineHeight: 1.6 }}>{selected.prevention}</span>
                  </div>

                  <div style={{ background: '#ffedd5', padding: 20, borderRadius: 12, border: '1px solid #fed7aa' }}>
                    <strong style={{ display: 'block', fontSize: '0.85rem', color: '#c2410c', textTransform: 'uppercase', marginBottom: 8 }}>Integrated Pest Management (IPM)</strong>
                    <span style={{ fontSize: '0.95rem', color: '#9a3412', lineHeight: 1.6 }}>{selected.ipm}</span>
                  </div>

                </div>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
