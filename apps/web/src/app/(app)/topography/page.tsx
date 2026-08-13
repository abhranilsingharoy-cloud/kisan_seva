'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import type { Zone } from '@/components/FarmMap';
import {
  Map as MapIcon,
  Layers,
  Satellite,
  Activity,
  AlertTriangle,
  CheckCircle2,
  ThermometerSun,
  Droplets,
  XCircle,
  MapPin,
  Search,
  Loader2,
  LocateFixed,
  Radio
} from 'lucide-react';

const FarmMap = dynamic(() => import('@/components/FarmMap'), {
  ssr: false,
  loading: () => (
    <div style={{ height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f172a' }}>
      <div style={{ textAlign: 'center', color: '#94a3b8' }}>
        <div style={{ width: '48px', height: '48px', border: '3px solid #1e293b', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
        <div style={{ fontWeight: 700, fontSize: '1rem', color: '#f8fafc' }}>Initializing Satellite Uplink…</div>
      </div>
    </div>
  )
});

// Procedural Farm Zone Generator
function generateZonesForLocation(lat: number, lng: number): Zone[] {
  // Size of the zone in decimal degrees (~300 meters)
  const dLat = 0.003; 
  const dLng = 0.0035; 
  const gap = 0.0005; // Gap between zones

  // Randomize health so each new location looks unique
  const randH = () => Math.floor(Math.random() * (95 - 25 + 1)) + 25; 
  
  const genIssue = (h: number) => {
    if (h > 75) return 'Optimal growth parameters. No issues detected.';
    if (h > 50) return 'Moderate stress. Monitor soil moisture levels closely.';
    if (h > 35) return 'Water stress detected. Irrigation recommended within 48h.';
    return 'Critical health degradation. Immediate intervention required.';
  };

  const z1h = randH(), z2h = randH(), z3h = randH(), z4h = randH();

  return [
    {
      id: 'z_alpha', name: 'Zone Alpha', crop: 'Wheat / Cereals', area: '3.2 Acres',
      health: z1h, ndvi: (z1h / 100) * 0.95, issue: genIssue(z1h),
      // North-West
      coordinates: [
        [lat + gap, lng - gap - dLng], [lat + gap + dLat, lng - gap - dLng],
        [lat + gap + dLat, lng - gap], [lat + gap, lng - gap]
      ]
    },
    {
      id: 'z_beta', name: 'Zone Beta', crop: 'Rice Paddy', area: '2.8 Acres',
      health: z2h, ndvi: (z2h / 100) * 0.95, issue: genIssue(z2h),
      // South-West
      coordinates: [
        [lat - gap - dLat, lng - gap - dLng], [lat - gap, lng - gap - dLng],
        [lat - gap, lng - gap], [lat - gap - dLat, lng - gap]
      ]
    },
    {
      id: 'z_gamma', name: 'Zone Gamma', crop: 'Sugarcane', area: '4.1 Acres',
      health: z3h, ndvi: (z3h / 100) * 0.95, issue: genIssue(z3h),
      // North-East
      coordinates: [
        [lat + gap, lng + gap], [lat + gap + dLat, lng + gap],
        [lat + gap + dLat, lng + gap + dLng], [lat + gap, lng + gap + dLng]
      ]
    },
    {
      id: 'z_delta', name: 'Zone Delta', crop: 'Mixed Vegetables', area: '1.9 Acres',
      health: z4h, ndvi: (z4h / 100) * 0.95, issue: genIssue(z4h),
      // South-East
      coordinates: [
        [lat - gap - dLat, lng + gap], [lat - gap, lng + gap],
        [lat - gap, lng + gap + dLng], [lat - gap - dLat, lng + gap + dLng]
      ]
    }
  ];
}

const DEFAULT_CENTER: [number, number] = [30.9192, 75.8570];

// Hook to simulate live real-time satellite telemetry
function useLiveTelemetry(targetLocation: [number, number] | null) {
  const [zones, setZones] = useState<Zone[]>([]);
  const [lastSync, setLastSync] = useState<Date>(new Date());
  
  // 1. When target location changes, generate new farm zones!
  useEffect(() => {
    const center = targetLocation || DEFAULT_CENTER;
    setZones(generateZonesForLocation(center[0], center[1]));
  }, [targetLocation]);

  // 2. Continuous telemetry ping
  useEffect(() => {
    const interval = setInterval(() => {
      setZones(currentZones => currentZones.map(zone => {
        // Random drift between -1.5% and +1.5%
        const drift = (Math.random() - 0.5) * 3;
        let newHealth = zone.health + drift;
        newHealth = Math.max(10, Math.min(100, newHealth)); // Clamp between 10-100
        
        return {
          ...zone,
          health: newHealth,
          ndvi: newHealth / 100 * 0.95 
        };
      }));
      setLastSync(new Date());
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  return { zones, lastSync };
}

function StatPill({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ flex: 1, padding: '12px 16px', backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.07)', textAlign: 'center' }}>
      <div style={{ fontSize: '1.25rem', fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
    </div>
  );
}

export default function TopographyPage() {
  const [isNDVI, setIsNDVI] = useState(true);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [mounted, setMounted] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  
  const [targetLocation, setTargetLocation] = useState<[number, number] | null>(null);
  const [locationName, setLocationName] = useState('Ludhiana District, Punjab, India');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Connect Live Telemetry powered by procedural generation
  const { zones, lastSync } = useLiveTelemetry(targetLocation);
  
  // Calculate dynamic average health
  const averageHealth = zones.length > 0 ? (zones.reduce((acc, z) => acc + z.health, 0) / zones.length).toFixed(1) : "0.0";

  // Calculate dynamic alerts based on live health
  const liveAlerts = zones
    .filter(z => z.health < 60)
    .sort((a, b) => a.health - b.health)
    .map(z => ({
      color: z.health < 45 ? '#ef4444' : '#eab308',
      bg: z.health < 45 ? 'rgba(239,68,68,0.12)' : 'rgba(234,179,8,0.12)',
      border: z.health < 45 ? 'rgba(239,68,68,0.25)' : 'rgba(234,179,8,0.25)',
      icon: z.health < 45 ? <Droplets size={18} color="#ef4444" /> : <ThermometerSun size={18} color="#eab308" />,
      title: `${z.name}: ${z.health < 45 ? 'Critical Stress' : 'Moderate Stress'}`,
      desc: `Live NDVI reads ${z.ndvi.toFixed(2)}. ${z.issue}`
    }));
    
  if (liveAlerts.length === 0 && zones.length > 0) {
    liveAlerts.push({
      color: '#10b981', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.25)',
      icon: <CheckCircle2 size={18} color="#10b981" />,
      title: 'All Zones Optimal', desc: 'No critical stress detected in the current telemetry scan.'
    });
  }

  // Ensure selected zone stays updated with live data if open
  const currentSelectedZone = selectedZone ? zones.find(z => z.id === selectedZone.id) || null : null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1&countrycodes=in`, {
        headers: { 'Accept': 'application/json', 'User-Agent': 'KisanSeva-Web-App' }
      });
      const data = await res.json();
      
      if (data && data.length > 0) {
        const result = data[0];
        setTargetLocation([parseFloat(result.lat), parseFloat(result.lon)]);
        setLocationName(result.display_name.split(',').slice(0, 3).join(','));
        setSearchQuery('');
        setSelectedZone(null); // Clear selected zone on move
      } else {
        alert("Location not found.");
      }
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleLocateMe = () => {
    if (!navigator.geolocation) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setTargetLocation([pos.coords.latitude, pos.coords.longitude]);
        setLocationName("Your Current Location");
        setSelectedZone(null); // Clear selected zone on move
        setIsLocating(false);
      },
      () => {
        alert("Could not fetch location.");
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#020617', fontFamily: "'Inter', system-ui, sans-serif", overflow: 'hidden' }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        @keyframes pulse-fast { 0%,100%{opacity:1} 50%{opacity:0.3} }
        .live-badge { animation: pulse-fast 1s infinite; }
      `}</style>

      {/* ── Dark Header ── */}
      <header style={{ padding: '14px 28px', backgroundColor: '#0f172a', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0, zIndex: 10000 }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <MapIcon size={22} color="#3b82f6" /> Farm Topography & NDVI
          </h1>
          <div style={{ color: '#64748b', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '4px', padding: '2px 8px', fontSize: '0.7rem', fontWeight: 800 }}>
              <Radio size={12} className="live-badge" /> LIVE
            </span>
            <span>{mounted ? lastSync.toLocaleTimeString() : 'Connecting...'} · {locationName}</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button onClick={handleLocateMe} disabled={isLocating} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', cursor: 'pointer', color: '#3b82f6' }} title="Locate Me">
            {isLocating ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <LocateFixed size={18} />}
          </button>

          <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '4px 12px', width: '240px' }}>
            {isSearching ? <Loader2 size={16} color="#94a3b8" style={{ animation: 'spin 1s linear infinite' }} /> : <Search size={16} color="#94a3b8" />}
            <input type="text" placeholder="Search places..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ background: 'transparent', border: 'none', color: '#f8fafc', padding: '6px 8px', width: '100%', fontSize: '0.85rem', outline: 'none' }} />
            <input type="submit" style={{ display: 'none' }} />
          </form>

          <div style={{ display: 'flex', backgroundColor: '#1e293b', borderRadius: '8px', padding: '3px', border: '1px solid #334155', gap: '2px' }}>
            <button type="button" onClick={() => setIsNDVI(false)} style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '6px 14px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', backgroundColor: !isNDVI ? '#3b82f6' : 'transparent', color: !isNDVI ? '#fff' : '#64748b' }}>
              <Satellite size={15} /> Satellite
            </button>
            <button type="button" onClick={() => setIsNDVI(true)} style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '6px 14px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', backgroundColor: isNDVI ? '#16a34a' : 'transparent', color: isNDVI ? '#fff' : '#64748b' }}>
              <Layers size={15} /> High-Res NDVI
            </button>
          </div>
        </div>
      </header>

      {/* ── Map + Overlay ── */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>

        <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
          <FarmMap isNDVI={isNDVI} zones={zones} onZoneSelect={setSelectedZone} targetLocation={targetLocation} />
        </div>

        {/* Legend */}
        {isNDVI && (
          <div style={{ position: 'absolute', bottom: '28px', left: '24px', zIndex: 9999, backgroundColor: 'rgba(15,23,42,0.88)', backdropFilter: 'blur(14px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '14px 18px', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Pixel NDVI Index</div>
            {[['#16a34a','0.75 – 1.0','Healthy'],['#84cc16','0.5 – 0.74','Moderate'],['#eab308','0.25 – 0.49','Stressed'],['#ef4444','0 – 0.24','Critical']].map(([c, range, label]) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <div style={{ width: '16px', height: '16px', borderRadius: '4px', backgroundColor: c }} />
                <div>
                  <span style={{ fontWeight: 600, fontSize: '0.78rem', color: '#e2e8f0' }}>{label}</span>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', marginLeft: '6px' }}>{range}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Selected Zone Popover */}
        {currentSelectedZone && (
          <div style={{ position: 'absolute', bottom: '28px', left: '50%', transform: 'translateX(-50%)', zIndex: 9999, backgroundColor: 'rgba(15,23,42,0.95)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', padding: '18px 22px', boxShadow: '0 8px 40px rgba(0,0,0,0.6)', minWidth: '340px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#f8fafc' }}>{currentSelectedZone.name}</div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px' }}>🌾 {currentSelectedZone.crop} · 📐 {currentSelectedZone.area}</div>
              </div>
              <button onClick={() => setSelectedZone(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><XCircle size={18} /></button>
            </div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
              <StatPill label="Live Health" value={`${currentSelectedZone.health.toFixed(1)}%`} color={currentSelectedZone.health >= 70 ? '#10b981' : currentSelectedZone.health >= 45 ? '#eab308' : '#ef4444'} />
              <StatPill label="Live NDVI" value={currentSelectedZone.ndvi.toFixed(2)} color="#3b82f6" />
            </div>
          </div>
        )}

        {/* Live Analytics Panel */}
        <div style={{ position: 'absolute', top: '20px', right: '20px', width: '320px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '12px', pointerEvents: 'none' }}>

          <div style={{ backgroundColor: 'rgba(15,23,42,0.88)', backdropFilter: 'blur(14px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '18px', boxShadow: '0 8px 32px rgba(0,0,0,0.5)', pointerEvents: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Activity size={13} /> Live Farm Health Index
              </div>
              <Radio size={14} color="#10b981" className="live-badge" />
            </div>
            
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '12px' }}>
              <span style={{ fontSize: '3rem', fontWeight: 900, lineHeight: 1, color: Number(averageHealth) > 70 ? '#10b981' : (Number(averageHealth) > 40 ? '#eab308' : '#ef4444') }}>{averageHealth}%</span>
            </div>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
              <StatPill label="Healthy" value={`${zones.filter(z=>z.health>=60).length} Zones`} color="#10b981" />
              <StatPill label="Critical" value={`${zones.filter(z=>z.health<60).length} Zones`} color="#ef4444" />
            </div>
          </div>

          <div style={{ backgroundColor: 'rgba(15,23,42,0.88)', backdropFilter: 'blur(14px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '18px', boxShadow: '0 8px 32px rgba(0,0,0,0.5)', pointerEvents: 'auto' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertTriangle size={13} /> Live Telemetry Alerts
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {liveAlerts.slice(0, 3).map((a, i) => (
                <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '10px', backgroundColor: a.bg, border: `1px solid ${a.border}`, borderRadius: '8px' }}>
                  <div style={{ flexShrink: 0, marginTop: '1px' }}>{a.icon}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.82rem', color: a.color, marginBottom: '3px' }}>{a.title}</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', lineHeight: 1.5 }}>{a.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
