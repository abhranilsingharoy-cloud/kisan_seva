import os, json, urllib.request, time

api_key = os.environ.get('GEMINI_API_KEY')
schema = """{
  "id": "unique_string", "name": "Disease Name", "scientific": "Scientific Name", "crop": "Crop Name", "severity": "Low", "Moderate", "High", or "Critical",
  "cause": "Fungal", "Bacterial", "Viral", "Oomycete", "Pest",
  "growth_stage": "Seedling, Vegetative, Flowering, or Fruiting",
  "region": "Asia", "North America", "Europe", "Africa", "South America", or "Global",
  "affected_hosts": "1 sentence.", "symptoms": ["Symp 1", "Symp 2"], "conditions": "1 sentence.", "cycle": "1 sentence.", "treatment": "1 sentence.",
  "diagnosis": "1 sentence.", "impact": "1 sentence.", "prevention": "1 sentence.", "organic": ["M 1"], "chemical": ["C 1"], "ipm": "1 sentence.", "geography": "1 sentence.", "differential": "1 sentence."
}"""

def gen(prompt):
    data = json.dumps({
        'contents': [{'parts': [{'text': prompt}]}],
        'generationConfig': {'temperature': 0.7, 'maxOutputTokens': 8192}
    }).encode('utf-8')
    req = urllib.request.Request(f'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}', data=data, headers={'Content-Type': 'application/json'})
    try:
        with urllib.request.urlopen(req) as response:
            res_data = json.loads(response.read().decode())
            text = res_data['candidates'][0]['content']['parts'][0]['text']
            return text.replace('```json', '').replace('```', '').strip()
    except Exception as e:
        print("Error:", e)
        return "[]"

crops = ["Wheat", "Rice", "Tomato", "Potato", "Onion", "Cotton", "Maize", "Sugarcane", "Banana", "Citrus", "Soybean", "Apple"]
all_diseases = []

for i, crop in enumerate(crops):
    print(f"Generating 8 diseases for {crop}...")
    prompt = f"Generate a JSON array of exactly 8 different agricultural crop diseases/pests strictly for {crop}. Return ONLY a valid JSON array of objects. Use this schema exactly: {schema}"
    res = gen(prompt)
    try:
        # Simple fix if truncated
        last_idx = res.rfind('},')
        if not (res.endswith(']') or res.endswith('}')) and last_idx != -1:
            res = res[:last_idx+1] + '\n]'
        parsed = json.loads(res)
        all_diseases.extend(parsed)
    except Exception as e:
        print(f"Failed to parse for {crop}: {e}")
    time.sleep(2) # Rate limit

for i, d in enumerate(all_diseases):
    d['id'] = f'ai_gen_{i}'
    if 'growth_stage' not in d: d['growth_stage'] = 'Various'
    if 'region' not in d: d['region'] = 'Global'

print(f"Generated a total of {len(all_diseases)} diseases.")
with open('apps/web/src/app/(app)/disease-library/massive_diseases.json', 'w', encoding='utf-8') as f:
    json.dump(all_diseases, f, indent=2)
