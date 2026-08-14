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
        }]
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
      const baseUrl = 'https://integrate.api.nvidia.com/v1/chat/completions';
      const model = 'meta/llama-3.2-90b-vision-instruct';

      if (!apiKey) throw new Error(`${provider.toUpperCase()}_API_KEY not configured`);

      const payload = {
        model: model,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: systemPrompt },
              { type: 'image_url', image_url: { url: `data:${mimeType};base64,${base64Image}` } }
            ]
          }
        ],
        max_tokens: 600,
        temperature: 0.2,
      };

      const response = await fetch(baseUrl!, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || `${provider} API Error`);
      resultJson = data.choices[0].message.content;

    } else {
      throw new Error(`Provider '${provider}' not supported for vision tasks yet.`);
    }

    // Clean up markdown code blocks if the model returned them
    resultJson = resultJson.replace(/```json/g, '').replace(/```/g, '').trim();
    
    let parsed;
    try {
      parsed = JSON.parse(resultJson);
    } catch (e) {
      console.error("Failed to parse JSON:", resultJson);
      throw new Error("AI returned invalid JSON formatting.");
    }

    return NextResponse.json({ success: true, provider, data: parsed });

  } catch (error: any) {
    console.error("[Diagnose API Error]:", error);
    return NextResponse.json({ success: false, error: error.message || 'Diagnosis failed' }, { status: 500 });
  }
}

