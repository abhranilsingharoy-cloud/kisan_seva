const fs = require('fs');

async function run() {
  const apiKey = process.env.GEMINI_API_KEY;
  const schema = `{ "id": "id", "name": "Name", "scientific": "Sci", "crop": "Crop", "severity": "High", "cause": "Fungal", "growth_stage": "Flowering", "region": "Asia", "affected_hosts": "1", "symptoms": ["1"], "conditions": "1", "cycle": "1", "diagnosis": "1", "impact": "1", "prevention": "1", "organic": ["1"], "chemical": ["1"], "ipm": "1", "geography": "1", "differential": "1" }`;

  const failedCrops = ["Banana", "Cotton", "Potato", "Tomato", "Citrus", "Soybean"];
  const existing = JSON.parse(fs.readFileSync('apps/web/src/app/(app)/disease-library/massive_diseases.json'));
  
  for (const crop of failedCrops) {
    const prompt = `Generate a JSON array of exactly 9 different agricultural crop diseases strictly for ${crop}. Return ONLY a valid JSON array of objects. Schema: ${schema}`;
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      const data = await res.json();
      let text = data.candidates[0].content.parts[0].text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(text);
      existing.push(...parsed);
      console.log('Success for', crop);
    } catch(e) {
      console.log('Failed for', crop);
    }
    await new Promise(r => setTimeout(r, 2000));
  }

  existing.forEach((d, i) => d.id = 'ai_gen_' + i);
  fs.writeFileSync('apps/web/src/app/(app)/disease-library/massive_diseases.json', JSON.stringify(existing, null, 2));
  console.log('Final Total:', existing.length);
}
run();
