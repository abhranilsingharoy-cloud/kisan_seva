const fs = require('fs');

async function run() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) { console.error('No API key'); return; }
  
  const prompt = `Generate a JSON array of 50 different agricultural crop diseases (fungal, bacterial, viral, pests) covering a wide variety of global crops (wheat, rice, maize, tomato, potato, citrus, banana, coffee, cotton, sugarcane, etc).
Return ONLY a valid JSON array of objects, with no markdown formatting.
Each object must have this exact structure:
{
  "id": "unique_string",
  "name": "Disease Name",
  "scientific": "Scientific Name",
  "crop": "Affected Crop",
  "severity": "Low", "Moderate", "High", or "Critical",
  "cause": "Fungal", "Bacterial", "Viral", "Oomycete", "Soilborne Fungal", or "Pest",
  "affected_hosts": "1 sentence.",
  "symptoms": ["Symptom 1", "Symptom 2", "Symptom 3"],
  "conditions": "1 sentence.",
  "cycle": "1 sentence.",
  "diagnosis": "1 sentence.",
  "impact": "1 sentence.",
  "prevention": "1 sentence.",
  "organic": ["Method 1", "Method 2"],
  "chemical": ["Chemical 1", "Chemical 2"],
  "ipm": "1 sentence.",
  "geography": "1 sentence.",
  "differential": "1 sentence."
}`;

  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 8000 }
    })
  });
  
  const data = await res.json();
  let text = data.candidates[0].content.parts[0].text;
  text = text.replace(/```json/g, '').replace(/```/g, '').trim();
  fs.writeFileSync('apps/web/src/app/(app)/disease-library/massive_diseases.json', text);
  console.log('Generated massive_diseases.json with size: ', text.length);
}
run();
