<div align="center">

<img src="./apps/web/public/icon.jpg" alt="KisanSeva Logo" width="120" height="120" style="border-radius:24px;"/>

# 🌾 KisanSeva — किसान सेवा

### 📂 Project Structure

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

## 📈 Scalability & DevOps Architecture

[![CI/CD](https://github.com/abhranilsingharoy-cloud/kisan_seva/actions/workflows/ci.yml/badge.svg)](https://github.com/abhranilsingharoy-cloud/kisan_seva/actions)

### Deployment Pipeline

```
Developer → git push → GitHub Actions (Lint + Build + Audit) → Vercel Edge CDN
```

Every commit to `main` automatically:
1. ✅ Runs **ESLint** code quality checks
2. ✅ Runs **TypeScript** type checking
3. ✅ Builds **Next.js production bundle**
4. ✅ Runs **pnpm security audit**
5. ✅ Triggers **Vercel auto-deploy** to global edge network

### Scalability Targets

| Layer | Technology | Capacity |
|-------|-----------|----------|
| Frontend CDN | Vercel Edge Network | 10M+ requests/day |
| API Layer | Next.js Serverless Functions | Auto-scales to zero |
| Database | Supabase PostgreSQL | 500K+ rows, connection pooling |
| LLM Inference | Groq Llama-3 70B | 18,000 tokens/second |
| Authentication | Clerk | 1M+ MAU on free tier |

### Health Monitoring

🏥 **Live Health Endpoint:** [`/api/health`](https://kisanseva-ks.vercel.app/api/health) — Returns real-time status of all backend services (Supabase, Groq, Weather API, News Feed) with latency metrics.

---

## ⚙️ Local Development Setup

### Quick Start (Frontend Only)

```bash
git clone https://github.com/abhranilsingharoy-cloud/kisan_seva.git
cd kisan_seva
pnpm install
cp apps/web/.env.example apps/web/.env.local
# Fill in your API keys
pnpm run dev
# Open http://localhost:5173
```

### Full Stack (Frontend + Python ML Service)

**Terminal 1 — Python ML Service:**
```bash
cd apps/ml-service
python -m venv .venv
.\.venv\Scripts\activate     # Windows
# source .venv/bin/activate  # macOS/Linux
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

**Terminal 2 — Next.js Frontend:**
```bash
pnpm run dev
```

### HTTPS Mode (for Microphone / Camera Access)

```bash
cd apps/web
npx next dev --port 5173 --experimental-https
# Open https://localhost:5173
```

---

## 🔐 Environment Variables

Create `apps/web/.env.local`:

```env
# ── AI & LLM ─────────────────────────────────────
GROQ_API_KEY=gsk_...          # Llama-3.3-70B + Whisper
GEMINI_API_KEY=AIza...         # Gemini Vision (crop diagnosis)
NVIDIA_NIM_KEY=nvapi-...       # Nvidia NIM Vision

# ── Auth (Clerk) ─────────────────────────────────
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...

# ── Database (Supabase) ──────────────────────────
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# ── Maps & Weather ───────────────────────────────
NEXT_PUBLIC_MAPTILER_KEY=...
OPENWEATHER_API_KEY=...
```

---

## 🌍 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/agent` | AI chat via Groq Llama-3.3-70B |
| `POST` | `/api/transcribe` | Voice → text via Groq Whisper |
| `POST` | `/api/overpass` | OSM Overpass proxy (3 mirrors) |
| `GET`  | `/api/v1/tts` | Google TTS proxy for Hindi/Bengali |
| `GET`  | `/api/v1/market` | Live Agmarknet mandi prices |
| `POST` | `/api/v1/diagnose` | Crop disease diagnosis |
| `GET`  | `/api/v1/weather` | Location weather forecast |

---

## 🏆 Hackathon Highlights

```
╔══════════════════════════════════════════════════════════════════════╗
║               🏆  WHAT MAKES KISANSEVA STAND OUT                    ║
╠══════════════════════════════════════════════════════════════════════╣
║  ✅  15 fully functional features — all deployed & live             ║
║  ✅  7-Agent AI Architecture with Master Orchestrator               ║
║  ✅  Voice input via MediaRecorder → Groq Whisper (no HTTPS!)       ║
║  ✅  TTS in Hindi + Bengali via Google Translate proxy               ║
║  ✅  Real live data — Agmarknet + OpenStreetMap + OpenWeather       ║
║  ✅  Server-side Overpass proxy with 3-mirror fallback               ║
║  ✅  Supabase + Clerk — production-grade auth & database            ║
║  ✅  Turborepo monorepo — Next.js + Python in one repo              ║
║  ✅  Deployed live on Vercel — test it right now!                   ║
║  ✅  5 Indian languages supported (EN / HI / BN / TA / TE)         ║
║  ✅  Cold storage finder with live map (zero mock data!)            ║
║  ✅  Full ML training pipeline for custom disease model             ║
║  ✅  QR-based crop traceability for B2B buyers                      ║
║  ✅  SOS emergency broadcast to nearby farmers                      ║
║  ✅  Docs locker — secure farm document storage                     ║
╚══════════════════════════════════════════════════════════════════════╝
```

---

## 🗺️ Roadmap

- [x] 7-agent AI advisory system
- [x] Voice input (MediaRecorder + Groq Whisper)
- [x] Multilingual TTS (Hindi, Bengali)
- [x] Live mandi prices (Agmarknet)
- [x] Crop disease diagnosis (Gemini Vision)
- [x] Disease Library encyclopaedia
- [x] Cold storage finder (OSM live data)
- [x] Equipment rental marketplace
- [x] Farm map with plots
- [x] Crop planner & irrigation schedule
- [x] Government schemes discovery
- [x] QR crop traceability
- [x] Docs Locker (secure document storage)
- [x] SOS Emergency Broadcast
- [x] Offline-first PWA with background sync
- [x] Push notifications for price alerts
- [x] WhatsApp Business API integration
- [ ] Mobile app (React Native)
- [x] Custom trained PlantVillage disease model (38 classes)
- [x] Satellite NDVI crop health monitoring

---

<div align="center">

**👨‍💻 Built by Abhranil Singha Roy**

[![GitHub](https://img.shields.io/badge/GitHub-abhranilsingharoy--cloud-181717?style=for-the-badge&logo=github)](https://github.com/abhranilsingharoy-cloud)

*Built with ❤️ for India's farming community — because every farmer deserves the best technology.*

<br/>

**⭐ Star this repo if KisanSeva inspired you!**

[![Stars](https://img.shields.io/github/stars/abhranilsingharoy-cloud/kisan_seva?style=social)](https://github.com/abhranilsingharoy-cloud/kisan_seva)

`Made with 🌾 · Powered by Limitless Prime· Built for Bharat`

</div>
