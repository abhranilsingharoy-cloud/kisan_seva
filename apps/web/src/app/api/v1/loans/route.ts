// @ts-ignore: node:sqlite is available in Node 26 runtime but not in @types/node v20
import { DatabaseSync } from 'node:sqlite';
import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

// Initialize Database
const dbDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });
const dbPath = path.join(dbDir, 'kisan_finance.db');

const db = new DatabaseSync(dbPath);
db.exec(`
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

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const farmerId = searchParams.get('farmerId') || 'NK-001';

    const stmt = db.prepare(`SELECT * FROM loans WHERE farmer_id = ? ORDER BY timestamp DESC`);
    const myLoans = stmt.all(farmerId) as any[];

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

    const stmt = db.prepare('INSERT INTO loans (farmer_id, amount, purpose, score, status) VALUES (?, ?, ?, ?, ?)');
    stmt.run(farmerId, amount, purpose, score, 'APPROVED');

    return NextResponse.json({ success: true, message: 'Loan approved & disbursed successfully' });
  } catch (error: any) {
    console.error("Loans POST Error:", error);
    return NextResponse.json({ error: error.message || 'Failed to disburse loan' }, { status: 500 });
  }
}
