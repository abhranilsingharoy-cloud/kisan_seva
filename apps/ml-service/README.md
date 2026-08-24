# 🧠 KisanSeva — Python ML Service (Multi-Agent System)

This is the Python-based Machine Learning backend for the **KisanSeva** platform. It handles all advanced AI reasoning, LangChain orchestration, and integration with specialized agricultural APIs.

## 🏗️ Architecture

The service runs a highly scalable **FastAPI** server that acts as the primary entry point. Behind the scenes, it utilizes a **Master Orchestrator (powered by Groq Llama-3)** that delegates tasks to 7 specialized AI agents:

1. 📸 **Crop Diagnosis Agent:** Analyzes crop images using Gemini Vision / Nvidia NIM.
2. 📈 **Market Price Agent:** Fetches real-time mandi prices via the Govt. Agmarknet API.
3. ⛅ **Weather Advisory Agent:** Integrates hyper-local data from OpenWeatherMap.
4. 🧪 **Soil Health Agent:** Calculates customized NPK fertilizer requirements.
5. 🦠 **Outbreak Monitor Agent:** Tracks regional pest and disease outbreak patterns.
6. 📚 **Knowledge Base Agent:** Handles RAG (Retrieval-Augmented Generation) queries.
7. 📱 **SMS/IVR Agent:** Prepares advisory texts for low-bandwidth environments.

## 🛠️ Getting Started

### 1. Set Up Virtual Environment

It is highly recommended to use a Python virtual environment to prevent dependency conflicts.

```bash
# Windows
python -m venv .venv
.\.venv\Scripts\activate

# Mac/Linux
python3 -m venv .venv
source .venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Environment Variables

Create a `.env` file in this directory and configure your keys:
```ini
GROQ_API_KEY=gsk_your_groq_key
GEMINI_API_KEY=AIza_your_gemini_key
OPENWEATHER_API_KEY=your_weather_key
```

### 4. Run the Server

Start the local Uvicorn development server:

```bash
uvicorn main:app --reload --port 8000
```

The FastAPI server will start on [http://localhost:8000](http://localhost:8000). 
You can visit [http://localhost:8000/docs](http://localhost:8000/docs) to interact with the auto-generated Swagger UI.

## 🔗 Integration with Next.js

When this server is running locally, the Next.js frontend (in `apps/web`) will automatically detect it and route AI requests here. If this server is offline, the Next.js API gracefully falls back to the serverless Groq endpoint, ensuring zero downtime for farmers.

## 🌍 Important Links
- **[Main Repository Documentation](../../README.md)** — Go here for the full system architecture, Next.js frontend setup, and judge demo instructions.
