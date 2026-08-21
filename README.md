<div align="center">

<img src="https://raw.githubusercontent.com/abhranilsingharoy-cloud/kisan_seva/main/apps/web/public/icon.jpg" alt="KisanSeva Logo" width="120" height="120" style="border-radius:24px; box-shadow: 0 4px 14px rgba(0,0,0,0.1);"/>

# 🌾 KisanSeva — किसान सेवा

### *Empowering Every Farmer with the Power of AI*

<br/>

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Python-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Groq](https://img.shields.io/badge/Groq-Llama_3.3_70B-FF6B35?style=for-the-badge&logo=meta&logoColor=white)](https://groq.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Clerk](https://img.shields.io/badge/Clerk-Auth-6C47FF?style=for-the-badge&logo=clerk&logoColor=white)](https://clerk.dev/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?style=for-the-badge&logo=vercel&logoColor=white)](https://kisan-seva-ks.vercel.app/)
[![Turbo](https://img.shields.io/badge/Monorepo-Turborepo-EF4444?style=for-the-badge&logo=turborepo&logoColor=white)](https://turbo.build/)

<br/>

> **🏆 Hackathon Project** — A production-ready, full-stack AI platform built to bridge the digital divide for India's 140 million+ farming families.

<br/>

<a href="https://kisan-seva-ks.vercel.app/" target="_blank">
  <img src="https://raw.githubusercontent.com/abhranilsingharoy-cloud/kisan_seva/main/apps/web/public/hero-screenshot.png" alt="KisanSeva Landing Page" width="100%" style="border-radius:12px; margin-bottom: 20px; box-shadow: 0 8px 24px rgba(0,0,0,0.15);"/>
</a>

<br/>

[🌐 **Live Demo**](https://kisan-seva-ks.vercel.app/) &nbsp;|&nbsp; [📂 **GitHub**](https://github.com/abhranilsingharoy-cloud/kisan_seva) &nbsp;|&nbsp; [📋 **Report Issue**](https://github.com/abhranilsingharoy-cloud/kisan_seva/issues)

</div>

---

## 📸 Screenshots

<div align="center">

| Dashboard | AI Agent Chat | Crop Diagnosis |
|:---------:|:-------------:|:--------------:|
| Smart farm overview with live weather & alerts | 7-agent multilingual voice chat | Upload photo → instant disease diagnosis |

| Mandi Prices | Farm Resources | Cold Storage Finder |
|:-----------:|:--------------:|:-------------------:|
| Live Agmarknet data with price trends | Equipment rentals with real images | Live OSM-powered cold storage map |

</div>

---

## ✨ Why KisanSeva?

India has **140 million farming families**. Most lack access to:
- ❌ Real-time market prices (forced to sell low to middlemen)
- ❌ Expert crop disease diagnosis (crop loss from undetected disease)
- ❌ Personalized weather & irrigation advice
- ❌ Government scheme awareness
- ❌ Equipment rental networks

**KisanSeva solves all of this** — in Hindi, Bengali, Tamil, Telugu and English — right from a smartphone.

---

## 🚀 Feature Showcase

### 🤖 1. 7-Agent AI Advisory System
> *The brain of KisanSeva — a multi-agent AI orchestration system*

A conversational AI assistant powered by **7 specialized agricultural agents** working in parallel, coordinated by a Master Orchestrator.

| Agent | Role | Technology |
|-------|------|-----------|
| 🌿 **Diagnosis Agent** | Identifies crop disease from symptoms or image | Groq Llama-3 + Gemini Vision |
| 📊 **Market Price Agent** | Fetches live Agmarknet mandi prices | Agmarknet API + LangChain |
| 🌤️ **Weather Advisory Agent** | Hyper-local weather + irrigation scheduling | OpenWeatherMap API |
| 🌱 **Soil Health Agent** | NPK analysis, fertilizer recommendations | RAG + Groq |
| 🚨 **Outbreak Monitor Agent** | Detects regional crop disease patterns | Groq + aggregated data |
| 📚 **Knowledge Base Agent** | Agricultural best practices via RAG | Local Vector Store |
| 📱 **SMS/IVR Agent** | Serves farmers without smartphones | Twilio/IVR bridge |

**🎤 Voice Input:** Record audio locally with `MediaRecorder` → transcribed via **Groq Whisper** → works on HTTP/HTTPS without permission issues  
**🗣️ Multilingual TTS:** Responds in Hindi/Bengali via **Google Translate TTS proxy** · English via Web Speech API  
**🌐 5 Languages:** English · हिंदी · বাংলা · தமிழ் · తెలుగు

---

### 👁️ 2. Crop Disease Diagnosis (Vision AI)
> *Snap a photo → get a diagnosis in under 5 seconds*

Farmers upload a photo of a sick crop leaf. The AI returns:
- ✅ Disease name & scientific classification
- ✅ Severity level (Low / Moderate / High)
- ✅ Confidence score with visual bar
- ✅ Step-by-step treatment plan (chemical + organic)
- ✅ Prevention tips & farmer feedback system

**Supported Models:** Google Gemini Vision · Nvidia NIM Vision

---

### 📊 3. Live Mandi Price Comparator
> *Beat the middleman — know your crop's real worth*

- 📡 **Real-time data** from Government of India's **Agmarknet** database
- 📈 **7-day price trend** visual bar chart per commodity
- 🔔 **Price Alert System** — get notified when your target price is reached
- 🗺️ **10-mandi comparison table** with distance and modal price
- 📤 **Share / Export** best price to WhatsApp

---

### 🗺️ 4. Smart Farm Map & Weather Advisory
- **Interactive Leaflet Map** powered by MapTiler with satellite & terrain layers
- **Hyper-local weather** (temperature, humidity, wind, rainfall forecast)
- **5-day forecast** with crop-specific irrigation recommendations
- **Plot overlay** — visualize your own farm plots on the map

---

### 🌱 5. Soil Health & Smart Crop Planner
- **NPK Calculator** — input soil test values, get fertilizer plan
- **Crop Stage Tracker** — visual timeline from sowing to harvest
- **My Plots** — manage multiple farm plots with area, crop, and schedule data
- **Weekly Schedule Table** — irrigation and fertilizer calendar

---

### 🏚️ 6. Farm Resources Hub
- **🚜 Equipment Rentals** — browse tractors, harvesters, drones, implements with real photos, hourly rates (₹) and owner contact
- **🧊 Cold Storage Finder** — live search via **OpenStreetMap Overpass API** (server-side proxied through 3 mirrors for reliability) showing nearby cold storage with phone, distance, and Google Maps directions
- **Realistic pricing** matching actual Indian hourly rental market rates

---

### 🤝 7. Community Hub (Kisan Sabha)
- **📢 SOS Emergency Broadcast** — alert nearby farmers about locust attacks, flash floods, or disease outbreaks
- **💬 Kisan Sabha Forum** — community discussions, traditional knowledge sharing
- **📋 Traceability QR** — farm-to-fork crop lifecycle tracking with QR code generation for B2B buyers

---

### 💳 8. Agri-Credit & Government Schemes
- **Loan Calculator** — EMI estimation for Kisan Credit Card and crop loans
- **AI-curated Schemes** — eligibility-matched government scheme discovery (PM-KISAN, PMFBY, KCC)
- **Docs Locker** — securely store land records, Aadhaar, bank documents

---

## 🛠️ Complete Tech Stack

<div align="center">

### Frontend
| Technology | Purpose | Version |
|-----------|---------|---------|
| **Next.js** | Full-stack React framework | 16.3 (Turbopack) |
| **React** | UI library | 19.x |
| **Tailwind CSS** | Utility-first styling | v4 |
| **Zustand** | Global state management | v5 |
| **Framer Motion** | Animations & transitions | v13 |
| **Leaflet + React-Leaflet** | Interactive farm maps | v1.9 |
| **Lucide React** | Icon library | v1.31 |
| **Recharts** | Data visualization charts | v3 |
| **next-intl** | Internationalization (i18n) | v4 |
| **TanStack Query** | Server state & data fetching | v5 |

### Backend & Cloud
| Technology | Purpose |
|-----------|---------|
| **Next.js API Routes** | Serverless backend functions |
| **Supabase** | PostgreSQL database + storage |
| **Clerk** | Authentication & user management |
| **Vercel** | Hosting + edge deployment |
| **Turborepo** | Monorepo build orchestration |

### AI & Machine Learning
| Technology | Purpose |
|-----------|---------|
| **Groq (Llama-3.3-70B)** | Primary LLM for all agents |
| **Groq Whisper** | Voice-to-text transcription |
| **Google Gemini Vision** | Crop disease image analysis |
| **Nvidia NIM Vision** | Alternative vision model |
| **FastAPI + Uvicorn** | Python ML microservice |
| **LangChain** | Agent orchestration framework |
| **Google Translate TTS** | Multilingual text-to-speech |

### External APIs
| API | Data |
|-----|------|
| **Agmarknet (Govt. of India)** | Live mandi agricultural prices |
| **OpenWeatherMap** | Hyper-local weather forecasts |
| **OpenStreetMap Overpass** | Cold storage facility locations |
| **Nominatim** | Geocoding (city → coordinates) |
| **MapTiler** | Satellite & terrain map tiles |

</div>

---

## 🏗️ System Architecture

```mermaid
graph TD
    classDef frontend fill:#1e3a5f,stroke:#3b82f6,stroke-width:2px,color:#fff;
    classDef backend fill:#0f2a1a,stroke:#10b981,stroke-width:2px,color:#fff;
    classDef python fill:#2d1b00,stroke:#f59e0b,stroke-width:2px,color:#fff;
    classDef cloud fill:#1a0a2e,stroke:#8b5cf6,stroke-width:2px,color:#fff;
    classDef ai fill:#2d0a0a,stroke:#ef4444,stroke-width:2px,color:#fff;
    classDef agent fill:#0f172a,stroke:#eab308,stroke-width:1px,color:#e2e8f0;

    subgraph Client ["📱 Client Layer"]
        User([🌾 Farmer])
        WebUI[🖥️ Next.js 16 App<br/>React 19 · Tailwind v4 · Zustand]:::frontend
    end

    subgraph Vercel ["⚡ Vercel Serverless Functions"]
        AgentAPI[/api/agent<br/>Groq Llama-3.3]:::backend
        TranscribeAPI[/api/transcribe<br/>Groq Whisper]:::backend
        OverpassAPI[/api/overpass<br/>3-Mirror Proxy]:::backend
        TTSAPI[/api/v1/tts<br/>Google TTS Proxy]:::backend
    end

    subgraph Cloud ["☁️ Cloud Services"]
        Clerk[🔐 Clerk Auth]:::cloud
        Supabase[(🗄️ Supabase<br/>PostgreSQL)]:::cloud
    end

    subgraph ML ["🧠 Python Multi-Agent Backend"]
        FastAPI[🚀 FastAPI]:::python
        Orchestrator{Master Orchestrator}:::python
        A1[Diagnosis Agent]:::agent
        A2[Market Agent]:::agent
        A3[Weather Agent]:::agent
        A4[Soil Agent]:::agent
        A5[Outbreak Agent]:::agent
        A6[Knowledge Agent]:::agent
        A7[SMS/IVR Agent]:::agent
        RAG[(📚 Vector Store)]:::python
    end

    subgraph External ["🌐 External APIs"]
        Groq[🧠 Groq LLM]:::ai
        Whisper[🎤 Groq Whisper]:::ai
        Vision[👁️ Gemini Vision]:::ai
        Agmarknet[📊 Agmarknet]:::cloud
        OWM[🌤️ OpenWeather]:::cloud
        OSM[🗺️ Overpass API]:::cloud
    end

    User --> WebUI
    WebUI --> Clerk
    WebUI --> AgentAPI
    WebUI --> TranscribeAPI
    WebUI --> OverpassAPI
    WebUI --> TTSAPI

    AgentAPI --> Groq
    AgentAPI -.Local Mode.-> FastAPI
    TranscribeAPI --> Whisper
    OverpassAPI --> OSM

    FastAPI --> Orchestrator
    Orchestrator --> A1 & A2 & A3 & A4 & A5 & A6 & A7
    A6 <--> RAG
    A1 --> Vision
    A2 --> Agmarknet
    A3 --> OWM
    Orchestrator --> Groq

    WebUI --> Supabase
```

---

## 📂 Project Structure

```
kisan_seva/                          # 🏠 Turborepo Monorepo Root
├── turbo.json                       # Build pipeline configuration
├── pnpm-workspace.yaml              # Workspace package definitions
├── supabase_schema.sql              # Database schema (plots, profiles, alerts)
│
├── apps/
│   │
│   ├── web/                         # 🌐 Next.js Frontend (Main App)
│   │   ├── public/
│   │   │   ├── images/rentals/      # Equipment photos (drone, tractors, planters)
│   │   │   └── chatbot-avatar.jpg   # AI assistant avatar
│   │   │
│   │   └── src/
│   │       ├── app/
│   │       │   ├── (app)/           # 🔒 Protected dashboard routes
│   │       │   │   ├── layout.tsx   # App shell (sidebar, auth check)
│   │       │   │   ├── AppLayoutClient.tsx  # Sidebar nav with all 16 items
│   │       │   │   ├── agent/       # 🤖 AI Agent chat page (7 agents)
│   │       │   │   ├── dashboard/   # 📊 Farm overview dashboard
│   │       │   │   ├── resources/   # 🚜 Equipment rentals + cold storage
│   │       │   │   │   ├── RentalsTab.tsx   # Equipment cards with real images
│   │       │   │   │   └── StorageTab.tsx   # OSM cold storage finder
│   │       │   │   ├── market/      # 📈 Mandi price comparator
│   │       │   │   ├── schedule/    # 📅 Irrigation & fertilizer schedule
│   │       │   │   ├── diagnose/    # 👁️ Crop disease diagnosis
│   │       │   │   ├── soil/        # 🌱 Soil health & NPK analysis
│   │       │   │   ├── plots/       # 🗺️ My farm plots manager
│   │       │   │   ├── community/   # 🤝 Kisan Sabha community forum
│   │       │   │   ├── schemes/     # 💰 Government schemes
│   │       │   │   ├── agri-credit/ # 💳 Loan calculator
│   │       │   │   └── traceability/# 🔗 QR-based crop tracking
│   │       │   │
│   │       │   └── api/             # ⚙️ Serverless API Routes
│   │       │       ├── agent/       # Groq Llama-3.3 chat endpoint
│   │       │       ├── transcribe/  # Groq Whisper voice-to-text
│   │       │       ├── overpass/    # OSM Overpass 3-mirror proxy
│   │       │       └── v1/          # Proxied routes → Python ML service
│   │       │           └── tts/     # Google Translate TTS proxy
│   │       │
│   │       ├── components/
│   │       │   ├── chat/            # Floating AI chatbot widget
│   │       │   ├── ColdStorageMap.tsx # Leaflet map for storage finder
│   │       │   └── ui/              # Shared UI primitives
│   │       │
│   │       ├── hooks/
│   │       │   └── useVoiceChat.ts  # MediaRecorder → Whisper voice pipeline
│   │       │
│   │       └── lib/
│   │           ├── chatStore.ts     # Zustand AI chat state
│   │           └── supabase/        # DB client (server + browser)
│   │
│   └── ml-service/                  # 🧠 Python FastAPI Multi-Agent Backend
│       ├── main.py                  # FastAPI entry point
│       ├── requirements.txt         # Dependencies
│       │
│       ├── agents/
│       │   ├── orchestrator/        # Master Orchestrator (routes queries)
│       │   │   ├── master_orchestrator.py
│       │   │   └── agent_registry.py
│       │   ├── specialist/          # The 7 Expert Agents
│       │   │   ├── diagnosis_agent.py
│       │   │   ├── mandi_price_agent.py
│       │   │   ├── weather_advisory_agent.py
│       │   │   ├── soil_health_agent.py
│       │   │   ├── outbreak_detection_agent.py
│       │   │   ├── knowledge_base_agent.py
│       │   │   └── sms_ivr_agent.py
│       │   └── base/base_agent.py   # LangChain base class
│       │
│       ├── knowledge_base/          # RAG Vector Store
│       │   ├── crop_disease_db.py
│       │   └── vector_store.py
│       │
│       └── training/                # ML Model Training Pipeline
│           ├── configs/model_config.py
│           ├── scripts/             # Training & evaluation scripts
│           └── data/                # Dataset loaders
```

---

## ⚙️ Local Development Setup

### Prerequisites
- Node.js 20+ & pnpm 9+
- Python 3.11+ (for ML service)
- Git

### Quick Start (Frontend Only)

```bash
# 1. Clone the repo
git clone https://github.com/abhranilsingharoy-cloud/kisan_seva.git
cd kisan_seva

# 2. Install all dependencies
pnpm install

# 3. Set up environment variables
cp apps/web/.env.example apps/web/.env.local
# Fill in your API keys (see Environment Variables section below)

# 4. Start the dev server
pnpm run dev

# Open http://localhost:5173
```

### Full Stack (Frontend + Python ML Service)

**Terminal 1 — Python ML Service:**
```bash
cd apps/ml-service
python -m venv .venv

# Windows
.\.venv\Scripts\activate
# macOS / Linux
source .venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

**Terminal 2 — Next.js Frontend:**
```bash
# From repo root
pnpm run dev
```

> The Next.js app auto-detects the local Python service and routes AI requests to it. If offline, it gracefully falls back to the Groq cloud API.

### HTTPS Local Development (for Microphone Access)

```bash
cd apps/web
npx next dev --port 5173 --experimental-https
# Open https://localhost:5173 — microphone will work!
```

---

## 🔐 Environment Variables

Create `apps/web/.env.local`:

```env
# ── AI & LLM ────────────────────────────────────────
GROQ_API_KEY=your_groq_api_key         # Llama-3.3-70B chat + Whisper transcription
GEMINI_API_KEY=your_gemini_api_key     # Crop disease vision (Gemini)
NVIDIA_NIM_KEY=your_nvidia_nim_key     # Crop disease vision (NIM)

# ── Authentication (Clerk) ───────────────────────────
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...

# ── Database (Supabase) ─────────────────────────────
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# ── Maps ────────────────────────────────────────────
NEXT_PUBLIC_MAPTILER_KEY=your_maptiler_key

# ── Weather ─────────────────────────────────────────
OPENWEATHER_API_KEY=your_openweather_key

# ── Python ML Service (local dev only) ──────────────
NEXT_PUBLIC_ML_SERVICE_URL=http://localhost:8000
```

---

## 🌍 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/agent` | AI chat — Groq Llama-3.3-70B |
| `POST` | `/api/transcribe` | Voice → text via Groq Whisper |
| `POST` | `/api/overpass` | OSM Overpass proxy (3 mirrors) |
| `GET`  | `/api/v1/tts` | Google TTS proxy for Hindi/Bengali |
| `GET`  | `/api/v1/market` | Live Agmarknet mandi prices |
| `POST` | `/api/v1/diagnose` | Crop disease diagnosis |
| `GET`  | `/api/v1/weather` | Location weather forecast |

---

## 🌟 Hackathon Highlights

```
╔══════════════════════════════════════════════════════════════════╗
║            🏆  WHAT MAKES KISANSEVA STAND OUT                   ║
╠══════════════════════════════════════════════════════════════════╣
║  ✅  7-Agent AI Architecture with Master Orchestrator           ║
║  ✅  Voice input via MediaRecorder → Groq Whisper (no HTTPS!)   ║
║  ✅  TTS in Hindi + Bengali via Google Translate proxy           ║
║  ✅  Real live data — Agmarknet + OpenStreetMap + OpenWeather   ║
║  ✅  Server-side Overpass proxy with 3-mirror fallback           ║
║  ✅  Supabase + Clerk — production-grade auth & database        ║
║  ✅  Turborepo monorepo — Next.js + Python in one repo          ║
║  ✅  Deployed live on Vercel — test it right now!               ║
║  ✅  5 Indian languages supported (EN/HI/BN/TA/TE)             ║
║  ✅  Cold storage finder with live map (zero mock data!)        ║
║  ✅  Full ML training pipeline for custom disease model         ║
║  ✅  QR-based crop traceability for B2B buyers                  ║
╚══════════════════════════════════════════════════════════════════╝
```

---

## 🗺️ Roadmap

- [x] 7-agent AI advisory system
- [x] Voice input (MediaRecorder + Groq Whisper)
- [x] Multilingual TTS (Hindi, Bengali)
- [x] Live mandi prices (Agmarknet)
- [x] Crop disease diagnosis (Gemini Vision)
- [x] Cold storage finder (OSM live data)
- [x] Equipment rental marketplace
- [x] Farm map with plots
- [x] Government schemes discovery
- [x] QR crop traceability
- [ ] Offline-first PWA with service worker
- [ ] Push notifications for price alerts
- [ ] WhatsApp Business API integration
- [ ] Mobile app (React Native)
- [ ] Custom trained PlantVillage disease model (38 classes)
- [ ] Satellite NDVI crop health monitoring

---

## 👨‍💻 Developer

<div align="center">

**Abhranil Singha Roy**

[![GitHub](https://img.shields.io/badge/GitHub-abhranilsingharoy--cloud-181717?style=for-the-badge&logo=github)](https://github.com/abhranilsingharoy-cloud)
[![Email](https://img.shields.io/badge/Email-abhranilsingharoy%40gmail.com-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](mailto:abhranilsingharoy@gmail.com)

*Built with ❤️ for India's farming community — because every farmer deserves the best technology.*

</div>

---

<div align="center">

**⭐ Star this repo if KisanSeva inspired you!**

[![Star History](https://img.shields.io/github/stars/abhranilsingharoy-cloud/kisan_seva?style=social)](https://github.com/abhranilsingharoy-cloud/kisan_seva)

Made with 🌾 · Powered by AI · Built for Bharat

</div>
