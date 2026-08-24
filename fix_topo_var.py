import re

with open("apps/web/src/app/(app)/topography/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

bad_catch_block = """        } catch (error) {
          console.error("Data fetch failed:", error);
          const fallbackGeom = [
            [center[0] - 0.002, center[1] - 0.002],"""

good_catch_block = """        } catch (error) {
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
            coordinates: fallbackGeom
          }]);
        } finally {"""

content = re.sub(r"        \} catch \(error\) \{\n          console\.error\(\"Data fetch failed:\", error\);\n          const fallbackGeom = \[\n            \[center\[0\] - 0\.002, center\[1\] - 0\.002\],", """        } catch (error) {
          console.error("Data fetch failed:", error);
          const c = targetLocation || [30.9010, 75.8573];
          const fallbackGeom = [
            [c[0] - 0.002, c[1] - 0.002],""", content)
            
content = re.sub(r"            \[center\[0\] \+ 0\.002, center\[1\] - 0\.002\],\n            \[center\[0\] \+ 0\.002, center\[1\] \+ 0\.002\],\n            \[center\[0\] - 0\.002, center\[1\] \+ 0\.002\],\n            \[center\[0\] - 0\.002, center\[1\] - 0\.002\]\n          \] as \[number, number\]\[\];", """            [c[0] + 0.002, c[1] - 0.002],
            [c[0] + 0.002, c[1] + 0.002],
            [c[0] - 0.002, c[1] + 0.002],
            [c[0] - 0.002, c[1] - 0.002]
          ] as [number, number][];""", content)

with open("apps/web/src/app/(app)/topography/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Fixed Topo Var")
