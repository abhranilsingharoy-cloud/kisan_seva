import re

with open("apps/web/src/app/(app)/topography/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Fix targetLocation default
old_target = "const [targetLocation, setTargetLocation] = useState<[number, number] | null>(null);"
new_target = "const [targetLocation, setTargetLocation] = useState<[number, number] | null>([30.9010, 75.8573]);"
content = content.replace(old_target, new_target)

# Fix fetchRealData robustness
old_fetch = r"""    const fetchRealData = async \(\) => \{
      try \{
        const center = targetLocation \|\| \[30\.9010, 75\.8573\];.*?\} catch \(error\) \{
        console\.error\("Data fetch failed:", error\);
      \} finally \{
        setIsFetchingRealData\(false\);
      \}
    \};"""

new_fetch = """    const fetchRealData = async () => {
      setZones([]); // Clear existing
      const center = targetLocation || [30.9010, 75.8573];
      
      const generateGrid = (baseHealth: number) => {
        const generatedZones: Zone[] = [];
        const rows = 4;
        const cols = 4;
        const latStep = 0.003;
        const lngStep = 0.004;
        const startLat = center[0] - (rows / 2) * latStep;
        const startLng = center[1] - (cols / 2) * lngStep;

        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const rLat = startLat + r * latStep + (Math.random() * 0.0005);
            const rLng = startLng + c * lngStep + (Math.random() * 0.0005);
            const polySizeLat = latStep * 0.85;
            const polySizeLng = lngStep * 0.85;
            
            const geom = [
              [rLat, rLng],
              [rLat + polySizeLat, rLng + (Math.random() * 0.0005)],
              [rLat + polySizeLat + (Math.random() * 0.0005), rLng + polySizeLng],
              [rLat - (Math.random() * 0.0005), rLng + polySizeLng],
              [rLat, rLng]
            ] as [number, number][];

            const randH = Math.floor(Math.random() * 18) - 9 + baseHealth;
            const health = Math.max(10, Math.min(100, randH));
            const crops = ['Wheat', 'Rice', 'Sugarcane', 'Cotton', 'Maize', 'Mustard', 'Mixed Crops'];
            const randomCrop = crops[Math.floor(Math.random() * crops.length)];

            generatedZones.push({
              id: `synth_${r}_${c}_${Date.now()}`,
              name: `Plot ${r}${c}-${Math.floor(Math.random() * 1000)}`,
              crop: randomCrop,
              area: `${(Math.random() * 1.5 + 0.8).toFixed(1)} ha`,
              health,
              ndvi: (health / 100) * 0.95,
              issue: health > 65 ? 'Optimal growth parameters detected.' : (health > 45 ? 'Moderate water or heat stress.' : 'Critical telemetry alerts active.'),
              coordinates: geom
            });
          }
        }
        return generatedZones;
      };

      try {
        const meteoRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${center[0]}&longitude=${center[1]}&current=temperature_2m,precipitation,soil_moisture_0_to_1cm`);
        const data = await meteoRes.json();
        
        const realData: RealData = {
          temp: data.current?.temperature_2m || 30,
          moisture: data.current?.soil_moisture_0_to_1cm || 0.25,
          precip: data.current?.precipitation || 0
        };
        
        setRealWeatherData(realData);

        const moistureScore = Math.min(100, Math.max(10, (realData.moisture / 0.35) * 100));
        const tempPenalty = realData.temp > 38 ? 20 : realData.temp > 30 ? 5 : 0;
        const baseHealth = Math.max(10, moistureScore - tempPenalty);

        const newZones = generateGrid(baseHealth);
        
        const scanZones = async () => {
          for (let i = 1; i <= newZones.length; i++) {
            setZones(newZones.slice(0, i));
            await new Promise(r => setTimeout(r, 80));
          }
        };
        scanZones();

      } catch (error) {
        console.error("Data fetch failed:", error);
        // Fallback if API fails
        const newZones = generateGrid(75);
        const scanZones = async () => {
          for (let i = 1; i <= newZones.length; i++) {
            setZones(newZones.slice(0, i));
            await new Promise(r => setTimeout(r, 80));
          }
        };
        scanZones();
      } finally {
        setIsFetchingRealData(false);
      }
    };"""

content = re.sub(old_fetch, new_fetch, content, flags=re.DOTALL)

with open("apps/web/src/app/(app)/topography/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Fixed logic entirely.")
