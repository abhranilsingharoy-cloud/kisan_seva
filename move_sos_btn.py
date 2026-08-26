import re

with open('apps/web/src/components/CommunitySOS.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Modify the sos-floating-btn position
# from bottom: 120px; right: 32px;
# to bottom: 32px; left: 288px;  (to avoid sidebar which is 256px wide)
# And add a media query for mobile to place it at left: 24px; bottom: 80px;

content = re.sub(
    r'\.sos-floating-btn\s*\{\s*position:\s*fixed;\s*bottom:\s*120px;\s*right:\s*32px;\s*z-index:\s*99990;\s*\}',
    '.sos-floating-btn { position: fixed; bottom: 80px; left: 24px; z-index: 99990; }\\n          @media (min-width: 1024px) { .sos-floating-btn { bottom: 32px; left: 288px; } }',
    content
)

with open('apps/web/src/components/CommunitySOS.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Moved SOS button")
