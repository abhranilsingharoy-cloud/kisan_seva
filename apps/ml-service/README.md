# KisanSeva Machine Learning Service

This is the Python-based Multi-Agent Machine Learning backend for the **KisanSeva** platform. It handles all advanced AI reasoning, LangChain orchestration, and integration with specialized agricultural APIs.

## 🧠 Architecture

The service runs a **FastAPI** server that acts as the entry point. Behind the scenes, it utilizes a **LangChain** orchestrator that delegates tasks to 7 specialized AI agents:

1. **Crop Diagnosis Agent:** Analyzes images using Gemini Vision / Nvidia NIM.
2. **Market Price Agent:** Fetches live data from the Agmarknet API.
3. **Weather Advisory Agent:** Integrates with OpenWeatherMap.
4. **Soil Health Agent:** Calculates NPK fertilizer requirements.
5. **Outbreak Monitor Agent:** Tracks regional pest/disease outbreaks.
6. **Knowledge Base Agent:** Handles RAG (Retrieval-Augmented Generation) queries.
7. **SMS/IVR Agent:** Prepares advisory texts for low-bandwidth environments.

## 🚀 Getting Started

### 1. Set Up Virtual Environment

It is highly recommended to use a virtual environment (.venv).

`ash
# Windows
python -m venv .venv
.\.venv\Scripts\activate

# Mac/Linux
python3 -m venv .venv
source .venv/bin/activate
`

### 2. Install Dependencies

`ash
pip install -r requirements.txt
`

### 3. Environment Variables

Ensure your .env file is properly configured with your keys:
- GROQ_API_KEY
- GEMINI_API_KEY or NVIDIA_NIM_KEY
- WEATHER_API_KEY

### 4. Run the Server

`ash
uvicorn main:app --reload --port 8000
`

The FastAPI server will start on http://localhost:8000. You can visit http://localhost:8000/docs to see the auto-generated Swagger UI.

## 🔗 Integration with Next.js

When this server is running, the Next.js frontend (in pps/web) will automatically detect it and route AI requests here instead of using the serverless fallback route.

For the full system overview, refer to the [Root README](../../README.md).
