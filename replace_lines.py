with open('README.md', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_block = """## 📂 Project Structure

```
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

# lines are 0-indexed. line 422 is index 421. line 484 is index 483.
# We want to replace lines[421:483]
del lines[421:483]
lines.insert(421, new_block)

with open('README.md', 'w', encoding='utf-8') as f:
    f.writelines(lines)

print("Replaced lines 422-484 with new block.")
