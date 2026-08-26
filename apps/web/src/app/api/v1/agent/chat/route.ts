import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

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
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY || ''
    
    const rawBody = await req.json()
    const parseResult = ChatRequestSchema.safeParse(rawBody)
    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: parseResult.error.flatten() },
        { status: 400 }
      )
    }
    
    const { query, language, user_id, plot_id, context } = parseResult.data

    const currentDate = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'full', timeStyle: 'long' });
    const systemPrompt = `You are KisanSeva AI, an expert agricultural advisor for smallholder farmers in India.
Your name is "KisanSeva Saathi". 
Today's date is: ${currentDate}.
Provide concise, actionable advice about crops, diseases, irrigation, fertilizers, and market prices.
You MUST reply entirely in the language corresponding to this language code: ${language}.
- If language is 'hi', reply in Hindi using Devanagari script.
- If language is 'bn', reply in Bengali using Bengali script.
- If language is 'en', reply in English.
Use simple vocabulary that farmers understand. Keep answers concise and practical.
Always prioritise safety — for critical diseases, advise consulting a Krishi Vigyan Kendra (KVK) expert.`

    let text = '';
    let successModel = '';

    // --- ATTEMPT 1: Try Multiple Groq Models ---
    const groqModels = ['llama-3.1-8b-instant', 'llama3-8b-8192', 'mixtral-8x7b-32768', 'gemma-7b-it'];
    
    if (GROQ_API_KEY) {
      for (const model of groqModels) {
        try {
          const groqResp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${GROQ_API_KEY}`,
            },
            body: JSON.stringify({
              model: model,
              messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: query },
              ],
              temperature: 0.3,
              max_tokens: 1024,
            }),
            signal: AbortSignal.timeout(6000), // 6 sec timeout per model
          })
          
          if (groqResp.ok) {
            const data = await groqResp.json()
            text = data?.choices?.[0]?.message?.content || ''
            if (text) {
              successModel = `Groq ${model}`;
              break;
            }
          }
        } catch (e) {
          console.warn(`[Groq] Model ${model} failed, trying next...`);
        }
      }
    }

    // --- ATTEMPT 2: Fallback to Gemini 1.5 Flash ---
    if (!text && GEMINI_API_KEY) {
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
        const geminiResp = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: `${systemPrompt}\n\nUser Query: ${query}` }]
              }
            ],
            generationConfig: {
              temperature: 0.3,
              maxOutputTokens: 1024
            }
          }),
          signal: AbortSignal.timeout(8000),
        })

        if (geminiResp.ok) {
          const data = await geminiResp.json()
          text = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
          if (text) {
            successModel = 'Google Gemini 1.5 Flash';
          }
        }
      } catch (e) {
        console.warn(`[Gemini] Fallback failed:`, e);
      }
    }

    // If we have text from Groq OR Gemini, return it!
    if (text) {
      return NextResponse.json({
        agent_name: 'KisanSeva AI',
        success: true,
        result: { text, type: 'general_advisory', provider: successModel.includes('Groq') ? 'groq' : 'gemini' },
        confidence: 0.9,
        language,
        processing_time_ms: 0,
        sources: [successModel],
        follow_up_actions: [],
      })
    }

    // --- ATTEMPT 3: Fallback to Python ML Backend (Localtunnel) ---
    try {
      const ML_SERVICE_URL = process.env.NEXT_PUBLIC_ML_URL || 'https://silly-dingos-brake.loca.lt'
      const mlResp = await fetch(`${ML_SERVICE_URL}/api/v1/orchestrator`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, language, user_id, plot_id }),
        signal: AbortSignal.timeout(10000), // 10 sec timeout
      })
      
      if (mlResp.ok) {
        const mlData = await mlResp.json()
        return NextResponse.json(mlData)
      }
    } catch (e) {
      console.warn(`[ML Backend] Fallback failed:`, e);
    }

    // --- ATTEMPT 4: Ultimate Graceful Fallback (Never return 500) ---
    return NextResponse.json({
      agent_name: 'KisanSeva AI (Offline)',
      success: true,
      result: {
        text: "I am temporarily unable to reach the AI servers due to high traffic. Please try again in a few minutes, or contact your local KVK for urgent assistance.",
        type: 'general_advisory',
        provider: 'offline',
      },
      confidence: 1,
      language,
      processing_time_ms: 0,
      sources: ['Offline Cache'],
      follow_up_actions: [],
    })

  } catch (err: any) {
    console.error('[AI Chat API] Critical Error:', err)
    return NextResponse.json({
      agent_name: 'KisanSeva AI (Offline)',
      success: true,
      result: {
        text: "System error: Unable to connect. Please try again later.",
        type: 'error',
        provider: 'error',
      },
      confidence: 0,
      language: 'en',
      sources: []
    })
  }
}
