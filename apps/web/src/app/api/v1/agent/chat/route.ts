/**
 * KisanSeva â€” AI Chat API Route
 * 
 * @route POST /api/v1/agent/chat
 * @description Conversational agricultural AI powered by Groq Llama-3 70B.
 *   Attempts to proxy to the local Python ML orchestrator first, then falls
 *   back to calling Groq directly for maximum resilience.
 * 
 * @example Request body:
 * {
 *   "query": "My tomato leaves are turning yellow",
 *   "language": "hi",
 *   "user_id": "user_abc123",
 *   "plot_id": "plot_xyz",
 *   "context": { "crop": "tomato", "location": "Punjab" }
 * }
 * 
 * @example Response:
 * {
 *   "agent_name": "KisanSeva AI (Groq)",
 *   "success": true,
 *   "result": { "text": "...", "type": "general_advisory", "provider": "groq" },
 *   "confidence": 0.9,
 *   "language": "hi",
 *   "sources": ["Groq llama3-70b-8192"]
 * }
 */
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const ML_SERVICE_URL = process.env.NEXT_PUBLIC_ML_URL || 'http://localhost:8000'
const GROQ_MODEL     = 'groq/compound'

/** Zod schema for validating incoming chat request bodies */
const ChatRequestSchema = z.object({
  query: z.string().min(1, 'query is required').max(2000, 'query too long'),
  language: z.string().default('en'),
  user_id: z.string().optional(),
  plot_id: z.string().optional(),
  context: z.any().default({}),
})

export async function POST(req: NextRequest) {
  try {
    const GROQ_API_KEY = process.env.GROQ_API_KEY || ''
    
    const rawBody = await req.json()
    
    // Validate inputs with Zod
    const parseResult = ChatRequestSchema.safeParse(rawBody)
    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: parseResult.error.flatten() },
        { status: 400 }
      )
    }
    
    const { query, language, user_id, plot_id, context } = parseResult.data

    // ── Go straight to Groq (ML tunnel is unreliable on production) ──────────
    if (!GROQ_API_KEY) {
      return NextResponse.json({
        agent_name: 'KisanSeva AI (Offline Mode)',
        success: true,
        result: { text: 'GROQ_API_KEY is not configured. Please add it to Vercel Environment Variables.', type: 'general_advisory', provider: 'mock' },
        confidence: 1,
        language,
        processing_time_ms: 100,
        sources: ['Mock']
      })
    }

    const currentDate = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'full', timeStyle: 'long' });
    const systemPrompt = `You are KisanSeva AI, an expert agricultural advisor for smallholder farmers in India.
Your name is "KisanSeva Saathi". 
Today's current date and time in India is: ${currentDate}. You have real-time awareness of the present date.
Provide concise, actionable advice about crops, diseases, irrigation, fertilizers, and market prices.
You MUST reply entirely in the language corresponding to this language code: ${language}.
- If language is 'hi', reply in Hindi using Devanagari script (à¤¹à¤¿à¤‚à¤¦à¥€ à¤®à¥‡à¤‚ à¤‰à¤¤à¥à¤¤à¤° à¤¦à¥‡à¤‚).
- If language is 'bn', reply in Bengali using Bengali script (à¦¬à¦¾à¦‚à¦²à¦¾à¦¯à¦¼ à¦‰à¦¤à§à¦¤à¦° à¦¦à¦¿à¦¨).
- If language is 'en', reply in English.
Use simple vocabulary that farmers understand. Keep answers concise and practical.
Always prioritise safety â€” for critical diseases, advise consulting a Krishi Vigyan Kendra (KVK) expert.`

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
      sources: [`Groq ${GROQ_MODEL}`],
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


