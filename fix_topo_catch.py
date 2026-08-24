import re

with open("apps/web/src/app/(app)/topography/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

bad_catch_block = r"      \} catch \(error\) \{\n        console\.error\(\"Data fetch failed:\", error\);\n          const fallbackGeom = \[\n            \[center\[0\] - 0\.002, center\[1\] - 0\.002\],\n            \[c\[0\] \+ 0\.002, c\[1\] - 0\.002\],\n            \[c\[0\] \+ 0\.002, c\[1\] \+ 0\.002\],\n            \[c\[0\] - 0\.002, c\[1\] \+ 0\.002\],\n            \[c\[0\] - 0\.002, c\[1\] - 0\.002\]\n          \] as \[number, number\]\[\];\n          setZones\(\[\{\n            id: 'fb_err',\n            name: 'Estimated Local Plot',\n            crop: 'Analyzed Field',\n            area: 'Estimated',\n            health: 75,\n            ndvi: 0\.72,\n            issue: 'Offline telemetry fallback active\.',\n            coordinates: fallbackGeom"

good_catch_block = """      } catch (error) {
        console.error("Data fetch failed:", error);
        const c = targetLocation || [30.9010, 75.8573];
        const fallbackGeom = [
          [c[0] - 0.002, c[1] - 0.002],
          [c[0] + 0.002, c[1] - 0.002],
          [c[0] + 0.002, c[1] + 0.002],
          [c[0] - 0.002, c[1] + 0.002],
          [c[0] - 0.002, c[1] - 0.002]
        ] as [number, number][];
        setZones([{
          id: 'fb_err',
          name: 'Estimated Local Plot',
          crop: 'Analyzed Field',
          area: 'Estimated',
          health: 75,
          ndvi: 0.72,
          issue: 'Offline telemetry fallback active.',
          coordinates: fallbackGeom"""

content = re.sub(bad_catch_block, good_catch_block, content, flags=re.DOTALL)

with open("apps/web/src/app/(app)/topography/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Fixed catch correctly")
