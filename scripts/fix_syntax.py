import re

with open('apps/web/src/app/(app)/resources/StorageTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("mapsUrl: https://www.google.com/maps/search/?api=1&query=,", "mapsUrl: `https://www.google.com/maps/search/?api=1&query=${elLat},${elLon}`")
content = content.replace("mapsUrl: https://www.google.com/maps/search/?api=1&query=, };", "mapsUrl: `https://www.google.com/maps/search/?api=1&query=${s.lat},${s.lon}` };")

with open('apps/web/src/app/(app)/resources/StorageTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed syntax")
