'use client';

import React, { useState, useEffect } from 'react';
import { Leaf, Calculator, FlaskConical, IndianRupee, Download, History, Plus, Check } from 'lucide-react';

const PAGE_BG = { background: '#f9fafb', minHeight: '100vh', paddingBottom: 100 };

type CalcResult = {
  id: string;
  date: string;
  crop: string;
  area: number;
  fertilizers: { name: string; kgPerAcre: number; totalKg: number; cost: number }[];
  pesticides: { name: string; dosage: string; coverage: string }[];
  totalCost: number;
};

const CROP_DATA: Record<string, any> = {
  'Wheat': { dap: 50, urea: 65, mop: 20, pest: [{ name: 'Mancozeb 75% WP', dosage: '2.5g/L', coverage: 'Leaves & stem' }] },
  'Rice': { dap: 45, urea: 60, mop: 15, pest: [{ name: 'Tricyclazole 75% WP', dosage: '0.6g/L', coverage: 'Full plant spray' }] },
  'Cotton': { dap: 40, urea: 30, mop: 10, pest: [{ name: 'Imidacloprid 17.8% SL', dosage: '0.5ml/L', coverage: 'Foliar spray' }] },
  'Tomato': { dap: 60, urea: 40, mop: 25, pest: [{ name: 'Chlorothalonil 75% WP', dosage: '2g/L', coverage: 'Preventive spray' }] },
};

const PRICES = {
  'DAP': 27, // per kg (approx 1350/50kg)
  'Urea': 6, // per kg (approx 266/45kg)
  'MOP': 17, // per kg (approx 850/50kg)
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
    const data = CROP_DATA[form.crop] || CROP_DATA['Wheat'];
    
    const fertilizers = [
      { name: 'DAP (Di-ammonium Phosphate)', kgPerAcre: data.dap, totalKg: data.dap * form.area, cost: data.dap * form.area * PRICES.DAP },
      { name: 'Urea', kgPerAcre: data.urea, totalKg: data.urea * form.area, cost: data.urea * form.area * PRICES.Urea },
      { name: 'MOP (Muriate of Potash)', kgPerAcre: data.mop, totalKg: data.mop * form.area, cost: data.mop * form.area * PRICES.MOP },
    ];
    
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

  return (
    <div style={PAGE_BG}>
      <div style={{ background: '#fff', padding: '32px 28px 20px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#111827', margin: '0 0 8px', letterSpacing: '-0.03em' }}>Fertilizer & Pesticide Calculator</h1>
          <p style={{ color: '#4b5563', margin: 0 }}>Get exact dosage recommendations based on your crop, area, and soil.</p>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px', display: 'grid', gap: 32, gridTemplateColumns: currentResult ? '1fr 1.5fr' : '1fr', alignItems: 'start' }}>
        
        {/* Form */}
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e8ede7', padding: 24 }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: 8 }}><Calculator size={20} color="#2d6a27" /> Parameters</h2>
          
          <form onSubmit={handleCalculate} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: 6 }}>Crop Type</label>
              <select value={form.crop} onChange={e => setForm({...form, crop: e.target.value})} style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #d1d5db' }}>
                {Object.keys(CROP_DATA).map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: 6 }}>Field Area (Acres)</label>
              <input type="number" step="0.1" min="0.1" value={form.area} onChange={e => setForm({...form, area: parseFloat(e.target.value) || 1})} style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #d1d5db' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: 6 }}>Soil Type</label>
              <select value={form.soil} onChange={e => setForm({...form, soil: e.target.value})} style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #d1d5db' }}>
                <option>Sandy</option><option>Loamy</option><option>Clay</option><option>Black Cotton Soil</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: 6 }}>Growth Stage</label>
              <select value={form.stage} onChange={e => setForm({...form, stage: e.target.value})} style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #d1d5db' }}>
                <option>Sowing</option><option>Vegetative</option><option>Flowering</option><option>Fruiting</option>
              </select>
            </div>

            <div style={{ marginTop: 12 }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: 6 }}>Current NPK Values (Optional)</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input placeholder="N" style={{ flex: 1, padding: '10px', borderRadius: 8, border: '1px solid #d1d5db' }} />
                <input placeholder="P" style={{ flex: 1, padding: '10px', borderRadius: 8, border: '1px solid #d1d5db' }} />
                <input placeholder="K" style={{ flex: 1, padding: '10px', borderRadius: 8, border: '1px solid #d1d5db' }} />
              </div>
            </div>

            <button type="submit" style={{ width: '100%', padding: '14px', background: '#2d6a27', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: '1.05rem', cursor: 'pointer', marginTop: 8 }}>
              Calculate Dosage
            </button>
          </form>
        </div>

        {/* Results */}
        {currentResult ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            
            {/* Fertilizer Card */}
            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e8ede7', overflow: 'hidden' }}>
              <div style={{ background: '#f0fdf4', padding: '16px 20px', borderBottom: '1px solid #dcfce7', display: 'flex', alignItems: 'center', gap: 8 }}>
                <FlaskConical size={20} color="#166534" />
                <h3 style={{ margin: 0, color: '#166534', fontWeight: 800 }}>Fertilizer Recommendations</h3>
              </div>
              <div style={{ padding: 20 }}>
                {currentResult.fertilizers.map((f, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: idx < currentResult.fertilizers.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                    <div>
                      <div style={{ fontWeight: 700, color: '#111827' }}>{f.name}</div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{f.kgPerAcre} kg / acre</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 800, color: '#111827', fontSize: '1.1rem' }}>{f.totalKg.toFixed(1)} kg total</div>
                      <div style={{ fontSize: '0.875rem', color: '#16a34a', fontWeight: 600 }}>Est: ₹{f.cost.toLocaleString()}</div>
                    </div>
                  </div>
                ))}
                <div style={{ background: '#f9fafb', padding: '16px', borderRadius: 8, marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, color: '#4b5563' }}>Total Estimated Cost:</span>
                  <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#111827' }}>₹{currentResult.totalCost.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Pesticides & Organic */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e8ede7', padding: 20 }}>
                <h3 style={{ margin: '0 0 16px', fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}><Leaf size={18} color="#2d6a27"/> Pesticide</h3>
                {currentResult.pesticides.map((p, i) => (
                  <div key={i} style={{ marginBottom: 12 }}>
                    <div style={{ fontWeight: 700, color: '#111827' }}>{p.name}</div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Dosage: {p.dosage}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e8ede7', padding: 20 }}>
                <h3 style={{ margin: '0 0 16px', fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}><Leaf size={18} color="#84cc16"/> Organic Alt.</h3>
                <div style={{ fontWeight: 700, color: '#111827' }}>Neem Cake</div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Dosage: 100 kg / acre</div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: 4 }}>Vermicompost: 2 tons / acre</div>
              </div>
            </div>

          </div>
        ) : (
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e8ede7', padding: 32, textAlign: 'center' }}>
            <Calculator size={48} color="#d1d5db" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#4b5563', margin: '0 0 8px' }}>No Calculation Yet</h3>
            <p style={{ color: '#6b7280', margin: 0 }}>Fill out the parameters on the left to generate exact fertilizer dosages and cost estimates for your field.</p>
          </div>
        )}
      </div>
    </div>
  );
}
