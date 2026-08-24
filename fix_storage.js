const fs = require('fs');
let content = fs.readFileSync('apps/web/src/app/(app)/resources/StorageTab.tsx', 'utf-8');
const regex = /async function fetchNearby\(lat: number, lon: number, radiusKm: number\): Promise<\{results: ColdStorage\[\], isFallback: boolean\}> \{[\s\S]*?return \{ results, isFallback \};\r?\n\}/;

const newFunc = `async function fetchNearby(lat: number, lon: number, radiusKm: number): Promise<{results: ColdStorage[], isFallback: boolean}> {
  const r = radiusKm * 1000;
  let results: ColdStorage[] = [];
  let isFallback = false;

  const query = \`[out:json][timeout:15];(node["amenity"="cold_storage"](around:\${r},\${lat},\${lon});way["amenity"="cold_storage"](around:\${r},\${lat},\${lon});relation["amenity"="cold_storage"](around:\${r},\${lat},\${lon});node["building"="cold_storage"](around:\${r},\${lat},\${lon});node["name"~"cold storage",i](around:\${r},\${lat},\${lon});node["name"~"sheetgriha",i](around:\${r},\${lat},\${lon}););out center tags;\`;

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

          // deduplicate
          const key = \`\${name}-\${Math.round(elLat * 1000)}-\${Math.round(elLon * 1000)}\`;
          if (seen.has(key)) continue;
          seen.add(key);

          results.push({
            id: \`osm-\${el.id}\`,
            name,
            address: tags['addr:full'] || tags['addr:street'] || tags['addr:city'] || (dist < 2 ? 'Nearby' : 'Regional Facility'),
            lat: elLat,
            lon: elLon,
            distanceKm: dist,
            phone: tags.phone || tags.contact,
            website: tags.website,
            operator: tags.operator,
            capacity: tags.capacity,
            mapsUrl: \`https://www.google.com/maps/search/?api=1&query=\${elLat},\${elLon}\`
          });
        }
      }
    }
  } catch (err) {
    console.warn("Overpass API failed, will use fallback data");
  }

  // If no results from OSM within radius, or if API failed, show the closest 3 from fallback (even if > radiusKm)
  if (results.length === 0) {
    isFallback = true;
    const fallbackWithDist = FALLBACK_STORAGES.map(s => {
      const d = haversineKm(lat, lon, s.lat, s.lon);
      return { ...s, distanceKm: d, mapsUrl: \`https://www.google.com/maps/search/?api=1&query=\${s.lat},\${s.lon}\` };
    });
    // Sort by distance and take the closest 3
    fallbackWithDist.sort((a, b) => a.distanceKm - b.distanceKm);
    results = fallbackWithDist.slice(0, 3);
  } else {
    results.sort((a, b) => a.distanceKm - b.distanceKm);
  }

  return { results, isFallback };
}`;

if (regex.test(content)) {
    content = content.replace(regex, newFunc);
    fs.writeFileSync('apps/web/src/app/(app)/resources/StorageTab.tsx', content);
    console.log("Fixed StorageTab with Node!");
} else {
    console.log("Could not find the function to replace");
}
`
