import re

with open('apps/web/src/components/CommunitySOS.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

replacement = """          .sos-floating-btn {
            position: fixed;
            bottom: 120px;
            right: 32px;
            z-index: 99990;"""

content = re.sub(
    r'\.sos-floating-btn \{\s*position: fixed;\s*bottom: 240px;\s*left: 24px;\s*z-index: 99990;',
    replacement,
    content,
    flags=re.DOTALL
)

with open('apps/web/src/components/CommunitySOS.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Moved SOS button to right side")
