<div align="center">

# 🌾 KisanSeva 

**AI-Powered Multi-Agent Agricultural Advisory System**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)

KisanSeva is a comprehensive platform built to empower farmers with real-time market prices, crop disease diagnosis, localized weather forecasts, and a conversational AI assistant composed of 7 specialized agricultural agents.

</div>

---

## 🚀 Key Features in Detail

### 1. 🤖 7-Agent AI Advisory System (AI Agent & Chatbot)
A highly advanced, conversational AI assistant composed of 7 specialized agents. 
- **Voice-Activated & Multilingual:** Farmers can click the microphone to speak in English, Hindi, or Bengali. The AI responds natively in their language.
- **Context-Aware Routing:** The AI orchestrator automatically routes the farmer's question to the correct specialized agent.

### 2. 👁️ Crop Diagnose (Vision AI)
Farmers can upload a photo of a diseased crop directly from their phone.
- **Multi-Model Support:** Choose between **Google Gemini Vision** or **Nvidia NIM Vision** to instantly scan the leaf.
- **Actionable Treatment Plans:** The AI identifies the disease, explains the cause, and provides step-by-step biological and chemical treatment recommendations.

### 3. 📊 Live B2B Market & Pricing (Agmarknet)
A real-time marketplace dashboard designed to help farmers get the best prices.
- **Live Mandi Data:** Pulls real-time agricultural market prices directly from the Government of India's Agmarknet database.
- **Price Trends & Analytics:** View historical charts and AI-generated summaries to decide when and where to sell.

### 4. 🗺️ Farm Map & Weather Advisory
Features an interactive map built with Leaflet and MapTiler, allowing farmers to visualize regional data.
- **Localized Weather:** Integrated with OpenWeatherMap API to provide hyper-local weather data.
- **Irrigation Scheduling:** The AI uses the temperature and forecast to recommend watering schedules.

### 5. 🌱 Soil Health & My Plots
- **Fertilizer Planning:** Farmers can input their soil type or NPK values to receive a customized fertilizer schedule.
- **My Plots:** Track and manage individual farm plots, monitor crop lifecycles, and schedule harvesting tasks.

### 6. 🤝 Community SOS & Kisan Sabha
- **SOS Emergency Broadcast:** Instant emergency alerts (locust attacks, severe weather, sudden disease outbreaks) broadcast to nearby farmers.
- **Kisan Sabha:** A community forum where farmers can connect, discuss local agricultural issues, and share traditional knowledge.

### 7. 🚜 Agri-Credit, Schemes & Equipment
- **Agri-Credit:** Built-in loan calculators and credit advisory to help farmers secure financial support.
- **Government Schemes:** AI-curated list of eligible government agricultural schemes.
- **Equipment:** A hub for managing, renting, or buying modern farming machinery.

### 8. 🔗 Crop Traceability
- **Farm-to-Fork Tracking:** A robust system to track the lifecycle of the crop, generating QR codes to prove authenticity and organic status to B2B buyers.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router), React 19
- **Styling:** Tailwind CSS, Framer Motion (Animations)
- **State Management:** Zustand
- **Maps:** Leaflet & MapTiler

### Backend & Cloud
- **API:** Next.js Serverless Functions
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Clerk
- **Hosting:** Vercel

### Machine Learning & AI
- **Framework:** Python, FastAPI, Uvicorn
- **AI Orchestration:** LangChain
- **LLMs:** Groq (Llama-3.3-70b), Google Gemini Vision, Nvidia NIM
- **Data Integration:** Agmarknet API, OpenWeatherMap

---

## 🏗️ Visual Architecture

