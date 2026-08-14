/**
 * KisanSeva — Next.js AI Chat API Route
 * Server-side route that proxies to the ML service agent API,
 * or calls Groq directly as a fast, reliable fallback.
 */
import { NextRequest, NextResponse } from 'next/server'

const ML_SERVICE_URL = process.env.NEXT_PUBLIC_ML_URL || 'http://localhost:8000'
const GROQ_API_KEY   = process.env.GROQ_API_KEY || ''
const GROQ_MODEL     = 'llama-3.3-70b-versatile'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { query, language = 'en', user_id, plot_id, context = {} } = body

    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'query is required' }, { status: 400 })
    }

    // ── Try ML Service orchestrator first ─────────────────
    try {
      const mlResp = await fetch(`${ML_SERVICE_URL}/v1/agent/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, language, user_id, plot_id, context }),
      })

      if (mlResp.ok) {
        const data = await mlResp.json()
        return NextResponse.json(data)
      }
    } catch (mlErr) {
      console.warn('[AI Chat] ML service unavailable, falling back to Groq:', mlErr)
    }

    // ── Fallback: Call Groq directly ────────────────────
    if (!GROQ_API_KEY) {
      // Return a smart mock response if no API key is provided
      let mockText = 'This is a mock response because the GROQ_API_KEY is not set in your .env.local file. Please add it for real AI responses.';
      
      if (language === 'hi') {
        mockText = 'यह एक डमी उत्तर है क्योंकि आपकी .env.local फ़ाइल में GROQ_API_KEY सेट नहीं है। असली AI उत्तरों के लिए कृपया इसे जोड़ें।';
      } else if (language === 'bn') {
        mockText = 'এটি একটি মক উত্তর কারণ আপনার .env.local ফাইলে GROQ_API_KEY সেট করা নেই। আসল এআই উত্তরের জন্য দয়া করে এটি যোগ করুন।';
      }

      return NextResponse.json({
        agent_name: 'KisanSeva AI (Offline Mode)',
        success: true,
        result: { text: mockText, type: 'general_advisory', provider: 'mock' },
        confidence: 1,
        language,
        processing_time_ms: 100,
        sources: ['Mock DB']
      })
    }

    const systemPrompt = `You are KisanSeva AI, an expert agricultural advisor for smallholder farmers in India.
Provide concise, actionable advice about crops, diseases, irrigation, fertilizers, and market prices.
You MUST reply entirely in the language corresponding to this language code: ${language}.
- If language is 'hi', reply in Hindi using Devanagari script (हिंदी में उत्तर दें).
- If language is 'bn', reply in Bengali using Bengali script (বাংলায় উত্তর দিন).
- If language is 'en', reply in English.
Use simple vocabulary that farmers understand. Keep answers concise and practical.
Always prioritise safety — for critical diseases, advise consulting a Krishi Vigyan Kendra (KVK) expert.`

    const groqResp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: query },
        ],
        temperature: 0.3,
        max_tokens: 1024,
      }),
      signal: AbortSignal.timeout(20_000),
    })

    if (!groqResp.ok) {
      const err = await groqResp.text()
      console.error('[Groq] API error:', err)
      throw new Error(`Groq API error: ${groqResp.status}`)
    }

    const groqData = await groqResp.json()
    const text = groqData?.choices?.[0]?.message?.content ?? ''

    return NextResponse.json({
      agent_name: 'KisanSeva AI (Groq)',
      success: true,
      result: {
        text,
        type: 'general_advisory',
        provider: 'groq',
      },
      confidence: 0.9,
      language,
      processing_time_ms: 0,
      sources: ['Groq llama-3.3-70b'],
      follow_up_actions: [],
    })

  } catch (err: any) {
    console.error('[AI Chat API] Error:', err)
    return NextResponse.json(
      { error: 'Internal server error', message: err?.message },
      { status: 500 }
    )
  }
}

