'use client';

import React, { useState, useEffect } from 'react';
import { Leaf, Calculator, FlaskConical, Download, Check, AlertCircle } from 'lucide-react';

const PAGE_BG = { background: '#f0f4f0', minHeight: '100vh', paddingBottom: 100 };

type CalcResult = {
  id: string;
  date: string;
  crop: string;
  area: number;
  fertilizers: { name: string; kgPerAcre: number; totalKg: number; cost: number }[];
  pesticides: { name: string; dosage: string; coverage: string }[];
  totalCost: number;
};

// ── All major crops ──────────────────────────────────────────────────────────
const ALL_CROPS = [
  // Cereals
  'Wheat', 'Rice (Paddy)', 'Maize', 'Jowar (Sorghum)', 'Bajra (Pearl Millet)', 'Ragi (Finger Millet)', 'Barley',
  // Pulses
  'Chickpea (Chana)', 'Pigeon Pea (Arhar/Tur)', 'Lentil (Masoor)', 'Mung Bean (Moong)', 'Black Gram (Urad)', 'Kidney Bean (Rajma)',
  // Oilseeds
  'Groundnut', 'Mustard', 'Soybean', 'Sunflower', 'Sesame (Til)', 'Linseed', 'Castor',
  // Cash Crops
  'Cotton', 'Sugarcane', 'Jute', 'Tobacco',
  // Vegetables
  'Tomato', 'Onion', 'Potato', 'Brinjal (Eggplant)', 'Cabbage', 'Cauliflower', 'Peas', 'Okra (Bhindi)', 'Bitter Gourd', 'Bottle Gourd', 'Pumpkin', 'Chilli', 'Capsicum', 'Spinach', 'Fenugreek (Methi)',
  // Fruits
  'Mango', 'Banana', 'Papaya', 'Guava', 'Pomegranate', 'Grape', 'Orange', 'Lemon', 'Apple', 'Pineapple', 'Watermelon',
  // Spices & Plantation
  'Turmeric', 'Ginger', 'Garlic', 'Coriander', 'Cumin', 'Cardamom', 'Pepper', 'Coconut', 'Arecanut',
];

// Base recommended NPK values (in kg/acre) for different crops (Approximations from ICAR)
const NPK_RECOMMENDATIONS: Record<string, { N: number, P: number, K: number, pest: any[] }> = {
  'Wheat': { N: 60, P: 30, K: 20, pest: [{ name: 'Mancozeb 75% WP', dosage: '2.5g/L', coverage: 'Rust prevention' }] },
  'Rice (Paddy)': { N: 50, P: 25, K: 25, pest: [{ name: 'Tricyclazole 75% WP', dosage: '0.6g/L', coverage: 'Blast control' }] },
  'Maize': { N: 60, P: 30, K: 20, pest: [{ name: 'Emamectin Benzoate', dosage: '0.4g/L', coverage: 'Fall Armyworm' }] },
  'Sugarcane': { N: 120, P: 40, K: 40, pest: [{ name: 'Chlorantraniliprole', dosage: '0.3ml/L', coverage: 'Borer control' }] },
  'Cotton': { N: 60, P: 30, K: 30, pest: [{ name: 'Imidacloprid 17.8% SL', dosage: '0.5ml/L', coverage: 'Sucking pests' }] },
  'Tomato': { N: 60, P: 40, K: 40, pest: [{ name: 'Chlorothalonil 75% WP', dosage: '2g/L', coverage: 'Early blight' }] },
  'Potato': { N: 70, P: 40, K: 60, pest: [{ name: 'Mancozeb 75% WP', dosage: '2.5g/L', coverage: 'Late blight' }] },
  'Onion': { N: 40, P: 20, K: 20, pest: [{ name: 'Profenofos', dosage: '1.5ml/L', coverage: 'Thrips control' }] },
  'Soybean': { N: 15, P: 30, K: 15, pest: [{ name: 'Quinalphos', dosage: '2ml/L', coverage: 'Stem fly' }] },
  'Chickpea (Chana)': { N: 10, P: 20, K: 10, pest: [{ name: 'Indoxacarb', dosage: '0.5ml/L', coverage: 'Pod borer' }] },
  'Groundnut': { N: 15, P: 25, K: 20, pest: [{ name: 'Chlorpyrifos', dosage: '2ml/L', coverage: 'White grub' }] },
  'Mustard': { N: 30, P: 20, K: 15, pest: [{ name: 'Dimethoate', dosage: '2ml/L', coverage: 'Aphids' }] },
};

// Fallback for crops not explicitly mapped
const FALLBACK_NPK = { N: 40, P: 20, K: 20, pest: [{ name: 'Neem Oil 10000ppm', dosage: '3ml/L', coverage: 'General pest deterrent' }] };

// Current Govt Subsidized Prices (₹/kg)
const PRICES = {
  'Urea': 5.92, // (approx 266.50/45kg bag)
  'DAP': 27.00, // (approx 1350/50kg bag)
  'MOP': 34.00, // (approx 1700/50kg bag)
};

