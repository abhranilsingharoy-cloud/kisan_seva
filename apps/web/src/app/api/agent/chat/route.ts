/**
 * KisanSeva — Next.js AI Chat API Route
 * Server-side route that proxies to the ML service agent API,
 * or calls Gemini directly as a fallback.
 */
import { NextRequest, NextResponse } from 'next/server'

const ML_SERVICE_URL = process.env.NEXT_PUBLIC_ML_URL || 'http://localhost:8000'
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || ''
const GEMINI_MODEL   = 'gemini-2.0-flash'

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
        signal: AbortSignal.timeout(25_000),
      })

      if (mlResp.ok) {
        const data = await mlResp.json()
        return NextResponse.json(data)
      }
    } catch (mlErr) {
      console.warn('[AI Chat] ML service unavailable, falling back to Gemini direct:', mlErr)
    }

    // ── Fallback: Call Gemini directly ────────────────────
    if (!GEMINI_API_KEY) {
      return NextResponse.json({
        agent_name: 'KisanSeva AI',
        success: false,
        result: { text: 'AI service is temporarily unavailable. Please try again shortly.' },
        confidence: 0,
        language,
        processing_time_ms: 0,
        error: 'No AI provider available',
      })
    }

    const systemPrompt = `You are KisanSeva AI, an expert agricultural advisor for smallholder farmers in India.
Provide concise, actionable advice about crops, diseases, irrigation, fertilizers, and market prices.
When answering in Hindi or regional languages, use simple vocabulary farmers understand.
Always prioritise safety — for critical diseases, advise consulting a Krishi Vigyan Kendra (KVK) expert.
Current context: language=${language}, plot_id=${plot_id || 'unknown'}`

    const geminiResp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents: [{ role: 'user', parts: [{ text: query }] }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 1024,
            topP: 0.95,
          },
          safetySettings: [
            { category: 'HARM_CATEGORY_HARASSMENT',        threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_HATE_SPEECH',       threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
          ],
        }),
        signal: AbortSignal.timeout(20_000),
      }
    )

    if (!geminiResp.ok) {
      const err = await geminiResp.text()
      console.error('[Gemini] API error:', err)
      throw new Error(`Gemini API error: ${geminiResp.status}`)
    }

    const geminiData = await geminiResp.json()
    const text = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
    const usage = geminiData?.usageMetadata ?? {}

    return NextResponse.json({
      agent_name: 'KisanSeva AI (Gemini)',
      success: true,
      result: {
        text,
        type: 'general_advisory',
        provider: 'gemini',
      },
      confidence: 0.85,
      language,
      processing_time_ms: 0,
      sources: ['Gemini 2.0 Flash'],
      follow_up_actions: [],
      usage: {
        prompt_tokens: usage.promptTokenCount ?? 0,
        completion_tokens: usage.candidatesTokenCount ?? 0,
      },
    })

  } catch (err: any) {
    console.error('[AI Chat API] Error:', err)
    return NextResponse.json(
      { error: 'Internal server error', message: err?.message },
      { status: 500 }
    )
  }
}
