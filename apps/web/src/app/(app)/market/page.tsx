'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  TrendingUp, TrendingDown, Bell, MapPin, ArrowLeft,
  X, Share2, RefreshCw, Search, AlertCircle, Loader2, CheckCircle
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CROPS = ['Tomato', 'Wheat', 'Rice', 'Onion', 'Potato', 'Cotton', 'Maize', 'Soybean'];
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
  const [selectedCrop, setSelectedCrop] = useState(CROPS[0]);
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
      const resp = await fetch(`/api/market?${params.toString()}`);
      
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

  const basePrice = avgPrice > 0 ? avgPrice : 2000;
  
  // Deterministic mock historical data tailored to current live price
  const chartData = Array.from({ length: 30 }, (_, i) => {
    const dayOffset = 29 - i;
    const date = new Date();
    date.setDate(date.getDate() - dayOffset);
    const dateStr = date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    
    // Create realistic price fluctuation ending at basePrice
    // We dampen the fluctuation towards the end so the last point matches the live average closely
    const dampener = 1 - (i / 30) * 0.5; 
    const fluctuation = (Math.sin(i / 4) * 0.1 + Math.cos(i / 2) * 0.05) * basePrice * dampener;
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
              <input type="text" className="input" placeholder="Search for crops (e.g., Wheat, Rice, Tomatoes)..." style={{ width: '100%', paddingLeft: '36px' }} />
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
            {/* Price Chart Card */}
            <div className="card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', margin: 0, fontSize: '1.25rem' }}>Price Trends (Last 30 Days) - {selectedCrop} in {selectedState || 'All States'}</h2>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn btn-sm" style={{ backgroundColor: 'var(--color-bone)' }}>All Dates</button>
                  <button className="btn btn-sm" style={{ backgroundColor: 'var(--color-bone)' }}>My Gainers</button>
                </div>
              </div>

              <div style={{ height: '300px', width: '100%', marginTop: '16px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorModal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12, fill: '#6b7280' }} 
                      tickLine={false} 
                      axisLine={false}
                      minTickGap={30}
                    />
                    <YAxis 
                      domain={['auto', 'auto']}
                      tickFormatter={(val) => `₹${val}`}
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                      formatter={(value: any, name: any) => [`₹${value}`, String(name).charAt(0).toUpperCase() + String(name).slice(1)]}
                    />
                    <Area type="monotone" dataKey="max" stroke="#ef4444" fill="none" strokeDasharray="5 5" />
                    <Area type="monotone" dataKey="min" stroke="#3b82f6" fill="none" strokeDasharray="5 5" />
                    <Area type="monotone" dataKey="modal" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorModal)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div style={{ display: 'flex', gap: '24px', marginTop: '16px', fontSize: '0.875rem', color: 'var(--color-saddle)', justifyContent: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: '12px', height: '2px', backgroundColor: '#3b82f6', borderTop: '2px dashed #3b82f6' }} /> Minimum</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: '12px', height: '4px', backgroundColor: '#22c55e' }} /> Modal Average</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: '12px', height: '2px', backgroundColor: '#ef4444', borderTop: '2px dashed #ef4444' }} /> Maximum</div>
              </div>
            </div>

            {/* Pinned Commodities */}
            <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '8px' }}>
              {[
                { name: 'Wheat', price: '₹2,850', change: '+2.5% (+₹70)', isUp: true, emoji: '🌾', bg: '#fef3c7' },
                { name: 'Rice (Basmati)', price: '₹4,100', change: '-1.2% (-₹50)', isUp: false, emoji: '🍚', bg: '#e0f2fe' },
                { name: 'Tomatoes', price: '₹1,500', change: '+5.0% (+₹75)', isUp: true, emoji: '🍅', bg: '#fee2e2' },
                { name: 'Onions', price: '₹2,200', change: '-0.5% (-₹10)', isUp: false, emoji: '🧅', bg: '#f3e8ff' },
              ].map(item => (
                <div key={item.name} className="card" style={{ flex: '0 0 200px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                      {item.emoji}
                    </div>
                    <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{item.name}</span>
                  </div>
                  <div style={{ fontSize: '1.125rem', fontWeight: 700 }}>{item.price} <span style={{ fontSize: '0.75rem', fontWeight: 400, color: 'var(--color-bark)' }}>/ Qtl</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <span style={{ fontSize: '0.75rem', color: item.isUp ? 'var(--color-success)' : 'var(--color-danger)', fontWeight: 600 }}>{item.change}</span>
                    <div style={{ display: 'flex', gap: '2px', alignItems: 'flex-end', height: '24px' }}>
                      {[40, 60, 50, 80, 100].map((h, i) => (
                        <div key={i} style={{ width: '4px', height: `${h}%`, backgroundColor: item.isUp ? '#22c55e' : '#ef4444', opacity: 0.5 + (i * 0.1) }} />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Live Market Table */}
            <div className="card" style={{ padding: '24px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', margin: '0 0 16px 0', fontSize: '1.25rem' }}>Live Mandi Prices</h2>
              {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}><Loader2 className="spin" size={32} color="var(--color-honey-amber)" /></div>
              ) : error ? (
                <div style={{ padding: '16px', color: 'var(--color-danger)', display: 'flex', gap: '8px' }}><AlertCircle /> {error}</div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table className="ks-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                    <thead style={{ borderBottom: '1px solid var(--color-bone)' }}>
                      <tr style={{ textAlign: 'left', color: 'var(--color-saddle)' }}>
                        <th style={{ padding: '12px' }}>Mandi Name</th>
                        <th style={{ padding: '12px' }}>State</th>
                        <th style={{ padding: '12px' }}>Min</th>
                        <th style={{ padding: '12px' }}>Modal</th>
                        <th style={{ padding: '12px' }}>Max</th>
                        <th style={{ padding: '12px' }}>vs Avg</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mandis.map((m: any, idx: number) => {
                        const isBest = idx === 0;
                        const delta = m.modal - avgPrice;
                        return (
                          <tr key={m.id} className={isBest ? 'best' : ''} style={{ borderBottom: '1px solid var(--color-bone)', backgroundColor: isBest ? 'rgba(34, 197, 94, 0.05)' : 'transparent' }}>
                            <td style={{ padding: '12px', fontWeight: 500 }}>{m.name} {isBest && <span className="badge badge-success" style={{ marginLeft: '8px' }}>Best</span>}</td>
                            <td style={{ padding: '12px' }}>{m.state}</td>
                            <td style={{ padding: '12px', color: 'var(--color-bark)' }}>₹{m.min}</td>
                            <td style={{ padding: '12px', fontWeight: 600 }}>₹{m.modal}</td>
                            <td style={{ padding: '12px', color: 'var(--color-bark)' }}>₹{m.max}</td>
                            <td style={{ padding: '12px', color: delta > 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
                              {delta > 0 ? '+' : ''}₹{delta}
                            </td>
                          </tr>
                        )
                      })}
                      {mandis.length === 0 && (
                        <tr><td colSpan={6} style={{ padding: '24px', textAlign: 'center', color: 'var(--color-bark)' }}>No data available for this selection.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', flex: '1 1 35%' }}>
            
            {/* Top Gainers & Losers Card */}
            <div className="card" style={{ padding: '24px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', margin: '0 0 20px 0', fontSize: '1.125rem' }}>Top Gainers & Losers (Today)</h2>
              
              <div style={{ marginBottom: '24px' }}>
                <span className="badge badge-success" style={{ marginBottom: '12px', display: 'inline-block' }}>GAINERS</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Cotton</span><span style={{ color: 'var(--color-success)', fontWeight: 600 }}>₹6,500 (+5.2%)</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Soybean</span><span style={{ color: 'var(--color-success)', fontWeight: 600 }}>₹4,800 (+3.8%)</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Tur Dal</span><span style={{ color: 'var(--color-success)', fontWeight: 600 }}>₹9,200 (+2.1%)</span></div>
                </div>
              </div>

              <div>
                <span className="badge badge-danger" style={{ marginBottom: '12px', display: 'inline-block' }}>LOSERS</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Potato</span><span style={{ color: 'var(--color-danger)', fontWeight: 600 }}>₹1,100 (-3.5%)</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Garlic</span><span style={{ color: 'var(--color-danger)', fontWeight: 600 }}>₹8,500 (-2.8%)</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Maize</span><span style={{ color: 'var(--color-danger)', fontWeight: 600 }}>₹1,950 (-1.9%)</span></div>
                </div>
              </div>
            </div>

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
