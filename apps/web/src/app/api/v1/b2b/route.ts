import { DatabaseSync } from 'node:sqlite';
import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

// Initialize Database
const dbDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });
const dbPath = path.join(dbDir, 'b2b_contracts.db');

const db = new DatabaseSync(dbPath);

// Create table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS bids (
    id TEXT PRIMARY KEY,
    buyerName TEXT NOT NULL,
    buyerType TEXT NOT NULL,
    verified BOOLEAN NOT NULL,
    rating REAL NOT NULL,
    commodity TEXT NOT NULL,
    variety TEXT NOT NULL,
    quantityReq INTEGER NOT NULL,
    quantityUnit TEXT NOT NULL,
    priceOffered INTEGER NOT NULL,
    marketAvg INTEGER NOT NULL,
    deliveryLocation TEXT NOT NULL,
    expiresInHours REAL NOT NULL,
    tags TEXT NOT NULL, -- Stored as JSON string
    status TEXT NOT NULL, -- 'open', 'accepting', 'secured'
    contractHash TEXT,
    securedAt DATETIME,
    notificationLog TEXT -- Stored as JSON string
  )
`);

// Seed initial data if the table is empty
const checkEmpty = db.prepare('SELECT COUNT(*) as count FROM bids').get() as { count: number };
if (checkEmpty.count === 0) {
  const insertStmt = db.prepare(`
    INSERT INTO bids (id, buyerName, buyerType, verified, rating, commodity, variety, quantityReq, quantityUnit, priceOffered, marketAvg, deliveryLocation, expiresInHours, tags, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  const INITIAL_BIDS = [
    ['BID-9921', 'ITC Agri Business', 'FMCG', 1, 4.9, 'Wheat', 'Sharbati Premium', 50, 'Tonnes', 2950, 2800, 'Sahaswan Hub, UP', 12, JSON.stringify(['Urgent', 'Premium Quality', 'Transport Paid']), 'open'],
    ['BID-8842', 'Reliance Fresh', 'Retailer', 1, 4.7, 'Tomato', 'Hybrid (Red)', 5, 'Tonnes', 45, 38, 'Navi Mumbai Hub, MH', 4, JSON.stringify(['Same-Day Delivery', 'Organic Preferred']), 'open'],
    ['BID-7731', 'Haldiram Snacks', 'FMCG', 1, 4.8, 'Potato', 'Chipsona', 25, 'Tonnes', 1800, 1650, 'Nagpur Factory, MH', 24, JSON.stringify(['Specific Variety', 'Bulk Contract']), 'open'],
    ['BID-6610', 'Evergreen Exports', 'Exporter', 0, 4.2, 'Basmati Rice', 'Pusa-1121', 100, 'Tonnes', 4200, 4100, 'Kandla Port, GJ', 48, JSON.stringify(['Export Quality', 'FSSAI Required']), 'open']
  ];

  INITIAL_BIDS.forEach(bid => {
    insertStmt.run(...bid);
  });
}

export async function GET(req: Request) {
  try {
    const stmt = db.prepare(`SELECT * FROM bids ORDER BY CASE WHEN status = 'secured' THEN 1 ELSE 0 END, securedAt DESC`);
    const results = stmt.all() as any[];
    
    // Parse JSON fields
    const parsedBids = results.map(row => ({
      ...row,
      verified: row.verified === 1,
      tags: JSON.parse(row.tags),
      notificationLog: row.notificationLog ? JSON.parse(row.notificationLog) : null
    }));

    return NextResponse.json({ success: true, bids: parsedBids });
  } catch (error: any) {
    console.error("B2B GET Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, bidId } = body;

    if (action === 'accept') {
      // 1. Verify bid is still open
      const bid = db.prepare('SELECT * FROM bids WHERE id = ? AND status = "open"').get(bidId) as any;
      if (!bid) {
        return NextResponse.json({ success: false, error: 'Bid not found or already secured.' }, { status: 400 });
      }

      // 2. Generate Cryptographic Hash (Smart Contract ID)
      const dataString = `${bid.id}-${Date.now()}-${bid.buyerName}`;
      const contractHash = '0x' + crypto.createHash('sha256').update(dataString).digest('hex');

      // 3. Generate Notification Log
      const notificationLog = {
        sentAt: new Date().toISOString(),
        recipient: `${bid.buyerName} Procurement Manager`,
        channel: 'WhatsApp Business API & Email',
        message: `Your bid ${bid.id} for ${bid.quantityReq} ${bid.quantityUnit} of ${bid.commodity} has been accepted by Farmer Narayan Kumar. Escrow is now locked. Hash: ${contractHash.substring(0,10)}...`,
        status: 'DELIVERED_AND_READ'
      };

      // 4. Update Database to 'secured' state
      const updateStmt = db.prepare(`
        UPDATE bids 
        SET status = 'secured', 
            contractHash = ?, 
            securedAt = CURRENT_TIMESTAMP, 
            notificationLog = ? 
        WHERE id = ?
      `);
      
      updateStmt.run(contractHash, JSON.stringify(notificationLog), bidId);

      // Fetch the updated bid to return to frontend
      const updatedBid = db.prepare('SELECT * FROM bids WHERE id = ?').get(bidId) as any;
      
      return NextResponse.json({ 
        success: true, 
        message: 'Contract successfully secured', 
        bid: {
          ...updatedBid,
          verified: updatedBid.verified === 1,
          tags: JSON.parse(updatedBid.tags),
          notificationLog: JSON.parse(updatedBid.notificationLog)
        }
      });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });

  } catch (error: any) {
    console.error("B2B POST Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
