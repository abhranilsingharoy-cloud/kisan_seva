import re

with open('apps/web/next.config.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove the rewrites block
content = re.sub(r'\s*//.*?Rewrites.*?\n\s*async rewrites\(\) \{[\s\S]*?\},', '', content)

with open('apps/web/next.config.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("Removed rewrites from next.config.ts")
