# 🌾 KisanSeva — Web Application (Frontend & Serverless API)

This is the core Next.js application for the **KisanSeva** platform. It serves as the primary gateway for farmers to access crop diagnosis, real-time APMC market prices, hyper-local weather advisories, IoT telemetry, and the 7-agent AI advisory system.

## 🚀 Tech Stack

- **Framework:** Next.js 16.3 (App Router with Turbopack)
- **UI Library:** React 19
- **Styling:** Tailwind CSS v4 & Framer Motion
- **State Management:** Zustand v5
- **Authentication:** Clerk
- **Database / BaaS:** Supabase (PostgreSQL)
- **Maps:** Leaflet & React-Leaflet
- **PWA:** Fully offline-capable Progressive Web App

## 🏗️ Folder Structure

```
src/
├── app/                  # Next.js 16 App Router
│   ├── (marketing)/      # Public landing pages
│   ├── (app)/            # 🔒 Protected farmer dashboard & tools
│   │   ├── agent/        # Voice-enabled 7-agent AI chat
│   │   ├── dashboard/    # Smart Farm Dashboard
│   │   ├── diagnose/     # Vision AI Crop Disease Detection
│   │   ├── market/       # Live Agmarknet mandi prices
│   │   ├── iot/          # Smart Farm Sensor Telemetry
│   │   └── ...           # (18 modules total)
│   └── api/              # Serverless API endpoints
│       ├── health/       # Uptime and feature flag monitoring
│       └── v1/           # Core API routes (Chat, Transcribe, Proxy)
├── components/           # Reusable UI & Feature components
├── hooks/                # Custom React Hooks (e.g. useVoiceChat)
├── lib/                  # Utility functions & API clients
└── types/                # Centralized TypeScript interfaces
```

## 🛠️ Getting Started

> **Note:** This project is part of a Turborepo monorepo. It is recommended to run commands from the repository root.

1. Install dependencies from the root directory:
```bash
pnpm install
```

2. Copy `.env.example` to `.env.local` and add your API keys:
```bash
cp .env.example .env.local
```

3. Start the development server (runs on Turbopack):
```bash
pnpm --filter web dev
```

Open [http://localhost:5173](http://localhost:5173) with your browser to see the application.

## 🌍 Important Links
- **[Main Repository Documentation](../../README.md)** — Go here for the full system architecture, ML backend setup, and judge demo instructions.
