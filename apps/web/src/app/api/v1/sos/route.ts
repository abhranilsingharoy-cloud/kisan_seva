import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { sql } from '@vercel/postgres';

// -- LOCAL SQLITE FALLBACK SETUP --
let localDb: any = null;
const isVercel = !!process.env.VERCEL || !!process.env.POSTGRES_URL;

if (!isVercel) {
  const { DatabaseSync } = require('node:sqlite');
  const dbDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });
  localDb = new DatabaseSync(path.join(dbDir, 'sos_alerts.db'));
  localDb.exec(`
    CREATE TABLE IF NOT EXISTS alerts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

// Haversine formula to calculate distance in KM between two coordinates
function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
  return R * c; 
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const radiusStr = searchParams.get('radius');

    if (!lat || !lng) {
      return NextResponse.json({ error: 'Latitude and Longitude are required' }, { status: 400 });
    }

    const targetLat = parseFloat(lat);
    const targetLng = parseFloat(lng);
    const radiusKm = radiusStr ? parseFloat(radiusStr) : 50; 

    let allAlerts: any[] = [];

    if (isVercel) {
      // VERCEL POSTGRES PROD DB
      // Create table if it doesn't exist just in case
      await sql`
        CREATE TABLE IF NOT EXISTS alerts (
          id SERIAL PRIMARY KEY,
          type VARCHAR(255) NOT NULL,
          latitude DOUBLE PRECISION NOT NULL,
          longitude DOUBLE PRECISION NOT NULL,
          timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;
      // We use interval '1 day' for postgres instead of datetime('now', '-1 day')
      const result = await sql`SELECT * FROM alerts WHERE timestamp >= NOW() - INTERVAL '1 day' ORDER BY timestamp DESC`;
      allAlerts = result.rows;
    } else {
      // LOCAL SQLITE FALLBACK
      const stmt = localDb!.prepare(`SELECT * FROM alerts WHERE timestamp >= datetime('now', '-1 day') ORDER BY timestamp DESC`);
      allAlerts = stmt.all() as any[];
    }

    // Filter by Haversine distance
    const nearbyAlerts = allAlerts.map(alert => {
      const distance = getDistanceFromLatLonInKm(targetLat, targetLng, alert.latitude, alert.longitude);
      return { ...alert, distance };
    }).filter(alert => alert.distance <= radiusKm);

    return NextResponse.json({ alerts: nearbyAlerts });
  } catch (error: any) {
    console.error("SOS GET Error:", error);
    return NextResponse.json({ error: error.message || 'Failed to fetch alerts' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, latitude, longitude } = body;

    if (!type || latitude === undefined || longitude === undefined) {
      return NextResponse.json({ error: 'Type, latitude, and longitude are required' }, { status: 400 });
    }

    if (isVercel) {
      // Create table if not exists just in case it's the first ever query
      await sql`
        CREATE TABLE IF NOT EXISTS alerts (
          id SERIAL PRIMARY KEY,
          type VARCHAR(255) NOT NULL,
          latitude DOUBLE PRECISION NOT NULL,
          longitude DOUBLE PRECISION NOT NULL,
          timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;
      await sql`INSERT INTO alerts (type, latitude, longitude) VALUES (${type}, ${latitude}, ${longitude})`;
    } else {
      const stmt = localDb!.prepare('INSERT INTO alerts (type, latitude, longitude) VALUES (?, ?, ?)');
      stmt.run(type, latitude, longitude);
    }

    return NextResponse.json({ success: true, message: 'SOS Alert broadcasted successfully' });
  } catch (error: any) {
    console.error("SOS POST Error:", error);
    return NextResponse.json({ error: error.message || 'Failed to broadcast alert' }, { status: 500 });
  }
}

