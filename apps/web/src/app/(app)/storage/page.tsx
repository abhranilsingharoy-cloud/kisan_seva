'use client';

import React, { useState, useCallback, useEffect } from 'react';
import {
  MapPin,
  ThermometerSnowflake,
  Search,
  Locate,
  Phone,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  Package,
  Navigation,
  X,
  CheckCircle2,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface ColdStorage {
  id: string;
  name: string;
  address: string;
  lat: number;
  lon: number;
  distanceKm: number;
  phone?: string;
  website?: string;
  openingHours?: string;
  tags: Record<string, string>;
  mapsUrl: string;
}

type Status = 'idle' | 'locating' | 'searching' | 'done' | 'error';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function mapsUrl(lat: number, lon: number, name: string) {
  return `https://www.google.com/maps/search/${encodeURIComponent(name)}/@${lat},${lon},15z`;
}

// ─── Overpass query — fetches real cold storage from OpenStreetMap ─────────────
async function fetchNearby(lat: number, lon: number, radiusKm = 50): Promise<ColdStorage[]> {
  const r = radiusKm * 1000; // metres
  // OSM tags for cold storage / refrigerated warehouses
  const query = `
    [out:json][timeout:25];
    (
      node["amenity"="cold_storage"](around:${r},${lat},${lon});
      node["building"="cold_storage"](around:${r},${lat},${lon});
      node["industrial"="cold_storage"](around:${r},${lat},${lon});
      node["man_made"="storage_tank"]["substance"="cold"](around:${r},${lat},${lon});
      way["amenity"="cold_storage"](around:${r},${lat},${lon});
      way["building"="cold_storage"](around:${r},${lat},${lon});
      way["industrial"="cold_storage"](around:${r},${lat},${lon});
      node["name"~"cold storage",i](around:${r},${lat},${lon});
      node["name"~"sheetgriha",i](around:${r},${lat},${lon});
      node["name"~"refrigerat",i]["amenity"~"storage|warehouse"](around:${r},${lat},${lon});
      way["name"~"cold storage",i](around:${r},${lat},${lon});
      way["name"~"sheetgriha",i](around:${r},${lat},${lon});
    );
    out center tags;
  `;

  const res = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    body: query,
  });

  if (!res.ok) throw new Error('Overpass API error');

  const data = await res.json();

  const results: ColdStorage[] = (data.elements as any[])
    .map((el: any) => {
      const elLat = el.lat ?? el.center?.lat;
      const elLon = el.lon ?? el.center?.lon;
      if (!elLat || !elLon) return null;

      const tags = el.tags ?? {};
      const name =
        tags.name ||
        tags['name:en'] ||
        tags['name:hi'] ||
        'Cold Storage Facility';
      const address = [
        tags['addr:housenumber'],
        tags['addr:street'],
        tags['addr:city'] || tags['addr:district'],
        tags['addr:state'],
      ]
        .filter(Boolean)
        .join(', ');

      return {
        id: String(el.id),
        name,
        address: address || 'Address not listed',
        lat: elLat,
        lon: elLon,
        distanceKm: haversineKm(lat, lon, elLat, elLon),
        phone: tags.phone || tags['contact:phone'],
        website: tags.website || tags['contact:website'],
        openingHours: tags.opening_hours,
        tags,
        mapsUrl: mapsUrl(elLat, elLon, name),
      } as ColdStorage;
    })
    .filter(Boolean) as ColdStorage[];

  // Deduplicate by name+lat proximity and sort by distance
  const seen = new Set<string>();
  return results
    .filter((f) => {
      const key = `${f.name.toLowerCase().slice(0, 20)}_${f.lat.toFixed(2)}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, 30);
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ColdStoragePage() {
  const [status, setStatus] = useState<Status>('idle');
  const [results, setResults] = useState<ColdStorage[]>([]);
  const [error, setError] = useState('');
  const [userLat, setUserLat] = useState<number | null>(null);
  const [userLon, setUserLon] = useState<number | null>(null);
  const [cityName, setCityName] = useState('');
  const [manualCity, setManualCity] = useState('');
  const [radiusKm, setRadiusKm] = useState(50);
  const [selected, setSelected] = useState<ColdStorage | null>(null);

  // Reverse-geocode to get city name
  const reversGeocode = async (lat: number, lon: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
      );
      const data = await res.json();
      setCityName(
        data.address?.city ||
          data.address?.town ||
          data.address?.district ||
          data.address?.state ||
          'your location'
      );
    } catch {
      setCityName('your location');
    }
  };

  // Geocode a typed city name to lat/lon
  const geocodeCity = async (city: string): Promise<{ lat: number; lon: number } | null> => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city + ', India')}&format=json&limit=1`
      );
      const data = await res.json();
      if (!data.length) return null;
      return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
    } catch {
      return null;
    }
  };

  const search = useCallback(async (lat: number, lon: number) => {
    setStatus('searching');
    setResults([]);
    setError('');
    try {
      const facilities = await fetchNearby(lat, lon, radiusKm);
      setResults(facilities);
      setStatus('done');
    } catch (e: any) {
      setError('Failed to fetch cold storage data. Please try again.');
      setStatus('error');
    }
  }, [radiusKm]);

  const handleGPS = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      setStatus('error');
      return;
    }
    setStatus('locating');
    setError('');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserLat(latitude);
        setUserLon(longitude);
        await reversGeocode(latitude, longitude);
        search(latitude, longitude);
      },
      (err) => {
        setError('Could not access GPS. Please type your city name below.');
        setStatus('error');
      },
      { timeout: 10000, maximumAge: 60000 }
    );
  };

  const handleManualSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCity.trim()) return;
    setStatus('locating');
    const coords = await geocodeCity(manualCity.trim());
    if (!coords) {
      setError(`Could not find "${manualCity}". Try a different city name.`);
      setStatus('error');
      return;
    }
    setUserLat(coords.lat);
    setUserLon(coords.lon);
    setCityName(manualCity);
    search(coords.lat, coords.lon);
  };

  return (
    <div style={{ background: '#f0f4f0', minHeight: '100vh', paddingBottom: 100 }}>
      {/* Header */}
      <div style={{ background: '#fff', padding: '28px 24px 20px', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#2d6a27', marginBottom: 4 }}>
            <ThermometerSnowflake size={20} />
            <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Live Location Search
            </span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#111827', margin: '0 0 6px', letterSpacing: '-0.03em' }}>
            Cold Storage Finder
          </h1>
          <p style={{ color: '#6b7280', fontSize: '0.95rem', margin: '0 0 20px' }}>
            Find real cold storage facilities near you using live OpenStreetMap data
          </p>

          {/* Search Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* GPS button */}
            <button
              onClick={handleGPS}
              disabled={status === 'locating' || status === 'searching'}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                padding: '14px 24px', background: '#2d6a27', color: '#fff',
                border: 'none', borderRadius: 12, fontWeight: 700, fontSize: '1rem',
                cursor: status === 'locating' || status === 'searching' ? 'not-allowed' : 'pointer',
                opacity: status === 'locating' || status === 'searching' ? 0.7 : 1,
                transition: 'opacity 0.2s'
              }}
            >
              {status === 'locating' ? (
                <RefreshCw size={20} style={{ animation: 'spin 1s linear infinite' }} />
              ) : (
                <Locate size={20} />
              )}
              {status === 'locating' ? 'Getting your location…' :
               status === 'searching' ? 'Searching nearby facilities…' :
               'Use My GPS Location'}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
              <span style={{ color: '#9ca3af', fontSize: '0.8rem', fontWeight: 600 }}>OR ENTER CITY</span>
              <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
            </div>

            {/* Manual city search */}
            <form onSubmit={handleManualSearch} style={{ display: 'flex', gap: 10 }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <Search style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} size={18} />
                <input
                  type="text"
                  placeholder="e.g. Vidisha, Bhopal, Nagpur…"
                  value={manualCity}
                  onChange={e => setManualCity(e.target.value)}
                  style={{
                    width: '100%', padding: '13px 16px 13px 42px',
                    borderRadius: 12, border: '1px solid #d1d5db',
                    outline: 'none', fontSize: '0.95rem', boxSizing: 'border-box'
                  }}
                />
              </div>
              <button
                type="submit"
                disabled={!manualCity.trim() || status === 'searching'}
                style={{
                  padding: '0 20px', background: '#fff',
                  border: '1px solid #d1d5db', borderRadius: 12,
                  fontWeight: 700, color: '#374151', cursor: 'pointer'
                }}
              >
                Search
              </button>
            </form>

            {/* Radius selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: '0.85rem', color: '#6b7280', fontWeight: 600, whiteSpace: 'nowrap' }}>
                Search radius:
              </span>
              {[25, 50, 100, 200].map(km => (
                <button
                  key={km}
                  onClick={() => setRadiusKm(km)}
                  style={{
                    padding: '6px 14px', borderRadius: 20, border: 'none',
                    fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer',
                    background: radiusKm === km ? '#2d6a27' : '#f3f4f6',
                    color: radiusKm === km ? '#fff' : '#4b5563',
                    transition: 'all 0.15s'
                  }}
                >
                  {km} km
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 900, margin: '24px auto', padding: '0 24px' }}>

        {/* Error */}
        {status === 'error' && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12, padding: '16px 20px', display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 24 }}>
            <AlertCircle size={20} style={{ color: '#dc2626', flexShrink: 0, marginTop: 1 }} />
            <div>
              <div style={{ fontWeight: 700, color: '#991b1b', marginBottom: 4 }}>Search failed</div>
              <div style={{ color: '#dc2626', fontSize: '0.9rem' }}>{error}</div>
            </div>
          </div>
        )}

        {/* Searching spinner */}
        {status === 'searching' && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <RefreshCw size={40} style={{ color: '#2d6a27', animation: 'spin 1s linear infinite', margin: '0 auto 16px', display: 'block' }} />
            <p style={{ color: '#6b7280', fontSize: '1rem', fontWeight: 600 }}>
              Scanning OpenStreetMap data within {radiusKm} km…
            </p>
          </div>
        )}

        {/* Results */}
        {status === 'done' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', margin: 0 }}>
                {results.length > 0
                  ? `${results.length} facilities found near ${cityName}`
                  : `No cold storage found within ${radiusKm} km of ${cityName}`}
              </h2>
              {results.length > 0 && (
                <button
                  onClick={() => userLat && userLon && search(userLat, userLon)}
                  style={{ background: 'none', border: 'none', color: '#2d6a27', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.875rem' }}
                >
                  <RefreshCw size={14} /> Refresh
                </button>
              )}
            </div>

            {results.length === 0 && (
              <div style={{ background: '#fff', borderRadius: 16, padding: '40px 24px', textAlign: 'center' }}>
                <ThermometerSnowflake size={48} style={{ color: '#d1d5db', margin: '0 auto 16px', display: 'block' }} />
                <p style={{ color: '#6b7280', fontSize: '0.95rem', marginBottom: 12 }}>
                  No cold storage facilities are mapped on OpenStreetMap yet in this area.
                </p>
                <p style={{ color: '#9ca3af', fontSize: '0.85rem' }}>
                  Try expanding the search radius to 100 km or 200 km, or search a nearby larger city.
                </p>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
              {results.map(facility => (
                <div
                  key={facility.id}
                  style={{
                    background: '#fff', borderRadius: 16,
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    overflow: 'hidden',
                    transition: 'box-shadow 0.2s',
                    display: 'flex', flexDirection: 'column'
                  }}
                >
                  {/* Card header */}
                  <div style={{ background: 'linear-gradient(135deg, #1e5631 0%, #2d6a27 100%)', padding: '20px 20px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                      <div style={{ width: 40, height: 40, background: 'rgba(255,255,255,0.15)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <ThermometerSnowflake size={20} style={{ color: '#fff' }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#fff', margin: '0 0 4px', lineHeight: 1.3 }}>
                          {facility.name}
                        </h3>
                        <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>
                          📍 {facility.distanceKm.toFixed(1)} km away
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card body */}
                  <div style={{ padding: '16px 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, color: '#6b7280', fontSize: '0.85rem' }}>
                      <MapPin size={14} style={{ flexShrink: 0, marginTop: 2, color: '#9ca3af' }} />
                      <span>{facility.address !== 'Address not listed'
                        ? facility.address
                        : `Approx. ${facility.distanceKm.toFixed(1)} km from ${cityName}`}
                      </span>
                    </div>

                    {facility.phone && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', color: '#374151' }}>
                        <Phone size={14} style={{ color: '#9ca3af' }} />
                        <a href={`tel:${facility.phone}`} style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 600 }}>
                          {facility.phone}
                        </a>
                      </div>
                    )}

                    {facility.openingHours && (
                      <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                        🕐 {facility.openingHours}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div style={{ padding: '12px 20px 16px', display: 'flex', gap: 10, borderTop: '1px solid #f3f4f6' }}>
                    <a
                      href={facility.mapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                        padding: '10px 0', background: '#2d6a27', color: '#fff',
                        borderRadius: 10, fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none'
                      }}
                    >
                      <Navigation size={15} /> Get Directions
                    </a>
                    {facility.website && (
                      <a
                        href={facility.website.startsWith('http') ? facility.website : `https://${facility.website}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          padding: '10px 14px', background: '#f3f4f6', color: '#374151',
                          borderRadius: 10, textDecoration: 'none'
                        }}
                      >
                        <ExternalLink size={16} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Idle state */}
        {status === 'idle' && (
          <div style={{ background: '#fff', borderRadius: 20, padding: '48px 32px', textAlign: 'center' }}>
            <div style={{ width: 72, height: 72, background: '#f0fdf4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <ThermometerSnowflake size={36} style={{ color: '#2d6a27' }} />
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#111827', marginBottom: 10 }}>
              Find Real Cold Storage Near You
            </h2>
            <p style={{ color: '#6b7280', fontSize: '0.95rem', lineHeight: 1.6, maxWidth: 420, margin: '0 auto 8px' }}>
              Uses live <strong>OpenStreetMap</strong> data to find actual cold storage facilities within your chosen radius.
            </p>
            <p style={{ color: '#9ca3af', fontSize: '0.82rem' }}>
              Tap "Use My GPS Location" above or type your city name to start searching.
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
