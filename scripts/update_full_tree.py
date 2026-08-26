import re

with open('README.md', 'r', encoding='utf-8') as f:
    content = f.read()

replacement = """## 📂 Project Structure

```text
kisan_seva/                          # 📦 Turborepo Monorepo Root
├── .github/
│   └── workflows/
│       └── ci.yml                   # 🔄 GitHub Actions CI/CD Pipeline
├── scripts/                         # 🛠️ Dev Scripts (Data Gen, DB Migrations)
│   ├── README.md
│   ├── gen_diseases.js
│   └── fix_storage.py
├── turbo.json                       # 🚀 Build pipeline configuration
├── pnpm-workspace.yaml              # 📦 Workspace package definitions
├── supabase_schema.sql              # 🗄️ Database schema definitions
│
└── apps/
    └── web/                         # 🌐 Next.js Frontend App
        ├── .env.example             # 🔑 Environment variables template
        ├── public/
        │   ├── images/rentals/      # 🚜 Equipment photos
        │   └── hero-screenshot.png  # 📸 UI Assets
        │
        └── src/
            ├── middleware.ts        # 🛡️ Rate Limiting & Security Headers
            ├── types/
            │   └── index.ts         # 📝 Centralized TypeScript Interfaces
            ├── components/          # 🧩 Shared React Components
            │   ├── home/            # Landing page UI components
            │   ├── ui/              # Reusable generic components
            │   └── ErrorBoundary.tsx# ⚠️ React Error Boundary
            │
            └── app/                 # 🛣️ Next.js App Router
                ├── (marketing)/     # 📢 Public Landing Pages
                │   └── page.tsx     # Homepage with Judge Panel
                │
                ├── (app)/           # 🔒 Protected Dashboard Routes
                │   ├── AppLayoutClient.tsx  # Sidebar navigation wrapper
                │   ├── agent/           # 🤖 AI Agent (7-agent chat)
                │   ├── dashboard/       # 📊 Smart farm dashboard
                │   ├── resources/       # 🚜 Equipment rentals + cold storage
                │   ├── market/          # 📈 Mandi price comparator
                │   ├── schedule/        # 📅 Crop planner & irrigation schedule
                │   ├── diagnose/        # 📸 Crop disease diagnosis
                │   ├── disease-library/ # 🦠 Disease encyclopaedia
                │   ├── soil-health/     # 🧪 Soil health & NPK analysis
                │   ├── topography/      # 🗺️ Farm Map & plots manager
                │   ├── community/       # 👥 Kisan Sabha forum & Radio
                │   ├── schemes/         # 🏛️ Government schemes
                │   ├── finance/         # 💰 Agri-credit & Loan calculator
                │   ├── documents/       # 📁 Document storage (Docs Locker)
                │   ├── iot/             # 📡 IoT Sensor Telemetry
                │   ├── settings/        # ⚙️ Farmer Profile Preferences
                │   ├── help/            # 🆘 Support & Call Center
                │   └── blockchain/      # 🔗 QR crop tracking & Traceability
                │
                └── api/             # ⚙️ Serverless API Routes
                    ├── health/          # 🏥 System health & feature flags
                    ├── v1/
                    │   ├── agent/chat/  # Groq Llama-3 70B AI endpoint
                    │   ├── transcribe/  # Groq Whisper voice-to-text
                    │   ├── market/      # Live Mandi price fetcher
                    │   ├── news/        # RSS Krishi News fetcher
                    │   ├── notifications/ # Push notification generator
                    │   └── overpass/    # OSM proxy for cold storage
                    └── tts/             # Google Translate Text-to-Speech
```

"""

# Use regex to replace everything from Project Structure to Scalability
content = re.sub(
    r'## .*?Project Structure.*?## .*?Scalability & DevOps Architecture',
    replacement + "## 📈 Scalability & DevOps Architecture",
    content,
    flags=re.DOTALL
)

with open('README.md', 'w', encoding='utf-8') as f:
    f.write(content)

print("Project structure updated successfully")
