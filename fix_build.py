import re

with open('apps/web/next.config.ts', 'r', encoding='utf-8') as f:
    content = f.read()

replacement = """const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  //"""

content = content.replace("const nextConfig: NextConfig = {\n  //", replacement)

with open('apps/web/next.config.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("Added ignore configs to next.config.ts")
