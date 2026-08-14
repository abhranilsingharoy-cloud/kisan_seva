'use client';
import React, { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';

interface PriceAlertManagerProps {
  selectedCrop: string;
  selectedState: string;
  currentPrice: number;
}

const getSafeAlerts = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem('kisan_seva_price_alerts') || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export default function PriceAlertManager({ selectedCrop, selectedState, currentPrice }: PriceAlertManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState<'create' | 'manage'>('create');
  
  const [alertTargetPrice, setAlertTargetPrice] = useState('2500');
  const [alertType, setAlertType] = useState('above');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  const [savedAlerts, setSavedAlerts] = useState<any[]>([]);
  const [triggeredAlerts, setTriggeredAlerts] = useState<any[]>([]);

  // Load saved alerts
  useEffect(() => {
    if (isOpen) {
      setSavedAlerts(getSafeAlerts());
    }
  }, [isOpen]);

  // Check triggers
  useEffect(() => {
    if (currentPrice > 0) {
      const existing = getSafeAlerts();
      const triggered = existing.filter((a: any) => {
        if (a.crop === selectedCrop) {
          const target = Number(a.price);
          if (a.type === 'above' && currentPrice > target) return true;
          if (a.type === 'below' && currentPrice < target) return true;
        }
        return false;
      });
      setTriggeredAlerts(triggered);
    }
  }, [currentPrice, selectedCrop]);

  const handleSetAlert = () => {
    if (!alertTargetPrice) return;
    const newAlert = { crop: selectedCrop, state: selectedState || 'All States', price: alertTargetPrice, type: alertType, date: new Date().toISOString() };
    const existing = getSafeAlerts();
    localStorage.setItem('kisan_seva_price_alerts', JSON.stringify([...existing, newAlert]));
    
    setToastMessage(`Alert set: ${selectedCrop} ${alertType} ₹${alertTargetPrice}`);
    setTimeout(() => setToastMessage(null), 3000);
    setIsOpen(false);
  };

  const handleDeleteAlert = (index: number) => {
    const updated = [...savedAlerts];
    updated.splice(index, 1);
    setSavedAlerts(updated);
    localStorage.setItem('kisan_seva_price_alerts', JSON.stringify(updated));
  };

  return (
    <>
      <button 
        type="button" 
        className="btn btn-primary btn-sm" 
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setTab('create'); setIsOpen(true); }} 
        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
      >
        <Bell size={16} /> Price Alerts
      </button>

      {/* Modal */}
      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)', padding: '16px' }}>
          <div className="card" onClick={(e) => e.stopPropagation()} style={{ backgroundColor: '#fff', padding: '24px', width: '100%', maxWidth: '400px', position: 'relative' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', margin: 0, fontSize: '1.25rem' }}>Price Alerts</h2>
              <button type="button" onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-bark)' }}><X size={20} /></button>
            </div>
            
            <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', borderBottom: '1px solid var(--color-bone)' }}>
              <button type="button" onClick={() => setTab('create')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', paddingBottom: '8px', fontWeight: 600, color: tab === 'create' ? 'var(--color-primary)' : 'var(--color-bark)', borderBottom: tab === 'create' ? '2px solid var(--color-primary)' : '2px solid transparent' }}>Create Alert</button>
              <button type="button" onClick={() => setTab('manage')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', paddingBottom: '8px', fontWeight: 600, color: tab === 'manage' ? 'var(--color-primary)' : 'var(--color-bark)', borderBottom: tab === 'manage' ? '2px solid var(--color-primary)' : '2px solid transparent' }}>My Alerts ({savedAlerts.length})</button>
            </div>

            {tab === 'create' ? (
              <>
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
                  <button type="button" className="btn btn-ghost" onClick={() => setIsOpen(false)}>Cancel</button>
                  <button type="button" className="btn btn-primary" onClick={handleSetAlert}>Set Alert</button>
                </div>
              </>
            ) : (
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {savedAlerts.length === 0 ? (
                  <div style={{ textAlign: 'center', color: 'var(--color-bark)', padding: '24px 0' }}>No active alerts.</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {savedAlerts.map((alert, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: 'var(--color-parchment)', borderRadius: '8px', border: '1px solid var(--color-bone)' }}>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{alert.crop}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-bark)' }}>{alert.type === 'above' ? '↑ Above' : '↓ Below'} ₹{alert.price} in {alert.state}</div>
                        </div>
                        <button type="button" onClick={() => handleDeleteAlert(idx)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-danger)', padding: '4px' }} title="Delete Alert"><X size={16} /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Toast */}
      {toastMessage && (
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', backgroundColor: 'var(--color-success)', color: 'white', padding: '12px 24px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', zIndex: 10000, fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Bell size={18} /> {toastMessage}
        </div>
      )}

      {/* Triggered Alert Popup */}
      {triggeredAlerts.length > 0 && (
        <div style={{ position: 'fixed', bottom: '80px', right: '24px', backgroundColor: 'var(--color-danger)', color: 'white', padding: '16px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', zIndex: 10000, maxWidth: '300px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, marginBottom: '8px' }}>
            <Bell size={18} /> Price Alert Triggered!
          </div>
          {triggeredAlerts.map((a, i) => (
            <div key={i} style={{ fontSize: '0.875rem', marginBottom: '8px' }}>
              <strong style={{ display: 'block' }}>{a.crop}</strong>
              Current price ₹{currentPrice.toLocaleString()} is {a.type} your target of ₹{a.price}.
            </div>
          ))}
          <button type="button" onClick={() => setTriggeredAlerts([])} style={{ background: 'white', color: 'var(--color-danger)', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600, marginTop: '8px' }}>Dismiss</button>
        </div>
      )}
    </>
  );
}

