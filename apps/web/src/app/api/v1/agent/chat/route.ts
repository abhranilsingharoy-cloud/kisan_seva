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
    const ML_SERVICE_URL = process.env.NEXT_PUBLIC_ML_URL || 'https://kisanseva-api.onrender.com'
    
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
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${GROQ_API_KEY}` },
            body: JSON.stringify({
              model,
              messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: query }],
              temperature: 0.3,
              max_tokens: 1024,
            }),
            signal: AbortSignal.timeout(6000),
          })
          if (groqResp.ok) {
            const data = await groqResp.json()
            text = data?.choices?.[0]?.message?.content || ''
            if (text) { successModel = `Groq/${model}`; break; }
          }
        } catch (e) { /* try next */ }
      }
    }

    // --- ATTEMPT 2: Try Multiple Gemini Models ---
    const geminiModels = ['gemini-1.5-flash', 'gemini-1.5-flash-8b', 'gemini-2.0-flash'];
    if (!text && GEMINI_API_KEY) {
      for (const gModel of geminiModels) {
        try {
          const geminiResp = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${gModel}:generateContent?key=${GEMINI_API_KEY}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{ parts: [{ text: `${systemPrompt}\n\nUser Query: ${query}` }] }],
                generationConfig: { temperature: 0.3, maxOutputTokens: 1024 }
              }),
              signal: AbortSignal.timeout(8000),
            }
          )
          if (geminiResp.ok) {
            const data = await geminiResp.json()
            text = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
            if (text) { successModel = `Gemini/${gModel}`; break; }
          }
        } catch (e) { /* try next */ }
      }
    }

    if (text) {
      return NextResponse.json({
        agent_name: 'KisanSeva AI',
        success: true,
        result: { text, type: 'general_advisory', provider: successModel.startsWith('Groq') ? 'groq' : 'gemini' },
        confidence: 0.9,
        language,
        processing_time_ms: 0,
        sources: [successModel],
        follow_up_actions: [],
      })
    }

    // --- ATTEMPT 3: Render ML Backend ---
    try {
      const mlResp = await fetch(`${ML_SERVICE_URL}/v1/agent/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, language, user_id: user_id || 'anonymous', plot_id, context }),
        signal: AbortSignal.timeout(15000),
      })
      if (mlResp.ok) {
        const mlData = await mlResp.json()
        return NextResponse.json(mlData)
      }
    } catch (e) { /* try next */ }

    // --- ATTEMPT 4: Smart keyword-based responses (always works, no API needed) ---
    const q = query.toLowerCase();
    if (q.includes('date') || q.includes('time') || q.includes('today') || q.includes('aaj')) {
      text = `Today is ${currentDate}.`;
    } else if (q.includes('wheat') || q.includes('gehu')) {
      text = `Wheat Advisory: Sow Nov-Dec (rabi season). Apply 120kg N, 60kg P, 40kg K per hectare. Water 4-6 times. Watch for yellow rust — spray Propiconazole at first signs. MSP: ₹2,275/quintal.`;
    } else if (q.includes('rice') || q.includes('paddy') || q.includes('dhan')) {
      text = `Paddy Advisory: Transplant 25-30 day seedlings. Maintain 5cm water level during tillering. Apply 120-150kg N/ha in 3 splits. Watch for blast and stem borer. Harvest when 80% grains turn golden.`;
    } else if (q.includes('tomato') || q.includes('tamatar')) {
      text = `Tomato Advisory: Space 60x45cm. Stake at 30cm height. Apply NPK 19:19:19 every 15 days. Watch for early blight and leaf curl virus. Irrigate every 5-7 days. Harvest when fruits are red-orange.`;
    } else if (q.includes('fertilizer') || q.includes('khad') || q.includes('urea') || q.includes('dap')) {
      text = `Fertilizer Guide: Use Urea (46% N) for vegetative growth. Apply DAP (18N-46P) at sowing. Use MOP (60% K) during fruiting. Split urea into 3 doses to minimize losses. Ideal soil pH: 6.0-7.5.`;
    } else if (q.includes('disease') || q.includes('rog') || q.includes('pest') || q.includes('keet')) {
      text = `For disease/pest ID: Use the Crop Diagnose feature in this app for instant AI analysis. Common treatment: Copper oxychloride for fungi, Chlorpyrifos for insects, Carbendazim for soil pathogens. Call KVK: 1800-180-1551 (free).`;
    } else if (q.includes('price') || q.includes('mandi') || q.includes('bhav') || q.includes('rate')) {
      text = `Check live mandi prices in the Market section — 500+ mandis updated daily. For MSP rates visit agmarknet.gov.in or call Kisan Call Centre: 1800-180-1551 (toll-free, 24x7).`;
    } else if (q.includes('rain') || q.includes('weather') || q.includes('mausam') || q.includes('barish')) {
      text = `Weather tip: Use the Meghdoot app or imd.gov.in for 5-day farmer-specific forecasts. Avoid sowing before predicted heavy rain. Best sowing: 3-5 clear days after last rain for proper field prep.`;
    } else if (q.includes('loan') || q.includes('kcc') || q.includes('credit') || q.includes('subsidy')) {
      text = `Kisan Credit Card (KCC): Get crop loans at 4% interest (with subvention). Apply at your nearest bank with land records. PM-KISAN gives ₹6,000/year directly to your account. Check Schemes section for all subsidies.`;
    } else if (q.includes('irrigation') || q.includes('drip') || q.includes('pani') || q.includes('water')) {
      text = `Irrigation Advisory: Drip irrigation saves 40-60% water vs flood irrigation. PM Krishi Sinchai Yojana gives 55-75% subsidy on drip systems. Check soil moisture before irrigating — insert finger 2 inches; if dry, water.`;
    } else {
      text = `Namaste! I am KisanSeva Saathi, your AI farming advisor. I can help with:\n• 🌿 Crop disease identification (use Crop Diagnose)\n• 💧 Irrigation and fertilizer schedules\n• 📈 Live mandi prices (Market section)\n• 🏛️ Government schemes and subsidies\n• 🌤️ Weather-based crop advisory\n\nPlease ask your specific farming question!`;
    }

    return NextResponse.json({
      agent_name: 'KisanSeva AI',
      success: true,
      result: { text, type: 'general_advisory', provider: 'knowledge-base' },
      confidence: 0.85,
      language,
      processing_time_ms: 0,
      sources: ['KisanSeva Agricultural Knowledge Base'],
      follow_up_actions: [],
    })

  } catch (err: any) {
    console.error('[Chat API] Error:', err)
    return NextResponse.json({
      agent_name: 'KisanSeva AI',
      success: true,
      result: {
        text: `Namaste! I am KisanSeva Saathi. Ask me anything about crops, diseases, irrigation, or market prices!`,
        type: 'general_advisory',
        provider: 'knowledge-base',
      },
      confidence: 0.8,
      language: 'en',
      sources: ['KisanSeva Knowledge Base']
    })
  }
}
