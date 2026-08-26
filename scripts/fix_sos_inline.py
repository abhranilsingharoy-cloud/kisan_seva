import re

with open('apps/web/src/components/CommunitySOS.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the inline style that overrides position: fixed
content = content.replace(
    '<div className="sos-floating-btn" style={{ position: \'relative\', display: \'inline-block\' }}>',
    '<div className="sos-floating-btn">'
)

with open('apps/web/src/components/CommunitySOS.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Removed inline style from sos-floating-btn")
