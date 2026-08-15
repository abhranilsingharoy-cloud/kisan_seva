import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { sql } from '@vercel/postgres';

const isVercel = !!process.env.VERCEL || !!process.env.POSTGRES_URL;
let localDb: any = null;

if (!isVercel) {
  const { DatabaseSync } = require('node:sqlite');
  const dbDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });
  localDb = new DatabaseSync(path.join(dbDir, 'b2b_contracts.db'));

  localDb.exec(`
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
      tags TEXT NOT NULL, 
      status TEXT NOT NULL, 
      contractHash TEXT,
      securedAt DATETIME,
      notificationLog TEXT 
    )
  `);

  const checkEmpty = localDb.prepare('SELECT COUNT(*) as count FROM bids').get() as { count: number };
  if (checkEmpty.count === 0) {
    const insertStmt = localDb.prepare(`
      INSERT INTO bids (id, buyerName, buyerType, verified, rating, commodity, variety, quantityReq, quantityUnit, priceOffered, marketAvg, deliveryLocation, expiresInHours, tags, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const INITIAL_BIDS = [
      ['BID-9921', 'ITC Agri Business', 'FMCG', 1, 4.9, 'Wheat', 'Sharbati Premium', 50, 'Tonnes', 2950, 2800, 'Sahaswan Hub, UP', 12, JSON.stringify(['Urgent', 'Premium Quality', 'Transport Paid']), 'open'],
      ['BID-8842', 'Reliance Fresh', 'Retailer', 1, 4.7, 'Tomato', 'Hybrid (Red)', 5, 'Tonnes', 45, 38, 'Navi Mumbai Hub, MH', 4, JSON.stringify(['Same-Day Delivery', 'Organic Preferred']), 'open'],
      ['BID-7731', 'Haldiram Snacks', 'FMCG', 1, 4.8, 'Potato', 'Chipsona', 25, 'Tonnes', 1800, 1650, 'Nagpur Factory, MH', 24, JSON.stringify(['Specific Variety', 'Bulk Contract']), 'open'],
      ['BID-6610', 'Evergreen Exports', 'Exporter', 0, 4.2, 'Basmati Rice', 'Pusa-1121', 100, 'Tonnes', 4200, 4100, 'Kandla Port, GJ', 48, JSON.stringify(['Export Quality', 'FSSAI Required']), 'open']
    ];
    INITIAL_BIDS.forEach(bid => insertStmt.run(...bid));
  }
}

async function seedVercelDbIfNeeded() {
  await sql`
    CREATE TABLE IF NOT EXISTS bids (
      id VARCHAR(255) PRIMARY KEY,
      buyerName VARCHAR(255) NOT NULL,
      buyerType VARCHAR(255) NOT NULL,
      verified BOOLEAN NOT NULL,
      rating DOUBLE PRECISION NOT NULL,
      commodity VARCHAR(255) NOT NULL,
      variety VARCHAR(255) NOT NULL,
      quantityReq INTEGER NOT NULL,
      quantityUnit VARCHAR(255) NOT NULL,
      priceOffered INTEGER NOT NULL,
      marketAvg INTEGER NOT NULL,
      deliveryLocation VARCHAR(255) NOT NULL,
      expiresInHours DOUBLE PRECISION NOT NULL,
      tags TEXT NOT NULL, 
      status VARCHAR(255) NOT NULL, 
      contractHash TEXT,
      securedAt TIMESTAMP,
      notificationLog TEXT 
    )
  `;
  const countRes = await sql`SELECT COUNT(*) as count FROM bids`;
  const count = parseInt(countRes.rows[0].count, 10);
  
  if (count === 0) {
    const INITIAL_BIDS = [
      ['BID-9921', 'ITC Agri Business', 'FMCG', true, 4.9, 'Wheat', 'Sharbati Premium', 50, 'Tonnes', 2950, 2800, 'Sahaswan Hub, UP', 12, JSON.stringify(['Urgent', 'Premium Quality', 'Transport Paid']), 'open'],
      ['BID-8842', 'Reliance Fresh', 'Retailer', true, 4.7, 'Tomato', 'Hybrid (Red)', 5, 'Tonnes', 45, 38, 'Navi Mumbai Hub, MH', 4, JSON.stringify(['Same-Day Delivery', 'Organic Preferred']), 'open'],
      ['BID-7731', 'Haldiram Snacks', 'FMCG', true, 4.8, 'Potato', 'Chipsona', 25, 'Tonnes', 1800, 1650, 'Nagpur Factory, MH', 24, JSON.stringify(['Specific Variety', 'Bulk Contract']), 'open'],
      ['BID-6610', 'Evergreen Exports', 'Exporter', false, 4.2, 'Basmati Rice', 'Pusa-1121', 100, 'Tonnes', 4200, 4100, 'Kandla Port, GJ', 48, JSON.stringify(['Export Quality', 'FSSAI Required']), 'open']
    ];
    for (const bid of INITIAL_BIDS) {
      await sql`
        INSERT INTO bids (id, buyerName, buyerType, verified, rating, commodity, variety, quantityReq, quantityUnit, priceOffered, marketAvg, deliveryLocation, expiresInHours, tags, status)
        VALUES (${bid[0] as string}, ${bid[1] as string}, ${bid[2] as string}, ${bid[3] as boolean}, ${bid[4] as number}, ${bid[5] as string}, ${bid[6] as string}, ${bid[7] as number}, ${bid[8] as string}, ${bid[9] as number}, ${bid[10] as number}, ${bid[11] as string}, ${bid[12] as number}, ${bid[13] as string}, ${bid[14] as string})
      `;
    }
  }
}

export async function GET(req: Request) {
  try {
    let results: any[] = [];
    if (isVercel) {
      await seedVercelDbIfNeeded();
      const res = await sql`SELECT * FROM bids ORDER BY CASE WHEN status = 'secured' THEN 1 ELSE 0 END, securedAt DESC`;
      results = res.rows.map(r => ({
        ...r,
        buyername: undefined, // Fix pg returning lowercase column names if unquoted
        buyertype: undefined,
        quantityreq: undefined,
        quantityunit: undefined,
        priceoffered: undefined,
        marketavg: undefined,
        deliverylocation: undefined,
        expiresinhours: undefined,
        contracthash: undefined,
        securedat: undefined,
        notificationlog: undefined,
        buyerName: r.buyername,
        buyerType: r.buyertype,
        quantityReq: r.quantityreq,
        quantityUnit: r.quantityunit,
        priceOffered: r.priceoffered,
        marketAvg: r.marketavg,
        deliveryLocation: r.deliverylocation,
        expiresInHours: r.expiresinhours,
        contractHash: r.contracthash,
        securedAt: r.securedat,
        notificationLog: r.notificationlog
      }));
    } else {
      const stmt = localDb!.prepare(`SELECT * FROM bids ORDER BY CASE WHEN status = 'secured' THEN 1 ELSE 0 END, securedAt DESC`);
      results = stmt.all() as any[];
    }
    
    // Parse JSON fields
    const parsedBids = results.map(row => ({
      ...row,
      verified: row.verified === 1 || row.verified === true,
      tags: typeof row.tags === 'string' ? JSON.parse(row.tags) : row.tags,
      notificationLog: row.notificationLog ? (typeof row.notificationLog === 'string' ? JSON.parse(row.notificationLog) : row.notificationLog) : null
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
      let bid: any = null;
      if (isVercel) {
        await seedVercelDbIfNeeded();
        const res = await sql`SELECT * FROM bids WHERE id = ${bidId} AND status = 'open'`;
        if (res.rows.length > 0) {
          const r = res.rows[0];
          bid = { ...r, buyerName: r.buyername, quantityReq: r.quantityreq, quantityUnit: r.quantityunit, commodity: r.commodity };
        }
      } else {
        bid = localDb!.prepare('SELECT * FROM bids WHERE id = ? AND status = "open"').get(bidId) as any;
      }

      if (!bid) {
        return NextResponse.json({ success: false, error: 'Bid not found or already secured.' }, { status: 400 });
      }

      const dataString = `${bid.id}-${Date.now()}-${bid.buyerName}`;
      const contractHash = '0x' + crypto.createHash('sha256').update(dataString).digest('hex');

      const notificationLog = {
        sentAt: new Date().toISOString(),
        recipient: `${bid.buyerName} Procurement Manager`,
        channel: 'WhatsApp Business API & Email',
        message: `Your bid ${bid.id} for ${bid.quantityReq} ${bid.quantityUnit} of ${bid.commodity} has been accepted by Farmer Narayan Kumar. Escrow is now locked. Hash: ${contractHash.substring(0,10)}...`,
        status: 'DELIVERED_AND_READ'
      };

      let updatedBid: any = null;
      if (isVercel) {
        await sql`
          UPDATE bids 
          SET status = 'secured', 
              contractHash = ${contractHash}, 
              securedAt = CURRENT_TIMESTAMP, 
              notificationLog = ${JSON.stringify(notificationLog)}
          WHERE id = ${bidId}
        `;
        const res = await sql`SELECT * FROM bids WHERE id = ${bidId}`;
        const r = res.rows[0];
        updatedBid = {
           ...r,
           buyerName: r.buyername, buyerType: r.buyertype, quantityReq: r.quantityreq, 
           quantityUnit: r.quantityunit, priceOffered: r.priceoffered, marketAvg: r.marketavg, 
           deliveryLocation: r.deliverylocation, expiresInHours: r.expiresinhours, 
           contractHash: r.contracthash, securedAt: r.securedat, notificationLog: r.notificationlog
        };
      } else {
        const updateStmt = localDb!.prepare(`
          UPDATE bids 
          SET status = 'secured', 
              contractHash = ?, 
              securedAt = CURRENT_TIMESTAMP, 
              notificationLog = ? 
          WHERE id = ?
        `);
        updateStmt.run(contractHash, JSON.stringify(notificationLog), bidId);
        updatedBid = localDb!.prepare('SELECT * FROM bids WHERE id = ?').get(bidId) as any;
      }
      
      return NextResponse.json({ 
        success: true, 
        message: 'Contract successfully secured', 
        bid: {
          ...updatedBid,
          verified: updatedBid.verified === 1 || updatedBid.verified === true,
          tags: typeof updatedBid.tags === 'string' ? JSON.parse(updatedBid.tags) : updatedBid.tags,
          notificationLog: typeof updatedBid.notificationLog === 'string' ? JSON.parse(updatedBid.notificationLog) : updatedBid.notificationLog
        }
      });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });

  } catch (error: any) {
    console.error("B2B POST Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
