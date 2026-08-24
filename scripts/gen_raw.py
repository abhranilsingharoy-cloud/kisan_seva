import os, json, urllib.request

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
        'generationConfig': {'temperature': 0.2, 'maxOutputTokens': 8192}
    }).encode('utf-8')
    req = urllib.request.Request(f'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}', data=data, headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(req) as response:
        res_data = json.loads(response.read().decode())
        text = res_data['candidates'][0]['content']['parts'][0]['text']
        return text.replace('```json', '').replace('```', '').strip()

try:
    print("Generating batch 1 (60 diseases)...")
    b1 = gen(f"Generate a JSON array of exactly 60 different agricultural crop diseases/pests strictly for: Wheat, Rice, Tomato, Potato, Onion, and Cotton. Return ONLY a valid JSON array of objects. Do not truncate. Use this schema exactly: {schema}")
    print("Generating batch 2 (60 diseases)...")
    b2 = gen(f"Generate a JSON array of exactly 60 different agricultural crop diseases/pests strictly for: Maize, Sugarcane, Banana, Citrus, Apple, and Soybean. Return ONLY a valid JSON array of objects. Do not truncate. Use this schema exactly: {schema}")
    
    with open('raw_b1.json', 'w') as f: f.write(b1)
    with open('raw_b2.json', 'w') as f: f.write(b2)
    print("Saved raw output.")
except Exception as e:
    print("Error:", e)
