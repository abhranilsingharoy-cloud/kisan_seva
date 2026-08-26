import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const image = formData.get('image') as File | null;
    const provider = formData.get('provider') as string || 'gemini';

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    // Convert file to base64
    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString('base64');
    const mimeType = image.type || 'image/jpeg';

    const systemPrompt = `You are an expert crop agronomist and disease specialist. Analyze the provided crop leaf image.
Identify the crop and the disease, provide a confidence level (0-100), severity (Low, Moderate, High), and a short paragraph description.
Also provide exactly 3 short recommended treatment/action steps, key visual symptoms, root cause of the disease, and prevention strategies for the future.
Return ONLY valid JSON matching this schema exactly, with no markdown formatting or extra text:
{
  "disease": "string",
  "confidence": 95,
  "severity": "High",
  "description": "string",
  "symptoms": ["symptom 1", "symptom 2"],
  "causes": "string",
  "prevention": "string",
  "treatmentSteps": ["step 1", "step 2", "step 3"]
}`;

    let resultJson = "";
    let successProvider = "";

    // ATTEMPT 1: Gemini (Try multiple models)
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey && geminiKey.length > 20) {
      const visionModels = ['gemini-3.6-flash', 'gemini-2.5-flash'];
      for (const gModel of visionModels) {
        try {
          const url = `https://generativelanguage.googleapis.com/v1beta/models/${gModel}:generateContent?key=${geminiKey}`;
          const payload = {
            contents: [{ parts: [{ text: systemPrompt }, { inline_data: { mime_type: mimeType, data: base64Image } }] }],
            generationConfig: { responseMimeType: "application/json", temperature: 0.1, maxOutputTokens: 4096 }
          };
          const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
          const data = await response.json();
          if (response.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
            resultJson = data.candidates[0].content.parts[0].text;
            successProvider = 'gemini';
            break;
          }
        } catch (e) { /* try next */ }
      }
    }

    // ATTEMPT 2: Nvidia NIM Fallback
    const nvidiaKey = process.env.NVIDIA_NIM_KEY || process.env.GEMINI_API_KEY; // Fallback in case user put Nvidia key in Gemini slot
    if (!resultJson && nvidiaKey && nvidiaKey.startsWith('AQ.')) {
      try {
        const url = 'https://integrate.api.nvidia.com/v1/chat/completions';
        const payload = {
          model: 'meta/llama-3.2-90b-vision-instruct',
          messages: [{
            role: 'user',
            content: [
              { type: 'text', text: systemPrompt },
              { type: 'image_url', image_url: { url: `data:${mimeType};base64,${base64Image}` } }
            ]
          }],
          temperature: 0.1,
          max_tokens: 2048,
        };
        const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${nvidiaKey}` }, body: JSON.stringify(payload) });
        const data = await response.json();
        if (response.ok && data.choices?.[0]?.message?.content) {
          resultJson = data.choices[0].message.content;
          successProvider = 'nvidia';
        }
      } catch (e) { /* fallback */ }
    }

    // ATTEMPT 3: ML Backend (Render)
    if (!resultJson) {
      try {
        const ML_SERVICE_URL = process.env.NEXT_PUBLIC_ML_URL || 'https://kisanseva-api.onrender.com'
        const response = await fetch(`${ML_SERVICE_URL}/v1/diagnose`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: `data:${mimeType};base64,${base64Image}` }),
          signal: AbortSignal.timeout(15000),
        })
        if (response.ok) {
          const mlData = await response.json()
          return NextResponse.json(mlData)
        }
      } catch (e) { /* fail */ }
    }

    if (!resultJson) {
      throw new Error("All AI vision models failed. Please check your API keys in Vercel.");
    }

    // Clean up markdown code blocks if the model returned them
    resultJson = resultJson.replace(/```json/g, '').replace(/```/g, '').trim();
    
    // Extra: extract JSON object if buried in surrounding text
    const jsonMatch = resultJson.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      resultJson = jsonMatch[0];
    }

    let parsed;
    try {
      parsed = JSON.parse(resultJson);
    } catch (e) {
      console.error("Failed to parse JSON:", resultJson.substring(0, 500));
      throw new Error("AI returned invalid JSON formatting.");
    }

    return NextResponse.json({ success: true, provider, data: parsed });

  } catch (error: any) {
    console.error("[Diagnose API Error]:", error);
    return NextResponse.json({ success: false, error: error.message || 'Diagnosis failed' }, { status: 500 });
  }
}



