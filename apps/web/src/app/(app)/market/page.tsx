'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Bell, Search, X } from 'lucide-react';
import PriceChartCard from '@/components/features/market/PriceChartCard';
import PinnedCommodities from '@/components/features/market/PinnedCommodities';
import LiveMandiTable from '@/components/features/market/LiveMandiTable';
import TopGainersLosers from '@/components/features/market/TopGainersLosers';

const ALL_COMMODITIES = [
  'Amaranthus', 'Amla(Nelli Kai)', 'Apple', 'Arhar (Tur/Red Gram)', 'Ashgourd', 'Bajra(Pearl Millet)', 'Banana', 'Barley (Jau)',
  'Bengal Gram(Gram)(Whole)', 'Bitter gourd', 'Black Gram (Urd Beans)', 'Bottle gourd', 'Brinjal', 'Cabbage', 
  'Capsicum', 'Carrot', 'Castor Seed', 'Cauliflower', 'Coconut', 'Coriander(Leaves)', 'Cotton', 'Cowpea (Lobia)',
  'Cucumber(Kheera)', 'Drumstick', 'Garlic', 'Ginger', 'Green Chilli', 'Green Gram (Moong)', 'Groundnut', 
  'Guava', 'Jack Fruit', 'Jowar(Sorghum)', 'Jute', 'Lemon', 'Lentil (Masur)', 'Maize', 'Mango', 'Mustard', 
  'Okra', 'Onion', 'Orange', 'Paddy(Dhan)', 'Papaya', 'Peas(Green)', 'Pineapple', 'Pomegranate', 'Potato', 
  'Pumpkin', 'Radish', 'Ragi (Finger Millet)', 'Rice', 'Soybean', 'Spinach', 'Sweet Potato', 'Tomato', 'Turmeric',
  'Water Melon', 'Wheat'
].sort();

const STATES = [
  '',
  // 28 States
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 
  'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  // 8 Union Territories
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
];

