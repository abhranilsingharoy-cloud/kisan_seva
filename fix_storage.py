import re

with open("apps/web/src/app/(app)/resources/StorageTab.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Fix the query string
bad_query = r'const query = \[out:json\]\[timeout:15\];\(node\["amenity"="cold_storage"\]\(around:,,.*?out center tags;;'
good_query = 'const query = `[out:json][timeout:15];(node["amenity"="cold_storage"](around:${r},${lat},${lon});way["amenity"="cold_storage"](around:${r},${lat},${lon});relation["amenity"="cold_storage"](around:${r},${lat},${lon});node["building"="cold_storage"](around:${r},${lat},${lon});node["name"~"cold storage",i](around:${r},${lat},${lon});node["name"~"sheetgriha",i](around:${r},${lat},${lon}););out center tags;`;'

content = re.sub(bad_query, good_query, content, flags=re.DOTALL)

with open("apps/web/src/app/(app)/resources/StorageTab.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("StorageTab fixed")
