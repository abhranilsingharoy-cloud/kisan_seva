/**
 * KisanSeva — Live Weather API Route
 * Fetches current weather + 7-day forecast from OpenWeatherMap
 * for a given lat/lon. Used by Schedule page and WeatherAdvisoryAgent.
 */
import { NextRequest, NextResponse } from 'next/server'

const OW_KEY     = process.env.NEXT_PUBLIC_OPENWEATHER_KEY || ''
const OW_BASE    = 'https://api.openweathermap.org/data/2.5'
const OW_GEO     = 'https://api.openweathermap.org/geo/1.0'

// Crop coefficient (Kc) table for ET-based irrigation estimation
const KC_TABLE: Record<string, number> = {
  tomato: 1.15, wheat: 1.10, rice: 1.20, potato: 1.05,
  onion: 1.00, cotton: 1.15, maize: 1.20, soybean: 1.15,
  default: 1.00,
}

function estimateIrrigation(
  tempMax: number, tempMin: number, humidity: number,
  windSpeed: number, rainfall: number, crop: string, stageFactor = 1.0
): number {
  // Hargreaves simplified ET₀ (mm/day)
  const Ra = 15.0  // approx extraterrestrial radiation MJ/m²/day (mid-lat, summer)
  const et0 = 0.0023 * (tempMax - tempMin) ** 0.5 * ((tempMax + tempMin) / 2 + 17.8) * Ra * 0.408
  const kc  = (KC_TABLE[crop.toLowerCase()] ?? KC_TABLE.default) * stageFactor
  const etc = et0 * kc
  const netIrrigation = Math.max(0, Math.round(etc - rainfall))
  return netIrrigation
}

