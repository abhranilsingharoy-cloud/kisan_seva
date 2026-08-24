import re

with open("apps/web/src/app/(app)/agent/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

bad_import = """  ChevronRight, Loader2, Globe, BarChart2, Droplets, AlertTriangle, BookOpen, PhoneCall, X
  Square
} from 'lucide-react';"""
good_import = """  ChevronRight, Loader2, Globe, BarChart2, Droplets, AlertTriangle, BookOpen, PhoneCall, X,
  Square
} from 'lucide-react';"""

content = content.replace(bad_import, good_import)

with open("apps/web/src/app/(app)/agent/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Added comma")
