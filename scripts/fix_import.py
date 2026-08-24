import re

with open("apps/web/src/app/(app)/agent/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

bad_import = "} from 'lucide-react';"
good_import = "  Square\n} from 'lucide-react';"

content = content.replace(bad_import, good_import)

with open("apps/web/src/app/(app)/agent/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Added Square")
