// @ts-ignore: node:sqlite is available in Node 26 runtime but not in @types/node v20
import { DatabaseSync } from 'node:sqlite';
import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

// Initialize Database
const dbDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });
const dbPath = path.join(dbDir, 'sos_alerts.db');

const db = new DatabaseSync(dbPath);
db.exec(`
  CREATE TABLE IF NOT EXISTS alerts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

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
  const d = R * c; // Distance in km
  return d;
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
    const radiusKm = radiusStr ? parseFloat(radiusStr) : 50; // Default 50km radius

    // Get all alerts from the last 24 hours
    const stmt = db.prepare(`SELECT * FROM alerts WHERE timestamp >= datetime('now', '-1 day') ORDER BY timestamp DESC`);
    const allAlerts = stmt.all() as any[];

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

    const stmt = db.prepare('INSERT INTO alerts (type, latitude, longitude) VALUES (?, ?, ?)');
    stmt.run(type, latitude, longitude);

    return NextResponse.json({ success: true, message: 'SOS Alert broadcasted successfully' });
  } catch (error: any) {
    console.error("SOS POST Error:", error);
    return NextResponse.json({ error: error.message || 'Failed to broadcast alert' }, { status: 500 });
  }
}