```mermaid
graph TD
    %% Styling
    classDef frontend fill:#1e293b,stroke:#3b82f6,stroke-width:2px,color:#fff;
    classDef backend fill:#0f172a,stroke:#10b981,stroke-width:2px,color:#fff;
    classDef python fill:#1e293b,stroke:#f59e0b,stroke-width:2px,color:#fff;
    classDef cloud fill:#020617,stroke:#8b5cf6,stroke-width:2px,color:#fff;
    classDef ai fill:#4c1d95,stroke:#c084fc,stroke-width:2px,color:#fff;
    classDef agent fill:#0f172a,stroke:#eab308,stroke-width:1px,color:#e2e8f0;

    %% Client Layer
    subgraph Client ["📱 Client Layer"]
        User([🌾 Farmer / User])
        WebUI[🖥️ Next.js Web App<br/>React, Tailwind, Zustand]:::frontend
    end

    %% Cloud Services Layer
    subgraph Services ["☁️ Cloud Services & Databases"]
        Clerk[🔐 Clerk<br/>Authentication]:::cloud
        Supabase[(🗄️ Supabase<br/>PostgreSQL & Storage)]:::cloud
        Firebase[🔔 Firebase<br/>Push Notifications]:::cloud
    end

    %% API Layer (Vercel)
    subgraph Vercel ["⚡ Vercel Serverless API Layer"]
        API_Gateway[⚙️ API Gateway / Middleware]:::backend
        V_Auth[Auth Routes]:::backend
        V_DB[DB Routes]:::backend
        V_Agent[Fallback AI Route]:::backend
    end

    %% Python ML Layer
    subgraph ML ["🧠 Python Multi-Agent Service (Local/Dedicated)"]
        FastAPI[🚀 FastAPI / Uvicorn]:::python
        Orchestrator{🤖 Master<br/>Orchestrator}:::python
        
        %% The 7 Agents
        A1[Crop Diagnosis Agent]:::agent
        A2[Market Price Agent]:::agent
        A3[Weather Advisory Agent]:::agent
        A4[Soil Health Agent]:::agent
        A5[Outbreak Monitor Agent]:::agent
        A6[Knowledge Base Agent]:::agent
        A7[SMS / IVR Agent]:::agent
        
        RAG[(📚 Local RAG<br/>Vector Store)]:::python
    end

    %% External APIs & LLMs
    subgraph External ["🌐 External APIs & LLMs"]
        Groq[🧠 Groq Llama-3.3<br/>Primary Reasoning]:::ai
        Vision[👁️ Gemini / Nvidia NIM<br/>Image Diagnostics]:::ai
        Agmarknet[📊 Agmarknet API<br/>Live Mandi Prices]:::cloud
        OpenWeather[🌤️ OpenWeather API]:::cloud
        MapTiler[🗺️ MapTiler Maps]:::cloud
    end

    %% Flows
    User -- Interacts --> WebUI
    WebUI -- Authenticates --> Clerk
    WebUI -- API Requests --> API_Gateway
    
    API_Gateway --> V_Auth
    API_Gateway --> V_DB
    API_Gateway --> V_Agent

    V_Auth -. Validates .-> Clerk
    V_DB -- CRUD Ops --> Supabase
    WebUI -- Map Tiles --> MapTiler
    
    %% AI Flow
    V_Agent -. Local Dev Mode .-> FastAPI
    V_Agent -- Fallback Mode --> Groq
    V_Agent -- Vision Tasks --> Vision
    
    %% Python ML Internal Flow
    FastAPI --> Orchestrator
    Orchestrator --> A1
    Orchestrator --> A2
    Orchestrator --> A3
    Orchestrator --> A4
    Orchestrator --> A5
    Orchestrator --> A6
    Orchestrator --> A7
    
    A6 <--> RAG
    
    %% Agents to External
    A1 -- Uses --> Vision
    A2 -- Fetches --> Agmarknet
    A3 -- Fetches --> OpenWeather
    Orchestrator -- Reasons with --> Groq
```

*Note: When hosted on Vercel, the Next.js API gracefully falls back to using the Groq API directly if the local Python ML service is offline.*

---

## 📂 Detailed Folder Architecture

The platform uses a **Turborepo** monorepo structure to perfectly organize the Next.js frontend and the Python Machine Learning service.

