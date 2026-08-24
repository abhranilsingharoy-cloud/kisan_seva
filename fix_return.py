import re

with open("apps/web/src/app/(app)/resources/StorageTab.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Fix the return in fetchNearby
bad_return = "  return results.sort((a, b) => a.distanceKm - b.distanceKm).slice(0, 40);\n}"
good_return = """  let finalResults = results.sort((a, b) => a.distanceKm - b.distanceKm).slice(0, 40);
  let isFallback = false;
  
  if (finalResults.length === 0) {
    isFallback = true;
    const fallbackWithDist = FALLBACK_STORAGES.map(s => {
      const d = haversineKm(lat, lon, s.lat, s.lon);
      return { ...s, distanceKm: d, mapsUrl: `https://www.google.com/maps/search/?api=1&query=${s.lat},${s.lon}` };
    });
    fallbackWithDist.sort((a, b) => a.distanceKm - b.distanceKm);
    finalResults = fallbackWithDist.slice(0, 3);
  }
  
  return { results: finalResults, isFallback };
}"""

content = content.replace(bad_return, good_return)

with open("apps/web/src/app/(app)/resources/StorageTab.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Fixed return")
