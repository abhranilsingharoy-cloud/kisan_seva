import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { query } = await req.json();
    
    if (!query) {
      return NextResponse.json({ success: false, error: 'No search query provided' }, { status: 400 });
    }

    const systemPrompt = `You are a world-class plant pathologist and agricultural database system.
The user is searching for an agricultural disease or pest using this query: "${query}".
You must synthesize a scientifically accurate, highly detailed pathogen profile for the closest matching agricultural disease.

You must ALWAYS respond with ONLY a valid JSON object matching exactly this structure:
{
  "id": "generated_id",
  "name": "Common Name of the Disease/Pest",
  "scientific": "Scientific Name",
  "crop": "Primary Affected Crop(s)",
  "severity": "Low", "Moderate", "High", or "Critical",
  "cause": "Fungal", "Bacterial", "Viral", "Oomycete", "Soilborne Fungal", or "Pest",
  "affected_hosts": "1-2 sentences on host plants.",
  "symptoms": ["Symptom 1", "Symptom 2", "Symptom 3", "Symptom 4"],
  "conditions": "1-2 sentences on favorable weather/environmental conditions.",
  "cycle": "1-2 sentences explaining the disease lifecycle or pest lifecycle.",
  "diagnosis": "How a lab or field expert diagnoses it.",
  "impact": "Economic or yield impact.",
  "prevention": "1-2 sentences on prevention.",
  "organic": ["Organic method 1", "Organic method 2", "Organic method 3"],
  "chemical": ["Chemical treatment 1", "Chemical treatment 2"],
  "ipm": "Integrated Pest Management overarching strategy.",
  "geography": "Where it is found globally.",
  "differential": "How to differentiate it from a similar looking disease."
}
Do not wrap in markdown tags like \`\`\`json. Just return the raw JSON object.`;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY not configured");
    
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    const payload = {
      contents: [{
        parts: [
          { text: systemPrompt }
        ]
      }],
      generationConfig: {
        temperature: 0.3
      }
    };
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || "Gemini API Error");
    
    let resultJson = data.candidates[0].content.parts[0].text;
    resultJson = resultJson.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const parsedData = JSON.parse(resultJson);
    parsedData.id = 'ai_' + Date.now(); // Ensure unique ID for the frontend

    return NextResponse.json({
      success: true,
      data: parsedData
    });

  } catch (error: any) {
    console.error('[Disease Lookup API Error]:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to search disease' }, { status: 500 });
  }
}
