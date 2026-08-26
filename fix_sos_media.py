import re

with open('apps/web/src/components/CommunitySOS.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

replacement = """          .sos-floating-btn {
            position: fixed;
            bottom: 120px;
            right: 32px;
            z-index: 99990;
          }"""

content = re.sub(
    r'\.sos-floating-btn \{\s*position: fixed;\s*bottom: 120px;\s*right: 32px;\s*z-index: 99990;\s*\}\s*@media \(min-width: 768px\) \{\s*\.sos-floating-btn \{\s*bottom: 240px;\s*left: 288px;\s*\}\s*\}',
    replacement,
    content,
    flags=re.DOTALL
)

with open('apps/web/src/components/CommunitySOS.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed CSS media query")
