import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('image');

    if (!file) {
      return NextResponse.json({ success: false, error: 'No image uploaded' }, { status: 400 });
    }

    // Simulate AI processing delay for the demo
    await new Promise(resolve => setTimeout(resolve, 2500));

    // Return a highly realistic mock response simulating Gemini Vision OCR output
    return NextResponse.json({
      success: true,
      data: {
        metrics: [
          {
            name: "Nitrogen (N)",
            value: 115,
            unit: "kg/ha",
            optimal_low: 130,
            optimal_high: 150,
            status: "low",
            color: "#3b82f6"
          },
          {
            name: "Phosphorus (P)",
            value: 45,
            unit: "kg/ha",
            optimal_low: 30,
            optimal_high: 50,
            status: "optimal",
            color: "#8b5cf6"
          },
          {
            name: "Potassium (K)",
            value: 280,
            unit: "kg/ha",
            optimal_low: 250,
            optimal_high: 350,
            status: "optimal",
            color: "#f59e0b"
          },
          {
            name: "Soil pH",
            value: 6.2,
            unit: "pH",
            optimal_low: 6.5,
            optimal_high: 7.5,
            status: "low",
            color: "#ec4899"
          },
          {
            name: "Organic Carbon",
            value: 0.42,
            unit: "%",
            optimal_low: 0.5,
            optimal_high: 0.75,
            status: "low",
            color: "#10b981"
          }
        ],
        schedule: [
          {
            week: "Week 1 (Pre-sowing)",
            action: "Apply Base Fertilizer",
            product: "Urea + DAP (Di-ammonium Phosphate)",
            quantity: "40 kg/acre Urea, 50 kg/acre DAP",
            priority: "high"
          },
          {
            week: "Week 3 (Vegetative)",
            action: "Correct pH & Top-dress Nitrogen",
            product: "Agricultural Lime + Neem Coated Urea",
            quantity: "100 kg/acre Lime, 30 kg/acre Urea",
            priority: "high"
          },
          {
            week: "Week 6 (Flowering)",
            action: "Foliar Spray for Micro-nutrients",
            product: "Zinc Sulphate + Boron",
            quantity: "2 kg/acre Zn, 1 kg/acre B",
            priority: "medium"
          }
        ],
        diagnosis: "The uploaded soil health card indicates suboptimal Nitrogen (115 kg/ha) and Organic Carbon (0.42%) levels. The soil is slightly acidic (pH 6.2). We recommend an immediate application of Agricultural Lime to correct the pH, combined with Neem Coated Urea to provide a slow-release nitrogen boost. Potassium and Phosphorus levels are well within the optimal range.",
        tags: ["Low Nitrogen", "Slightly Acidic", "Low Carbon", "Good Phosphorus"],
        overallHealth: 68
      }
    });
  } catch (error) {
    console.error('Soil OCR Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to process soil card' }, { status: 500 });
  }
}
