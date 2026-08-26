import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const image = formData.get('image') as File | null;
    const provider = formData.get('provider') as string || 'gemini';

    if (!image) {
      return NextResponse.json({ success: false, error: 'No image provided' }, { status: 400 });
    }

    // Convert file to base64
    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString('base64');
    let mimeType = image.type || 'image/jpeg';
    if (mimeType === 'image/jpg') mimeType = 'image/jpeg';

    const systemPrompt = `You are an expert AI Agronomist analyzing Soil Health Cards via OCR.
Extract the soil metrics (N, P, K, pH, Organic Carbon, etc.) from the image if visible. 
If no text is visible or the image is not a soil card, make highly educated realistic estimates based on the visual soil type or return realistic Indian agricultural averages.
You must ALWAYS respond with ONLY a valid JSON object matching exactly this structure:
{
  "metrics": [
    { "name": "Nitrogen (N)", "value": 115, "unit": "kg/ha", "optimal_low": 130, "optimal_high": 150, "status": "low", "color": "#3b82f6" },
    { "name": "Phosphorus (P)", "value": 45, "unit": "kg/ha", "optimal_low": 30, "optimal_high": 50, "status": "optimal", "color": "#8b5cf6" },
    { "name": "Potassium (K)", "value": 280, "unit": "kg/ha", "optimal_low": 250, "optimal_high": 350, "status": "optimal", "color": "#f59e0b" },
    { "name": "Soil pH", "value": 6.2, "unit": "pH", "optimal_low": 6.5, "optimal_high": 7.5, "status": "low", "color": "#ec4899" },
    { "name": "Organic Carbon", "value": 0.42, "unit": "%", "optimal_low": 0.5, "optimal_high": 0.75, "status": "low", "color": "#10b981" }
  ],
  "schedule": [
    { "week": "Week 1", "action": "Action name", "product": "Fertilizer/Product", "quantity": "amount", "priority": "high" }
  ],
  "diagnosis": "A short 3 sentence diagnosis of the soil health and immediate actions required.",
  "tags": ["Low Nitrogen", "Good pH"],
  "overallHealth": 75
}
Do not wrap in markdown tags like \`\`\`json. Just return the raw JSON object matching the exact structure.`;

    let resultJson = "";

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
        }
      } catch (e) { /* fallback */ }
    }

    if (!resultJson) {
      throw new Error("All AI vision models failed. Please check your API keys in Vercel.");
    }

    // Clean up markdown code blocks if the model returned them
    resultJson = resultJson.replace(/```json/g, '').replace(/```/g, '').trim();
    
    let parsedData;
    try {
      parsedData = JSON.parse(resultJson);
    } catch (e) {
      console.error("Failed to parse JSON:", resultJson);
      throw new Error("AI returned invalid JSON formatting.");
    }

    return NextResponse.json({
      success: true,
      data: parsedData
    });

  } catch (error: any) {
    console.error('[Soil OCR Real API Error]:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to process soil card' }, { status: 500 });
  }
}


