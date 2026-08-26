import re

with open('apps/web/next.config.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the duplicate bracket issue
content = content.replace('  },\n    ]\n  },', '  },')

with open('apps/web/next.config.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed syntax in next.config.ts")
