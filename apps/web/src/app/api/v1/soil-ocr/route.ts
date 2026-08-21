import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No image uploaded' }, { status: 400 });
    }

    // Convert file to Base64
    const buffer = await file.arrayBuffer();
    const base64Image = Buffer.from(buffer).toString('base64');
    const mimeType = file.type || 'image/jpeg';
    const dataUrl = `data:${mimeType};base64,${base64Image}`;

    // Get OpenAI Key from environment
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.warn("No OPENAI_API_KEY found, falling back to mock response.");
      return generateMockResponse();
    }

    // Prepare OpenAI request
    const systemPrompt = `You are an expert AI Agronomist analyzing Soil Health Cards via OCR.
Extract the soil metrics (N, P, K, pH, Organic Carbon, etc.) from the image if visible. 
If no text is visible or the image is not a soil card, make highly educated realistic estimates based on the visual soil type or return realistic Indian agricultural averages.
You must ALWAYS respond with ONLY a valid JSON object matching exactly this structure:
{
  "metrics": [
    { "name": "Nitrogen (N)", "value": 115, "unit": "kg/ha", "optimal_low": 130, "optimal_high": 150, "status": "low|optimal|high", "color": "#3b82f6" },
    { "name": "Phosphorus (P)", "value": 45, "unit": "kg/ha", "optimal_low": 30, "optimal_high": 50, "status": "optimal", "color": "#8b5cf6" },
    { "name": "Potassium (K)", "value": 280, "unit": "kg/ha", "optimal_low": 250, "optimal_high": 350, "status": "optimal", "color": "#f59e0b" },
    { "name": "Soil pH", "value": 6.2, "unit": "pH", "optimal_low": 6.5, "optimal_high": 7.5, "status": "low", "color": "#ec4899" },
    { "name": "Organic Carbon", "value": 0.42, "unit": "%", "optimal_low": 0.5, "optimal_high": 0.75, "status": "low", "color": "#10b981" }
  ],
  "schedule": [
    { "week": "Week 1", "action": "Action name", "product": "Fertilizer/Product", "quantity": "amount", "priority": "high|medium|low" }
  ],
  "diagnosis": "A short 3 sentence diagnosis of the soil health and immediate actions required.",
  "tags": ["Low Nitrogen", "Good pH"],
  "overallHealth": 75
}
Do not wrap in markdown tags like \`\`\`json. Just return the raw JSON object. Use realistic metric values based on the image.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: [
              { type: "text", text: "Analyze this soil health card or soil image and provide the JSON report." },
              { type: "image_url", image_url: { url: dataUrl } }
            ]
          }
        ],
        max_tokens: 1000,
        temperature: 0.2
      })
    });

    if (!response.ok) {
      const errTxt = await response.text();
      console.error("OpenAI API Error:", errTxt);
      return generateMockResponse(); // Fallback on error
    }

    const aiData = await response.json();
    let jsonText = aiData.choices[0].message.content;
    
    // Clean up potential markdown formatting
    jsonText = jsonText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const parsedData = JSON.parse(jsonText);

    return NextResponse.json({
      success: true,
      data: parsedData
    });

  } catch (error) {
    console.error('Soil OCR Real API Error:', error);
    return generateMockResponse(); // Ultimate fallback
  }
}

function generateMockResponse() {
  return NextResponse.json({
    success: true,
    data: {
      metrics: [
        { name: "Nitrogen (N)", value: 115, unit: "kg/ha", optimal_low: 130, optimal_high: 150, status: "low", color: "#3b82f6" },
        { name: "Phosphorus (P)", value: 45, unit: "kg/ha", optimal_low: 30, optimal_high: 50, status: "optimal", color: "#8b5cf6" },
        { name: "Potassium (K)", value: 280, unit: "kg/ha", optimal_low: 250, optimal_high: 350, status: "optimal", color: "#f59e0b" },
        { name: "Soil pH", value: 6.2, unit: "pH", optimal_low: 6.5, optimal_high: 7.5, status: "low", color: "#ec4899" },
        { name: "Organic Carbon", value: 0.42, unit: "%", optimal_low: 0.5, optimal_high: 0.75, status: "low", color: "#10b981" }
      ],
      schedule: [
        { week: "Week 1 (Pre-sowing)", action: "Apply Base Fertilizer", product: "Urea + DAP", quantity: "40 kg/acre Urea, 50 kg/acre DAP", priority: "high" },
        { week: "Week 3 (Vegetative)", action: "Correct pH", product: "Agricultural Lime", quantity: "100 kg/acre", priority: "high" },
        { week: "Week 6 (Flowering)", action: "Foliar Spray", product: "Zinc Sulphate", quantity: "2 kg/acre", priority: "medium" }
      ],
      diagnosis: "The AI API fell back to mock data. Nitrogen and Organic Carbon levels are suboptimal. Apply Agricultural Lime to correct pH.",
      tags: ["Fallback Mode", "Low Nitrogen"],
      overallHealth: 68
    }
  });
}