function diseaseRisk(humidity: number, tempAvg: number, rainfall: number) {
  const fungalRisk =
    humidity > 85 && tempAvg >= 18 && tempAvg <= 30 ? 'high'
    : humidity > 70 && tempAvg >= 15 ? 'moderate'
    : 'low'

  const bacterialRisk =
    humidity > 80 && tempAvg > 25 && rainfall > 0 ? 'moderate' : 'low'

  const pestRisk = tempAvg > 35 ? 'moderate' : 'low'

  return { fungalRisk, bacterialRisk, pestRisk }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const lat   = searchParams.get('lat')
  const lon   = searchParams.get('lon')
  const city  = searchParams.get('city')
  const crop  = searchParams.get('crop') || 'default'
  const stage = searchParams.get('stage') || 'vegetative'

  if (!OW_KEY) {
    return NextResponse.json({ error: 'OpenWeather API key not configured' }, { status: 500 })
  }

  try {
    let resolvedLat = lat
    let resolvedLon = lon
    let locationName = city || 'Your Location'

    // ── Geocode city name if lat/lon not provided ─────────
    if ((!lat || !lon) && city) {
      const geoResp = await fetch(
        `${OW_GEO}/direct?q=${encodeURIComponent(city)},IN&limit=1&appid=${OW_KEY}`,
        { signal: AbortSignal.timeout(8000) }
      )
      if (!geoResp.ok) throw new Error('Geocoding failed')
      const geoData = await geoResp.json()
      if (!geoData.length) {
        return NextResponse.json({ error: `City not found: ${city}` }, { status: 404 })
      }
      resolvedLat = geoData[0].lat.toString()
      resolvedLon = geoData[0].lon.toString()
      locationName = `${geoData[0].name}, ${geoData[0].state || 'India'}`
    }

    if (!resolvedLat || !resolvedLon) {
      return NextResponse.json(
        { error: 'Provide lat & lon or city query param' }, { status: 400 }
      )
    }

    // ── Fetch current weather + 5-day forecast ────────────
    const [currentResp, forecastResp] = await Promise.all([
      fetch(
        `${OW_BASE}/weather?lat=${resolvedLat}&lon=${resolvedLon}&appid=${OW_KEY}&units=metric`,
        { signal: AbortSignal.timeout(8000) }
      ),
      fetch(
        `${OW_BASE}/forecast?lat=${resolvedLat}&lon=${resolvedLon}&appid=${OW_KEY}&units=metric&cnt=40`,
        { signal: AbortSignal.timeout(8000) }
      ),
    ])

    if (!currentResp.ok || !forecastResp.ok) {
      throw new Error(`OpenWeather error: ${currentResp.status} / ${forecastResp.status}`)
    }

    const current  = await currentResp.json()
    const forecast = await forecastResp.json()

    // ── Process current weather ───────────────────────────
    const now = {
      temp:        Math.round(current.main.temp),
      feelsLike:   Math.round(current.main.feels_like),
      humidity:    current.main.humidity,
      windSpeed:   Math.round(current.wind.speed * 3.6), // m/s → km/h
      rainfall24h: current.rain?.['1h'] ?? current.rain?.['3h'] ?? 0,
      description: current.weather[0].description,
      icon:        current.weather[0].icon,
      locationName: current.name || locationName,
      country:     current.sys.country,
    }

    // ── Group forecast into daily summaries (noon entry) ──
    const dailyMap = new Map<string, any>()
    for (const item of forecast.list) {
      const date = item.dt_txt.split(' ')[0]
      const hour = parseInt(item.dt_txt.split(' ')[1])
      // Prefer noon reading; first reading as fallback
      if (!dailyMap.has(date) || hour === 12) {
        dailyMap.set(date, item)
      }
    }

    const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
    const daily = Array.from(dailyMap.values()).slice(0, 7).map(item => {
      const d    = new Date(item.dt * 1000)
      const rain = item.rain?.['3h'] ?? 0

      // Irrigation estimate for this day
      const irrigMm = estimateIrrigation(
        item.main.temp_max ?? item.main.temp,
        item.main.temp_min ?? item.main.temp - 8,
        item.main.humidity,
        item.wind.speed,
        rain,
        crop,
        stage === 'germination' ? 0.5 : stage === 'harvest' ? 0.8 : 1.0
      )

      const risk = diseaseRisk(item.main.humidity, item.main.temp, rain)

      return {
        date:        item.dt_txt.split(' ')[0],
        dayName:     days[d.getDay()],
        isToday:     item.dt_txt.split(' ')[0] === new Date().toISOString().split('T')[0],
        maxTemp:     Math.round(item.main.temp_max ?? item.main.temp),
        minTemp:     Math.round(item.main.temp_min ?? item.main.temp - 8),
        humidity:    item.main.humidity,
        rainfall:    Math.round(rain * 10) / 10,
        windSpeed:   Math.round(item.wind.speed * 3.6),
        description: item.weather[0].description,
        icon:        item.weather[0].icon,
        irrigationMm: irrigMm,
        shouldIrrigate: irrigMm > 5,
        diseaseRisk: risk,
        sprayWindow: item.wind.speed < 4 && item.main.humidity < 75
          ? 'Ideal spray conditions (early morning)'
          : item.wind.speed > 5
          ? 'Avoid spraying — too windy'
          : 'Acceptable',
      }
    })

    // ── Today's advisory ──────────────────────────────────
    const todayData = daily[0] ?? null
    const advisory = todayData ? {
      irrigate:      todayData.shouldIrrigate,
      irrigationMm:  todayData.irrigationMm,
      urgency:       todayData.irrigationMm > 25 ? 'high' : todayData.irrigationMm > 10 ? 'moderate' : 'low',
      diseaseAlert:  todayData.diseaseRisk.fungalRisk === 'high'
        ? '⚠️ High fungal disease risk — consider preventive fungicide spray'
        : null,
      sprayWindow:   todayData.sprayWindow,
      generalAdvice: now.rainfall24h > 5
        ? 'Good rainfall received. Skip irrigation today. Watch for waterlogging.'
        : todayData.irrigationMm > 20
        ? `Irrigate ${todayData.irrigationMm}mm urgently — high evapotranspiration.`
        : `Moderate conditions. Irrigate ${todayData.irrigationMm}mm if soil feels dry.`,
    } : null

    return NextResponse.json({
      success: true,
      location: {
        lat: parseFloat(resolvedLat!),
        lon: parseFloat(resolvedLon!),
        name: now.locationName,
      },
      current: now,
      daily,
      advisory,
      crop,
      stage,
      fetchedAt: new Date().toISOString(),
    })

  } catch (err: any) {
    console.error('[Weather API]', err)
    return NextResponse.json(
      { error: 'Weather fetch failed', message: err.message },
      { status: 500 }
    )
  }
}