```text
kisan_seva/
├── turbo.json                   # Monorepo task runner configuration
├── package.json                 # Root dependencies and workspace definitions
│
├── apps/
│   ├── web/                     # 🌐 Next.js Frontend Application
│   │   ├── src/
│   │   │   ├── app/             # Next.js App Router (Pages & API)
│   │   │   │   ├── api/v1/      # Serverless API routes (B2B, market, diagnose, weather, TTS)
│   │   │   │   └── [locale]/    # Internationalized routing for EN, HI, BN
│   │   │   │       ├── (app)/   # Protected dashboard routes (schedule, market, diagnose)
│   │   │   │       └── (public)/# Public marketing pages and landing page
│   │   │   │
│   │   │   ├── components/      # Modular React UI Components
│   │   │   │   ├── chat/        # Floating chatbot UI, message bubbles, language selector
│   │   │   │   ├── features/    # Core feature UI (Mandi tables, diagnosis scanners, charts)
│   │   │   │   ├── home/        # Landing page components (Hero, Testimonials, Map visualizations)
│   │   │   │   ├── layout/      # Navbar, AgriFooter, offline indicators, translation widgets
│   │   │   │   └── ui/          # Generic reusable elements (buttons, full-page scrollers)
│   │   │   │
│   │   │   ├── hooks/           # Custom React hooks
│   │   │   │   └── useVoiceChat.ts # Handles microphone access, speech-to-text, and fallback logic
│   │   │   │
│   │   │   ├── lib/             # Core Utilities & State Management
│   │   │   │   ├── chatStore.ts # Zustand global state manager for the AI chat history
│   │   │   │   └── supabase/    # Supabase authentication and database clients (server/client)
│   │   │   │
│   │   │   ├── i18n/            # next-intl configuration and translation dictionaries
│   │   │   ├── .env.production  # Production environment variables (auto-synced to Vercel)
│   │   │   ├── middleware.ts    # Clerk Auth and Next-Intl routing interceptors
│   │   │   ├── next.config.ts   # Next.js compiler settings and PWA configuration
│   │   │   └── tailwind.config.ts # Custom Tailwind theme colors and animations
│   │
│   └── ml-service/              # 🧠 Python Multi-Agent & Machine Learning Backend
│       ├── main.py              # FastAPI server entry point (routes requests to the Orchestrator)
│       ├── requirements.txt     # Python dependencies (FastAPI, LangChain, Uvicorn, Torch)
│       │
│       ├── agents/              # The 7-Agent Architecture
│       │   ├── orchestrator/    # The "Brain" that decides which agent should answer
│       │   │   ├── master_orchestrator.py
│       │   │   └── agent_registry.py
│       │   ├── specialist/      # The specific "Expert" agents
│       │   │   ├── diagnosis_agent.py      # Handles crop diseases
│       │   │   ├── mandi_price_agent.py    # Fetches real-time Agmarknet data
│       │   │   ├── weather_advisory_agent.py # Connects to OpenWeather
│       │   │   ├── soil_health_agent.py    # Generates NPK fertilizer plans
│       │   │   ├── outbreak_detection_agent.py
│       │   │   ├── sms_ivr_agent.py        
│       │   │   ├── knowledge_base_agent.py # RAG queries
│       │   │   └── feedback_agent.py       # Collects user feedback
│       │   └── base/
│       │       └── base_agent.py # LangChain base class template for all agents
│       │
│       ├── knowledge_base/      # RAG (Retrieval-Augmented Generation) System
│       │   ├── crop_disease_db.py
│       │   └── vector_store.py  # Embeddings for agricultural documents
│       │
│       ├── training/            # Custom Model Training Scripts (Future-proofing)
│       │   ├── scripts/         # Scripts for Google Colab model training and evaluation
│       │   ├── configs/         # Model hyperparameter configs
│       │   └── data/            # Dataset loaders for images
│       │
│       └── utils/               # Python Utility Functions
│           ├── llm_client.py    # Connection to Groq Llama-3.3-70b
│           ├── image_utils.py   # Processes images for Gemini/Nvidia NIM
│           ├── language_utils.py # Translation layer
│           └── sentry_init.py   # Error tracking
```

---

## ⚙️ How to Run Locally

You have two options for running the project locally depending on what you want to test.

### Option 1: Quick Start (Frontend + Cloud AI)
Run this if you just want to see the UI. The AI features will automatically fall back to using the cloud Groq API.

1. Install dependencies in the root folder:
   ```bash
   pnpm install
   ```
2. Start the web frontend:
   ```bash
   pnpm run dev
   ```
3. Open `http://localhost:5173` in your browser.

### Option 2: Full Stack (Frontend + Python Multi-Agent Backend)
Run this if you want to test the full 7-agent Python orchestration system locally. You will need **two terminal windows**.

**Terminal 1 (Start the Python ML Server):**
```bash
cd apps/ml-service
# Activate your virtual environment
.\.venv\Scripts\activate   # Windows
# source .venv/bin/activate # Mac/Linux

# Start the FastAPI server
uvicorn main:app --reload --port 8000
```

**Terminal 2 (Start the Web Frontend):**
```bash
# From the root repository folder
pnpm run dev
```
Open `http://localhost:5173` in your browser. The web app will now automatically detect and use your local Python ML server!

---

## 🔐 Environment Variables

To run the project, ensure you have the required API keys configured in `apps/web/.env.local`:
- `GROQ_API_KEY` (AI Chatbot)
- `GEMINI_API_KEY` & `NVIDIA_NIM_KEY` (Crop Vision)
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` & `CLERK_SECRET_KEY` (Auth)
- `NEXT_PUBLIC_SUPABASE_URL` & `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Database)

*(For production deployments, these are securely configured in Vercel).*

---

## 👨‍💻 Owner & Credits

Designed and developed by **Abhranil Singha Roy**.

Built with passion for agricultural innovation and AI technology. 🌾
