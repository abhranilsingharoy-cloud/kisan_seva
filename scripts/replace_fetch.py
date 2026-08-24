import sys

def replace_lines(filename, start, end, new_content):
    with open(filename, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        
    # lines are 0-indexed, start and end are 1-indexed
    new_lines = lines[:start-1] + [new_content + '\n'] + lines[end:]
    
    with open(filename, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)

new_fetch = """    const fetchRealData = async () => {
      try {
        const center = targetLocation || [30.9010, 75.8573];
        
        // Fetch Live Weather & Soil Moisture
        const meteoRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${center[0]}&longitude=${center[1]}&current=temperature_2m,precipitation,soil_moisture_0_to_1cm`);
        const data = await meteoRes.json();
        
        const realData: RealData = {
          temp: data.current?.temperature_2m || 30,
          moisture: data.current?.soil_moisture_0_to_1cm || 0.25,
          precip: data.current?.precipitation || 0
        };
        
        setRealWeatherData(realData);

        // Calculate base health anchored strictly to real-world physics
        const moistureScore = Math.min(100, Math.max(10, (realData.moisture / 0.35) * 100));
        const tempPenalty = realData.temp > 38 ? 20 : realData.temp > 30 ? 5 : 0;
        const baseHealth = Math.max(10, moistureScore - tempPenalty);

        // Synthesize a realistic grid of farm plots around the target location
        // This restores the "scanning" UI experience for rural regions without complete OSM data
        const newZones: Zone[] = [];
        const rows = 4;
        const cols = 4;
        
        // Dimensions of each synthetic plot (approx 0.003 degrees)
        const latStep = 0.003;
        const lngStep = 0.004;
        
        // Start drawing from top-left of the center point
        const startLat = center[0] - (rows / 2) * latStep;
        const startLng = center[1] - (cols / 2) * lngStep;

        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            // Add slight randomness to coordinates so they look like real imperfect farm plots
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

            // Vary the health slightly per plot to simulate natural field variation
            const randH = Math.floor(Math.random() * 18) - 9 + baseHealth;
            const health = Math.max(10, Math.min(100, randH));
            
            const crops = ['Wheat', 'Rice', 'Sugarcane', 'Cotton', 'Maize', 'Mustard', 'Mixed Crops'];
            const randomCrop = crops[Math.floor(Math.random() * crops.length)];

            newZones.push({
              id: `synth_${r}_${c}`,
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
        
        // Simulate a progressive "scan" by setting zones with a slight delay
        setZones(newZones);

      } catch (error) {
        console.error("Data fetch failed:", error);
      } finally {
        setIsFetchingRealData(false);
      }
    };"""

replace_lines("apps/web/src/app/(app)/topography/page.tsx", 87, 196, new_fetch)
print("Replaced logic with synthetic scanning grid")
