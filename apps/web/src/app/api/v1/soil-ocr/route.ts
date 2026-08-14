import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const image = formData.get('image') as File | null;

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY not configured on server' }, { status: 500 });
    }

    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString('base64');
    const mimeType = image.type || 'image/jpeg';

    const prompt = `You are an expert Indian agricultural soil scientist and agronomist.
The user has uploaded a photo of a Government of India Soil Health Card or a soil test lab report.

Your task has two parts:

PART 1 — EXTRACT SOIL VALUES:
Carefully read the image and extract these soil parameters. If a value is not visible, use a realistic estimate for Indian agricultural soil:
- Nitrogen (N) in kg/ha
- Phosphorus (P) in kg/ha
- Potassium (K) in kg/ha
- Soil pH
- Organic Carbon (OC) in %
- Sulphur (S) in mg/kg
- Zinc (Zn) in mg/kg
- Iron (Fe) in mg/kg

PART 2 — AI AGRONOMIST DIAGNOSIS:
Based on the extracted values, generate:
1. An overall health score (0-100)
2. A single paragraph diagnosis in plain farmer-friendly language
3. A list of diagnostic tags
4. A week-by-week fertilizer schedule with exactly 5 actions

Return ONLY valid JSON with NO markdown, NO code fences. Use this exact schema:
{
  "extracted": true,
  "metrics": [
    {"name": "Nitrogen (N)", "value": 112, "unit": "kg/ha", "optimal_low": 140, "optimal_high": 280, "status": "low", "color": "#3b82f6"},
    {"name": "Phosphorus (P)", "value": 18, "unit": "kg/ha", "optimal_low": 25, "optimal_high": 55, "status": "low", "color": "#8b5cf6"},
    {"name": "Potassium (K)", "value": 185, "unit": "kg/ha", "optimal_low": 110, "optimal_high": 280, "status": "optimal", "color": "#f59e0b"},
    {"name": "Soil pH", "value": 5.4, "unit": "", "optimal_low": 6.0, "optimal_high": 7.5, "status": "low", "color": "#ec4899"},
    {"name": "Organic Carbon", "value": 0.42, "unit": "%", "optimal_low": 0.75, "optimal_high": 2.0, "status": "low", "color": "#10b981"},
    {"name": "Sulphur (S)", "value": 12, "unit": "mg/kg", "optimal_low": 10, "optimal_high": 20, "status": "optimal", "color": "#6366f1"},
    {"name": "Zinc (Zn)", "value": 0.6, "unit": "mg/kg", "optimal_low": 0.6, "optimal_high": 3.0, "status": "optimal", "color": "#f97316"},
    {"name": "Iron (Fe)", "value": 4.5, "unit": "mg/kg", "optimal_low": 4.5, "optimal_high": 40, "status": "optimal", "color": "#14b8a6"}
  ],
  "overallHealth": 33,
  "diagnosis": "Your soil is highly acidic which is blocking nutrient absorption. A significant Nitrogen and Phosphorus deficiency could reduce yield by 30-45% this season.",
  "tags": ["pH Too Low", "N Deficient", "P Deficient", "K Optimal"],
  "schedule": [
    {"week": "Week 1", "action": "Soil Acidification Treatment", "product": "Agricultural Lime (CaCO3)", "quantity": "2.5 bags (125 kg) per acre", "priority": "high"},
    {"week": "Week 2", "action": "Nitrogen Boost (Basal Dose)", "product": "Urea (46-0-0)", "quantity": "2 bags (100 kg) per acre", "priority": "high"},
    {"week": "Week 3", "action": "Phosphorus Supplement", "product": "DAP (Di-Ammonium Phosphate)", "quantity": "1.5 bags (75 kg) per acre", "priority": "medium"},
    {"week": "Week 5", "action": "Organic Matter Enrichment", "product": "Vermicompost", "quantity": "500 kg per acre", "priority": "medium"},
    {"week": "Week 7", "action": "Nitrogen Top Dressing", "product": "Urea (46-0-0)", "quantity": "1 bag (50 kg) per acre", "priority": "low"}
  ]
}`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    const payload = {
      contents: [{
        parts: [
          { text: prompt },
          { inline_data: { mime_type: mimeType, data: base64Image } }
        ]
      }],
      generationConfig: { temperature: 0.1, maxOutputTokens: 2048 }
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || 'Gemini API Error');

    let raw = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    raw = raw.replace(/```json/gi, '').replace(/```/g, '').trim();

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      throw new Error('AI returned malformed JSON. Please try again.');
    }

    return NextResponse.json({ success: true, data: parsed });

  } catch (err: any) {
    console.error('[soil-ocr] Error:', err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

