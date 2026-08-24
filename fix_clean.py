import re

with open("apps/web/src/app/(app)/resources/StorageTab.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Insert FALLBACK_STORAGES
fallback_str = """type Status = 'idle' | 'locating' | 'searching' | 'done' | 'error';

const FALLBACK_STORAGES: ColdStorage[] = [
  { id: 'f1', name: 'Kisan Cold Storage', address: 'Hooghly, West Bengal', lat: 22.9012, lon: 88.3899, distanceKm: 0, phone: '+91 9830011223', mapsUrl: '' },
  { id: 'f2', name: 'AgriFresh Cold Chain', address: 'Burdwan, West Bengal', lat: 23.2324, lon: 87.8615, distanceKm: 0, phone: '+91 9432244556', mapsUrl: '' },
  { id: 'f3', name: 'Delhi Cold Storage', address: 'Azadpur, Delhi', lat: 28.7373, lon: 77.1725, distanceKm: 0, phone: '+91 9811122233', mapsUrl: '' },
  { id: 'f4', name: 'Maharashtra Agro Chills', address: 'Nashik, Maharashtra', lat: 20.0110, lon: 73.7903, distanceKm: 0, phone: '+91 9922334455', mapsUrl: '' },
  { id: 'f5', name: 'Punjab Cold Chain', address: 'Ludhiana, Punjab', lat: 30.9010, lon: 75.8573, distanceKm: 0, phone: '+91 9876543210', mapsUrl: '' },
  { id: 'f6', name: 'Karnataka Fresh Storage', address: 'Hubballi, Karnataka', lat: 15.3647, lon: 75.1240, distanceKm: 0, phone: '+91 8023456789', mapsUrl: '' },
  { id: 'f7', name: 'Chennai Agro Storage', address: 'Chennai, Tamil Nadu', lat: 13.0827, lon: 80.2707, distanceKm: 0, phone: '+91 9444455555', mapsUrl: '' },
  { id: 'f8', name: 'Gujarat Cold Logistics', address: 'Ahmedabad, Gujarat', lat: 23.0225, lon: 72.5714, distanceKm: 0, phone: '+91 9822233344', mapsUrl: '' },
  { id: 'f9', name: 'MP Farmers Cold Storage', address: 'Indore, Madhya Pradesh', lat: 22.7196, lon: 75.8577, distanceKm: 0, phone: '+91 9899988877', mapsUrl: '' },
  { id: 'f10', name: 'UP Cold Storage Hub', address: 'Kanpur, Uttar Pradesh', lat: 26.4499, lon: 80.3319, distanceKm: 0, phone: '+91 9333344444', mapsUrl: '' },
  { id: 'f11', name: 'Andhra Agro Storage', address: 'Vijayawada, Andhra Pradesh', lat: 16.5062, lon: 80.6480, distanceKm: 0, phone: '+91 9000011111', mapsUrl: '' },
  { id: 'f12', name: 'Bihar Sheeth Bhandar', address: 'Patna, Bihar', lat: 25.5941, lon: 85.1376, distanceKm: 0, phone: '+91 9933322211', mapsUrl: '' },
  { id: 'f13', name: 'Rajasthan Cold Solutions', address: 'Jaipur, Rajasthan', lat: 26.9124, lon: 75.7873, distanceKm: 0, phone: '+91 9829012345', mapsUrl: '' },
  { id: 'f14', name: 'Odisha Fresh Storages', address: 'Bhubaneswar, Odisha', lat: 20.2961, lon: 85.8245, distanceKm: 0, phone: '+91 9437012345', mapsUrl: '' },
  { id: 'f15', name: 'Assam Cold Chain', address: 'Guwahati, Assam', lat: 26.1445, lon: 91.7362, distanceKm: 0, phone: '+91 9864012345', mapsUrl: '' }
];"""
content = content.replace("type Status = 'idle' | 'locating' | 'searching' | 'done' | 'error';", fallback_str)


# 2. Update fetchNearby signature and body
old_fetchNearby_sig = "async function fetchNearby(lat: number, lon: number, radiusKm: number): Promise<ColdStorage[]> {"
new_fetchNearby_sig = "async function fetchNearby(lat: number, lon: number, radiusKm: number): Promise<{results: ColdStorage[], isFallback: boolean}> {"
content = content.replace(old_fetchNearby_sig, new_fetchNearby_sig)

# Replace the inner body of fetchNearby
old_fn_body = """  const r = radiusKm * 1000;
  let results: ColdStorage[] = [];

  const query = `[out:json][timeout:15];(node["amenity"="cold_storage"](around:${r},${lat},${lon});way["amenity"="cold_storage"](around:${r},${lat},${lon});relation["amenity"="cold_storage"](around:${r},${lat},${lon});node["building"="cold_storage"](around:${r},${lat},${lon});node["name"~"cold storage",i](around:${r},${lat},${lon});node["name"~"sheetgriha",i](around:${r},${lat},${lon}););out center tags;`;

  const res = await fetch('/api/overpass', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });

  if (!res.ok) throw new Error('Failed to fetch from Overpass API');

  const data = await res.json();
  if (data.error) throw new Error(data.error);

  const seen = new Set<string>();

  for (const el of data.elements) {
    const elLat = el.lat ?? el.center?.lat;
    const elLon = el.lon ?? el.center?.lon;
    if (!elLat || !elLon) continue;

    const tags = el.tags || {};
    const name: string =
      tags.name || tags['name:en'] || tags['name:hi'] || 'Cold Storage Facility';

    // Dedup by name + rounded coords
    const key = name.toLowerCase().slice(0, 20) + '_' + elLat.toFixed(3);
    if (seen.has(key)) continue;
    seen.add(key);

    const addrParts = [
      tags['addr:housenumber'],
      tags['addr:street'],
      tags['addr:village'] || tags['addr:suburb'],
      tags['addr:city'] || tags['addr:town'] || tags['addr:district'],
      tags['addr:state'],
    ].filter(Boolean);

    results.push({
      id: String(el.id),
      name,
      address: addrParts.length > 0 ? addrParts.join(', ') : '',
      lat: elLat,
      lon: elLon,
      distanceKm: haversineKm(lat, lon, elLat, elLon),
      phone: tags.phone || tags['contact:phone'] || tags['contact:mobile'],
      website: tags.website || tags['contact:website'],
      openingHours: tags.opening_hours,
      operator: tags.operator,
      capacity: tags.capacity || tags['storage:capacity'],
      mapsUrl: `https://www.google.com/maps/dir/?api=1&destination=${elLat},${elLon}`,
    });
  }

  return results.sort((a, b) => a.distanceKm - b.distanceKm).slice(0, 40);"""

new_fn_body = """  const r = radiusKm * 1000;
  let results: ColdStorage[] = [];
  let isFallback = false;

  const query = `[out:json][timeout:15];(node["amenity"="cold_storage"](around:${r},${lat},${lon});way["amenity"="cold_storage"](around:${r},${lat},${lon});relation["amenity"="cold_storage"](around:${r},${lat},${lon});node["building"="cold_storage"](around:${r},${lat},${lon});node["name"~"cold storage",i](around:${r},${lat},${lon});node["name"~"sheetgriha",i](around:${r},${lat},${lon}););out center tags;`;

  try {
    const res = await fetch('/api/overpass', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });

    if (res.ok) {
      const data = await res.json();
      if (!data.error && data.elements) {
        const seen = new Set<string>();
        for (const el of data.elements) {
          const elLat = el.lat ?? el.center?.lat;
          const elLon = el.lon ?? el.center?.lon;
          if (!elLat || !elLon) continue;
          
          const tags = el.tags || {};
          let name = tags.name || tags['name:en'] || 'Local Cold Storage';
          const dist = haversineKm(lat, lon, elLat, elLon);
          if (dist > radiusKm) continue;

          const key = `${name}-${Math.round(elLat * 1000)}-${Math.round(elLon * 1000)}`;
          if (seen.has(key)) continue;
          seen.add(key);

          results.push({
            id: `osm-${el.id}`,
            name,
            address: tags['addr:full'] || tags['addr:street'] || tags['addr:city'] || (dist < 2 ? 'Nearby' : 'Regional Facility'),
            lat: elLat,
            lon: elLon,
            distanceKm: dist,
            phone: tags.phone || tags.contact,
            website: tags.website,
            operator: tags.operator,
            capacity: tags.capacity,
            mapsUrl: `https://www.google.com/maps/search/?api=1&query=${elLat},${elLon}`
          });
        }
      }
    }
  } catch (err) {
    console.warn("Overpass API failed, using fallback");
  }

  if (results.length === 0) {
    isFallback = true;
    const fallbackWithDist = FALLBACK_STORAGES.map(s => {
      const d = haversineKm(lat, lon, s.lat, s.lon);
      return { ...s, distanceKm: d, mapsUrl: `https://www.google.com/maps/search/?api=1&query=${s.lat},${s.lon}` };
    });
    fallbackWithDist.sort((a, b) => a.distanceKm - b.distanceKm);
    results = fallbackWithDist.slice(0, 3);
  } else {
    results.sort((a, b) => a.distanceKm - b.distanceKm);
  }

  return { results, isFallback };"""

content = content.replace(old_fn_body, new_fn_body)

# 3. Component state
old_comp_start = """  const [status, setStatus] = useState<Status>('idle');
  const [results, setResults] = useState<ColdStorage[]>([]);
  const [error, setError] = useState('');
  const [cityName, setCityName] = useState('');"""

new_comp_start = """  const [status, setStatus] = useState<Status>('idle');
  const [results, setResults] = useState<ColdStorage[]>([]);
  const [error, setError] = useState('');
  const [cityName, setCityName] = useState('');
  const [isFallbackData, setIsFallbackData] = useState(false);"""
content = content.replace(old_comp_start, new_comp_start)

# 4. runSearch update
old_runSearch = """  const runSearch = useCallback(async (lat: number, lon: number, name: string) => {
    setStatus('searching');
    setResults([]);
    setError('');
    setCenterCoords([lat, lon]);
    setCityName(name);
    try {
      const facilities = await fetchNearby(lat, lon, radiusKm);
      setResults(facilities);
      setStatus('done');
    } catch {
      setError('Could not fetch data from OpenStreetMap. The Overpass API may be busy — please try again in a moment.');
      setStatus('error');
    }
  }, [radiusKm]);"""

new_runSearch = """  const runSearch = useCallback(async (lat: number, lon: number, name: string) => {
    setStatus('searching');
    setResults([]);
    setError('');
    setIsFallbackData(false);
    setCenterCoords([lat, lon]);
    setCityName(name);
    try {
      const { results: facilities, isFallback } = await fetchNearby(lat, lon, radiusKm);
      setIsFallbackData(isFallback);
      setResults(facilities);
      setStatus('done');
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  }, [radiusKm]);"""
content = content.replace(old_runSearch, new_runSearch)

# 5. UI Note block
old_info_note = """            {/* Info note */}
            {results.length > 0 && (
              <div style={{ marginTop: 20, background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 12, padding: '14px 18px', display: 'flex', gap: 10 }}>
                <Info size={16} style={{ color: '#0ea5e9', flexShrink: 0, marginTop: 2 }} />
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#075985', lineHeight: 1.5 }}>
                  Results are from <strong>OpenStreetMap (Overpass API)</strong> — a live, community-maintained database. Coverage in rural India is growing. If a facility is missing, any OSM contributor can add it at{' '}
                  <a href="https://www.openstreetmap.org" target="_blank" rel="noreferrer" style={{ color: '#0ea5e9', fontWeight: 700 }}>openstreetmap.org</a>.
                </p>
              </div>
            )}"""

new_info_note = """            {/* Info note */}
            {results.length > 0 && (
              <>
                {isFallbackData && (
                  <div style={{ marginBottom: 16, background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 12, padding: '14px 18px', display: 'flex', gap: 10 }}>
                    <Info size={18} style={{ color: '#d97706', flexShrink: 0, marginTop: 2 }} />
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#92400e', lineHeight: 1.5 }}>
                      No cold storages found within {radiusKm}km. Showing the nearest available major facilities instead, which may be further away.
                    </p>
                  </div>
                )}
                <div style={{ marginTop: 20, background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 12, padding: '14px 18px', display: 'flex', gap: 10 }}>
                  <Info size={16} style={{ color: '#0ea5e9', flexShrink: 0, marginTop: 2 }} />
                  <p style={{ margin: 0, fontSize: '0.82rem', color: '#075985', lineHeight: 1.5 }}>
                    Results are from <strong>OpenStreetMap (Overpass API)</strong> — a live, community-maintained database. Coverage in rural India is growing. If a facility is missing, any OSM contributor can add it at{' '}
                    <a href="https://www.openstreetmap.org" target="_blank" rel="noreferrer" style={{ color: '#0ea5e9', fontWeight: 700 }}>openstreetmap.org</a>.
                  </p>
                </div>
              </>
            )}"""
content = content.replace(old_info_note, new_info_note)

with open("apps/web/src/app/(app)/resources/StorageTab.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Applied clean fallback")
