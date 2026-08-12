'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  TrendingUp, TrendingDown, Bell, Filter, MapPin, ArrowLeft,
  X, ExternalLink, Share2, RefreshCw, Home, Microscope, Calendar,
  ChevronDown, Loader2, AlertCircle, CheckCircle
} from 'lucide-react';

const CROPS  = ['Tomato', 'Wheat', 'Rice', 'Onion', 'Potato', 'Cotton', 'Maize', 'Soybean'];
const STATES = ['', 'Maharashtra', 'Punjab', 'Uttar Pradesh', 'Madhya Pradesh', 'Karnataka', 'Tamil Nadu', 'Andhra Pradesh', 'Rajasthan', 'Delhi', 'West Bengal'];
const STATE_LABELS: Record<string, string> = {
  '': 'All States', 'Uttar Pradesh': 'UP', 'Madhya Pradesh': 'MP',
  'Tamil Nadu': 'TN', 'Andhra Pradesh': 'AP', 'West Bengal': 'WB',
};

export default function MarketPricePage() {
  const [selectedCrop, setSelectedCrop]       = useState(CROPS[0]);
  const [selectedState, setSelectedState]     = useState('');
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertTargetPrice, setAlertTargetPrice] = useState('2500');
  const [alertType, setAlertType]             = useState('above');
  const [alertSet, setAlertSet]               = useState(false);

  // Live market data state
  const [marketData, setMarketData]   = useState<any>(null);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);

  const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  const fetchPrices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ commodity: selectedCrop, limit: '20' });
      if (selectedState) params.append('state', selectedState);
      const resp = await fetch(`/api/market?${params.toString()}`);
      if (!resp.ok) throw new Error(`Server error ${resp.status}`);
      const data = await resp.json();
      if (!data.success) throw new Error(data.error || 'No data');
      setMarketData(data);
      setLastRefreshed(new Date());
    } catch (err: any) {
      setError(err.message || 'Failed to load mandi prices');
    } finally {
      setLoading(false);
    }
  }, [selectedCrop, selectedState]);

  // Fetch on mount and whenever crop/state changes
  useEffect(() => { fetchPrices(); }, [fetchPrices]);

  // Derived values from live data
  const mandis    = marketData?.mandis     ?? [];
  const bestMandi = marketData?.bestMandi  ?? null;
  const avgPrice  = marketData?.stateAvgPrice ?? 0;
  const sellSignal = marketData?.sellSignal ?? '';


  return (
    <div className="page-container" style={{ backgroundColor: 'var(--color-parchment)', minHeight: '100vh', paddingBottom: '80px', fontFamily: 'var(--font-sans)', color: 'var(--color-ink)' }}>
      {/* Top Navigation */}
      <div className="top-nav" style={{ position: 'sticky', top: 0, zIndex: 10, backgroundColor: 'var(--color-parchment)', borderBottom: '1px solid var(--color-bone)', padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button className="btn-icon" style={{ padding: '8px', borderRadius: '50%', border: 'none', background: 'transparent', cursor: 'pointer' }}>
            <ArrowLeft size={24} color="var(--color-ink)" />
          </button>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>Mandi Price Comparator</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-bark)', fontSize: '0.875rem' }}>
              <RefreshCw size={12} />
              <span>Live data &middot; Updated every 15 minutes</span>
            </div>
          </div>
        </div>
      </div>

      <main style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1000px', margin: '0 auto' }}>
        {/* Filter Bar */}
        <div className="card" style={{ padding: '16px', display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--color-bone)', borderRadius: 'var(--radius-md)' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ position: 'relative' }}>
              <select 
                className="input" 
                value={selectedCrop} 
                onChange={(e) => setSelectedCrop(e.target.value)}
                style={{ appearance: 'none', paddingRight: '32px', paddingLeft: '12px', paddingBlock: '8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-bark)', backgroundColor: '#fff', fontSize: '1rem', cursor: 'pointer' }}
              >
                {CROPS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <ChevronDown size={16} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--color-saddle)' }} />
            </div>
            
            <div style={{ position: 'relative' }}>
              <select 
                className="input" 
                value={selectedState} 
                onChange={(e) => setSelectedState(e.target.value)}
                style={{ appearance: 'none', paddingRight: '32px', paddingLeft: '12px', paddingBlock: '8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-bark)', backgroundColor: '#fff', fontSize: '1rem', cursor: 'pointer' }}
              >
                {STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <ChevronDown size={16} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--color-saddle)' }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', backgroundColor: 'var(--color-parchment)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-bone)', fontSize: '0.875rem', color: 'var(--color-saddle)' }}>
              {today}
            </div>
          </div>

          <button className="btn btn-primary" onClick={() => setIsAlertModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--color-honey-amber)', color: 'var(--color-ink)', border: 'none', padding: '10px 16px', borderRadius: 'var(--radius-sm)', fontWeight: 600, cursor: 'pointer' }}>
            <Bell size={18} />
            Set Price Alert
          </button>
        </div>

        {/* Hero Price Card */}
        <div className="card panel-dark" style={{ backgroundColor: 'var(--color-charcoal-olive)', color: '#fff', padding: '24px', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span className="eyebrow eyebrow-amber" style={{ color: 'var(--color-honey-amber)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Best Price Today</span>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 700, margin: '8px 0', display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                ₹{MANDI_DATA[0].modal}<span style={{ fontSize: '1rem', color: 'var(--color-bark)', fontFamily: 'var(--font-sans)', fontWeight: 400 }}>/quintal</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-bone)' }}>
                <MapPin size={16} />
                <span style={{ fontSize: '1.125rem', fontWeight: 500 }}>{MANDI_DATA[0].name}, {MANDI_DATA[0].state}</span>
              </div>
            </div>
            <div className="badge badge-success" style={{ backgroundColor: 'var(--color-success)', color: '#fff', padding: '4px 8px', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <TrendingUp size={12} />
              ₹{MANDI_DATA[0].modal - AVG_PRICE} higher than avg
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button className="btn" style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 'var(--radius-sm)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem' }}>
              <ExternalLink size={16} />
              Get Directions
            </button>
            <button className="btn" style={{ backgroundColor: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '8px 16px', borderRadius: 'var(--radius-sm)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem' }}>
              <Share2 size={16} />
              Share
            </button>
          </div>
        </div>

        {/* 7-Day Price Trend */}
        <div className="card" style={{ backgroundColor: '#fff', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-bone)' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', margin: '0 0 16px 0', fontSize: '1.25rem' }}>7-Day Price Trend ({selectedCrop})</h2>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '120px', paddingTop: '20px' }}>
            {[
              { day: 'Mon', val: 2150, h: '40%' },
              { day: 'Tue', val: 2120, h: '35%' },
              { day: 'Wed', val: 2180, h: '50%' },
              { day: 'Thu', val: 2200, h: '60%' },
              { day: 'Fri', val: 2250, h: '75%' },
              { day: 'Sat', val: 2310, h: '90%' },
              { day: 'Sun', val: 2340, h: '100%', active: true },
            ].map(d => (
              <div key={d.day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', width: '12%' }}>
                <div style={{ 
                  width: '100%', 
                  height: d.h, 
                  backgroundColor: d.active ? 'var(--color-honey-amber)' : 'var(--color-bone)',
                  borderRadius: '4px 4px 0 0',
                  transition: 'height 0.3s ease'
                }} />
                <span style={{ fontSize: '0.75rem', color: d.active ? 'var(--color-ink)' : 'var(--color-bark)', fontWeight: d.active ? 600 : 400 }}>{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Price Table */}
        <div className="card" style={{ backgroundColor: '#fff', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-bone)', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-bone)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', margin: 0, fontSize: '1.25rem' }}>Compare Mandis</h2>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--color-parchment)', color: 'var(--color-saddle)', borderBottom: '1px solid var(--color-bone)' }}>
                  <th style={{ padding: '12px 20px', fontWeight: 500 }}>Mandi Name</th>
                  <th style={{ padding: '12px 20px', fontWeight: 500 }}>State</th>
                  <th style={{ padding: '12px 20px', fontWeight: 500 }}>Min - Max Price</th>
                  <th style={{ padding: '12px 20px', fontWeight: 500 }}>Modal Price</th>
                  <th style={{ padding: '12px 20px', fontWeight: 500 }}>vs Avg</th>
                  <th style={{ padding: '12px 20px', fontWeight: 500 }}>Updated</th>
                </tr>
              </thead>
              <tbody>
                {MANDI_DATA.map((row, idx) => {
                  const isBest = idx === 0;
                  const delta = row.modal - AVG_PRICE;
                  const isPositive = delta > 0;
                  return (
                    <tr key={row.id} style={{ 
                      borderBottom: '1px solid var(--color-bone)', 
                      backgroundColor: isBest ? 'rgba(45, 122, 79, 0.05)' : 'transparent',
                    }}>
                      <td style={{ padding: '16px 20px', fontWeight: 500, color: 'var(--color-ink)' }}>{row.name}</td>
                      <td style={{ padding: '16px 20px', color: 'var(--color-saddle)' }}>{row.state}</td>
                      <td style={{ padding: '16px 20px', color: 'var(--color-bark)' }}>₹{row.min} - ₹{row.max}</td>
                      <td style={{ padding: '16px 20px', fontWeight: 600, color: isBest ? 'var(--color-success)' : 'var(--color-ink)' }}>₹{row.modal}</td>
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: isPositive ? 'var(--color-success)' : 'var(--color-danger)', fontWeight: 500 }}>
                          {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                          ₹{Math.abs(delta)}
                        </div>
                      </td>
                      <td style={{ padding: '16px 20px', color: 'var(--color-bark)', fontSize: '0.75rem' }}>{row.updated}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Alert Modal */}
      {isAlertModalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setIsAlertModalOpen(false)} />
          <div className="card" style={{ position: 'relative', backgroundColor: '#fff', borderRadius: 'var(--radius-md)', padding: '24px', width: '100%', maxWidth: '400px', zIndex: 101, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', margin: 0, fontSize: '1.25rem' }}>Set Price Alert</h2>
              <button className="btn-icon" onClick={() => setIsAlertModalOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-bark)' }}>
                <X size={20} />
              </button>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label className="input-label" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '8px', color: 'var(--color-saddle)' }}>Commodity</label>
              <div style={{ padding: '10px 12px', backgroundColor: 'var(--color-bone)', borderRadius: 'var(--radius-sm)', color: 'var(--color-ink)' }}>{selectedCrop} in {selectedState}</div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label className="input-label" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '8px', color: 'var(--color-saddle)' }}>Target Price (₹/quintal)</label>
              <input 
                type="number" 
                className="input" 
                value={alertTargetPrice} 
                onChange={(e) => setAlertTargetPrice(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-bark)', borderRadius: 'var(--radius-sm)', fontSize: '1rem' }} 
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label className="input-label" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '8px', color: 'var(--color-saddle)' }}>Alert Condition</label>
              <div style={{ display: 'flex', gap: '16px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="radio" checked={alertType === 'above'} onChange={() => setAlertType('above')} />
                  Goes above
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="radio" checked={alertType === 'below'} onChange={() => setAlertType('below')} />
                  Drops below
                </label>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button className="btn btn-ghost" onClick={() => setIsAlertModalOpen(false)} style={{ padding: '10px 16px', background: 'transparent', border: 'none', color: 'var(--color-saddle)', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
              <button className="btn btn-primary" onClick={() => setIsAlertModalOpen(false)} style={{ padding: '10px 16px', background: 'var(--color-honey-amber)', color: 'var(--color-ink)', border: 'none', borderRadius: 'var(--radius-sm)', fontWeight: 600, cursor: 'pointer' }}>Set Alert</button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Nav (Mobile) */}
      <div className="bottom-nav lg:hidden" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, display: 'flex', justifyContent: 'space-around', backgroundColor: '#fff', borderTop: '1px solid var(--color-bone)', padding: '12px 0 24px 0', zIndex: 10 }}>
        <div className="bottom-nav-item" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: 'var(--color-bark)' }}>
          <Home size={24} />
          <span style={{ fontSize: '0.7rem' }}>Home</span>
        </div>
        <div className="bottom-nav-item" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: 'var(--color-bark)' }}>
          <Microscope size={24} />
          <span style={{ fontSize: '0.7rem' }}>Diagnose</span>
        </div>
        <div className="bottom-nav-item" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: 'var(--color-success)' }}>
          <TrendingUp size={24} />
          <span style={{ fontSize: '0.7rem', fontWeight: 600 }}>Market</span>
        </div>
        <div className="bottom-nav-item" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: 'var(--color-bark)' }}>
          <Calendar size={24} />
          <span style={{ fontSize: '0.7rem' }}>Schedule</span>
        </div>
        <div className="bottom-nav-item" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: 'var(--color-bark)' }}>
          <Bell size={24} />
          <span style={{ fontSize: '0.7rem' }}>Alerts</span>
        </div>
      </div>
    </div>
  );
}
