/**
 * KisanSeva — Live Mandi Price API Route
 * Fetches real-time mandi prices from data.gov.in Agmarknet dataset.
 * Endpoint: /api/market?commodity=Tomato&state=Maharashtra&limit=20
 */
import { NextRequest, NextResponse } from 'next/server'

const AGMARKNET_KEY  = process.env.AGMARKNET_API_KEY || ''
const AGMARKNET_BASE = 'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070'

// Transport cost estimate: ₹8/km/tonne under 50km, ₹6/km beyond
function estimateTransportCost(distanceKm: number, volumeTonnes = 1): number {
  if (distanceKm <= 50) return distanceKm * 8 * volumeTonnes
  return (50 * 8 + (distanceKm - 50) * 6) * volumeTonnes
}

// Straight-line distance between two lat/lon points (Haversine)
function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R  = 6371
  const dL = (lat2 - lat1) * Math.PI / 180
  const dl  = (lon2 - lon1) * Math.PI / 180
  const a  = Math.sin(dL/2)**2 + Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dl/2)**2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
}

// Major mandi coordinates for distance calculation
const MANDI_COORDS: Record<string, [number, number]> = {
  'Azadpur':      [28.733, 77.175], 'Vashi':         [19.075, 73.000],
  'Koyambedu':    [13.072, 80.194], 'Yeshwanthpur':  [13.020, 77.553],
  'Ghazipur':     [25.578, 83.570], 'Nasik':         [20.000, 73.790],
  'Pune':         [18.520, 73.855], 'Kolkata':       [22.572, 88.363],
  'Jaipur':       [26.912, 75.787], 'Lucknow':       [26.846, 80.946],
  'Bhopal':       [23.259, 77.412], 'Ahmedabad':     [23.022, 72.571],
  'Hyderabad':    [17.385, 78.486], 'Bengaluru':     [12.971, 77.594],
  'Chandigarh':   [30.733, 76.779], 'Patna':         [25.594, 85.137],
  'Indore':       [22.719, 75.857], 'Surat':         [21.170, 72.831],
  'Nagpur':       [21.145, 79.088], 'Coimbatore':    [11.017, 76.955],
}

function getMandiCoords(mandiName: string): [number, number] | null {
  for (const [key, coords] of Object.entries(MANDI_COORDS)) {
    if (mandiName.toLowerCase().includes(key.toLowerCase())) return coords
  }
  return null
}

// State average price from the ranked results
function stateAverage(records: any[]): number {
  if (!records.length) return 0
  const sum = records.reduce((acc, r) => acc + (parseFloat(r.modal_price) || 0), 0)
  return Math.round(sum / records.length)
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const commodity   = searchParams.get('commodity') || 'Tomato'
  const state       = searchParams.get('state') || ''
  const farmerLat   = parseFloat(searchParams.get('lat') || '20.5937')
  const farmerLon   = parseFloat(searchParams.get('lon') || '78.9629')
  const limit       = Math.min(parseInt(searchParams.get('limit') || '30'), 100)

  if (!AGMARKNET_KEY) {
    return NextResponse.json({ error: 'Agmarknet API key not configured' }, { status: 500 })
  }

  try {
    // Build Agmarknet query params
    const params = new URLSearchParams({
      'api-key':  AGMARKNET_KEY,
      'format':   'json',
      'limit':    limit.toString(),
      'offset':   '0',
      'filters[Commodity]': commodity,
    })
    if (state) params.append('filters[State]', state)

    const url = `${AGMARKNET_BASE}?${params.toString()}`
    const resp = await fetch(url, {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 3600 },
    })

    if (!resp.ok) {
      throw new Error(`Agmarknet API error: ${resp.status} ${resp.statusText}`)
    }

    const raw = await resp.json()
    const records: any[] = raw.records || raw.data || []

    if (!records.length) {
      return NextResponse.json({
        success: false,
        error: `No price data found for ${commodity}${state ? ` in ${state}` : ''}`,
        commodity, state,
      }, { status: 404 })
    }

    // ── Enrich each record ──────────────────────────────────
    const avgPrice = stateAverage(records)

    const enriched = records
      .map((r: any) => {
        const modalPrice = parseFloat(r.modal_price) || 0
        const minPrice   = parseFloat(r.min_price)   || 0
        const maxPrice   = parseFloat(r.max_price)   || 0
        const mandiName  = r.market || r.mandi || 'Unknown'

        // Distance from farmer
        const coords = getMandiCoords(mandiName)
        const distanceKm = coords
          ? Math.round(haversineKm(farmerLat, farmerLon, coords[0], coords[1]))
          : null

        // Net value after transport
        const transportCost = distanceKm
          ? Math.round(estimateTransportCost(distanceKm) / 10) // per quintal approx
          : 0
        const netValue = modalPrice - transportCost

        // vs state average
        const vsAverage = avgPrice ? Math.round(modalPrice - avgPrice) : 0

        return {
          mandiName,
          district:      r.district || '',
          state:         r.state    || state,
          commodity:     r.commodity || commodity,
          variety:       r.variety  || 'Mixed',
          minPrice,
          maxPrice,
          modalPrice,
          unit:          'Quintal',
          vsAverage,
          vsAveragePct:  avgPrice ? Math.round((vsAverage / avgPrice) * 100) : 0,
          distanceKm,
          transportCost,
          netValue,
          arrivalDate:   r.arrival_date || new Date().toISOString().split('T')[0],
          isBestPrice:   false, // will be set after sort
        }
      })
      .filter(r => r.modalPrice > 0)
      .sort((a, b) => b.netValue - a.netValue) // rank by net value (price - transport)

    // Mark best
    if (enriched.length) enriched[0].isBestPrice = true

    // ── Summary stats ───────────────────────────────────────
    const best          = enriched[0]
    const stateAvg      = avgPrice
    const highestPrice  = Math.max(...enriched.map(r => r.modalPrice))
    const lowestPrice   = Math.min(...enriched.map(r => r.modalPrice))
    const priceRange    = highestPrice - lowestPrice
    const spreadPct     = stateAvg ? Math.round((priceRange / stateAvg) * 100) : 0

    // Sell timing signal based on spread
    const sellSignal =
      spreadPct > 20 ? 'High price variation across mandis — sell at best mandi now'
      : spreadPct > 10 ? 'Moderate variation — compare 2-3 nearest mandis before selling'
      : 'Prices stable across mandis — sell at nearest convenient mandi'

    return NextResponse.json({
      success:    true,
      commodity,
      state:      state || 'All States',
      totalMandis: enriched.length,
      stateAvgPrice: stateAvg,
      highestPrice,
      lowestPrice,
      priceRange,
      spreadPct,
      sellSignal,
      bestMandi:  best,
      mandis:     enriched,
      unit:       'INR/Quintal',
      fetchedAt:  new Date().toISOString(),
      source:     'Agmarknet via data.gov.in',
    })

  } catch (err: any) {
    console.error('[Market API]', err)
    return NextResponse.json(
      { error: 'Mandi price fetch failed', message: err.message },
      { status: 500 }
    )
  }
}
