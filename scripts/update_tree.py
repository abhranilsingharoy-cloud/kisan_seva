import re

with open('README.md', 'r', encoding='utf-8') as f:
    content = f.read()

replacement = """│   │       │   ├── (app)/           # 🔒 Protected dashboard routes
│   │       │   │   ├── AppLayoutClient.tsx  # Sidebar with all 18 nav items
│   │       │   │   ├── agent/       # 🤖 AI Agent (7-agent chat)
│   │       │   │   ├── dashboard/   # 📊 Smart farm dashboard
│   │       │   │   ├── resources/   # 🚜 Equipment rentals + cold storage
│   │       │   │   ├── market/      # 📈 Mandi price comparator
│   │       │   │   ├── schedule/    # 📅 Crop planner & irrigation schedule
│   │       │   │   ├── diagnose/    # 📸 Crop disease diagnosis
│   │       │   │   ├── disease-library/ # 🦠 Disease encyclopaedia
│   │       │   │   ├── soil/        # 🧪 Soil health & NPK analysis
│   │       │   │   ├── plots/       # 🗺️ My farm plots manager
│   │       │   │   ├── community/   # 👥 Kisan Sabha forum
│   │       │   │   ├── schemes/     # 🏛️ Government schemes
│   │       │   │   ├── agri-credit/ # 💰 Loan calculator
│   │       │   │   ├── docs-locker/ # 📁 Document storage
│   │       │   │   ├── iot/         # 📡 IoT Sensor Telemetry
│   │       │   │   ├── settings/    # ⚙️ Farmer Profile Preferences
│   │       │   │   └── help/        # 🆘 Support & Call Center"""

content = re.sub(
    r'│   │       │   ├── \(app\)/.*?│   │       │   │   ├── docs-locker/ # 📁 Document storage',
    replacement,
    content,
    flags=re.DOTALL
)

with open('README.md', 'w', encoding='utf-8') as f:
    f.write(content)

print("README tree updated successfully")
