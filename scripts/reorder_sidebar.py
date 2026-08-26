import re

with open('apps/web/src/app/(app)/AppLayoutClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

replacement = """const APP_LINKS = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'My Plots', href: '/schedule', icon: Calendar },
  { name: 'Disease Library', href: '/disease-library', icon: BookOpen },
  { name: 'Crop Diagnose', href: '/diagnose', icon: Search },
  { name: 'Soil Health', href: '/soil-health', icon: FlaskConical },
  { name: 'Farm Map', href: '/topography', icon: Map },
  { name: 'Market', href: '/market', icon: TrendingUp },
  { name: 'Crop Planner', href: '/crop-planner', icon: Sprout },
  { name: 'Agri-Credit', href: '/finance', icon: Wallet },
  { name: 'Farm Resources', href: '/resources', icon: Tractor },
  { name: 'Traceability', href: '/blockchain', icon: QrCode },
  { name: 'Schemes', href: '/schemes', icon: FileText },
  { name: 'Docs Locker', href: '/documents', icon: FolderLock },
  { name: 'Community Hub', href: '/community', icon: Users },
  { name: 'AI Agent', href: '/agent', icon: Bot },
];"""

content = re.sub(
    r'const APP_LINKS = \[.*?\];',
    replacement,
    content,
    flags=re.DOTALL
)

with open('apps/web/src/app/(app)/AppLayoutClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Reordered sidebar links")