export default function MarketPricePage() {
  const [selectedCrop, setSelectedCrop] = useState('Tomato');
  const [selectedState, setSelectedState] = useState('');
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertTargetPrice, setAlertTargetPrice] = useState('2500');
  const [alertType, setAlertType] = useState('above');

  // Live market data state
  const [marketData, setMarketData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [today, setToday] = useState('');

  const fetchPrices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ commodity: selectedCrop, limit: '20' });
      if (selectedState) params.append('state', selectedState);
      const resp = await fetch(`/api/v1/market?${params.toString()}`);
      
      const data = await resp.json().catch(() => null);
      
      if (!resp.ok) {
        throw new Error(data?.error || `Server error ${resp.status}`);
      }
      if (!data?.success) {
        throw new Error(data?.error || 'No data returned from API');
      }
      
      setMarketData(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load mandi prices');
    } finally {
      setLoading(false);
    }
  }, [selectedCrop, selectedState]);

  useEffect(() => {
    fetchPrices();
    setToday(new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }));
  }, [fetchPrices]);

  const mandis = marketData?.mandis ?? [];
  const avgPrice = marketData?.stateAvgPrice ?? 0;

  const cropSeed = selectedCrop.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const basePrice = avgPrice > 0 ? avgPrice : 1500 + (cropSeed % 2000);
  
  // Deterministic mock historical data tailored to current live price
  const chartData = Array.from({ length: 30 }, (_, i) => {
    const dayOffset = 29 - i;
    const date = new Date();
    date.setDate(date.getDate() - dayOffset);
    const dateStr = date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    
    // Create realistic price fluctuation ending at basePrice
    // Use cropSeed to change the frequency and phase of the sine waves so each crop has a unique shape
    const dampener = 1 - (i / 30) * 0.5; 
    const freq1 = (cropSeed % 5 + 2) / 10; 
    const freq2 = (cropSeed % 7 + 3) / 10; 
    const phase = cropSeed % Math.PI;
    
    const fluctuation = (Math.sin(i * freq1 + phase) * 0.1 + Math.cos(i * freq2) * 0.05) * basePrice * dampener;
    const dailyModal = Math.round(basePrice - fluctuation); // minus to make the trend converge to basePrice
    
    return {
      date: dateStr,
      min: Math.round(dailyModal * 0.92),
      max: Math.round(dailyModal * 1.08),
      modal: dailyModal,
    };
  });

  return (
    <div style={{ backgroundColor: 'var(--color-parchment)', minHeight: '100%', fontFamily: 'var(--font-sans)', color: 'var(--color-ink)' }}>
      <main style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Filter Bar */}
        <div className="card" style={{ padding: '16px', display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', borderBottom: '1px solid var(--color-bone)' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', flex: 1 }}>
            <div style={{ position: 'relative', flex: '1 1 200px', maxWidth: '300px' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-saddle)' }} />
              <input 
                type="text" 
                list="crop-list"
                className="input" 
                placeholder="Search any crop (e.g. Wheat)..." 
                style={{ width: '100%', paddingLeft: '36px' }}
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
              />
              <datalist id="crop-list">
                {ALL_COMMODITIES.map(c => <option key={c} value={c} />)}
              </datalist>
            </div>
            
            <select className="input" value={selectedState} onChange={(e) => setSelectedState(e.target.value)} style={{ flex: '1 1 150px', maxWidth: '200px' }}>
              {STATES.map(s => <option key={s} value={s}>{s || 'All States'}</option>)}
            </select>
            
            <select className="input" style={{ flex: '1 1 150px', maxWidth: '200px' }}>
              <option value="">All Mandis</option>
            </select>

            <input type="text" className="input" readOnly value={today} style={{ width: '120px', color: 'var(--color-saddle)', backgroundColor: 'var(--color-bone)' }} />
          </div>

          <button className="btn btn-primary btn-sm" onClick={() => setIsAlertModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bell size={16} /> Set Price Alert
          </button>
        </div>

        {/* Main Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          
          {/* LEFT COLUMN */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', flex: '2 1 65%' }}>
            <PriceChartCard selectedCrop={selectedCrop} selectedState={selectedState} chartData={chartData} />
            <PinnedCommodities selectedCrop={selectedCrop} setSelectedCrop={setSelectedCrop} />
            <LiveMandiTable loading={loading} error={error} mandis={mandis} avgPrice={avgPrice} />
          </div>

          {/* RIGHT COLUMN */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', flex: '1 1 35%' }}>
            <TopGainersLosers />

            {/* Market News Card */}
            <div className="card" style={{ padding: '24px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', margin: '0 0 16px 0', fontSize: '1.125rem' }}>Market News</h2>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {[
                  { text: 'Government announces MSP hike for Rabi crops', date: 'Nov 24' },
                  { text: 'Export ban on non-basmati rice lifted', date: 'Nov 23' },
                  { text: 'Weather forecast indicates favorable conditions for sowing', date: 'Nov 22' },
                  { text: 'New agri-tech solutions showcased at national expo', date: 'Nov 20' },
                ].map((news, idx) => (
                  <div key={idx} style={{ padding: '12px 0', borderBottom: idx < 3 ? '1px solid var(--color-bone)' : 'none' }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '4px' }}>{news.text}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-bark)' }}>{news.date}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Alert Modal */}
      {isAlertModalOpen && (
        <div className="modal-overlay" style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)', padding: '16px' }}>
          <div className="modal-box card" style={{ backgroundColor: '#fff', padding: '24px', width: '100%', maxWidth: '400px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', margin: 0, fontSize: '1.25rem' }}>Set Price Alert</h2>
              <button onClick={() => setIsAlertModalOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-bark)' }}><X size={20} /></button>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '8px', color: 'var(--color-saddle)' }}>Commodity</label>
              <div className="input" style={{ backgroundColor: 'var(--color-bone)', padding: '8px 12px' }}>{selectedCrop} in {selectedState || 'All States'}</div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '8px', color: 'var(--color-saddle)' }}>Target Price (₹/quintal)</label>
              <input type="number" className="input" value={alertTargetPrice} onChange={(e) => setAlertTargetPrice(e.target.value)} style={{ width: '100%' }} />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '8px', color: 'var(--color-saddle)' }}>Alert Condition</label>
              <div style={{ display: 'flex', gap: '16px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}><input type="radio" checked={alertType === 'above'} onChange={() => setAlertType('above')} /> Goes above</label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}><input type="radio" checked={alertType === 'below'} onChange={() => setAlertType('below')} /> Drops below</label>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button className="btn btn-ghost" onClick={() => setIsAlertModalOpen(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={() => setIsAlertModalOpen(false)}>Set Alert</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
