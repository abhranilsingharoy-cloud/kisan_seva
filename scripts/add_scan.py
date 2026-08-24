import re

with open("apps/web/src/app/(app)/topography/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

old_scan = """        // Simulate a progressive "scan" by setting zones with a slight delay
        setZones(newZones);"""

new_scan = """        // Simulate a progressive "scan" by revealing zones one by one
        const scanZones = async () => {
          for (let i = 1; i <= newZones.length; i++) {
            setZones(newZones.slice(0, i));
            await new Promise(r => setTimeout(r, 100));
          }
        };
        scanZones();"""

content = content.replace(old_scan, new_scan)

with open("apps/web/src/app/(app)/topography/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Added scanning animation")
