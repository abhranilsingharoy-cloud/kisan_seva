const fs = require('fs');

async function generate(apiKey, prompt) {
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.5, maxOutputTokens: 8192 }
    })
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  let text = data.candidates[0].content.parts[0].text;
  text = text.replace(/```json/g, '').replace(/```/g, '').trim();
  const lastIndex = text.lastIndexOf('},');
  if (text.endsWith(']') || text.endsWith('}')) {
    // probably fine
    if (!text.endsWith(']')) text += ']'; 
  } else if (lastIndex !== -1) {
    text = text.substring(0, lastIndex + 1) + '\n]';
  }
  return JSON.parse(text);
}

async function run() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) { console.error('No API key'); return; }
  
  const schema = `{
    "id": "unique_string", "name": "Disease Name", "scientific": "Scientific Name", "crop": "Crop Name", "severity": "Low", "Moderate", "High", or "Critical",
    "cause": "Fungal", "Bacterial", "Viral", "Oomycete", "Pest",
    "growth_stage": "Seedling, Vegetative, Flowering, or Fruiting",
    "region": "Asia", "North America", "Europe", "Africa", "South America", or "Global",
    "affected_hosts": "1 sentence.", "symptoms": ["Symp 1", "Symp 2"], "conditions": "1 sentence.", "cycle": "1 sentence.", "treatment": "1 sentence.",
    "diagnosis": "1 sentence.", "impact": "1 sentence.", "prevention": "1 sentence.", "organic": ["M 1"], "chemical": ["C 1"], "ipm": "1 sentence.", "geography": "1 sentence.", "differential": "1 sentence."
  }`;

  const prompt1 = `Generate a JSON array of 60 different agricultural crop diseases/pests strictly for: Wheat, Rice, Tomato, Potato, Onion, and Cotton (distribute evenly). Return ONLY a valid JSON array of objects. Use this schema exactly for each object: ${schema}`;
  const prompt2 = `Generate a JSON array of 60 different agricultural crop diseases/pests strictly for: Maize, Sugarcane, Banana, Citrus, Apple, Soybean, and Coffee (distribute evenly). Return ONLY a valid JSON array of objects. Use this schema exactly for each object: ${schema}`;

  try {
      console.log('Generating batch 1...');
      const batch1 = await generate(apiKey, prompt1);
      console.log('Generating batch 2...');
      const batch2 = await generate(apiKey, prompt2);
      
      const all = [...batch1, ...batch2];
      all.forEach((d, i) => d.id = 'ai_gen_' + i);
      fs.writeFileSync('apps/web/src/app/(app)/disease-library/massive_diseases.json', JSON.stringify(all, null, 2));
      console.log('Success! Total:', all.length);
  } catch (e) {
      console.error(e);
  }
}
run();
