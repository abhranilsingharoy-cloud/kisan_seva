import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { sql } from '@vercel/postgres';

const isVercel = !!process.env.VERCEL || !!process.env.POSTGRES_URL;
let localDb: any = null;

if (!isVercel) {
  const { DatabaseSync } = require('node:sqlite');
  const dbDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });
  const dbPath = path.join(dbDir, 'kisan_finance.db');
  localDb = new DatabaseSync(dbPath);
  localDb.exec(`
    CREATE TABLE IF NOT EXISTS loans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      farmer_id TEXT NOT NULL,
      amount INTEGER NOT NULL,
      purpose TEXT NOT NULL,
      score INTEGER NOT NULL,
      status TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

async function seedVercelDbIfNeeded() {
  await sql`
    CREATE TABLE IF NOT EXISTS loans (
      id SERIAL PRIMARY KEY,
      farmer_id VARCHAR(255) NOT NULL,
      amount INTEGER NOT NULL,
      purpose TEXT NOT NULL,
      score INTEGER NOT NULL,
      status VARCHAR(255) NOT NULL,
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const farmerId = searchParams.get('farmerId') || 'NK-001';

    let myLoans: any[] = [];
    
    if (isVercel) {
      await seedVercelDbIfNeeded();
      const result = await sql`SELECT * FROM loans WHERE farmer_id = ${farmerId} ORDER BY timestamp DESC`;
      myLoans = result.rows.map(r => ({ ...r, farmer_id: r.farmer_id }));
    } else {
      const stmt = localDb.prepare(`SELECT * FROM loans WHERE farmer_id = ? ORDER BY timestamp DESC`);
      myLoans = stmt.all(farmerId) as any[];
    }

    return NextResponse.json({ loans: myLoans });
  } catch (error: any) {
    console.error("Loans GET Error:", error);
    return NextResponse.json({ error: error.message || 'Failed to fetch loans' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, purpose, score, farmerId = 'NK-001' } = body;

    if (!amount || !purpose || score === undefined) {
      return NextResponse.json({ error: 'Amount, purpose, and score are required' }, { status: 400 });
    }

    if (isVercel) {
      await seedVercelDbIfNeeded();
      await sql`
        INSERT INTO loans (farmer_id, amount, purpose, score, status) 
        VALUES (${farmerId}, ${amount}, ${purpose}, ${score}, 'APPROVED')
      `;
    } else {
      const stmt = localDb.prepare('INSERT INTO loans (farmer_id, amount, purpose, score, status) VALUES (?, ?, ?, ?, ?)');
      stmt.run(farmerId, amount, purpose, score, 'APPROVED');
    }

    return NextResponse.json({ success: true, message: 'Loan approved & disbursed successfully' });
  } catch (error: any) {
    console.error("Loans POST Error:", error);
    return NextResponse.json({ error: error.message || 'Failed to disburse loan' }, { status: 500 });
  }
}
