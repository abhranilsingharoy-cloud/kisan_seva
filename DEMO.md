# 🎯 KisanSeva — Judge Demo Guide

**Live App:** https://kisanseva-ks.vercel.app  
**GitHub:** https://github.com/abhranilsingharoy-cloud/kisan_seva  
**Health Check:** https://kisanseva-ks.vercel.app/api/health

---

## ⏱️ 5-Minute Rapid Demo (for time-constrained judges)

| Step | Feature | URL | What to Show |
|------|---------|-----|-------------|
| 1 | **Landing Page** | `/` | Scroll through — note features, impact section |
| 2 | **AI Disease Detection** | `/diagnose` | Upload any leaf photo → instant AI diagnosis |
| 3 | **Multilingual AI Agent** | `/agent` | Switch to Hindi, ask "मेरे टमाटर के पत्ते पीले हो रहे हैं" |
| 4 | **Live Market Prices** | `/market` | Select a commodity — see live mandi prices |
| 5 | **Smart Dashboard** | `/dashboard` | Note the impact strip — 140M+ farmers, 93.2% AI |
| 6 | **API Health** | `/api/health` | Shows all 15 feature flags, service status |

---

## 🏆 Priority 1 — Innovation Showcase

### What Makes KisanSeva Unique vs All Other Agri Apps

| Feature | KisanSeva | Other Apps |
|---------|----------|------------|
| **7-Agent AI Architecture** | ✅ Master Orchestrator + 7 Specialists | ❌ Single chatbot |
| **Voice-First in Hindi/Tamil** | ✅ MediaRecorder → Groq Whisper | ❌ English only |
| **Multilingual TTS** | ✅ 8 Indian languages | ❌ None |
| **Disease Detection < 5s** | ✅ Gemini 2.5 Vision | ❌ Manual lookup |
| **Cold Storage Geofencing** | ✅ OSM + AI + 200km radius filter | ❌ None |
| **QR Crop Traceability** | ✅ Blockchain-based QR | ❌ None |
| **SOS Emergency Broadcast** | ✅ Real-time farmer alerts | ❌ None |
| **Live Krishi Radio** | ✅ 6 HTTPS streams | ❌ None |
| **Offline PWA** | ✅ Background sync | ❌ None |
| **B2B Marketplace** | ✅ Corporate buyer contracts | ❌ None |

---

## 🌾 Priority 2 — Problem-Solution Fit

**The Problem:** India's 140 million farming families lack access to:
- ❌ Real-time market prices → forced to sell at 30-40% below market rate to middlemen  
- ❌ Expert disease diagnosis → 30% crop loss annually from late detection
- ❌ Language-appropriate tech → 85% of farmers speak no English
- ❌ Cold storage access → 40% post-harvest loss due to poor storage

**KisanSeva solves each one:**
- ✅ Live APMC mandi prices from Agmarknet API, updated every 15 minutes
- ✅ AI disease detection in < 5 seconds, 93.2% accuracy, 38 disease classes
- ✅ Full Hindi/Bengali/Tamil/Telugu interface + voice input
- ✅ Live cold storage finder with OSM geofencing (radius-filtered, authentic locations)

---

## 💻 Priority 3 — Code Quality Demo

Open GitHub and show judges:

1. **`src/types/index.ts`** — shared TypeScript interface registry for all 10 domain entities
2. **`src/middleware.ts`** — rate limiting + security headers (X-XSS-Protection, etc.)
3. **`apps/web/src/app/api/health/route.ts`** — professional health endpoint with JSDoc
4. **`.github/workflows/ci.yml`** — 4-stage CI pipeline (lint → typecheck → build → audit)
5. **`CONTRIBUTING.md`** — branch strategy, commit conventions, PR process
6. **250+ commits** with Conventional Commits format (`feat:`, `fix:`, `docs:`, `refactor:`)

---

## ⚙️ Priority 4 — Backend Architecture Demo

Hit these URLs live for judges:

```bash
# 1. Health check — shows all services + 15 feature flags
curl https://kisanseva-ks.vercel.app/api/health

# 2. Rate limiting — hit 21 times fast to see 429 response
# 3. Security headers — check X-KisanSeva-Version, X-XSS-Protection headers

# Example API calls:
curl https://kisanseva-ks.vercel.app/api/v1/news
curl "https://kisanseva-ks.vercel.app/api/v1/notifications?lat=28.6&lon=77.2&crop=Tomato"
```

**Architecture:** Next.js 16 → Groq Llama-3 70B → Supabase PostgreSQL → Vercel Edge

---

## 🎨 Priority 5 — Demo Pitch Script (2 minutes)

> *"KisanSeva is an AI-powered farm management platform built for India's 140 million smallholder farmers — in their own language, on a basic smartphone."*

**Slide 1 — Problem:** "Imagine you're a tomato farmer in Vidisha. Your crop has a disease but you don't know what it is. The nearest agronomist is 40km away. The local middleman offers ₹800/quintal — but the mandi 30km away is selling at ₹1,800."

**Slide 2 — Solution:** *[Open KisanSeva, switch to Hindi, use voice input to ask about tomato disease]*

**Slide 3 — Tech:** "Powered by 7 specialized AI agents on Groq Llama-3 — the fastest LLM in the world at 18,000 tokens/second. Full CI/CD pipeline, 93.2% disease accuracy, real-time mandi data."

**Slide 4 — Impact:** "₹0 cost to farmer. Works in 8 Indian languages. Offline-capable. Already deployed live."

---

## 🤖 Priority 6 — ML/AI Demo

1. Go to `/diagnose`
2. Note the stats bar: **38 classes · 93.2% accuracy · <400ms · PlantVillage**
3. Upload a leaf photo (any sick-looking plant leaf works)
4. Show the confidence score, severity level, treatment steps
5. Switch to `/agent`, pick Hindi, ask a crop question using voice
6. Hit `/api/health` — note `model_accuracy_pct: 93.2`, `training_dataset: "PlantVillage (54,306 images)"`

---

## 🔗 Key Links for Judges

| Resource | URL |
|----------|-----|
| Live App | https://kisanseva-ks.vercel.app |
| GitHub Repo | https://github.com/abhranilsingharoy-cloud/kisan_seva |
| Health API | https://kisanseva-ks.vercel.app/api/health |
| CI/CD Pipeline | https://github.com/abhranilsingharoy-cloud/kisan_seva/actions |
| AI Diagnosis | https://kisanseva-ks.vercel.app/diagnose |
| AI Agent | https://kisanseva-ks.vercel.app/agent |
| Live News | https://kisanseva-ks.vercel.app/community |
