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

    if (provider === 'gemini') {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error("GEMINI_API_KEY not configured");
      
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
      const payload = {
        contents: [{
          parts: [
            { text: systemPrompt },
            { inline_data: { mime_type: mimeType, data: base64Image } }
          ]
        }],
        generationConfig: {
          temperature: 0.2
        }
      };
      
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || "Gemini API Error");
      resultJson = data.candidates[0].content.parts[0].text;

    } else if (provider === 'nvidia') {
      const apiKey = process.env.NVIDIA_NIM_KEY;
      if (!apiKey) throw new Error("NVIDIA_NIM_KEY not configured");
      const baseUrl = 'https://integrate.api.nvidia.com/v1/chat/completions';
      
      const payload = {
        model: 'meta/llama-3.2-90b-vision-instruct',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: systemPrompt },
              { type: 'image_url', image_url: { url: `data:${mimeType};base64,${base64Image}` } }
            ]
          }
        ],
        max_tokens: 1000,
        temperature: 0.2,
      };

      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || "NVIDIA API Error");
      resultJson = data.choices[0].message.content;

    } else {
      throw new Error(`Provider '${provider}' not supported.`);
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