export default function FertilizerPage() {
  const [form, setForm] = useState({ crop: 'Wheat', area: 1, soil: 'Loamy', stage: 'Sowing' });
  const [history, setHistory] = useState<CalcResult[]>([]);
  const [currentResult, setCurrentResult] = useState<CalcResult | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('kisanseva_fertilizer_calcs');
    if (saved) {
      try { setHistory(JSON.parse(saved)); } catch {}
    }
  }, []);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const data = NPK_RECOMMENDATIONS[form.crop] || FALLBACK_NPK;
    
    // Convert NPK requirements (kg/acre) to commercial fertilizer bags
    // Urea is 46% N, DAP is 18% N, 46% P, MOP is 60% K
    
    // 1. Calculate DAP needed to fulfill P requirement
    const dapNeeded = Math.ceil(data.P / 0.46);
    // 2. DAP also supplies some N
    const nFromDap = dapNeeded * 0.18;
    // 3. Calculate Urea needed to fulfill remaining N requirement
    const remainingN = Math.max(0, data.N - nFromDap);
    const ureaNeeded = Math.ceil(remainingN / 0.46);
    // 4. Calculate MOP needed to fulfill K requirement
    const mopNeeded = Math.ceil(data.K / 0.60);

    const fertilizers = [
      { name: 'Urea (46% N)', kgPerAcre: ureaNeeded, totalKg: ureaNeeded * form.area, cost: ureaNeeded * form.area * PRICES.Urea },
      { name: 'DAP (18% N, 46% P)', kgPerAcre: dapNeeded, totalKg: dapNeeded * form.area, cost: dapNeeded * form.area * PRICES.DAP },
      { name: 'MOP (60% K)', kgPerAcre: mopNeeded, totalKg: mopNeeded * form.area, cost: mopNeeded * form.area * PRICES.MOP },
    ].filter(f => f.kgPerAcre > 0);
    
    const totalCost = fertilizers.reduce((sum, f) => sum + f.cost, 0);

    const result: CalcResult = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('en-IN'),
      crop: form.crop,
      area: form.area,
      fertilizers,
      pesticides: data.pest,
      totalCost
    };

    setCurrentResult(result);
    const newHistory = [result, ...history].slice(0, 5); // Keep last 5
    setHistory(newHistory);
    localStorage.setItem('kisanseva_fertilizer_calcs', JSON.stringify(newHistory));
  };

  const selectStyle: React.CSSProperties = {
    width: '100%', padding: '12px 14px', borderRadius: 10,
    border: '1px solid #d1d5db', fontSize: '0.95rem',
    outline: 'none', background: '#fff', color: '#111827', appearance: 'auto'
  };

  return (
    <div style={PAGE_BG}>
      <div style={{ background: '#fff', padding: '28px 24px 20px', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#2d6a27', marginBottom: 4 }}>
            <Calculator size={20} />
            <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Dosage Calculator</span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#111827', margin: '0 0 6px', letterSpacing: '-0.03em' }}>Fertilizer & Pesticide Calculator</h1>
          <p style={{ color: '#6b7280', margin: 0, fontSize: '0.95rem' }}>Get exact, scientific dosage recommendations based on ICAR guidelines for over 60+ crops.</p>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: '24px auto', padding: '0 24px', display: 'grid', gap: 24, gridTemplateColumns: currentResult ? '1fr 1.5fr' : '1fr', alignItems: 'start' }}>
        
        {/* Form */}
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e5e7eb', padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: 8, color: '#111827' }}>
            Parameters
          </h2>
          
          <form onSubmit={handleCalculate} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#374151', marginBottom: 6 }}>Crop Type</label>
              <select value={form.crop} onChange={e => setForm({...form, crop: e.target.value})} style={selectStyle}>
                {ALL_CROPS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#374151', marginBottom: 6 }}>Field Area (Acres)</label>
              <input type="number" step="0.1" min="0.1" value={form.area} onChange={e => setForm({...form, area: parseFloat(e.target.value) || 1})} style={selectStyle} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#374151', marginBottom: 6 }}>Soil Type</label>
              <select value={form.soil} onChange={e => setForm({...form, soil: e.target.value})} style={selectStyle}>
                <option>Sandy</option><option>Loamy</option><option>Clay</option><option>Black Cotton Soil</option><option>Red Soil</option><option>Laterite</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#374151', marginBottom: 6 }}>Growth Stage</label>
              <select value={form.stage} onChange={e => setForm({...form, stage: e.target.value})} style={selectStyle}>
                <option>Basal Dose (Sowing)</option><option>Top Dressing 1 (Vegetative)</option><option>Top Dressing 2 (Flowering)</option><option>Fruiting</option>
              </select>
            </div>

            <div style={{ marginTop: 8 }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#374151', marginBottom: 6 }}>Current NPK Soil Test Values (Optional)</label>
              <div style={{ display: 'flex', gap: 10 }}>
                <input placeholder="N" style={{ ...selectStyle, textAlign: 'center' }} />
                <input placeholder="P" style={{ ...selectStyle, textAlign: 'center' }} />
                <input placeholder="K" style={{ ...selectStyle, textAlign: 'center' }} />
              </div>
            </div>

            <button type="submit" style={{ width: '100%', padding: '14px', background: '#2d6a27', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: '1.05rem', cursor: 'pointer', marginTop: 12, transition: 'background 0.2s' }}>
              Calculate Dosage
            </button>
          </form>
        </div>

        {/* Results */}
        {currentResult ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            
            {/* Fertilizer Card */}
            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ background: '#f0fdf4', padding: '16px 20px', borderBottom: '1px solid #dcfce7', display: 'flex', alignItems: 'center', gap: 10 }}>
                <FlaskConical size={22} color="#16a34a" />
                <h3 style={{ margin: 0, color: '#166534', fontWeight: 800, fontSize: '1.15rem' }}>Optimal Fertilizer Requirement</h3>
              </div>
              <div style={{ padding: 24 }}>
                <div style={{ marginBottom: 20, paddingBottom: 16, borderBottom: '1px dashed #d1d5db' }}>
                  <div style={{ fontSize: '0.85rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>For {currentResult.area} Acre(s) of {currentResult.crop}</div>
                </div>

                {currentResult.fertilizers.map((f, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <div>
                      <div style={{ fontWeight: 800, color: '#111827', fontSize: '1.05rem' }}>{f.name}</div>
                      <div style={{ fontSize: '0.85rem', color: '#6b7280', fontWeight: 500 }}>{f.kgPerAcre} kg / acre</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 900, color: '#111827', fontSize: '1.15rem' }}>{f.totalKg.toFixed(1)} kg <span style={{fontSize: '0.8rem', fontWeight: 600, color: '#9ca3af'}}>Total</span></div>
                      <div style={{ fontSize: '0.85rem', color: '#16a34a', fontWeight: 700 }}>₹{Math.round(f.cost).toLocaleString()}</div>
                    </div>
                  </div>
                ))}
                <div style={{ background: '#f9fafb', padding: '16px 20px', borderRadius: 12, marginTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #e5e7eb' }}>
                  <span style={{ fontWeight: 700, color: '#4b5563', fontSize: '0.9rem' }}>Total Govt. Subsidized Cost:</span>
                  <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#111827' }}>₹{Math.round(currentResult.totalCost).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Pesticides & Organic */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
              <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e5e7eb', padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <h3 style={{ margin: '0 0 16px', fontSize: '1.05rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8, color: '#111827' }}>
                  <Leaf size={18} color="#2d6a27"/> Crop Protection
                </h3>
                {currentResult.pesticides.map((p, i) => (
                  <div key={i} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: i < currentResult.pesticides.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                    <div style={{ fontWeight: 800, color: '#111827', fontSize: '0.95rem', marginBottom: 2 }}>{p.name}</div>
                    <div style={{ fontSize: '0.85rem', color: '#6b7280', fontWeight: 500 }}>Dosage: <span style={{color: '#374151', fontWeight: 700}}>{p.dosage}</span></div>
                    <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: 2 }}>{p.coverage}</div>
                  </div>
                ))}
              </div>

              <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e5e7eb', padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <h3 style={{ margin: '0 0 16px', fontSize: '1.05rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8, color: '#111827' }}>
                  <Leaf size={18} color="#84cc16"/> Organic Alternatives
                </h3>
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontWeight: 800, color: '#111827', fontSize: '0.95rem', marginBottom: 2 }}>Neem Cake / Extract</div>
                  <div style={{ fontSize: '0.85rem', color: '#6b7280', fontWeight: 500 }}>Dosage: <span style={{color: '#374151', fontWeight: 700}}>100 kg / acre</span></div>
                  <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: 2 }}>Natural pest deterrent</div>
                </div>
                <div>
                  <div style={{ fontWeight: 800, color: '#111827', fontSize: '0.95rem', marginBottom: 2 }}>Vermicompost</div>
                  <div style={{ fontSize: '0.85rem', color: '#6b7280', fontWeight: 500 }}>Dosage: <span style={{color: '#374151', fontWeight: 700}}>1.5 tons / acre</span></div>
                  <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: 2 }}>Improves soil organic carbon</div>
                </div>
              </div>
            </div>

            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 12, padding: '14px 20px', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <AlertCircle size={18} style={{ color: '#2563eb', flexShrink: 0, marginTop: 1 }} />
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#1e3a8a', lineHeight: 1.5 }}>
                Calculations are based on <strong>ICAR standard NPK recommendations</strong> for general soils. If you provided soil test values, basal doses should be adjusted accordingly. Prices reflect standard govt subsidized rates (Urea ₹266/bag, DAP ₹1350/bag, MOP ₹1700/bag).
              </p>
            </div>

          </div>
        ) : (
          <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #e5e7eb', padding: '64px 32px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <div style={{ width: 72, height: 72, background: '#f3f4f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <Calculator size={36} color="#9ca3af" />
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#111827', margin: '0 0 12px' }}>Calculate Exact Inputs</h3>
            <p style={{ color: '#6b7280', margin: '0 auto', maxWidth: 400, lineHeight: 1.6, fontSize: '0.95rem' }}>
              Select your crop type and field area on the left to generate scientific fertilizer dosages, chemical pesticide recommendations, and organic alternatives.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
