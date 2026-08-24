import re

with open("apps/web/src/app/(app)/topography/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Replace all `center[` with `c[` inside the catch block if my regex failed. Let's just redefine center!
old_catch = """        } catch (error) {
          console.error("Data fetch failed:", error);
          const c = targetLocation || [30.9010, 75.8573];
          const fallbackGeom = [
            [c[0] - 0.002, c[1] - 0.002],
            [center[0] + 0.002, center[1] - 0.002],
            [center[0] + 0.002, center[1] + 0.002],
            [center[0] - 0.002, center[1] + 0.002],
            [center[0] - 0.002, center[1] - 0.002]
          ] as [number, number][];"""

old_catch2 = """        } catch (error) {
          console.error("Data fetch failed:", error);
          const fallbackGeom = [
            [center[0] - 0.002, center[1] - 0.002],
            [center[0] + 0.002, center[1] - 0.002],
            [center[0] + 0.002, center[1] + 0.002],
            [center[0] - 0.002, center[1] + 0.002],
            [center[0] - 0.002, center[1] - 0.002]
          ] as [number, number][];"""

new_catch = """        } catch (error) {
          console.error("Data fetch failed:", error);
          const center = targetLocation || [30.9010, 75.8573];
          const fallbackGeom = [
            [center[0] - 0.002, center[1] - 0.002],
            [center[0] + 0.002, center[1] - 0.002],
            [center[0] + 0.002, center[1] + 0.002],
            [center[0] - 0.002, center[1] + 0.002],
            [center[0] - 0.002, center[1] - 0.002]
          ] as [number, number][];"""

if old_catch in content:
    content = content.replace(old_catch, new_catch)
elif old_catch2 in content:
    content = content.replace(old_catch2, new_catch)
else:
    # try broader replace inside catch
    content = re.sub(r'\} catch \(error\) \{\s*console\.error\("Data fetch failed:", error\);\s*const (c = targetLocation \|\| \[.*?\];\s*)?const fallbackGeom = \[\s*\[.*?\],\s*\[.*?\],\s*\[.*?\],\s*\[.*?\],\s*\[.*?\]\s*\] as \[number, number\]\[\];', new_catch, content, flags=re.DOTALL)

with open("apps/web/src/app/(app)/topography/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Fixed Topo Var 2")
